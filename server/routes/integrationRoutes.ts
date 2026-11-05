import { Router, Request, Response } from 'express';
import { MetaWebhookService } from '../services/metaWebhookService.js';
import { dbStore } from '../data/store.js';

const router = Router();

// GET /api/integrations/status - Status of social connections and webhooks
router.get('/status', (_req: Request, res: Response) => {
  const whatsappConfigured = Boolean(
    process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN
  );
  const instagramConfigured = Boolean(
    process.env.INSTAGRAM_ACCOUNT_ID && process.env.INSTAGRAM_ACCESS_TOKEN
  );

  return res.json({
    success: true,
    integrations: {
      whatsapp: {
        configured: whatsappConfigured,
        status: whatsappConfigured ? 'connected' : 'test_sandbox_active',
        accountName: 'Alex Rivera WebDev (WhatsApp Business)',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '109823487123982',
        webhookUrl: '/api/integrations/whatsapp/webhook',
        verifyTokenSet: Boolean(process.env.META_WEBHOOK_VERIFY_TOKEN),
      },
      instagram: {
        configured: instagramConfigured,
        status: instagramConfigured ? 'connected' : 'test_sandbox_active',
        accountName: '@alex_webdev (Instagram Professional)',
        accountId: process.env.INSTAGRAM_ACCOUNT_ID || '178414002349182',
        webhookUrl: '/api/integrations/instagram/webhook',
        verifyTokenSet: Boolean(process.env.META_WEBHOOK_VERIFY_TOKEN),
      },
      metaApp: {
        appIdSet: Boolean(process.env.META_APP_ID),
        appSecretSet: Boolean(process.env.META_APP_SECRET),
        signatureVerificationActive: Boolean(process.env.META_APP_SECRET),
      },
    },
    connections: dbStore.social_connections,
    totalMessagesReceived: dbStore.messages.length,
  });
});

// GET /api/integrations/whatsapp/webhook - WhatsApp Webhook Challenge Verification
router.get('/whatsapp/webhook', (req: Request, res: Response) => {
  const { isValid, challenge } = MetaWebhookService.verifyWebhookChallenge(req.query);

  if (isValid && challenge) {
    console.log('✅ WhatsApp Webhook verification challenge passed');
    return res.status(200).send(challenge);
  }

  console.warn('❌ WhatsApp Webhook verification failed. Invalid mode or token.');
  return res.status(403).json({ error: 'Verification token mismatch' });
});

// POST /api/integrations/whatsapp/webhook - WhatsApp Message Ingestion
router.post('/whatsapp/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-hub-signature-256'] as string;
    const rawPayload = JSON.stringify(req.body);

    // Verify signature if secret configured
    if (!MetaWebhookService.verifySignature(rawPayload, signature)) {
      console.warn('❌ Invalid Meta signature on WhatsApp webhook');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const result = await MetaWebhookService.parseWhatsAppWebhook(req.body, rawPayload);

    if (!result.success) {
      if (result.duplicate) {
        // Return 200 to acknowledge webhook according to Meta specs even if duplicate
        return res.status(200).json({ status: 'acknowledged_duplicate', message: result.error });
      }
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      status: 'success',
      message: 'WhatsApp message ingested and processed',
      data: result.message,
      insight: result.insight,
    });
  } catch (err: any) {
    console.error('WhatsApp webhook processing error:', err);
    return res.status(500).json({ error: 'Internal webhook error', message: err?.message });
  }
});

// GET /api/integrations/instagram/webhook - Instagram Webhook Challenge Verification
router.get('/instagram/webhook', (req: Request, res: Response) => {
  const { isValid, challenge } = MetaWebhookService.verifyWebhookChallenge(req.query);

  if (isValid && challenge) {
    console.log('✅ Instagram Webhook verification challenge passed');
    return res.status(200).send(challenge);
  }

  console.warn('❌ Instagram Webhook verification failed.');
  return res.status(403).json({ error: 'Verification token mismatch' });
});

// POST /api/integrations/instagram/webhook - Instagram Message Ingestion
router.post('/instagram/webhook', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-hub-signature-256'] as string;
    const rawPayload = JSON.stringify(req.body);

    if (!MetaWebhookService.verifySignature(rawPayload, signature)) {
      console.warn('❌ Invalid Meta signature on Instagram webhook');
      return res.status(401).json({ error: 'Invalid webhook signature' });
    }

    const result = await MetaWebhookService.parseInstagramWebhook(req.body, rawPayload);

    if (!result.success) {
      if (result.duplicate) {
        return res.status(200).json({ status: 'acknowledged_duplicate', message: result.error });
      }
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Instagram message ingested and processed',
      data: result.message,
      insight: result.insight,
    });
  } catch (err: any) {
    console.error('Instagram webhook processing error:', err);
    return res.status(500).json({ error: 'Internal webhook error', message: err?.message });
  }
});

// POST /api/integrations/simulate-webhook - Interactive test simulator for evaluators
router.post('/simulate-webhook', async (req: Request, res: Response) => {
  try {
    const {
      platform = 'whatsapp',
      sender = '+14155552671',
      text = 'Hi Alex! We would like to add 3 extra pages and an admin dashboard. Can we agree on $150 extra?',
      externalMessageId,
      projectId,
    } = req.body;

    const messageId =
      externalMessageId ||
      (platform === 'whatsapp'
        ? `wamid.HBgL${Date.now()}`
        : `ig_mid_${Date.now()}`);

    const result = await MetaWebhookService.processIncomingMessage({
      platform,
      externalMessageId: messageId,
      senderId: sender,
      messageContent: text,
      projectId: projectId || 'proj-1',
    });

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.json({
      success: true,
      simulated: true,
      platform,
      message: result.message,
      insight: result.insight,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Webhook simulation failed', message: err?.message });
  }
});

export default router;
