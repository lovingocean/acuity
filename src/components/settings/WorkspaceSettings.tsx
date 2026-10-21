import React, { useState } from 'react';
import {
  Settings,
  Users,
  CreditCard,
  Key,
  ShieldAlert,
  Sliders,
  Plus,
  Trash2,
  Copy,
  Check,
  RefreshCw
} from 'lucide-react';
import type { Workspace, User, LeadScoreRule, AuditLog } from '../../types';

interface WorkspaceSettingsProps {
  workspace: Workspace;
  currentUser: User;
  leadRules: LeadScoreRule[];
  auditLogs: AuditLog[];
  onUpdateWorkspace: (ws: Workspace) => void;
  onUpdateLeadRules: (rules: LeadScoreRule[]) => void;
  onResetSeedData: () => void;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const WorkspaceSettings: React.FC<WorkspaceSettingsProps> = ({
  workspace,
  currentUser,
  leadRules,
  auditLogs,
  onUpdateWorkspace,
  onUpdateLeadRules,
  onResetSeedData,
  onLogAction
}) => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'scoring' | 'apikeys' | 'audit'>('workspace');

  // Workspace form
  const [wsName, setWsName] = useState(workspace.name);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');
  const [teamMembers, setTeamMembers] = useState<User[]>([
    currentUser,
    { id: 'usr-2', name: 'Jordan Hayes', email: 'jordan.h@acuitysales.io', role: 'admin' },
    { id: 'usr-3', name: 'Maya Lin', email: 'maya.lin@acuitysales.io', role: 'member' }
  ]);

  // API Keys state
  const [apiKeys, setApiKeys] = useState<{ id: string; name: string; key: string; createdAt: string }[]>([
    { id: 'key-1', name: 'Production Outbound API', key: 'acuity_live_8f3a9e217c094bb61', createdAt: '2026-02-01' }
  ]);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleSaveWorkspaceName = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wsName.trim()) return;
    onUpdateWorkspace({ ...workspace, name: wsName.trim() });
    onLogAction('UPDATE_WORKSPACE', 'Workspace', `Updated workspace name to "${wsName.trim()}".`);
    alert('Workspace settings updated.');
  };

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    const newMember: User = {
      id: 'usr-' + Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      role: inviteRole
    };
    setTeamMembers([...teamMembers, newMember]);
    setInviteEmail('');
    onLogAction('INVITE_MEMBER', 'Team', `Invited ${newMember.email} as ${inviteRole}.`);
  };

  const handleToggleRule = (ruleId: string) => {
    const updated = leadRules.map(r => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
    onUpdateLeadRules(updated);
    onLogAction('UPDATE_LEAD_RULES', 'Scoring', `Toggled rule ${ruleId}.`);
  };

  const handleUpdateRulePoints = (ruleId: string, points: number) => {
    const updated = leadRules.map(r => (r.id === ruleId ? { ...r, points } : r));
    onUpdateLeadRules(updated);
  };

  const handleGenerateKey = () => {
    const name = prompt('Name for API Key (e.g. CRM Sync Webhook):');
    if (!name) return;
    const newKey = {
      id: 'key-' + Date.now(),
      name,
      key: `acuity_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setApiKeys([...apiKeys, newKey]);
    onLogAction('GENERATE_API_KEY', 'Security', `Generated API key "${name}".`);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Header & Sub-Navigation */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Workspace Administration & Governance
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Manage multi-tenant team access, lead scoring matrices, API credentials, and compliance audit trail.
            </p>
          </div>

          <div className="flex bg-slate-100 p-0.5 rounded-md border border-slate-200">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'workspace' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Workspace & Team
            </button>
            <button
              onClick={() => setActiveTab('scoring')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'scoring' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lead Scoring Rules
            </button>
            <button
              onClick={() => setActiveTab('apikeys')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'apikeys' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              API Keys
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                activeTab === 'audit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Audit Log ({auditLogs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Workspace & Team */}
      {activeTab === 'workspace' && (
        <div className="space-y-6">
          {/* Workspace General Info */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-3">Workspace Details</h3>
            <form onSubmit={handleSaveWorkspaceName} className="space-y-4 max-w-md">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Workspace Name</label>
                <input
                  type="text"
                  value={wsName}
                  onChange={(e) => setWsName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Current Plan</div>
                  <div className="text-sm font-bold text-indigo-700 mt-0.5">{workspace.plan} Tier</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Total Quota</div>
                  <div className="text-sm font-bold font-mono text-slate-800 mt-0.5 tabular-nums">
                    {workspace.creditsTotal.toLocaleString()} credits
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold shadow-2xs"
              >
                Save Changes
              </button>
            </form>
          </div>

          {/* Team Members & Roles */}
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h3 className="font-bold text-sm text-slate-900 mb-1">Team Members & Access Control</h3>
            <p className="text-slate-500 mb-4">
              Role-based permissions enforce tenant isolation across owners, admins, and members.
            </p>

            {/* Invite Form */}
            <form onSubmit={handleInviteMember} className="flex gap-2 max-w-lg mb-5">
              <input
                type="email"
                required
                placeholder="colleague@yourcompany.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600"
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as any)}
                className="border border-slate-200 rounded px-2 py-1.5 bg-white text-slate-800"
              >
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
              >
                Invite
              </button>
            </form>

            {/* Members table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {teamMembers.map(member => (
                    <tr key={member.id}>
                      <td className="p-3">
                        <div className="font-semibold text-slate-900">{member.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{member.email}</div>
                      </td>
                      <td className="p-3">
                        <span className="capitalize font-semibold text-slate-700">{member.role}</span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-medium">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Reset Demo State option */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-900">Reset Workspace Demo Dataset</h4>
              <p className="text-slate-500 mt-0.5">
                Re-seeds the workspace with 12 enterprise companies and 15 verified contacts.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset all contacts, companies, lists, and sequences to initial state?')) {
                  onResetSeedData();
                  alert('Workspace re-seeded successfully.');
                }
              }}
              className="px-3.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded font-semibold"
            >
              Reset Data
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Lead Scoring Rules */}
      {activeTab === 'scoring' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Configurable Lead Scoring Engine</h3>
              <p className="text-slate-500 mt-0.5">
                Automatically allocate point bonuses based on ICP seniority, corporate size, and deliverability status.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {leadRules.map(rule => (
              <div
                key={rule.id}
                className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-slate-50/50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={() => handleToggleRule(rule.id)}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">{rule.name}</div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Target condition: {rule.field} {rule.operator} "{rule.value}"
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-slate-500">Points:</span>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={rule.points}
                    onChange={(e) => handleUpdateRulePoints(rule.id, Number(e.target.value))}
                    className="w-16 border border-slate-200 rounded px-2 py-1 bg-white text-xs text-center font-mono font-bold"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: API Keys */}
      {activeTab === 'apikeys' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Developer API Keys</h3>
              <p className="text-slate-500 mt-0.5">
                Use workspace API keys to query contacts, trigger email verification, or ingest inbound leads.
              </p>
            </div>
            <button
              type="button"
              onClick={handleGenerateKey}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create API Key</span>
            </button>
          </div>

          <div className="space-y-3">
            {apiKeys.map(k => (
              <div
                key={k.id}
                className="p-3 border border-slate-200 rounded-lg flex items-center justify-between bg-slate-50/50"
              >
                <div>
                  <div className="font-semibold text-slate-900 text-xs">{k.name}</div>
                  <div className="font-mono text-[11px] text-slate-500 mt-0.5">{k.key}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Created: {k.createdAt}</div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(k.id, k.key)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-700 hover:bg-slate-50 font-medium text-xs"
                >
                  {copiedKeyId === k.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-slate-400" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h3 className="font-bold text-sm text-slate-900 mb-1">Security & Data Access Audit Trail</h3>
          <p className="text-slate-500 mb-4">
            Immutable log of all CSV exports, sequence launches, bulk email audits, and team modifications.
          </p>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                <tr>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">User</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Resource</th>
                  <th className="p-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500 text-[11px] whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{log.userName}</td>
                    <td className="p-3 font-mono text-[11px] text-indigo-700 font-bold">{log.action}</td>
                    <td className="p-3 text-slate-600">{log.resource}</td>
                    <td className="p-3 text-slate-600 font-mono text-[11px]">{log.details}</td>
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
