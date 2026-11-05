import { Router, Response } from 'express';
import { dbStore, ProjectRecord } from '../data/store.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/projects - List projects authorized for current user
router.get('/', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  let userProjects: ProjectRecord[];

  if (user.role === 'admin') {
    userProjects = dbStore.projects;
  } else if (user.role === 'client') {
    userProjects = dbStore.projects.filter((p) => p.client_id === user.id);
  } else {
    userProjects = dbStore.projects.filter((p) => p.freelancer_id === user.id);
  }

  // Attach milestones to projects for convenient frontend consumption
  const projectsWithMilestones = userProjects.map((p) => ({
    ...p,
    milestones: dbStore.milestones.filter((m) => m.project_id === p.id),
  }));

  return res.json({
    success: true,
    projects: projectsWithMilestones,
  });
});

// POST /api/projects - Create a project
router.post('/', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      title,
      description,
      project_budget = 200,
      timeline_days = 15,
      deliverables = ['Website with 5 pages', 'Contact form', 'Responsive design'],
      clientId,
      freelancerId,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Project title is required' });
    }

    const effectiveClientId = user.role === 'client' ? user.id : clientId || 'client-a';
    const effectiveFreelancerId = user.role === 'freelancer' ? user.id : freelancerId || 'freelancer-a';

    const newProject: ProjectRecord = {
      id: `proj-${Date.now()}`,
      client_id: effectiveClientId,
      freelancer_id: effectiveFreelancerId,
      title,
      description: description || 'Project managed via TrustBridge AI.',
      project_budget: Number(project_budget) || 200,
      status: 'active',
      current_version: 1,
      deliverables: Array.isArray(deliverables) ? deliverables : [deliverables],
      timeline_days: Number(timeline_days) || 15,
      start_date: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + (Number(timeline_days) || 15) * 86400000).toISOString().split('T')[0],
      created_at: new Date().toISOString(),
    };

    dbStore.projects.unshift(newProject);

    // Create 2 initial milestone items
    const ms1 = {
      id: `ms-${newProject.id}-1`,
      project_id: newProject.id,
      title: 'Milestone 1: Structure & Page Architecture',
      description: 'Initial design mockups and HTML skeleton signoff.',
      amount: Math.round(newProject.project_budget * 0.4),
      deadline: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };

    const ms2 = {
      id: `ms-${newProject.id}-2`,
      project_id: newProject.id,
      title: 'Milestone 2: Complete Implementation & Deployment',
      description: 'Full deliverable implementation, responsiveness, and launch.',
      amount: Math.round(newProject.project_budget * 0.6),
      deadline: newProject.deadline,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
    };

    dbStore.milestones.push(ms1, ms2);

    return res.status(201).json({
      success: true,
      project: {
        ...newProject,
        milestones: [ms1, ms2],
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create project', message: err?.message });
  }
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const project = dbStore.projects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const milestones = dbStore.milestones.filter((m) => m.project_id === id);
  const agreements = dbStore.agreements.filter((a) => a.project_id === id);
  const escrowTransactions = dbStore.escrow_transactions.filter((t) => t.project_id === id);

  return res.json({
    success: true,
    project: {
      ...project,
      milestones,
      agreements,
      escrowTransactions,
    },
  });
});

// PUT /api/projects/:id - Update project
router.put('/:id', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const projectIndex = dbStore.projects.findIndex((p) => p.id === id);

  if (projectIndex === -1) {
    return res.status(404).json({ error: 'Project not found' });
  }

  const existing = dbStore.projects[projectIndex];
  const updates = req.body;

  dbStore.projects[projectIndex] = {
    ...existing,
    ...updates,
    id: existing.id, // prevent overwriting ID
  };

  return res.json({
    success: true,
    project: dbStore.projects[projectIndex],
  });
});

export default router;
