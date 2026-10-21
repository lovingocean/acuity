import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  CheckCircle2,
  XCircle,
  Edit3,
  Calendar,
  Building2,
  Mail,
  Zap,
  TrendingUp,
  Sliders,
  RefreshCw,
  Clock,
  Play,
  Pause,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import type { AiSdrAgent, AiSdrPersonalizedDraft, Contact, SequenceCampaign } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface AiSdrHubProps {
  contacts: Contact[];
  sequences: SequenceCampaign[];
  onConsumeCredits: (count: number) => boolean;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const AiSdrHub: React.FC<AiSdrHubProps> = ({
  contacts,
  sequences,
  onConsumeCredits,
  onLogAction
}) => {
  const [agent, setAgent] = useState<AiSdrAgent>(() => AcuityStorage.getAiSdrAgent());
  const [drafts, setDrafts] = useState<AiSdrPersonalizedDraft[]>(() => AcuityStorage.getAiSdrDrafts());
  const [activeSubTab, setActiveSubTab] = useState<'queue' | 'generator' | 'settings'>('queue');

  // Generator State
  const [selectedContactId, setSelectedContactId] = useState(contacts[0]?.id || '');
  const [pitchTone, setPitchTone] = useState<'Executive Direct' | 'Value-Obsessed' | 'Pain-Point Focused' | 'Casual Tech'>('Executive Direct');
  const [customSignal, setCustomSignal] = useState('Recent expansion in cloud infra & Kubernetes vector search');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<{ subject: string; body: string } | null>(null);

  // Editing state for draft review
  const [editingDraftId, setEditingDraftId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState('');
  const [editBody, setEditBody] = useState('');

  const [notification, setNotification] = useState<string | null>(null);

  const handleToggleAgent = () => {
    const updated = { ...agent, isActive: !agent.isActive };
    setAgent(updated);
    AcuityStorage.saveAiSdrAgent(updated);
    onLogAction('TOGGLE_AI_SDR', 'AiSdr', `Set AI SDR Agent ${agent.name} to ${updated.isActive ? 'Active' : 'Paused'}.`);
  };

  const handleApproveDraft = (draftId: string) => {
    const ok = onConsumeCredits(2);
    if (!ok) {
      alert('Insufficient credits to dispatch AI SDR message.');
      return;
    }

    const updated = drafts.map(d =>
      d.id === draftId ? { ...d, status: 'sent' as const } : d
    );
    setDrafts(updated);
    AcuityStorage.setItem('ai_sdr_drafts', updated);

    // Update agent stats
    const updatedAgent = {
      ...agent,
      emailsDrafted: agent.emailsDrafted + 1,
      meetingBookingsCount: agent.meetingBookingsCount + (Math.random() > 0.7 ? 1 : 0)
    };
    setAgent(updatedAgent);
    AcuityStorage.saveAiSdrAgent(updatedAgent);

    onLogAction('AI_SDR_DISPATCH', 'AiSdr', `Approved and sent pitch draft ${draftId} to prospect.`);
    setNotification('Draft approved and dispatched via rotating mailbox pool!');
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRejectDraft = (draftId: string) => {
    const updated = drafts.filter(d => d.id !== draftId);
    setDrafts(updated);
    AcuityStorage.setItem('ai_sdr_drafts', updated);
    onLogAction('AI_SDR_REJECT', 'AiSdr', `Rejected pitch draft ${draftId}`);
  };

  const handleStartEdit = (draft: AiSdrPersonalizedDraft) => {
    setEditingDraftId(draft.id);
    setEditSubject(draft.subject);
    setEditBody(draft.pitchBody);
  };

  const handleSaveEdit = (draftId: string) => {
    const updated = drafts.map(d =>
      d.id === draftId ? { ...d, subject: editSubject, pitchBody: editBody } : d
    );
    setDrafts(updated);
    AcuityStorage.setItem('ai_sdr_drafts', updated);
    setEditingDraftId(null);
  };

  // Run AI Generation
  const handleGeneratePitch = (e: React.FormEvent) => {
    e.preventDefault();
    const contact = contacts.find(c => c.id === selectedContactId);
    if (!contact) return;

    const ok = onConsumeCredits(1);
    if (!ok) {
      alert('Insufficient credits for AI Pitch generation.');
      return;
    }

    setIsGenerating(true);
    setGeneratedDraft(null);

    setTimeout(() => {
      let subj = '';
      let body = '';

      if (pitchTone === 'Executive Direct') {
        subj = `${contact.companyName} infrastructure & ${contact.title.toLowerCase()} priorities`;
        body = `Hi ${contact.firstName},\n\nNoticed ${contact.companyName}'s current focus on ${customSignal || 'high-scale systems'}.\n\nWe recently partnered with comparable enterprise teams to accelerate execution velocity by 38% while reducing pipeline maintenance overhead.\n\nWould you be open to a concise 7-minute benchmark review this week?`;
      } else if (pitchTone === 'Value-Obsessed') {
        subj = `Quick metric for ${contact.companyName} (${contact.title})`;
        body = `Hi ${contact.firstName},\n\nGiven your leadership at ${contact.companyName}, I pulled some numbers relevant to ${customSignal || 'operational efficiency'}: teams in ${contact.department} typically eliminate 14 hours per engineer monthly using our automated verification architecture.\n\nHappy to share the 2-page case breakdown if of interest?`;
      } else if (pitchTone === 'Pain-Point Focused') {
        subj = `Solving deliverability drop-offs for ${contact.companyName}`;
        body = `Hi ${contact.firstName},\n\nMany ${contact.title}s we speak with in the ${contact.companyName} space struggle with false-positive bounce cascades and stale corporate dials.\n\nWe solved this with multi-source waterfall verification.\n\nWorth a brief conversation on Tuesday?`;
      } else {
        subj = `Idea for ${contact.companyName} x ${contact.firstName}`;
        body = `Hey ${contact.firstName} — saw your recent updates around ${customSignal || 'scaling architecture'}. Big fan of what the ${contact.companyName} team is shipping.\n\nPut together a short visual demo of how our platform plugs into your stack. Open to checking it out?`;
      }

      setGeneratedDraft({ subject: subj, body });
      setIsGenerating(false);

      // Add to queue
      const newDraft: AiSdrPersonalizedDraft = {
        id: 'draft-' + Date.now(),
        contactId: contact.id,
        contactName: contact.fullName,
        contactTitle: contact.title,
        companyName: contact.companyName,
        signalHook: customSignal,
        subject: subj,
        pitchBody: body,
        confidenceScore: 96,
        status: 'pending_review'
      };

      const nextDrafts = [newDraft, ...drafts];
      setDrafts(nextDrafts);
      AcuityStorage.setItem('ai_sdr_drafts', nextDrafts);

      onLogAction('AI_PITCH_GENERATION', 'AiSdr', `Generated AI personalized pitch for ${contact.fullName} at ${contact.companyName}.`);
    }, 700);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Agent Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400"
              />
              <span
                className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                  agent.isActive ? 'bg-emerald-500' : 'bg-slate-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">{agent.name} AI — Autonomous Outbound SDR</h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                  11x / Artisan Class
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    agent.isActive ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {agent.isActive ? 'Active Autopilot' : 'Paused'}
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Researches prospect firmographics, tech stack changes, and buyer signals to synthesize hyper-personalized 1:1 outbound emails.
              </p>
            </div>
          </div>

          {/* Controls & Metrics */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleAgent}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-xs ${
                agent.isActive
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {agent.isActive ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  Pause Agent
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Resume Agent
                </>
              )}
            </button>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1.5">
              <div className="px-2 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Researched</span>
                <span className="text-sm font-bold text-slate-800">{agent.accountsResearched}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="px-2 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Drafted</span>
                <span className="text-sm font-bold text-indigo-600">{agent.emailsDrafted}</span>
              </div>
              <div className="h-6 w-px bg-slate-200" />
              <div className="px-2 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Meetings</span>
                <span className="text-sm font-bold text-emerald-600">{agent.meetingBookingsCount}</span>
              </div>
            </div>
          </div>
        </div>

        {notification && (
          <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{notification}</span>
          </div>
        )}
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveSubTab('queue')}
          className={`pb-2.5 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'queue'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Review Queue ({drafts.filter(d => d.status === 'pending_review').length})
        </button>

        <button
          onClick={() => setActiveSubTab('generator')}
          className={`pb-2.5 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'generator'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Interactive Pitch Copilot
        </button>

        <button
          onClick={() => setActiveSubTab('settings')}
          className={`pb-2.5 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeSubTab === 'settings'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Agent Guardrails & Settings
        </button>
      </div>

      {/* TAB 1: REVIEW QUEUE */}
      {activeSubTab === 'queue' && (
        <div className="space-y-4">
          {drafts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400">
              <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-slate-600">Review queue is empty</p>
              <p className="text-xs mt-1">Use the Interactive Pitch Copilot tab to synthesize your next outbound drafts.</p>
            </div>
          ) : (
            drafts.map(draft => {
              const isEditing = editingDraftId === draft.id;

              return (
                <div
                  key={draft.id}
                  className={`bg-white border rounded-lg p-5 shadow-xs transition ${
                    draft.status === 'sent'
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-sm text-slate-900">{draft.contactName}</span>
                        <span className="text-slate-500">{draft.contactTitle}</span>
                        <span className="text-slate-400">@</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {draft.companyName}
                        </span>

                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                          {draft.confidenceScore}% AI Confidence
                        </span>

                        {draft.status === 'sent' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            Sent to Mailbox
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded w-fit">
                        <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                        <span>Signal Hook: {draft.signalHook}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    {draft.status === 'pending_review' && (
                      <div className="flex items-center gap-2 shrink-0">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveEdit(draft.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-xs transition"
                          >
                            Save Edits
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(draft)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-xs flex items-center gap-1 transition"
                          >
                            <Edit3 className="w-3 h-3" />
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleApproveDraft(draft.id)}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-xs flex items-center gap-1.5 transition shadow-xs"
                        >
                          <Send className="w-3 h-3" />
                          Approve & Send (2 cr)
                        </button>

                        <button
                          onClick={() => handleRejectDraft(draft.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          title="Reject Draft"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="mt-3">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Subject Line</label>
                          <input
                            type="text"
                            value={editSubject}
                            onChange={e => setEditSubject(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Body</label>
                          <textarea
                            rows={4}
                            value={editBody}
                            onChange={e => setEditBody(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500 font-sans"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-slate-800 text-xs flex items-center gap-2 mb-2">
                          <span className="text-slate-400 font-normal">Subject:</span>
                          <span>{draft.subject}</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-100 rounded-md p-3 text-slate-700 whitespace-pre-line leading-relaxed font-sans text-xs">
                          {draft.pitchBody}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: INTERACTIVE PITCH COPILOT */}
      {activeSubTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Generate 1:1 Hyper-Personalized Pitch
            </h2>

            <form onSubmit={handleGeneratePitch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Target Prospect</label>
                <select
                  value={selectedContactId}
                  onChange={e => setSelectedContactId(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                >
                  {contacts.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.fullName} — {c.title} ({c.companyName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pitch Tone & Philosophy</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Executive Direct', 'Value-Obsessed', 'Pain-Point Focused', 'Casual Tech'] as const).map(tone => (
                    <button
                      key={tone}
                      type="button"
                      onClick={() => setPitchTone(tone)}
                      className={`p-2 rounded border text-left text-xs transition ${
                        pitchTone === tone
                          ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-800'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {tone}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Trigger Signal Hook / Angle</label>
                <input
                  type="text"
                  value={customSignal}
                  onChange={e => setCustomSignal(e.target.value)}
                  placeholder="e.g. Series C funding, migrating to AWS, recent hiring surge..."
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Synthesizing Pitch via Gemini AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    Generate AI Pitch (1 credit)
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-600" />
              Generated Output Preview
            </h2>

            {generatedDraft ? (
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[11px] mb-1 font-semibold uppercase">Subject</span>
                  <p className="font-bold text-slate-900 text-xs">{generatedDraft.subject}</p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[11px] mb-2 font-semibold uppercase">Pitch Body</span>
                  <div className="text-slate-800 whitespace-pre-line leading-relaxed font-sans text-xs">
                    {generatedDraft.body}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Added to Review Queue
                  </span>
                  <button
                    onClick={() => setActiveSubTab('queue')}
                    className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    View in Queue
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <Sparkles className="w-8 h-8 opacity-40 mb-2" />
                <p className="font-semibold text-slate-500">No pitch generated yet</p>
                <p className="text-xs text-slate-400 mt-1">Select your prospect and click generate to run the AI engine.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: AGENT SETTINGS & GUARDRAILS */}
      {activeSubTab === 'settings' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5 max-w-3xl">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-600" />
            Autonomous Agent Guardrails & Policy
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div>
                <p className="font-bold text-slate-900">Require Human Review Before Sending</p>
                <p className="text-slate-500 text-xs">All AI drafted pitches sit in the Review Queue until explicitly approved by a team member.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div>
                <p className="font-bold text-slate-900">Daily Autonomous Research Cap</p>
                <p className="text-slate-500 text-xs">Maximum number of target accounts Aria will research per business day.</p>
              </div>
              <input type="number" defaultValue={50} className="w-20 px-2 py-1 border border-slate-300 rounded text-xs text-center" />
            </div>

            <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
              <div>
                <p className="font-bold text-slate-900">Auto-Pause on Deliverability Spike</p>
                <p className="text-slate-500 text-xs">Immediately halt autonomous outreach if mailbox bounce rate exceeds 2.5% in any 24h window.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
