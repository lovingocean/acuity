import React, { useState } from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  Zap,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import type { WaterfallProvider, WaterfallExecutionResult } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface WaterfallEnricherProps {
  onConsumeCredits: (count: number) => boolean;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const WaterfallEnricher: React.FC<WaterfallEnricherProps> = ({
  onConsumeCredits,
  onLogAction
}) => {
  const [providers, setProviders] = useState<WaterfallProvider[]>(() => AcuityStorage.getWaterfallProviders());
  const [targetEmail, setTargetEmail] = useState('satya.nadella@microsoft.com');
  const [targetDomain, setTargetDomain] = useState('microsoft.com');
  const [result, setResult] = useState<WaterfallExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleToggleProvider = (id: string) => {
    const updated = providers.map(p => (p.id === id ? { ...p, isEnabled: !p.isEnabled } : p));
    setProviders(updated);
    AcuityStorage.saveWaterfallProviders(updated);
  };

  const handleRunWaterfall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) return;

    const activeProviders = providers.filter(p => p.isEnabled);
    const creditsNeeded = activeProviders.reduce((s, p) => s + p.costCredits, 0);

    const ok = onConsumeCredits(creditsNeeded);
    if (!ok) {
      alert(`Insufficient credits for waterfall execution (${creditsNeeded} required).`);
      return;
    }

    setIsRunning(true);
    setResult(null);

    setTimeout(() => {
      const res = AcuityStorage.executeWaterfall(targetEmail.trim(), targetDomain.trim());
      setResult(res);
      setIsRunning(false);
      onLogAction('WATERFALL_ENRICHMENT', 'Waterfall', `Executed waterfall cascade across ${activeProviders.length} providers for ${targetEmail}.`);
    }, 600);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Multi-Vendor Waterfall Enrichment Engine (Clay Architecture)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cascade enrichment requests across multiple proprietary B2B registries to maximize match rates for work emails and direct dial mobile numbers.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Waterfall Provider Pipeline Configuration */}
        <div className="lg:col-span-1 bg-white border border-slate-200 rounded-lg p-5 flex flex-col">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Waterfall Routing Sequence</h3>
          <p className="text-slate-500 mb-4">
            Requests fall through each tier automatically until verified data is resolved.
          </p>

          <div className="space-y-3 flex-1">
            {providers.map((p, idx) => (
              <div
                key={p.id}
                className={`p-3 rounded-lg border transition-all ${
                  p.isEnabled ? 'bg-slate-50/70 border-slate-200' : 'bg-slate-100/50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white font-mono text-[10px] font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-semibold text-slate-900 text-xs">{p.name}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={p.isEnabled}
                    onChange={() => handleToggleProvider(p.id)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pl-7 font-mono">
                  <span>Type: <strong className="text-slate-700">{p.providerType}</strong></span>
                  <span>Match: <strong className="text-emerald-700 tabular-nums">{p.matchRate}%</strong></span>
                  <span>Cost: <strong className="text-indigo-700">{p.costCredits} cr</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-Time Execution Console */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg p-5 flex flex-col">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Live Waterfall Execution Test</h3>
          <p className="text-slate-500 mb-4">
            Test resolution cascade across your active providers and review real-time step latency.
          </p>

          <form onSubmit={handleRunWaterfall} className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Target Contact Email</label>
              <input
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Action</label>
              <button
                type="submit"
                disabled={isRunning}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition-colors disabled:opacity-50 shadow-xs flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isRunning ? 'Cascading...' : 'Run Waterfall'}</span>
              </button>
            </div>
          </form>

          {/* Trace Results */}
          {result && (
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/60 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <span className="font-bold text-slate-900 text-xs">Waterfall Cascade Resolved</span>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Target: {result.targetEmail} · Charged: {result.creditsCharged} credits
                  </div>
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Complete
                </span>
              </div>

              {/* Resolved Data Points */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded border border-slate-200 flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Verified Work Mailbox</div>
                    <div className="font-mono font-bold text-slate-900 text-xs">{result.finalEmail}</div>
                  </div>
                </div>

                <div className="p-3 bg-white rounded border border-slate-200 flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <div className="text-[10px] uppercase font-semibold text-slate-400">Direct Dial Mobile (DNC Clean)</div>
                    <div className="font-mono font-bold text-slate-900 text-xs">{result.finalDirectPhone}</div>
                  </div>
                </div>
              </div>

              {/* Step Logs Table */}
              <div>
                <div className="text-[11px] font-semibold text-slate-600 mb-1.5">Provider Execution Trace:</div>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="p-2">Provider</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Latency</th>
                        <th className="p-2">Extracted Fields</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {result.steps.map((st, i) => (
                        <tr key={i}>
                          <td className="p-2 font-semibold text-slate-800">{st.providerName}</td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                              st.status === 'FOUND' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {st.status}
                            </span>
                          </td>
                          <td className="p-2 font-mono text-slate-500 tabular-nums">{st.latencyMs}ms</td>
                          <td className="p-2 font-mono text-indigo-600">
                            {st.foundFields.length > 0 ? st.foundFields.join(', ') : 'None'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
