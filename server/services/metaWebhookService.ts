import crypto from 'crypto';
import dotenv from 'dotenv';
import { dbStore, MessageRecord, AIInsightRecord } from '../data/store.js';
import { GeminiService } from './geminiService.js';

dotenv.config();

const META_WEBHOOK_VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || 'trustbridge_meta_verify_token_2026';
const META_APP_SECRET = process.env.META_APP_SECRET || '';

export class MetaWebhookService {
  /**
   * Verify Webhook challenge for WhatsApp and Instagram
   */
  public static verifyWebhookChallenge(query: any): { isValid: boolean; challenge?: string } {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === META_WEBHOOK_VERIFY_TOKEN) {
      return { isValid: true, challenge: String(challenge) };
    }
    return { isValid: false };
  }

  /**
   * Verify SHA256 Signature from Meta (X-Hub-Signature-256)
   */
  public static verifySignature(rawPayload: string, signatureHeader?: string): boolean {
    if (!META_APP_SECRET || !signatureHeader) {
      // In sandbox development without app secret configured, permit testing
      return true;
    }

    try {
      const elements = signatureHeader.split('=');
      const signatureHash = elements[1];
      const expectedHash = crypto
        .createHmac('sha256', META_APP_SECRET)
        .update(rawPayload)
        .digest('hex');

      return crypto.timingSafeEqual(Buffer.from(signatureHash), Buffer.from(expectedHash));
    } catch (e) {
      return false;
    }
  }

  /**
   * Ingest and process an incoming message from WhatsApp or Instagram
   */
  public static async processIncomingMessage(params: {
    platform: 'whatsapp' | 'instagram';
    externalMessageId: string;
    senderId: string;
    recipientId?: string;
    messageContent: string;
    timestamp?: string;
    rawPayload?: any;
    projectId?: string;
  }): Promise<{ success: boolean; duplicate?: boolean; message?: MessageRecord; insight?: AIInsightRecord; error?: string }> {
    const {
      platform,
      externalMessageId,
      senderId,
      recipientId,
      messageContent,
      timestamp,
      rawPayload,
      projectId,
    } = params;

    // 1. Prevent duplicate webhook deliveries
    const existingMsg = dbStore.messages.find((m) => m.external_message_id === externalMessageId);
    if (existingMsg) {
      return {
        success: false,
        duplicate: true,
        error: `Duplicate webhook ignored: Message ${externalMessageId} already stored.`,
      };
    }

    // 2. Associate with known project or default project
    const targetProject = projectId
      ? dbStore.projects.find((p) => p.id === projectId)
      : dbStore.projects[0];

    // 3. Store message in database
    const newMsg: MessageRecord = {
      id: `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      project_id: targetProject?.id || 'proj-1',
      sender_id: targetProject?.client_id || 'client-a',
      recipient_id: targetProject?.freelancer_id || 'freelancer-a',
      sender_identifier: senderId,
      recipient_identifier: recipientId || 'trustbridge_business',
      platform,
      external_message_id: externalMessageId,
      message_content: messageContent,
      message_timestamp: timestamp || new Date().toISOString(),
      processing_status: 'received',
      raw_payload: rawPayload || {},
      created_at: new Date().toISOString(),
    };

    dbStore.messages.unshift(newMsg);

    // 4. Trigger Gemini AI analysis
    let aiInsight: AIInsightRecord | undefined;
    try {
      const extracted = await GeminiService.analyzeSocialMessage(messageContent);
      newMsg.processing_status = 'processed';

      aiInsight = {
        id: `ins-${Date.now()}`,
        project_id: newMsg.project_id,
        message_id: newMsg.id,
        insight_type: 'social_scope_extraction',
        extracted_data: extracted,
        confidence_score: extracted.confidence_score || 0.9,
        review_status: 'pending_review',
        created_at: new Date().toISOString(),
      };

      dbStore.ai_insights.unshift(aiInsight);

      // Create notification for freelancer
      dbStore.notifications.unshift({
        id: `notif-${Date.now()}`,
        user_id: newMsg.recipient_id || 'freelancer-a',
        title: `New ${platform === 'whatsapp' ? 'WhatsApp' : 'Instagram'} Scope Message`,
        description: `Client message received via ${platform}. ScopeGuard AI extracted proposed terms ($${extracted.agreed_amount}).`,
        notification_type: 'message',
        is_read: false,
        link_tab: 'scopeguard',
        link_resource_id: newMsg.project_id,
        created_at: new Date().toISOString(),
      });
    } catch (aiErr: any) {
      console.warn('AI processing failed for incoming message:', aiErr?.message);
    }

    return {
      success: true,
      message: newMsg,
      insight: aiInsight,
    };
  }

  /**
   * Helper to parse Meta WhatsApp Cloud API Webhook payload
   */
  public static async parseWhatsAppWebhook(body: any, rawPayload?: string) {
    const entry = body?.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return { success: false, error: 'No message object found in WhatsApp webhook payload' };
    }

    const messageText = message.text?.body || message.caption || '[Attachment / Non-text message]';
    const sender = message.from;
    const messageId = message.id;
    const timestamp = message.timestamp
      ? new Date(Number(message.timestamp) * 1000).toISOString()
      : new Date().toISOString();

    return this.processIncomingMessage({
      platform: 'whatsapp',
      externalMessageId: messageId,
      senderId: sender,
      recipientId: value.metadata?.display_phone_number || 'TrustBridge WhatsApp',
      messageContent: messageText,
      timestamp,
      rawPayload: body,
    });
  }

  /**
   * Helper to parse Meta Instagram Messaging API Webhook payload
   */
  public static async parseInstagramWebhook(body: any, rawPayload?: string) {
    const entry = body?.entry?.[0];
    const messaging = entry?.messaging?.[0];
    const message = messaging?.message;

    if (!message) {
      return { success: false, error: 'No message object found in Instagram webhook payload' };
    }

    const messageText = message.text || '[Attachment / Non-text message]';
    const sender = messaging.sender?.id || 'instagram_user';
    const messageId = message.mid || `ig_${Date.now()}`;
    const timestamp = messaging.timestamp
      ? new Date(Number(messaging.timestamp)).toISOString()
      : new Date().toISOString();

    return this.processIncomingMessage({
      platform: 'instagram',
      externalMessageId: messageId,
      senderId: sender,
      recipientId: messaging.recipient?.id || 'TrustBridge Instagram',
      messageContent: messageText,
      timestamp,
      rawPayload: body,
    });
  }
}
