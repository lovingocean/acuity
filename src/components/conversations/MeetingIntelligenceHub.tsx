import React, { useState } from 'react';
import {
  PhoneCall,
  Mic,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  Building2,
  Clock,
  Sparkles,
  BarChart2,
  DollarSign,
  Plus,
  Play,
  Volume2,
  Calendar,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import type { SalesCallRecording, Contact, Company } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface MeetingIntelligenceHubProps {
  contacts: Contact[];
  companies: Company[];
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const MeetingIntelligenceHub: React.FC<MeetingIntelligenceHubProps> = ({
  contacts,
  companies,
  onLogAction
}) => {
  const [calls, setCalls] = useState<SalesCallRecording[]>(() => AcuityStorage.getSalesCalls());
  const [selectedCallId, setSelectedCallId] = useState<string>(calls[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);

  // New call form
  const [newTitle, setNewTitle] = useState('');
  const [newProspectName, setNewProspectName] = useState('');
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newDuration, setNewDuration] = useState(25);
  const [newSummary, setNewSummary] = useState('');

  const selectedCall = calls.find(c => c.id === selectedCallId) || calls[0];

  const handleAddCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCall: SalesCallRecording = {
      id: 'call-' + Date.now(),
      title: newTitle.trim(),
      prospectName: newProspectName.trim() || 'Alex Vance',
      prospectTitle: 'VP of Technology',
      companyName: newCompanyName.trim() || 'Databricks',
      durationMinutes: newDuration,
      recordedAt: new Date().toISOString(),
      overallSentiment: 'Positive',
      talkRatioRep: 35,
      talkRatioProspect: 65,
      competitorMentions: ['Apollo.io'],
      budgetMentioned: true,
      dealRisks: ['Timeline dependent on security evaluation'],
      aiExecutiveSummary: newSummary.trim() || 'Strong alignment on pipeline velocity and email verification accuracy.'
    };

    const nextCalls = [newCall, ...calls];
    setCalls(nextCalls);
    AcuityStorage.saveSalesCall(newCall);
    setSelectedCallId(newCall.id);
    setShowAddModal(false);
    onLogAction('LOG_SALES_CALL', 'ConversationIntelligence', `Analyzed meeting "${newCall.title}" with ${newCall.prospectName}`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">Conversation & Meeting Intelligence</h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                  Gong / Chorus Class
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                AI transcription, talk-to-listen ratios, competitor mention radar, deal risk alerts, and automated CRM sync.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Upload / Record Call
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Call List, Right Deep Intelligence View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Calls List */}
        <div className="lg:col-span-5 space-y-3">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider px-1">
            Recorded Conversations ({calls.length})
          </h2>

          <div className="space-y-2.5">
            {calls.map(call => {
              const isSelected = call.id === selectedCall?.id;

              return (
                <div
                  key={call.id}
                  onClick={() => setSelectedCallId(call.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition ${
                    isSelected
                      ? 'bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-slate-900 text-xs line-clamp-1">{call.title}</h3>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        call.overallSentiment === 'Positive'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {call.overallSentiment}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">{call.prospectName}</span>
                    <span>•</span>
                    <span>{call.companyName}</span>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {call.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(call.recordedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Deep Intelligence Details */}
        <div className="lg:col-span-7">
          {selectedCall ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-5">
              {/* Header */}
              <div className="border-b border-slate-100 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-base font-bold text-slate-900">{selectedCall.title}</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold text-slate-800">{selectedCall.prospectName}</span>
                      <span>({selectedCall.prospectTitle})</span>
                      <span>@</span>
                      <span className="font-semibold text-indigo-600">{selectedCall.companyName}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-center">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
                    <span className="font-bold text-slate-800 text-xs">{selectedCall.durationMinutes} min</span>
                  </div>
                </div>
              </div>

              {/* Talk to Listen Ratio */}
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span className="flex items-center gap-1 text-indigo-700">
                    <Mic className="w-3.5 h-3.5" />
                    Rep Talk Time ({selectedCall.talkRatioRep}%)
                  </span>
                  <span className="flex items-center gap-1 text-emerald-700">
                    <Volume2 className="w-3.5 h-3.5" />
                    Prospect Talk Time ({selectedCall.talkRatioProspect}%)
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                  <div
                    className="bg-indigo-600 h-full"
                    style={{ width: `${selectedCall.talkRatioRep}%` }}
                    title={`Rep: ${selectedCall.talkRatioRep}%`}
                  />
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${selectedCall.talkRatioProspect}%` }}
                    title={`Prospect: ${selectedCall.talkRatioProspect}%`}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Optimal Gong benchmark: 35-45% Rep / 55-65% Prospect.
                </p>
              </div>

              {/* Signals and Competitors Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Competitors Mentioned
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selectedCall.competitorMentions && selectedCall.competitorMentions.length > 0 ? (
                      selectedCall.competitorMentions.map(c => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[10px]"
                        >
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">None detected</span>
                    )}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                    Budget & Purchasing Power
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Budget Discussed & Verified</span>
                  </div>
                </div>
              </div>

              {/* Deal Risks Callout */}
              {selectedCall.dealRisks && selectedCall.dealRisks.length > 0 && (
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-lg">
                  <div className="flex items-center gap-2 font-bold text-amber-900 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>AI Deal Risk Flags Detected</span>
                  </div>
                  <ul className="list-disc list-inside text-amber-800 text-xs space-y-1">
                    {selectedCall.dealRisks.map((risk, i) => (
                      <li key={i}>{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* AI Executive Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Executive Call Brief & Next Steps</span>
                </div>
                <div className="text-slate-700 leading-relaxed text-xs">
                  {selectedCall.aiExecutiveSummary}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-lg text-slate-400">
              <PhoneCall className="w-8 h-8 opacity-40 mb-2" />
              <p className="font-semibold text-slate-500">No meeting selected</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal to upload/log call */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Upload & Analyze Meeting Recording</h3>
            <p className="text-slate-500 text-xs mb-4">Run Gong-style transcript analysis and sentiment detection.</p>

            <form onSubmit={handleAddCall} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solution Architecture Review"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Prospect Name</label>
                <input
                  type="text"
                  placeholder="e.g. Elena Chen"
                  value={newProspectName}
                  onChange={e => setNewProspectName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
                <input
                  type="text"
                  placeholder="e.g. Databricks"
                  value={newCompanyName}
                  onChange={e => setNewCompanyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Call Summary Notes</label>
                <textarea
                  rows={3}
                  placeholder="Key discussion points, objections, and next actions..."
                  value={newSummary}
                  onChange={e => setNewSummary(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold transition"
                >
                  Save & Synthesize
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
