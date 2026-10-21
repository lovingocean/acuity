import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Search,
  Building2,
  Users,
  Send,
  ExternalLink,
  Flame,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import type { Company, Contact, IntentTopic } from '../../types';

interface IntentSurgeHubProps {
  companies: Company[];
  contacts: Contact[];
  onSelectCompany: (company: Company) => void;
  onSelectContact: (contact: Contact) => void;
  onEnrollInSequence: (contactIds: string[], sequenceId: string) => void;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const IntentSurgeHub: React.FC<IntentSurgeHubProps> = ({
  companies,
  contacts,
  onSelectCompany,
  onSelectContact,
  onEnrollInSequence,
  onLogAction
}) => {
  const [selectedSurgeLevel, setSelectedSurgeLevel] = useState<'All' | 'High' | 'Medium'>('All');
  const [searchTopic, setSearchTopic] = useState('');

  // Collect companies that have intent signals
  const surgingCompanies = companies.filter(c => c.intentSignals && c.intentSignals.length > 0);

  const filteredSurges = surgingCompanies.map(c => {
    const topics = (c.intentSignals || []).filter(t => {
      if (selectedSurgeLevel !== 'All' && t.surgeLevel !== selectedSurgeLevel) return false;
      if (searchTopic.trim() && !t.topic.toLowerCase().includes(searchTopic.toLowerCase())) return false;
      return true;
    });
    return { company: c, topics };
  }).filter(item => item.topics.length > 0);

  const totalSurgingAccounts = filteredSurges.length;
  const highSurgeCount = surgingCompanies.filter(c => c.intentSignals?.some(t => t.surgeLevel === 'High')).length;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                B2B Buyer Intent & Topic Surge Radar (6sense / Bombora Engine)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detect target accounts actively researching your product category, vector search, or compliance migration across 4,000+ B2B publisher networks.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-semibold text-slate-400">High-Surge Accounts</div>
              <div className="font-mono text-base font-bold text-amber-600 tabular-nums">{highSurgeCount} in-market</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="p-3 bg-white border border-slate-200 rounded-lg flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by researched intent topic (e.g. AI Inference)..."
            value={searchTopic}
            onChange={(e) => setSearchTopic(e.target.value)}
            className="w-full text-xs border border-slate-200 rounded px-2.5 py-1 text-slate-900 focus:outline-none focus:border-indigo-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-500">Surge Velocity:</span>
          <div className="flex bg-slate-100 p-0.5 rounded border border-slate-200">
            {(['All', 'High', 'Medium'] as const).map(lvl => (
              <button
                key={lvl}
                onClick={() => setSelectedSurgeLevel(lvl)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  selectedSurgeLevel === lvl ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="space-y-4">
        {filteredSurges.map(({ company, topics }) => {
          const associatedContacts = contacts.filter(
            c => c.companyId === company.id || c.companyDomain.toLowerCase() === company.domain.toLowerCase()
          );

          return (
            <div
              key={company.id}
              className="bg-white border border-slate-200 rounded-lg p-5 hover:border-amber-300 transition-colors shadow-2xs"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded bg-slate-900 text-white font-bold text-base flex items-center justify-center shrink-0">
                    {company.name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => onSelectCompany(company)}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 cursor-pointer"
                      >
                        {company.name}
                      </h3>
                      <span className="font-mono text-slate-400 text-xs">{company.domain}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {company.industry} · {company.headquarters} · {company.employeeRange} employees
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCompany(company)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-semibold text-xs"
                  >
                    View Org Chart
                  </button>
                </div>
              </div>

              {/* Surging Topics Strip */}
              <div className="py-4">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  <span>Publisher Content Surge Topics Detected Past 7 Days</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {topics.map(t => (
                    <div
                      key={t.topic}
                      className="p-3 rounded-lg border border-amber-200/60 bg-amber-50/40 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-slate-900 text-xs truncate" title={t.topic}>
                            {t.topic}
                          </span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                            t.surgeLevel === 'High' ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {t.surgeLevel}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Search Volume: <strong className="font-mono text-slate-700">{t.searchVolume.toLocaleString()}</strong> queries
                        </div>
                      </div>

                      <div className="mt-2 pt-2 border-t border-amber-200/40 flex items-center justify-between text-[11px]">
                        <span className="text-slate-500">Weekly Spike:</span>
                        <span className="font-mono font-bold text-emerald-700 flex items-center">
                          +{t.weeklySurgePct}% <ArrowUpRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* In-Market Decision Makers at this Surging Account */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    <strong>{associatedContacts.length}</strong> buying committee stakeholders ready for outbound touch
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {associatedContacts.slice(0, 3).map(cnt => (
                    <button
                      key={cnt.id}
                      onClick={() => onSelectContact(cnt)}
                      className="text-[11px] font-medium text-slate-700 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 border border-slate-200 px-2 py-0.5 rounded"
                    >
                      {cnt.fullName} ({cnt.seniority})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
