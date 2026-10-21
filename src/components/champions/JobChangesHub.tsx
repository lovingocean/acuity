import React, { useState } from 'react';
import {
  UserCheck,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Building2,
  Mail,
  Calendar,
  CheckCircle2,
  XCircle,
  Filter,
  Search,
  ExternalLink,
  ShieldCheck,
  Send,
  Plus
} from 'lucide-react';
import type { JobChangeAlert, Contact, SequenceCampaign, LeadList } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface JobChangesHubProps {
  workspaceId: string;
  contacts: Contact[];
  sequences: SequenceCampaign[];
  leadLists: LeadList[];
  onSelectContact: (contact: Contact) => void;
  onEnrollInSequence: (contactIds: string[], sequenceId: string) => void;
  onAddToList: (contactIds: string[], listId: string) => void;
  onConsumeCredits: (count: number) => boolean;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const JobChangesHub: React.FC<JobChangesHubProps> = ({
  workspaceId,
  contacts,
  sequences,
  leadLists,
  onSelectContact,
  onEnrollInSequence,
  onAddToList,
  onConsumeCredits,
  onLogAction
}) => {
  const [alerts, setAlerts] = useState<JobChangeAlert[]>(() => AcuityStorage.getJobChanges(workspaceId));
  const [filterType, setFilterType] = useState<'all' | 'past_customers' | 'under_30_days'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlertIds, setSelectedAlertIds] = useState<string[]>([]);
  const [enrollSequenceId, setEnrollSequenceId] = useState(sequences[0]?.id || '');
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const filteredAlerts = alerts.filter(alert => {
    if (filterType === 'past_customers' && !alert.isPastCustomer) return false;
    if (filterType === 'under_30_days' && alert.daysInRole > 30) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = alert.contactName.toLowerCase().includes(q);
      const matchComp = alert.newCompany.toLowerCase().includes(q) || alert.previousCompany.toLowerCase().includes(q);
      const matchTitle = alert.newTitle.toLowerCase().includes(q);
      if (!matchName && !matchComp && !matchTitle) return false;
    }
    return true;
  });

  const pastCustomerCount = alerts.filter(a => a.isPastCustomer).length;
  const newInRoleCount = alerts.filter(a => a.daysInRole <= 30).length;

  const handleToggleSelect = (id: string) => {
    setSelectedAlertIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedAlertIds.length === filteredAlerts.length) {
      setSelectedAlertIds([]);
    } else {
      setSelectedAlertIds(filteredAlerts.map(a => a.id));
    }
  };

  const handleEnrollAlerts = (alertIds: string[]) => {
    if (!enrollSequenceId) {
      alert('Please choose an outreach sequence first.');
      return;
    }
    const targetAlerts = alerts.filter(a => alertIds.includes(a.id));
    const targetContactIds = targetAlerts.map(a => a.contactId);

    // Consume 1 credit per enrollment
    const ok = onConsumeCredits(targetAlerts.length);
    if (!ok) {
      alert('Insufficient credits for sequence enrollment.');
      return;
    }

    onEnrollInSequence(targetContactIds, enrollSequenceId);
    
    // Update alerts status
    const updated = alerts.map(a =>
      alertIds.includes(a.id) ? { ...a, status: 'outreach_enrolled' as const } : a
    );
    setAlerts(updated);
    AcuityStorage.setItem('job_changes', updated);

    onLogAction('JOB_CHANGE_OUTREACH', 'ChampionTracking', `Enrolled ${alertIds.length} job-change champions into sequence.`);
    setActionMessage(`Enrolled ${alertIds.length} champion(s) in outreach sequence!`);
    setSelectedAlertIds([]);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleDismiss = (id: string) => {
    const updated = alerts.map(a => (a.id === id ? { ...a, status: 'dismissed' as const } : a));
    setAlerts(updated);
    AcuityStorage.setItem('job_changes', updated);
    onLogAction('DISMISS_JOB_CHANGE', 'ChampionTracking', `Dismissed alert ${id}`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">Job Change & Champion Tracker</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  UserGems Engine
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Automatically detect previous buyers and power users who switched to target accounts. Champions close 3.5x faster in the first 90 days.
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Past Buyers</span>
              <span className="text-sm font-bold text-emerald-600">{pastCustomerCount}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">&lt;30 Days in Role</span>
              <span className="text-sm font-bold text-indigo-600">{newInRoleCount}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Alerts</span>
              <span className="text-sm font-bold text-slate-800">{alerts.length}</span>
            </div>
          </div>
        </div>

        {actionMessage && (
          <div className="mt-4 p-2.5 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-700 flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* Filter and Bulk Action Controls */}
      <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by champion, company, or title..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="inline-flex rounded-md border border-slate-200 p-0.5 bg-slate-50">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                filterType === 'all' ? 'bg-white shadow-xs text-slate-800 font-semibold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              All Alerts ({alerts.length})
            </button>
            <button
              onClick={() => setFilterType('past_customers')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 ${
                filterType === 'past_customers' ? 'bg-white shadow-xs text-emerald-700 font-semibold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Sparkles className="w-3 h-3 text-emerald-500" />
              Past Customers ({pastCustomerCount})
            </button>
            <button
              onClick={() => setFilterType('under_30_days')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                filterType === 'under_30_days' ? 'bg-white shadow-xs text-indigo-700 font-semibold' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Fresh Moves (&lt;30d)
            </button>
          </div>
        </div>

        {/* Bulk Action Bar */}
        {selectedAlertIds.length > 0 && (
          <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-lg">
            <span className="text-xs font-bold text-indigo-900">{selectedAlertIds.length} selected</span>
            <select
              value={enrollSequenceId}
              onChange={e => setEnrollSequenceId(e.target.value)}
              className="bg-white border border-indigo-200 rounded px-2 py-1 text-xs text-slate-700 focus:outline-none"
            >
              {sequences.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => handleEnrollAlerts(selectedAlertIds)}
              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium text-xs flex items-center gap-1.5 transition"
            >
              <Send className="w-3 h-3" />
              Enroll Champions
            </button>
          </div>
        )}
      </div>

      {/* Alerts Table */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedAlertIds.length > 0 && selectedAlertIds.length === filteredAlerts.length}
              onChange={handleSelectAll}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-700">Select All ({filteredAlerts.length})</span>
          </div>
          <span className="text-slate-400 text-[11px]">Realtime LinkedIn & CRM Job Webhook Synced</span>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="font-medium">No job change alerts match your current filter.</p>
            </div>
          ) : (
            filteredAlerts.map(alert => {
              const matchedContact = contacts.find(c => c.id === alert.contactId);
              const isSelected = selectedAlertIds.includes(alert.id);

              return (
                <div
                  key={alert.id}
                  className={`p-4 transition hover:bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isSelected ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggleSelect(alert.id)}
                      className="mt-1 rounded text-indigo-600 focus:ring-indigo-500"
                    />

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => matchedContact && onSelectContact(matchedContact)}
                          className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition flex items-center gap-1"
                        >
                          {alert.contactName}
                          <ExternalLink className="w-3 h-3 opacity-60" />
                        </button>

                        {alert.isPastCustomer ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <Sparkles className="w-2.5 h-2.5" />
                            Previous Customer Champion
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                            Executive Move
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-semibold">
                          {alert.daysInRole} days in new role
                        </span>

                        {alert.status === 'outreach_enrolled' && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                            Enrolled in Outreach
                          </span>
                        )}
                      </div>

                      {/* Transition Path */}
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 flex-wrap">
                        <div className="flex items-center gap-1 text-slate-400 line-through">
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{alert.previousCompany}</span>
                          <span className="text-[11px]">({alert.previousTitle})</span>
                        </div>

                        <ArrowRight className="w-3.5 h-3.5 text-indigo-500 shrink-0" />

                        <div className="flex items-center gap-1.5 font-semibold text-slate-900 bg-indigo-50/70 border border-indigo-100 px-2 py-0.5 rounded">
                          <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{alert.newCompany}</span>
                          <span className="text-indigo-700 font-bold">— {alert.newTitle}</span>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-4 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {alert.contactEmail}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Detected {new Date(alert.changedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEnrollAlerts([alert.id])}
                      disabled={alert.status === 'outreach_enrolled'}
                      className={`px-3 py-1.5 rounded font-medium text-xs flex items-center gap-1.5 transition ${
                        alert.status === 'outreach_enrolled'
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      {alert.status === 'outreach_enrolled' ? 'Enrolled' : 'Launch Outreach'}
                    </button>

                    <button
                      onClick={() => handleDismiss(alert.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition"
                      title="Dismiss alert"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
