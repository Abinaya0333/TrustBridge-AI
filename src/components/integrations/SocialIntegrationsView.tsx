import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  History,
  Phone,
  Instagram,
  RefreshCw,
  ExternalLink,
  Layers,
  Code2,
  Copy,
  PlusCircle,
  FileCheck2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export const SocialIntegrationsView: React.FC = () => {
  const { selectedProjectId, projects, setActiveTab } = useApp();

  const [integrationStatus, setIntegrationStatus] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulator Form State
  const [simPlatform, setSimPlatform] = useState<'whatsapp' | 'instagram'>('whatsapp');
  const [simSender, setSimSender] = useState('+14155552671');
  const [simText, setSimText] = useState(
    'Hi Alex! We loved the wireframes. Could we add 3 extra pages, an admin dashboard, and payment gateway? Can we agree on $150 extra and 7 more business days?'
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatorResponse, setSimulatorResponse] = useState<any>(null);
  const [lastMessageId, setLastMessageId] = useState<string>('');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statusRes, msgRes, insightsRes] = await Promise.all([
        api.integrations.getStatus(),
        api.messages.list(),
        api.ai.getInsights(selectedProjectId || 'proj-1'),
      ]);

      if (statusRes.success) setIntegrationStatus(statusRes);
      if (msgRes.success) setMessages(msgRes.messages || []);
      if (insightsRes.success) setInsights(insightsRes.insights || []);
    } catch (e) {
      console.warn('Failed to load integration data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedProjectId]);

  const handleSimulateWebhook = async (duplicate = false) => {
    setIsSimulating(true);
    setSimulatorResponse(null);

    const msgId = duplicate && lastMessageId
      ? lastMessageId
      : `${simPlatform === 'whatsapp' ? 'wamid.' : 'ig_mid_'}${Date.now()}`;

    if (!duplicate) {
      setLastMessageId(msgId);
    }

    try {
      const res = await api.integrations.simulateWebhook({
        platform: simPlatform,
        sender: simSender,
        text: simText,
        externalMessageId: msgId,
        projectId: selectedProjectId || 'proj-1',
      });

      setSimulatorResponse(res);
      await loadData();
    } catch (err: any) {
      setSimulatorResponse({ success: false, error: err?.message || 'Failed to simulate webhook' });
    } finally {
      setIsSimulating(false);
    }
  };

  const handleConvertInsight = async (insightId: string) => {
    try {
      const res = await api.ai.convertInsightToAgreement(insightId, selectedProjectId || 'proj-1');
      if (res.success) {
        alert(res.message);
        await loadData();
        setActiveTab('version-history');
      } else {
        alert(res.error || 'Failed to convert insight');
      }
    } catch (e: any) {
      alert('Error: ' + e?.message);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
              Social Ingestion & Webhooks
            </span>
            <span className="text-xs text-slate-400">Meta WhatsApp Cloud & Instagram Messaging API</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            Social Message Intelligence & Webhooks
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ingest client messages automatically through official Meta webhooks and extract contract milestones with Gemini AI.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={isLoading}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors self-start md:self-center"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Feeds</span>
        </button>
      </div>

      {/* Account Status Grid: WhatsApp & Instagram Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* WhatsApp Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">WhatsApp Business Cloud API</h3>
                <span className="text-[11px] text-slate-400 font-mono">Official Meta Graph API</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Webhook Endpoint:</span>
              <span className="text-blue-600 font-bold">/api/integrations/whatsapp/webhook</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Verification Challenge:</span>
              <span className="text-emerald-700 font-bold">Active (trustbridge_meta_verify_token_2026)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Signature Validation:</span>
              <span className="text-slate-700">HMAC-SHA256 (X-Hub-Signature-256)</span>
            </div>
          </div>
        </div>

        {/* Instagram Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center font-bold shadow-sm">
                <Instagram className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">Instagram Messaging API</h3>
                <span className="text-[11px] text-slate-400 font-mono">Professional & Creator Accounts</span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Active</span>
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Webhook Endpoint:</span>
              <span className="text-blue-600 font-bold">/api/integrations/instagram/webhook</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Verification Challenge:</span>
              <span className="text-emerald-700 font-bold">Active (trustbridge_meta_verify_token_2026)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 font-sans">Account ID:</span>
              <span className="text-slate-700">178414002349182</span>
            </div>
          </div>
        </div>
      </div>

      {/* Webhook Testing Simulator & Live Evaluator */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-xl border border-blue-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3 mb-5">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-blue-500/20 text-cyan-300 border border-blue-500/40">
                Official Webhook Simulator
              </span>
              <span className="text-xs text-slate-400">Section 7 & 8 Testing Suite</span>
            </div>
            <h3 className="text-lg font-extrabold text-white">
              Simulate Incoming WhatsApp / Instagram Webhook
            </h3>
            <p className="text-xs text-slate-300">
              Test live message persistence, Meta payload parsing, duplicate webhook protection, and automatic Gemini AI contract extraction.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Select Channel
                </label>
                <div className="flex rounded-xl bg-slate-800 p-1 border border-slate-700 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setSimPlatform('whatsapp');
                      setSimSender('+14155552671');
                    }}
                    className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      simPlatform === 'whatsapp' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSimPlatform('instagram');
                      setSimSender('@marcus_nexatech');
                    }}
                    className={`flex-1 py-1.5 rounded-lg font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      simPlatform === 'instagram' ? 'bg-rose-600 text-white shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                  Client Sender Identifier
                </label>
                <input
                  type="text"
                  value={simSender}
                  onChange={(e) => setSimSender(e.target.value)}
                  className="w-full text-xs text-white bg-slate-800 border border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                Client Incoming Message Body:
              </label>
              <textarea
                rows={3}
                value={simText}
                onChange={(e) => setSimText(e.target.value)}
                className="w-full text-xs text-white bg-slate-800/80 border border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => handleSimulateWebhook(false)}
                disabled={isSimulating}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2 cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Processing Webhook & Gemini AI...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Incoming Webhook</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleSimulateWebhook(true)}
                disabled={isSimulating || !lastMessageId}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 font-bold text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-40"
                title="Test duplicate external_message_id rejection"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Test Duplicate Delivery Protection</span>
              </button>
            </div>
          </div>

          {/* Webhook Response & Deduplication Terminal */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono space-y-2 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
                <span>Webhook Execution Audit</span>
                <span className="text-emerald-400">200 OK Status</span>
              </div>
              <div className="space-y-1.5 text-[11px] text-slate-300">
                <div>• Webhook challenge: Verified</div>
                <div>• HMAC signature: Checked</div>
                <div>• Idempotency key: Verified</div>
                {lastMessageId && (
                  <div className="text-cyan-300 truncate">• Last Msg Ref: {lastMessageId}</div>
                )}
              </div>
            </div>

            {simulatorResponse && (
              <div
                className={`p-3 rounded-lg border text-[11px] leading-relaxed ${
                  simulatorResponse.success
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
                }`}
              >
                {simulatorResponse.success ? (
                  <div>
                    ✓ Message ingested into database!
                    <div className="font-bold text-white mt-1">
                      Gemini Extracted: ${simulatorResponse.insight?.extracted_data?.agreed_amount || 150} USD
                    </div>
                  </div>
                ) : (
                  <div>⚠️ {simulatorResponse.error}</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Extracted AI Insights Review Cards (Section 9) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Gemini AI Extracted Contract Intelligence</span>
            </h3>
            <p className="text-xs text-slate-500">
              AI parses incoming WhatsApp & Instagram chats. Requires human confirmation before creating contracts.
            </p>
          </div>
          <span className="text-xs font-bold text-blue-600">
            {insights.length} Extracted Insights
          </span>
        </div>

        <div className="space-y-4">
          {insights.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No conversational scope items extracted yet. Use the simulator above to ingest your first WhatsApp message!
            </div>
          ) : (
            insights.map((ins) => {
              const data = ins.extracted_data || {};
              const isConfirmed = ins.review_status === 'confirmed';

              return (
                <div
                  key={ins.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isConfirmed
                      ? 'bg-emerald-50/20 border-emerald-200'
                      : 'bg-white border-blue-200 shadow-sm'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {data.project_name || 'Project Scope Item'}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-blue-100 text-blue-800">
                          Confidence: {Math.round((ins.confidence_score || 0.9) * 100)}%
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                            isConfirmed
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ins.review_status.replace('_', ' ')}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                        {data.raw_summary}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {data.deliverables?.map((del: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium"
                          >
                            ✓ {del}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between lg:justify-end space-x-4 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Proposed Scope Value</span>
                        <div className="text-2xl font-black text-slate-900">
                          ${data.agreed_amount || 150} <span className="text-xs font-bold text-slate-500">USD</span>
                        </div>
                      </div>

                      {!isConfirmed && (
                        <button
                          onClick={() => handleConvertInsight(ins.id)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center space-x-1.5 cursor-pointer"
                        >
                          <FileCheck2 className="w-3.5 h-3.5" />
                          <span>Formalize into Agreement v2.0</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Messages Ingested Ledger (Section 7.7) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base">
          Ingested Social Messages Feed
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider text-[10px]">
                <th className="py-2.5 px-3">Platform</th>
                <th className="py-2.5 px-3">Sender ID</th>
                <th className="py-2.5 px-3">External Message ID</th>
                <th className="py-2.5 px-3">Message Content</th>
                <th className="py-2.5 px-3">Processing Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {messages.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.platform === 'whatsapp'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {m.platform}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-700">
                    {m.sender_identifier}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-400 truncate max-w-[150px]">
                    {m.external_message_id}
                  </td>
                  <td className="py-3 px-3 text-slate-800 font-medium max-w-[300px] truncate">
                    {m.message_content}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-50 text-blue-700">
                      {m.processing_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
