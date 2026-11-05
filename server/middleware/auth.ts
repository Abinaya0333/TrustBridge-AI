import { Request, Response, NextFunction } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { dbStore, ProfileRecord } from '../data/store.js';

export interface AuthenticatedRequest extends Request {
  user?: ProfileRecord;
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const customUserId = req.headers['x-user-id'] as string;

    // 1. If Supabase is configured and a Bearer token is provided
    if (isSupabaseConfigured && supabase && authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data: { user }, error } = await supabase.auth.getUser(token);

      if (!error && user) {
        // Find profile
        let profile = dbStore.profiles.find((p) => p.id === user.id);
        if (!profile) {
          profile = {
            id: user.id,
            email: user.email || '',
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            role: user.user_metadata?.role || 'client',
            profile_image: user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            simulated_balance: 1000.0,
            created_at: new Date().toISOString(),
          };
          dbStore.profiles.push(profile);
        }
        req.user = profile;
        return next();
      }
    }

    // 2. Local sandbox / demo mode fallback: check custom header or query
    const targetUserId = customUserId || (req.query.userId as string) || 'freelancer-a';
    const matchedProfile = dbStore.profiles.find((p) => p.id === targetUserId) || dbStore.profiles[0];

    req.user = matchedProfile;
    return next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Authentication failed', message: err?.message });
  }
};

export const requireRole = (allowedRoles: Array<'freelancer' | 'client' | 'admin'>) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Forbidden: Action requires one of [${allowedRoles.join(', ')}] role. Current role is ${req.user.role}.`,
      });
    }
    next();
  };
};
