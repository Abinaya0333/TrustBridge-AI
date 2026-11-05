import { Router, Response } from 'express';
import { dbStore } from '../data/store.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';
import { EscrowService } from '../services/escrowService.js';

const router = Router();

// POST /api/payments/initialize - Initialize escrow payment for a milestone
router.post('/initialize', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { projectId, milestoneId } = req.body;

  if (!projectId || !milestoneId) {
    return res.status(400).json({ error: 'Project ID and milestone ID are required' });
  }

  const result = EscrowService.initializePayment({
    projectId,
    milestoneId,
    clientId: user.id,
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.status(201).json({
    success: true,
    message: 'Escrow payment initialized',
    transaction: result.transaction,
  });
});

// POST /api/payments/:id/lock - Lock payment in escrow (simulate authorization & deposit)
router.post('/:id/lock', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { id } = req.params;

  const result = EscrowService.lockPayment({
    transactionId: id,
    clientId: user.id,
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({
    success: true,
    message: 'Funds locked in escrow successfully',
    transaction: result.transaction,
  });
});

// POST /api/payments/:id/release - Authorize and release locked funds to freelancer
router.post('/:id/release', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { id } = req.params;

  const result = EscrowService.releasePayment({
    transactionId: id,
    clientId: user.id,
  });

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  return res.json({
    success: true,
    message: 'Escrow funds successfully released to freelancer',
    transaction: result.transaction,
  });
});

// GET /api/payments/history - Get complete auditable escrow history
router.get('/history', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const { projectId } = req.query;

  const history = EscrowService.getHistory({
    userId: user.role === 'admin' ? undefined : user.id,
    projectId: projectId as string,
    role: user.role,
  });

  return res.json({
    success: true,
    count: history.length,
    transactions: history,
    disclaimer: 'DEMO ESCROW – No real money is transferred or held.',
  });
});

// GET /api/payments/balance - Get current user simulated balance
router.get('/balance', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  const profile = dbStore.profiles.find((p) => p.id === user.id) || user;

  return res.json({
    success: true,
    userId: user.id,
    role: user.role,
    simulatedBalance: profile.simulated_balance || 0,
    currency: 'USD',
  });
});

// GET /api/payments/:id - Get transaction details & receipt
router.get('/:id', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const tx = dbStore.escrow_transactions.find((t) => t.id === id || t.transaction_reference === id);

  if (!tx) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  const client = dbStore.profiles.find((p) => p.id === tx.client_id);
  const freelancer = dbStore.profiles.find((p) => p.id === tx.freelancer_id);
  const milestone = dbStore.milestones.find((m) => m.id === tx.milestone_id);
  const project = dbStore.projects.find((p) => p.id === tx.project_id);

  return res.json({
    success: true,
    transaction: tx,
    receipt: {
      reference: tx.transaction_reference,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      payer: client?.full_name || 'Client',
      recipient: freelancer?.full_name || 'Freelancer',
      project: project?.title || 'Project',
      milestone: milestone?.title || 'Milestone',
      issuedAt: tx.updated_at,
      disclaimer: 'DEMO ESCROW – No real money is transferred or held.',
    },
  });
});

export default router;
