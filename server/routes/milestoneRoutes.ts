import { Router, Response } from 'express';
import { dbStore, MilestoneRecord } from '../data/store.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';
import { EscrowService } from '../services/escrowService.js';

const router = Router();

// POST /api/milestones - Add milestone
router.post('/', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, title, description, amount, deadline } = req.body;

    if (!projectId || !title || !amount) {
      return res.status(400).json({ error: 'Project ID, title, and amount are required' });
    }

    const project = dbStore.projects.find((p) => p.id === projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const newMilestone: MilestoneRecord = {
      id: `ms-${projectId}-${Date.now()}`,
      project_id: projectId,
      title,
      description: description || '',
      amount: Number(amount),
      deadline: deadline || new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    dbStore.milestones.push(newMilestone);

    return res.status(201).json({
      success: true,
      milestone: newMilestone,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create milestone', message: err?.message });
  }
});

// GET /api/milestones/:id - Get milestone by ID
router.get('/:id', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const milestone = dbStore.milestones.find((m) => m.id === id);

  if (!milestone) {
    return res.status(404).json({ error: 'Milestone not found' });
  }

  const transaction = dbStore.escrow_transactions.find((t) => t.milestone_id === id);

  return res.json({
    success: true,
    milestone,
    transaction,
  });
});

// PATCH /api/milestones/:id/submit - Freelancer submits milestone for client approval
router.patch('/:id/submit', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;
  const { notes } = req.body;

  const result = EscrowService.requestMilestoneRelease({
    milestoneId: id,
    freelancerId: user.id,
    deliverableNotes: notes,
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const updatedMilestone = dbStore.milestones.find((m) => m.id === id);

  return res.json({
    success: true,
    message: 'Deliverable submitted for client approval',
    milestone: updatedMilestone,
    transaction: result.transaction,
  });
});

// PATCH /api/milestones/:id/approve - Client approves milestone and releases payment
router.patch('/:id/approve', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const user = req.user!;

  const tx = dbStore.escrow_transactions.find(
    (t) => t.milestone_id === id && (t.status === 'LOCKED' || t.status === 'RELEASE_REQUESTED')
  );

  if (!tx) {
    return res.status(400).json({
      error: 'Cannot approve: No active locked escrow transaction found for this milestone',
    });
  }

  const result = EscrowService.releasePayment({
    transactionId: tx.id,
    clientId: user.id,
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const updatedMilestone = dbStore.milestones.find((m) => m.id === id);

  return res.json({
    success: true,
    message: 'Milestone approved and escrow funds released to freelancer',
    milestone: updatedMilestone,
    transaction: result.transaction,
  });
});

export default router;
