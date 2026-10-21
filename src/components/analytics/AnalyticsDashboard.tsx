import React from 'react';
import {
  BarChart3,
  Users,
  Building2,
  Mail,
  Zap,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  PieChart
} from 'lucide-react';
import type { Contact, Company, SequenceCampaign, Workspace } from '../../types';

interface AnalyticsDashboardProps {
  contacts: Contact[];
  companies: Company[];
  sequences: SequenceCampaign[];
  workspace: Workspace;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  contacts,
  companies,
  sequences,
  workspace
}) => {
  const verifiedCount = contacts.filter(c => c.emailStatus === 'verified').length;
  const verifiedPercentage = contacts.length > 0 ? Math.round((verifiedCount / contacts.length) * 100) : 0;

  const hotLeadsCount = contacts.filter(c => c.leadScore >= 70).length;
  const warmLeadsCount = contacts.filter(c => c.leadScore >= 40 && c.leadScore < 70).length;
  const coldLeadsCount = contacts.filter(c => c.leadScore < 40).length;

  const totalSent = sequences.reduce((sum, s) => sum + s.sentCount, 0);
  const totalReplies = sequences.reduce((sum, s) => sum + s.repliedCount, 0);
  const overallReplyRate = totalSent > 0 ? Math.round((totalReplies / totalSent) * 100) : 0;

  // Pipeline count
  const pipelineStages = [
    { label: 'New Uncontacted', count: contacts.filter(c => c.leadStatus === 'New').length, color: 'bg-slate-400' },
    { label: 'Contacted', count: contacts.filter(c => c.leadStatus === 'Contacted').length, color: 'bg-blue-500' },
    { label: 'Engaged', count: contacts.filter(c => c.leadStatus === 'Engaged').length, color: 'bg-indigo-500' },
    { label: 'Qualified (Meeting)', count: contacts.filter(c => c.leadStatus === 'Qualified').length, color: 'bg-emerald-500' },
    { label: 'Customer', count: contacts.filter(c => c.leadStatus === 'Customer').length, color: 'bg-violet-600' }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <h2 className="text-base font-bold text-slate-900 leading-tight">
          Sales Intelligence & Prospecting Telemetry
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Workspace analytics tracking contact discovery, deliverability verification coverage, and outreach performance.
        </p>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Indexed Prospects</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {contacts.length.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {companies.length} verified companies
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Verified Email Coverage</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            {verifiedPercentage}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {verifiedCount} of {contacts.length} mailboxes deliverable
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Sequence Reply Rate</span>
            <Mail className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {overallReplyRate}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {totalReplies} positive replies out of {totalSent} touches
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Workspace Credits</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {(workspace.creditsTotal - workspace.creditsUsed).toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {workspace.creditsUsed} consumed of {workspace.creditsTotal} quota
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Funnel */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-bold text-sm text-slate-900 mb-1">CRM Prospect Pipeline Stages</h3>
          <p className="text-slate-500 text-xs mb-4">Current conversion status across your active contacts.</p>

          <div className="space-y-3">
            {pipelineStages.map((stage) => {
              const pct = contacts.length > 0 ? Math.round((stage.count / contacts.length) * 100) : 0;
              return (
                <div key={stage.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-slate-700">{stage.label}</span>
                    <span className="font-mono font-semibold text-slate-900 tabular-nums">
                      {stage.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-300`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lead Score Distribution */}
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Lead Score Tier Distribution</h3>
          <p className="text-slate-500 text-xs mb-4">Automated scoring computed by seniority, headcount, and verified deliverability.</p>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-emerald-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Hot Leads (Score ≥ 70)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{hotLeadsCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${contacts.length > 0 ? (hotLeadsCount / contacts.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-amber-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Warm Leads (Score 40 - 69)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{warmLeadsCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${contacts.length > 0 ? (warmLeadsCount / contacts.length) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-slate-600 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  Cold Leads (Score &lt; 40)
                </span>
                <span className="font-mono font-bold text-slate-900 tabular-nums">{coldLeadsCount}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="h-full bg-slate-400 rounded-full"
                  style={{ width: `${contacts.length > 0 ? (coldLeadsCount / contacts.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-5 p-3 bg-slate-50 rounded border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
            Lead scores are automatically re-calculated when contact seniority changes or when business email is verified.
          </div>
        </div>
      </div>
    </div>
  );
};
