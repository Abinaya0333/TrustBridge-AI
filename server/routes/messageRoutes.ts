import { Router, Response } from 'express';
import { dbStore, MessageRecord } from '../data/store.js';
import { authenticateUser, AuthenticatedRequest } from '../middleware/auth.js';
import { GeminiService } from '../services/geminiService.js';

const router = Router();

// GET /api/messages - List messages
router.get('/', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const user = req.user!;
  let msgs: MessageRecord[];

  if (user.role === 'admin') {
    msgs = dbStore.messages;
  } else {
    msgs = dbStore.messages.filter(
      (m) => m.sender_id === user.id || m.recipient_id === user.id || m.project_id
    );
  }

  return res.json({
    success: true,
    messages: msgs.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ),
  });
});

// GET /api/messages/project/:projectId - List messages for specific project
router.get('/project/:projectId', authenticateUser, (req: AuthenticatedRequest, res: Response) => {
  const { projectId } = req.params;

  const msgs = dbStore.messages
    .filter((m) => m.project_id === projectId)
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  return res.json({
    success: true,
    messages: msgs,
  });
});

// POST /api/messages - Send message (internal or simulated social message)
router.post('/', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user!;
    const {
      projectId,
      recipientId,
      messageContent,
      platform = 'whatsapp',
      autoAnalyzeWithAI = true,
    } = req.body;

    if (!messageContent) {
      return res.status(400).json({ error: 'Message content is required' });
    }

    const newMsg: MessageRecord = {
      id: `msg-${Date.now()}`,
      project_id: projectId || 'proj-1',
      sender_id: user.id,
      recipient_id: recipientId || (user.role === 'client' ? 'freelancer-a' : 'client-a'),
      sender_identifier: user.email || user.full_name,
      recipient_identifier: 'TrustBridge Contact',
      platform,
      external_message_id: `ext_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      message_content: messageContent,
      message_timestamp: new Date().toISOString(),
      processing_status: 'received',
      created_at: new Date().toISOString(),
    };

    dbStore.messages.unshift(newMsg);

    // AI Analysis if requested
    let insight;
    if (autoAnalyzeWithAI) {
      try {
        const extracted = await GeminiService.analyzeSocialMessage(messageContent);
        newMsg.processing_status = 'processed';

        insight = {
          id: `ins-${Date.now()}`,
          project_id: newMsg.project_id,
          message_id: newMsg.id,
          insight_type: 'social_scope_extraction',
          extracted_data: extracted,
          confidence_score: extracted.confidence_score || 0.9,
          review_status: 'pending_review' as const,
          created_at: new Date().toISOString(),
        };

        dbStore.ai_insights.unshift(insight);
      } catch (err: any) {
        console.warn('AI analysis skipped on message send:', err?.message);
      }
    }

    return res.status(201).json({
      success: true,
      message: newMsg,
      insight,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to send message', message: err?.message });
  }
});

export default router;
