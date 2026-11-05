import { Router, Response } from 'express';
import { dbStore, AgreementRecord } from '../data/store.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/agreements - List agreements
router.get('/', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.query;

  let results = [...dbStore.agreements];
  if (projectId) {
    results = results.filter((a) => a.project_id === projectId);
  }

  return res.json({
    success: true,
    agreements: results.sort((a, b) => b.version - a.version),
  });
});

// POST /api/agreements - Create agreement draft or new version
router.post('/', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      projectId,
      title,
      agreement_terms,
      deliverables = [],
      total_amount = 200,
      timeline_days = 15,
      revision_limit = 2,
      version,
      notes,
    } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'Project ID is required' });
    }

    const project = dbStore.projects.find((p) => p.id === projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Determine version number
    const existingVersions = dbStore.agreements
      .filter((a) => a.project_id === projectId)
      .map((a) => a.version);
    const nextVersion = version || (existingVersions.length > 0 ? Math.max(...existingVersions) + 1 : 1);

    const newAgreement: AgreementRecord = {
      id: `agr-${projectId}-v${nextVersion}`,
      project_id: projectId,
      client_id: project.client_id,
      freelancer_id: project.freelancer_id,
      version: nextVersion,
      title: title || `Services Agreement v${nextVersion}.0 – ${project.title}`,
      agreement_terms: agreement_terms || `MASTER FREELANCE SERVICES AGREEMENT - v${nextVersion}.0`,
      deliverables: Array.isArray(deliverables) ? deliverables : [deliverables],
      total_amount: Number(total_amount) || project.project_budget,
      timeline_days: Number(timeline_days) || project.timeline_days,
      revision_limit: Number(revision_limit) || 2,
      status: 'draft',
      created_at: new Date().toISOString(),
      notes: notes || 'Created via TrustBridge AI Agreement Engine',
    };

    dbStore.agreements.push(newAgreement);

    return res.status(201).json({
      success: true,
      agreement: newAgreement,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create agreement', message: err?.message });
  }
});

// GET /api/agreements/:id - Get agreement by ID
router.get('/:id', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const agreement = dbStore.agreements.find((a) => a.id === id);

  if (!agreement) {
    return res.status(404).json({ error: 'Agreement not found' });
  }

  return res.json({
    success: true,
    agreement,
  });
});

// PATCH /api/agreements/:id/status - Update agreement status
router.patch('/:id/status', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['draft', 'sent_to_client', 'accepted', 'rejected', 'superseded'].includes(status)) {
    return res.status(400).json({ error: 'Invalid agreement status' });
  }

  const agreement = dbStore.agreements.find((a) => a.id === id);
  if (!agreement) {
    return res.status(404).json({ error: 'Agreement not found' });
  }

  agreement.status = status;
  if (status === 'accepted') {
    agreement.accepted_at = new Date().toISOString();

    // When accepted, mark any previous version for the same project as superseded
    dbStore.agreements.forEach((a) => {
      if (a.project_id === agreement.project_id && a.version < agreement.version && a.status === 'accepted') {
        a.status = 'superseded';
      }
    });

    // Update project version & budget
    const project = dbStore.projects.find((p) => p.id === agreement.project_id);
    if (project) {
      project.current_version = agreement.version;
      project.project_budget = agreement.total_amount;
      project.timeline_days = agreement.timeline_days;
      project.deliverables = agreement.deliverables;
      project.status = 'active';
    }
  }

  return res.json({
    success: true,
    agreement,
  });
});

export default router;
