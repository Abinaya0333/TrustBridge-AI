import { Router, Response } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { dbStore, ProfileRecord } from '../data/store.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/auth/me - Get current authenticated user
router.get('/me', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  return res.json({
    success: true,
    user: req.user,
    isSupabaseConfigured,
  });
});

// POST /api/auth/register - Register new user (Supabase Auth + Profile)
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name, role = 'client' } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    if (!['freelancer', 'client'].includes(role)) {
      return res.status(400).json({ error: "Role must be 'freelancer' or 'client'" });
    }

    // Check if email already exists in local store
    const existing = dbStore.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    let userId = `usr-${Date.now()}`;

    // If Supabase is active, register through Supabase Auth
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name, role },
        },
      });

      if (error) {
        return res.status(400).json({ error: error.message });
      }

      if (data.user) {
        userId = data.user.id;
      }
    }

    const newProfile: ProfileRecord = {
      id: userId,
      full_name,
      email,
      role,
      profile_image:
        role === 'freelancer'
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      simulated_balance: role === 'client' ? 3000.0 : 0.0,
      created_at: new Date().toISOString(),
    };

    dbStore.profiles.push(newProfile);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newProfile,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Registration failed', message: err?.message });
  }
});

// POST /api/auth/login - Email/Password login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    if (isSupabaseConfigured && supabase && password) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      let profile = dbStore.profiles.find((p) => p.id === data.user?.id || p.email === email);
      if (!profile && data.user) {
        profile = {
          id: data.user.id,
          email: data.user.email || email,
          full_name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: data.user.user_metadata?.role || 'client',
          simulated_balance: 1000.0,
          created_at: new Date().toISOString(),
        };
        dbStore.profiles.push(profile);
      }

      return res.json({
        success: true,
        session: data.session,
        user: profile,
      });
    }

    // Local / Sandbox login by matching email or creating on the fly
    let profile = dbStore.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (!profile) {
      return res.status(404).json({ error: 'User profile not found. Please register first.' });
    }

    return res.json({
      success: true,
      user: profile,
      message: 'Logged in successfully',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Login failed', message: err?.message });
  }
});

// POST /api/auth/logout - Logout
router.post('/logout', async (_req, res) => {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/users - List available demo users for persona switching
router.get('/users', (_req, res) => {
  return res.json({
    success: true,
    users: dbStore.profiles,
  });
});

export default router;
