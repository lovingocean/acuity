import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Play,
  Pause,
  Clock,
  Sparkles,
  Users,
  Send,
  CheckCircle2,
  Trash2,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import type { SequenceCampaign, SequenceStep, Contact } from '../../types';

interface SequencesManagerProps {
  sequences: SequenceCampaign[];
  contacts: Contact[];
  onSaveSequence: (seq: SequenceCampaign) => void;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const SequencesManager: React.FC<SequencesManagerProps> = ({
  sequences,
  contacts,
  onSaveSequence,
  onLogAction
}) => {
  const [selectedSeqId, setSelectedSeqId] = useState<string>(sequences[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSeqName, setNewSeqName] = useState('');

  const currentSeq = sequences.find(s => s.id === selectedSeqId) || sequences[0];

  const handleToggleStatus = (seq: SequenceCampaign) => {
    const nextStatus = seq.status === 'active' ? 'paused' : 'active';
    const updated: SequenceCampaign = { ...seq, status: nextStatus };
    onSaveSequence(updated);
    onLogAction('SEQUENCE_STATUS', 'Sequence', `Changed sequence "${seq.name}" to ${nextStatus}.`);
  };

  const handleCreateSequence = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSeqName.trim()) return;

    const newSeq: SequenceCampaign = {
      id: 'seq-' + Date.now(),
      workspaceId: currentSeq?.workspaceId || 'ws-main',
      name: newSeqName.trim(),
      status: 'draft',
      enrolledCount: 0,
      sentCount: 0,
      openedCount: 0,
      repliedCount: 0,
      bouncedCount: 0,
      enrolledContactIds: [],
      createdAt: new Date().toISOString(),
      steps: [
        {
          id: 'step-' + Date.now() + '-1',
          stepNumber: 1,
          delayDays: 0,
          channel: 'email',
          subject: 'Quick question regarding {{company}}',
          bodyTemplate: 'Hi {{first_name}},\n\nI was reviewing {{company}}\'s recent milestones and wanted to reach out regarding your current engineering workflows.\n\nOpen to a brief 5-minute chat next week?'
        },
        {
          id: 'step-' + Date.now() + '-2',
          stepNumber: 2,
          delayDays: 3,
          channel: 'email',
          subject: 'Re: Quick question regarding {{company}}',
          bodyTemplate: 'Hi {{first_name}},\n\nWanted to quickly follow up on my note below. Would Tuesday at 2 PM work for a quick conversation?'
        }
      ]
    };

    onSaveSequence(newSeq);
    setSelectedSeqId(newSeq.id);
    setNewSeqName('');
    setShowCreateModal(false);
    onLogAction('CREATE_SEQUENCE', 'Sequence', `Created sequence campaign "${newSeq.name}".`);
  };

  const handleAddStep = () => {
    if (!currentSeq) return;
    const nextStepNum = currentSeq.steps.length + 1;
    const newStep: SequenceStep = {
      id: 'step-' + Date.now(),
      stepNumber: nextStepNum,
      delayDays: 3,
      channel: 'email',
      subject: `Follow-up #${nextStepNum} regarding {{company}}`,
      bodyTemplate: `Hi {{first_name}},\n\nFollowing up on my previous notes. Wanted to check if this priority is top of mind for {{company}} this quarter?`
    };

    onSaveSequence({
      ...currentSeq,
      steps: [...currentSeq.steps, newStep]
    });
    onLogAction('ADD_STEP', 'Sequence', `Added step #${nextStepNum} to sequence "${currentSeq.name}".`);
  };

  const handleUpdateStep = (stepId: string, updates: Partial<SequenceStep>) => {
    if (!currentSeq) return;
    const nextSteps = currentSeq.steps.map(s => (s.id === stepId ? { ...s, ...updates } : s));
    onSaveSequence({
      ...currentSeq,
      steps: nextSteps
    });
  };

  const handleDeleteStep = (stepId: string) => {
    if (!currentSeq || currentSeq.steps.length <= 1) {
      alert('Sequences require at least 1 step.');
      return;
    }
    const nextSteps = currentSeq.steps.filter(s => s.id !== stepId);
    onSaveSequence({
      ...currentSeq,
      steps: nextSteps.map((s, idx) => ({ ...s, stepNumber: idx + 1 }))
    });
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* Sequences Sidebar list */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">Sales Sequences</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Automated multi-channel outreach</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {sequences.map(seq => {
            const isSelected = (currentSeq?.id === seq.id);
            const replyRate = seq.sentCount > 0 ? Math.round((seq.repliedCount / seq.sentCount) * 100) : 0;

            return (
              <div
                key={seq.id}
                onClick={() => setSelectedSeqId(seq.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-50/70 border-l-2 border-indigo-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-semibold text-xs text-slate-900 line-clamp-1">{seq.name}</h4>
                  <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                    seq.status === 'active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : seq.status === 'paused'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {seq.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-2 font-mono">
                  <span>{seq.steps.length} steps</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">{seq.enrolledCount} enrolled</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-600 font-semibold tabular-nums">{replyRate}% reply</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Sequence Detail & Steps Builder */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {currentSeq ? (
          <>
            {/* Header info */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    {currentSeq.name}
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Auto-stops when recipient replies or unsubscribes. CAN-SPAM compliant footers injected automatically.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleToggleStatus(currentSeq)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors ${
                    currentSeq.status === 'active'
                      ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                  }`}
                >
                  {currentSeq.status === 'active' ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause Outreach</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>Activate Sequence</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-5 divide-x divide-slate-100 border-b border-slate-200 bg-slate-50 text-xs text-center py-3">
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Enrolled</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                  {currentSeq.enrolledCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Delivered</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                  {currentSeq.sentCount}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Open Rate</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                  {currentSeq.sentCount > 0 ? Math.round((currentSeq.openedCount / currentSeq.sentCount) * 100) : 0}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Reply Rate</div>
                <div className="text-base font-bold font-mono text-emerald-700 mt-0.5 tabular-nums">
                  {currentSeq.sentCount > 0 ? Math.round((currentSeq.repliedCount / currentSeq.sentCount) * 100) : 0}%
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-medium">Bounces</div>
                <div className="text-base font-bold font-mono text-slate-900 mt-0.5 tabular-nums">
                  {currentSeq.bouncedCount}
                </div>
              </div>
            </div>

            {/* Sequence Steps Timeline */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                  Outreach Steps & Cadence
                </span>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Touchpoint</span>
                </button>
              </div>

              {currentSeq.steps.map((step, idx) => (
                <div
                  key={step.id}
                  className="bg-white border border-slate-200 rounded-lg p-5 shadow-2xs relative"
                >
                  {/* Step header */}
                  <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                        {step.stepNumber}
                      </span>
                      <span className="font-semibold text-xs text-slate-900">
                        {step.channel === 'email' ? 'Automated Email' : 'LinkedIn Touchpoint'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Wait</span>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={step.delayDays}
                          onChange={(e) => handleUpdateStep(step.id, { delayDays: Number(e.target.value) })}
                          className="w-12 border border-slate-200 rounded px-1.5 py-0.5 text-xs text-center font-mono font-semibold"
                        />
                        <span>days after previous</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteStep(step.id)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded"
                        title="Delete step"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Subject Line
                    </label>
                    <input
                      type="text"
                      value={step.subject}
                      onChange={(e) => handleUpdateStep(step.id, { subject: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-600 text-slate-900"
                    />
                  </div>

                  {/* Body template */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-slate-600">
                        Body Template (Supported variables: <code className="font-mono text-indigo-600">{'{{first_name}}'}</code>, <code className="font-mono text-indigo-600">{'{{company}}'}</code>)
                      </label>
                    </div>
                    <textarea
                      rows={4}
                      value={step.bodyTemplate}
                      onChange={(e) => handleUpdateStep(step.id, { bodyTemplate: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded text-xs font-mono text-slate-800 focus:outline-none focus:border-indigo-600 leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-slate-400">
            Select or create a sales sequence campaign.
          </div>
        )}
      </div>

      {/* Modal: Create Sequence */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateSequence} className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Create Outreach Sequence</h3>
            <p className="text-xs text-slate-500 mb-4">Launch multi-step automated touchpoints.</p>

            <div className="mb-4 text-xs">
              <label className="block font-semibold text-slate-700 mb-1">Sequence Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Enterprise CTO Cold Outbound"
                value={newSeqName}
                onChange={(e) => setNewSeqName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-indigo-600 text-slate-900"
              />
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 shadow-xs"
              >
                Create Sequence
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
