import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  FolderKanban,
  Building2,
  Calendar,
  Layers,
  ArrowRight,
  Plus,
  CheckCircle2,
  ShieldCheck,
  Zap,
  ChevronRight,
  Filter
} from 'lucide-react';
import type { RevenueAttributionOpportunity, Company, SequenceCampaign } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface DealsAttributionHubProps {
  companies: Company[];
  sequences: SequenceCampaign[];
  onLogAction: (action: string, resource: string, details: string) => void;
}

const STAGES: RevenueAttributionOpportunity['stage'][] = [
  'Discovery',
  'Proposal',
  'Negotiation',
  'Closed Won'
];

export const DealsAttributionHub: React.FC<DealsAttributionHubProps> = ({
  companies,
  sequences,
  onLogAction
}) => {
  const [deals, setDeals] = useState<RevenueAttributionOpportunity[]>(() =>
    AcuityStorage.getRevenueAttributions()
  );
  const [showAddModal, setShowAddModal] = useState(false);

  // New deal form
  const [dealName, setDealName] = useState('');
  const [companyName, setCompanyName] = useState(companies[0]?.name || 'Databricks');
  const [dealValue, setDealValue] = useState(75000);
  const [originSeq, setOriginSeq] = useState(sequences[0]?.name || 'Executive Value Architecture');
  const [initialStage, setInitialStage] = useState<RevenueAttributionOpportunity['stage']>('Discovery');

  const handleMoveStage = (dealId: string, nextStage: RevenueAttributionOpportunity['stage']) => {
    const updated = deals.map(d => (d.id === dealId ? { ...d, stage: nextStage } : d));
    setDeals(updated);
    AcuityStorage.setItem('revenue_attributions', updated);
    onLogAction('MOVE_DEAL_STAGE', 'DealsAttribution', `Moved deal ${dealId} to ${nextStage}.`);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealName.trim()) return;

    const newDeal: RevenueAttributionOpportunity = {
      id: 'deal-' + Date.now(),
      dealName: dealName.trim(),
      companyName,
      dealValue,
      stage: initialStage,
      originatingSequence: originSeq,
      firstTouchDate: new Date().toISOString().split('T')[0],
      closedDate: initialStage === 'Closed Won' ? new Date().toISOString().split('T')[0] : 'In Flight',
      touchpointsCount: 4,
      winProbability: initialStage === 'Closed Won' ? 100 : initialStage === 'Negotiation' ? 80 : 40,
      roiMultiplier: Math.round((dealValue / 4500) * 10) / 10
    };

    const next = [newDeal, ...deals];
    setDeals(next);
    AcuityStorage.setItem('revenue_attributions', next);
    setShowAddModal(false);
    setDealName('');
    onLogAction('CREATE_DEAL', 'DealsAttribution', `Created opportunity "${newDeal.dealName}" ($${dealValue.toLocaleString()})`);
  };

  const closedWonTotal = deals
    .filter(d => d.stage === 'Closed Won')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const pipelineInFlight = deals
    .filter(d => d.stage !== 'Closed Won')
    .reduce((sum, d) => sum + d.dealValue, 0);

  const avgRoi = Math.round((deals.reduce((sum, d) => sum + d.roiMultiplier, 0) / (deals.length || 1)) * 10) / 10;

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">Deals Pipeline & Revenue Attribution</h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Clari / Apollo Deals Class
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Track full sales cycle progression from first cold outbound touch to Closed Won ARR with multi-touch attribution.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Closed Won ARR</span>
              <span className="text-sm font-bold text-emerald-600">${closedWonTotal.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">In Flight Pipeline</span>
              <span className="text-sm font-bold text-indigo-600">${pipelineInFlight.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Sequence ROI</span>
              <span className="text-sm font-bold text-amber-600">{avgRoi}x</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              New Deal
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        {STAGES.map(stage => {
          const stageDeals = deals.filter(d => d.stage === stage);
          const stageValue = stageDeals.reduce((sum, d) => sum + d.dealValue, 0);

          return (
            <div key={stage} className="bg-slate-100/70 border border-slate-200 rounded-lg p-3 flex flex-col min-h-[480px]">
              {/* Stage Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                  <span>{stage}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-600 text-[10px]">
                    {stageDeals.length}
                  </span>
                </div>
                <span className="font-bold text-slate-600 text-[11px]">
                  ${stageValue.toLocaleString()}
                </span>
              </div>

              {/* Deal Cards */}
              <div className="space-y-2.5 flex-1">
                {stageDeals.length === 0 ? (
                  <div className="h-28 flex items-center justify-center text-slate-400 text-[11px] border-2 border-dashed border-slate-200 rounded">
                    No active deals in {stage}
                  </div>
                ) : (
                  stageDeals.map(deal => (
                    <div
                      key={deal.id}
                      className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-indigo-400 transition"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{deal.dealName}</h4>
                        <span className="font-bold text-emerald-600 text-xs shrink-0">
                          ${deal.dealValue.toLocaleString()}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-600 flex items-center gap-1 mb-2">
                        <Building2 className="w-3 h-3 text-slate-400" />
                        <span className="font-semibold text-slate-800">{deal.companyName}</span>
                      </div>

                      <div className="p-2 bg-slate-50 border border-slate-100 rounded text-[10px] text-slate-500 space-y-1 mb-2.5">
                        <div className="flex items-center justify-between">
                          <span>Originating Sequence:</span>
                          <span className="font-semibold text-indigo-700 line-clamp-1 text-right max-w-[130px]">
                            {deal.originatingSequence}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Touchpoints:</span>
                          <span className="font-bold text-slate-700">{deal.touchpointsCount} touches</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Attributed Outbound ROI:</span>
                          <span className="font-bold text-emerald-600">{deal.roiMultiplier}x Multiplier</span>
                        </div>
                      </div>

                      {/* Stage Progression Selector */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                        <span className="text-slate-400">Move to:</span>
                        <div className="flex items-center gap-1">
                          {STAGES.filter(s => s !== stage).map(targetStage => (
                            <button
                              key={targetStage}
                              onClick={() => handleMoveStage(deal.id, targetStage)}
                              className="px-1.5 py-0.5 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 rounded text-[10px] text-slate-600 font-medium transition"
                            >
                              {targetStage.split(' ')[0]}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Create Sales Pipeline Opportunity</h3>
            <p className="text-slate-500 text-xs mb-4">Link a company to an outbound attribution pipeline stage.</p>

            <form onSubmit={handleAddDeal} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Databricks Outbound Expansion"
                  value={dealName}
                  onChange={e => setDealName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Associated Company</label>
                <select
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.domain})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ARR Value ($)</label>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={e => setDealValue(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stage</label>
                  <select
                    value={initialStage}
                    onChange={e => setInitialStage(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                  >
                    {STAGES.map(s => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Originating Outbound Sequence</label>
                <select
                  value={originSeq}
                  onChange={e => setOriginSeq(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                >
                  {sequences.map(s => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
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
                  Create Opportunity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
