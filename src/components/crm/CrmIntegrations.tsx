import React, { useState } from 'react';
import {
  Cable,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Trash2,
  Plus,
  ShieldCheck,
  Lock,
  ExternalLink
} from 'lucide-react';
import type { CrmIntegration, SuppressionRecord } from '../../types';

interface CrmIntegrationsProps {
  integrations: CrmIntegration[];
  suppressionRecords: SuppressionRecord[];
  onUpdateIntegration: (integration: CrmIntegration) => void;
  onAddSuppression: (type: 'email' | 'domain', value: string, reason: SuppressionRecord['reason']) => void;
  onDeleteSuppression: (id: string) => void;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const CrmIntegrations: React.FC<CrmIntegrationsProps> = ({
  integrations,
  suppressionRecords,
  onUpdateIntegration,
  onAddSuppression,
  onDeleteSuppression,
  onLogAction
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'integrations' | 'suppression'>('integrations');

  // Suppression form
  const [suppType, setSuppType] = useState<'email' | 'domain'>('domain');
  const [suppValue, setSuppValue] = useState('');
  const [suppReason, setSuppReason] = useState<SuppressionRecord['reason']>('Compliance');

  const handleToggleConnect = (integration: CrmIntegration) => {
    const nextConnected = !integration.isConnected;
    const updated: CrmIntegration = {
      ...integration,
      isConnected: nextConnected,
      connectedAt: nextConnected ? new Date().toISOString() : undefined,
      lastSyncedAt: nextConnected ? new Date().toISOString() : integration.lastSyncedAt
    };
    onUpdateIntegration(updated);
    onLogAction(
      nextConnected ? 'CONNECT_CRM' : 'DISCONNECT_CRM',
      'Integration',
      `${nextConnected ? 'Connected' : 'Disconnected'} provider ${integration.name}.`
    );
  };

  const handleTriggerSync = (integration: CrmIntegration) => {
    const updated: CrmIntegration = {
      ...integration,
      lastSyncedAt: new Date().toISOString(),
      recordsSynced: integration.recordsSynced + 12
    };
    onUpdateIntegration(updated);
    onLogAction('CRM_SYNC', 'Integration', `Synced 12 records with ${integration.name}.`);
    alert(`Sync completed successfully for ${integration.name}. 12 records updated.`);
  };

  const handleAddSuppressionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!suppValue.trim()) return;
    onAddSuppression(suppType, suppValue.trim().toLowerCase(), suppReason);
    setSuppValue('');
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Header and Subtabs */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              CRM Integrations & Suppression Management
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sync prospects with official sales stacks and enforce CAN-SPAM, CASL, and GDPR opt-out policies.
            </p>
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setActiveSubTab('integrations')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeSubTab === 'integrations'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              CRM Connectors ({integrations.length})
            </button>
            <button
              onClick={() => setActiveSubTab('suppression')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeSubTab === 'suppression'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Suppression & Opt-Outs ({suppressionRecords.length})
            </button>
          </div>
        </div>
      </div>

      {activeSubTab === 'integrations' ? (
        /* CRM Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map(integ => (
            <div
              key={integ.id}
              className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700">
                      {integ.name[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{integ.name}</h3>
                      <div className="text-[11px] text-slate-500 capitalize">
                        Sync cadence: {integ.syncFrequency}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    integ.isConnected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {integ.isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                {integ.isConnected && (
                  <div className="bg-slate-50 p-3 rounded border border-slate-100 mb-4 space-y-1.5 text-[11px]">
                    <div className="flex justify-between text-slate-600">
                      <span>API Credentials:</span>
                      <span className="font-mono text-slate-800">{integ.apiKeyMasked || 'OAuth 2.0 Token (Active)'}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Last Synchronized:</span>
                      <span className="font-mono text-slate-800">
                        {integ.lastSyncedAt ? new Date(integ.lastSyncedAt).toLocaleString() : 'Pending'}
                      </span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Records Synced:</span>
                      <span className="font-mono font-semibold text-slate-800 tabular-nums">
                        {integ.recordsSynced.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                {/* Field Mappings preview */}
                {integ.fieldMappings.length > 0 && (
                  <div className="mb-4">
                    <div className="text-[10px] uppercase font-semibold text-slate-400 mb-1.5">
                      Mapped Properties ({integ.fieldMappings.length})
                    </div>
                    <div className="space-y-1">
                      {integ.fieldMappings.map((m, idx) => (
                        <div key={idx} className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded">
                          <span className="font-mono text-indigo-700">{m.internalField}</span>
                          <span className="text-slate-400 text-[10px]">→</span>
                          <span className="font-mono text-slate-700">{m.externalField}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                {integ.isConnected ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleTriggerSync(integ)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Sync Now</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleConnect(integ)}
                      className="text-xs text-red-600 hover:text-red-700 font-medium"
                    >
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleConnect(integ)}
                    className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs transition-colors"
                  >
                    Connect {integ.name}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Suppression & Compliance List */
        <div className="space-y-4">
          {/* Add form */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-1">Add Suppression / Opt-Out Rule</h3>
            <p className="text-xs text-slate-500 mb-4">
              Suppress entire competitor domains or unsubscribed prospect emails from all sequences and exports.
            </p>

            <form onSubmit={handleAddSuppressionSubmit} className="flex flex-wrap items-end gap-3 text-xs">
              <div className="w-36">
                <label className="block text-slate-600 font-semibold mb-1">Type</label>
                <select
                  value={suppType}
                  onChange={(e) => setSuppType(e.target.value as 'email' | 'domain')}
                  className="w-full border border-slate-200 rounded p-1.5 bg-white text-slate-800"
                >
                  <option value="domain">Domain (e.g. competitor.com)</option>
                  <option value="email">Email Address</option>
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-slate-600 font-semibold mb-1">Target Value *</label>
                <input
                  type="text"
                  required
                  placeholder={suppType === 'domain' ? 'competitor.com' : 'user@domain.com'}
                  value={suppValue}
                  onChange={(e) => setSuppValue(e.target.value)}
                  className="w-full border border-slate-200 rounded p-1.5 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="w-40">
                <label className="block text-slate-600 font-semibold mb-1">Reason</label>
                <select
                  value={suppReason}
                  onChange={(e) => setSuppReason(e.target.value as SuppressionRecord['reason'])}
                  className="w-full border border-slate-200 rounded p-1.5 bg-white text-slate-800"
                >
                  <option value="Compliance">Compliance / Legal</option>
                  <option value="Unsubscribed">Unsubscribed</option>
                  <option value="Bounced">Hard Bounced</option>
                  <option value="Manual">Manual Block</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded shadow-2xs"
              >
                Add Rule
              </button>
            </form>
          </div>

          {/* Suppression records table */}
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <tr>
                  <th className="py-2.5 px-4">Type</th>
                  <th className="py-2.5 px-3">Value</th>
                  <th className="py-2.5 px-3">Reason</th>
                  <th className="py-2.5 px-3">Enacted On</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {suppressionRecords.map(rec => (
                  <tr key={rec.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 capitalize font-medium text-slate-700">
                      {rec.type}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-900 font-semibold">
                      {rec.value}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                        {rec.reason}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(rec.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => onDeleteSuppression(rec.id)}
                        className="text-slate-400 hover:text-red-600"
                        title="Remove suppression rule"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
