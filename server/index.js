import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { geminiChat } from "./gemini.js";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://worldwise-ai.vercel.app"
    ],
    credentials: true,
  })
);
app.use(express.json());

// --- SESSION & PASSPORT SETUP ---
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // set to true if using HTTPS
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "https://worldwise-ai-whispers.onrender.com/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // You can store user info in DB here if needed
      return done(null, {
        id: profile.id,
        displayName: profile.displayName,
        photo: profile.photos?.[0]?.value,
        email: profile.emails?.[0]?.value,
      });
    }
  )
);

// --- GOOGLE AUTH ROUTES ---
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: true,
  }),
  (req, res) => {
    // Redirect to frontend after login
    res.redirect("https://worldwise-ai.vercel.app");
  }
);

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("https://worldwise-ai.vercel.app");
  });
});

app.get("/me", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});



const supabaseService = createSupabaseClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

app.post("/chat", async (req, res) => {
  const { message, user_id } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }
  try {
    // 1. Get reply from Gemini
    const systemPrompt =
      "You are WorldWise AI, a helpful travel and study assistant. Answer with relevant tips, food, colleges, or local phrases based on the user's query.";
    const reply = await geminiChat(`${systemPrompt}\nUser: ${message}`);

    // 2. Extract a keyword (ask Gemini for a keyword based on the user's message)
    let keyword = "";
    try {
      const keywordPrompt = `Extract a single keyword (place, food, or theme) from this user query for image search. Only return the keyword.\nQuery: ${message}`;
      keyword = (await geminiChat(keywordPrompt)).trim().replace(/^\["']|["']$/g, "");
    } catch (err) {
      keyword = message.split(" ").slice(0, 2).join(" "); // fallback: first 2 words
    }

    // 3. Fetch images from Pexels
    let images = [];
    try {
      const pexelsRes = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(
          keyword
        )}&per_page=4`,
        {
          headers: {
            Authorization: `Bearer ${process.env.PEXELS_API_KEY}`,
          },
        }
      );
      if (pexelsRes.ok) {
        const pexelsData = await pexelsRes.json();
        images = (pexelsData.photos || [])
          .slice(0, 4)
          .map((photo) => photo.src.original);
      }
    } catch (err) {
      images = [];
    }

    // 4. Optionally save to Supabase messages table if user_id is present (existing logic)
    if (user_id) {
      supabaseService
        .from("messages")
        .insert([
          {
            user_id,
            prompt: message,
            reply,
          },
        ])
        .then(() => {})
        .catch(() => {}); // Don't block response
    }

    // 5. Return reply and images
    res.json({ reply, images });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Failed to get response from Gemini or Pexels." });
  }
});

// GET /images endpoint using Pexels API
app.get("/images", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Query parameter q is required." });
  }
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return res
      .status(500)
      .json({ error: "PEXELS_API_KEY not set in environment." });
  }
  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(
        query
      )}&per_page=3`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    if (!response.ok) {
      return res
        .status(500)
        .json({ error: "Failed to fetch images from Pexels." });
    }
    const data = await response.json();
    const images = (data.photos || [])
      .slice(0, 3)
      .map((photo) => photo.src.original);
    res.json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch images from Pexels." });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`WorldWise AI backend listening on port ${PORT}`);
});
