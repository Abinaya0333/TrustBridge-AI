import { Router, Request, Response } from 'express';
import { GeminiService } from '../services/geminiService.js';
import { dbStore, AgreementRecord, MilestoneRecord } from '../data/store.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/ai/analyze-message - Direct Gemini AI analysis of conversation text
router.post('/analyze-message', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text content is required for AI analysis' });
    }

    const insight = await GeminiService.analyzeSocialMessage(text);

    return res.json({
      success: true,
      data: insight,
      disclaimer: 'AI-generated interpretation. Requires explicit human review before becoming binding.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Message analysis failed', message: err?.message });
  }
});

// GET /api/ai/insights/:projectId - Retrieve all AI insights for a project
router.get('/insights/:projectId', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.params;

  const insights = dbStore.ai_insights
    .filter((ins) => ins.project_id === projectId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return res.json({
    success: true,
    insights,
  });
});

// POST /api/ai/convert-insight-to-agreement - Convert an AI insight into a real milestone/agreement
router.post('/convert-insight-to-agreement', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { insightId, projectId } = req.body;

    const insight = dbStore.ai_insights.find((i) => i.id === insightId);
    if (!insight) {
      return res.status(404).json({ error: 'Insight not found' });
    }

    const project = dbStore.projects.find((p) => p.id === (projectId || insight.project_id));
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const extracted = insight.extracted_data;
    const addAmount = extracted.agreed_amount || 150;
    const newVersion = project.current_version + 1;

    // 1. Add new milestone for the scope addition
    const newMilestone: MilestoneRecord = {
      id: `ms-${project.id}-${Date.now()}`,
      project_id: project.id,
      title: extracted.milestones?.[0]?.title || 'AI Extracted Scope Deliverables',
      description: extracted.deliverables?.join(', ') || 'Additional features agreed via conversation.',
      amount: addAmount,
      deadline: extracted.deadline || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      status: 'pending',
      created_at: new Date().toISOString(),
    };
    dbStore.milestones.push(newMilestone);

    // 2. Mark previous agreements as superseded and create Version 2
    dbStore.agreements.forEach((a) => {
      if (a.project_id === project.id && a.status === 'accepted') {
        a.status = 'superseded';
      }
    });

    const updatedDeliverables = [
      ...project.deliverables,
      ...(extracted.deliverables || ['Conversational additions']),
    ];

    const v2Agreement: AgreementRecord = {
      id: `agr-${project.id}-v${newVersion}`,
      project_id: project.id,
      client_id: project.client_id,
      freelancer_id: project.freelancer_id,
      version: newVersion,
      title: `Services Agreement v${newVersion}.0 – Scope Addendum`,
      agreement_terms: `MASTER FREELANCE SERVICES AGREEMENT - VERSION ${newVersion}.0\nIncorporated from verified client communication on ${new Date().toLocaleDateString()}.\n\nDeliverables:\n${updatedDeliverables.map((d, i) => `${i + 1}. ${d}`).join('\n')}\n\nRevised Budget: $${project.project_budget + addAmount}`,
      deliverables: updatedDeliverables,
      total_amount: project.project_budget + addAmount,
      timeline_days: project.timeline_days + 7,
      revision_limit: 3,
      status: 'accepted',
      accepted_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      notes: 'Generated from confirmed AI conversational insight.',
    };
    dbStore.agreements.push(v2Agreement);

    // 3. Update project budget and current version
    project.project_budget += addAmount;
    project.current_version = newVersion;
    project.deliverables = updatedDeliverables;

    // 4. Update insight status
    insight.review_status = 'confirmed';

    return res.json({
      success: true,
      message: `Successfully converted AI insight into Milestone and Agreement v${newVersion}.0!`,
      project,
      milestone: newMilestone,
      agreement: v2Agreement,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Conversion failed', message: err?.message });
  }
});

// ScopeGuard AI Analysis endpoint
router.post('/analyze-scope', async (req: Request, res: Response) => {
  try {
    const {
      projectTitle = 'Website Development',
      originalScope = 'Website with 5 pages, contact form, responsive design',
      originalBudget = 200,
      originalTimelineDays = 15,
      newRequirements = 'Add 3 additional pages, add an admin dashboard, integrate a payment gateway',
    } = req.body;

    const result = await GeminiService.analyzeScopeCreep({
      projectTitle,
      originalScope,
      originalBudget,
      originalTimelineDays,
      newRequirements,
    });

    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ error: 'Scope analysis failed', message: err?.message });
  }
});

export default router;
