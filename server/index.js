import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import fetch from 'node-fetch';
import session from 'express-session';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // adjust if your frontend runs elsewhere
  credentials: true
}));
app.use(express.json());

// --- SESSION & PASSPORT SETUP ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // You can store user info in DB here if needed
  return done(null, {
    id: profile.id,
    displayName: profile.displayName,
    photo: profile.photos?.[0]?.value,
    email: profile.emails?.[0]?.value
  });
}));

// --- GOOGLE AUTH ROUTES ---
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

app.get('/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/',
    session: true
  }),
  (req, res) => {
    // Redirect to frontend after login
    res.redirect('http://localhost:5173');
  }
);

app.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173');
  });
});

app.get('/me', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ user: null });
  }
});

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'Message is required.' });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are WorldWise AI, a helpful travel and study assistant.' },
        { role: 'user', content: message }
      ]
    });
    const reply = completion.choices[0]?.message?.content || '';
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to get response from OpenAI.' });
  }
});

// GET /images endpoint using Pexels API
app.get('/images', async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: 'Query parameter q is required.' });
  }
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'PEXELS_API_KEY not set in environment.' });
  }
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch images from Pexels.' });
    }
    const data = await response.json();
    const images = (data.photos || []).slice(0, 3).map(photo => photo.src.original);
    res.json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch images from Pexels.' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`WorldWise AI backend listening on port ${PORT}`);
}); 