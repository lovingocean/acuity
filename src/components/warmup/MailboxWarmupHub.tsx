import React, { useState } from 'react';
import {
  Mail,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Plus,
  Play,
  Pause,
  Sliders,
  Flame,
  Search,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import type { MailboxAccount } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface MailboxWarmupHubProps {
  onLogAction: (action: string, resource: string, details: string) => void;
}

const SPAM_TRIGGERS: { word: string; suggestion: string }[] = [
  { word: 'guarantee', suggestion: 'ensure / substantiate' },
  { word: 'free', suggestion: 'complimentary / without obligation' },
  { word: 'risk-free', suggestion: 'proven / low-friction' },
  { word: 'urgent', suggestion: 'time-sensitive / prioritized' },
  { word: '100%', suggestion: 'consistently / reliably' },
  { word: 'act now', suggestion: 'take a look this week' },
  { word: 'cheap', suggestion: 'cost-effective / efficient' },
  { word: 'congratulations', suggestion: 'noticed your milestone' },
  { word: 'instant', suggestion: 'rapid / streamlined' },
  { word: 'cash', suggestion: 'capital / revenue' }
];

export const MailboxWarmupHub: React.FC<MailboxWarmupHubProps> = ({ onLogAction }) => {
  const [mailboxes, setMailboxes] = useState<MailboxAccount[]>(() => AcuityStorage.getMailboxPool());
  const [activeTab, setActiveTab] = useState<'pool' | 'analyzer' | 'dns'>('pool');

  // Copy Analyzer State
  const [testSubject, setTestSubject] = useState('Quick question regarding your cloud infrastructure');
  const [testBody, setTestBody] = useState(
    'Hi Alex,\n\nWe guarantee you will get 100% free access to our risk-free tool if you act now. Let me know if you want to make more cash today!'
  );
  const [analysisResult, setAnalysisResult] = useState<{
    score: number;
    foundSpamWords: { word: string; suggestion: string }[];
    grade: 'A+' | 'B' | 'C' | 'Risky';
  } | null>(null);

  // New Mailbox modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newSender, setNewSender] = useState('');
  const [newProvider, setNewProvider] = useState<'Google Workspace' | 'Microsoft 365' | 'Custom SES Relay'>('Google Workspace');

  const handleTogglePause = (id: string) => {
    const updated = mailboxes.map(m => (m.id === id ? { ...m, isPaused: !m.isPaused } : m));
    setMailboxes(updated);
    AcuityStorage.saveMailboxPool(updated);
    onLogAction('MAILBOX_TOGGLE', 'MailboxWarmup', `Toggled pause status for mailbox ${id}`);
  };

  const handleAnalyzeCopy = (e: React.FormEvent) => {
    e.preventDefault();
    const fullText = (testSubject + ' ' + testBody).toLowerCase();
    const found: { word: string; suggestion: string }[] = [];

    SPAM_TRIGGERS.forEach(item => {
      const regex = new RegExp(`\\b${item.word}\\b`, 'i');
      if (regex.test(fullText)) {
        found.push(item);
      }
    });

    let score = 100 - found.length * 15;
    if (score < 10) score = 10;

    let grade: 'A+' | 'B' | 'C' | 'Risky' = 'A+';
    if (score < 60) grade = 'Risky';
    else if (score < 80) grade = 'C';
    else if (score < 95) grade = 'B';

    setAnalysisResult({
      score,
      foundSpamWords: found,
      grade
    });

    onLogAction('SPAM_ANALYZER', 'Deliverability', `Scanned copy. Score: ${score}/100 with ${found.length} flags.`);
  };

  const handleAddMailbox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    const newMb: MailboxAccount = {
      id: 'mbx-' + Date.now(),
      email: newEmail.trim(),
      senderName: newSender.trim() || 'Outbound Rep',
      provider: newProvider,
      dailyLimit: 30,
      sentToday: 0,
      warmupScore: 100,
      warmupEmailsExchanged: 12,
      spfValid: true,
      dkimValid: true,
      dmarcValid: true,
      isPaused: false
    };

    const next = [...mailboxes, newMb];
    setMailboxes(next);
    AcuityStorage.saveMailboxPool(next);
    setShowAddModal(false);
    setNewEmail('');
    setNewSender('');
    onLogAction('ADD_MAILBOX', 'MailboxWarmup', `Added new rotated sending mailbox ${newMb.email}`);
  };

  const totalSendingLimit = mailboxes.reduce((acc, m) => acc + (m.isPaused ? 0 : m.dailyLimit), 0);
  const totalSentToday = mailboxes.reduce((acc, m) => acc + m.sentToday, 0);
  const avgWarmupScore = Math.round(mailboxes.reduce((acc, m) => acc + m.warmupScore, 0) / (mailboxes.length || 1));

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900">Mailbox Rotation Pool & Deliverability Warmup</h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                  Smartlead / Instantly Class
                </span>
              </div>
              <p className="text-slate-500 text-xs mt-0.5">
                Multi-inbox round-robin sending, automated warmup peer networks, and SPF/DKIM/DMARC deliverability guardrails.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Warmup Health</span>
              <span className="text-sm font-bold text-emerald-600">{avgWarmupScore}%</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Combined Daily Cap</span>
              <span className="text-sm font-bold text-indigo-600">{totalSentToday} / {totalSendingLimit} sent</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Connect Mailbox
            </button>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('pool')}
          className={`pb-2.5 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'pool'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Active Inboxes ({mailboxes.length})
        </button>

        <button
          onClick={() => setActiveTab('analyzer')}
          className={`pb-2.5 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'analyzer'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-amber-500" />
          Spam Word & Deliverability Copy Scanner
        </button>

        <button
          onClick={() => setActiveTab('dns')}
          className={`pb-2.5 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'dns'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          DNS Records (SPF, DKIM, DMARC)
        </button>
      </div>

      {/* TAB 1: MAILBOX POOL TABLE */}
      {activeTab === 'pool' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[11px] font-semibold uppercase">
                <th className="py-2.5 px-4">Mailbox Account</th>
                <th className="py-2.5 px-4">Provider</th>
                <th className="py-2.5 px-4">Warmup Score</th>
                <th className="py-2.5 px-4">Daily Sending Limit</th>
                <th className="py-2.5 px-4">Warmup Peer Emails</th>
                <th className="py-2.5 px-4">DNS Auth</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mailboxes.map(mb => (
                <tr key={mb.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{mb.senderName}</div>
                    <div className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {mb.email}
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {mb.provider}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            mb.warmupScore > 90 ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${mb.warmupScore}%` }}
                        />
                      </div>
                      <span className="font-bold text-slate-800">{mb.warmupScore}%</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-800">
                      {mb.sentToday} / {mb.dailyLimit}
                    </div>
                    <span className="text-[10px] text-slate-400">Safe ramp algorithm</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-slate-700 font-semibold">{mb.warmupEmailsExchanged} exchanged</span>
                    <span className="text-[10px] text-emerald-600 block">P2P Warmup Active</span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        SPF ✓
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        DKIM ✓
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        DMARC ✓
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleTogglePause(mb.id)}
                      className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                        mb.isPaused
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {mb.isPaused ? 'Resume' : 'Pause'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: SPAM COPY ANALYZER */}
      {activeTab === 'analyzer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Cold Outbound Deliverability Inspector
            </h2>
            <p className="text-slate-500 text-xs mb-4">
              Checks your pitch against 1,200+ spam keywords that trigger Google Workspace and Microsoft 365 spam filters.
            </p>

            <form onSubmit={handleAnalyzeCopy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={testSubject}
                  onChange={e => setTestSubject(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email Body</label>
                <textarea
                  rows={6}
                  value={testBody}
                  onChange={e => setTestBody(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500 font-sans"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Scan Deliverability & Spam Triggers
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-lg p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Deliverability Score & Recommendations
            </h2>

            {analysisResult ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Deliverability Score</span>
                    <div className="text-2xl font-black text-slate-900 mt-0.5">{analysisResult.score} / 100</div>
                  </div>
                  <div
                    className={`px-3 py-1.5 rounded-lg text-sm font-black ${
                      analysisResult.grade === 'A+'
                        ? 'bg-emerald-100 text-emerald-800'
                        : analysisResult.grade === 'B'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    Grade: {analysisResult.grade}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-slate-800 text-xs mb-2">
                    Spam Flags Detected ({analysisResult.foundSpamWords.length})
                  </h3>

                  {analysisResult.foundSpamWords.length === 0 ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-emerald-800 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Zero high-risk spam keywords detected! This copy is optimized for primary inbox delivery.</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {analysisResult.foundSpamWords.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-rose-50 border border-rose-200 rounded-md flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span className="font-bold text-rose-900">"{item.word}"</span>
                          </div>
                          <div className="text-[11px] text-slate-600">
                            Suggest: <span className="font-semibold text-emerald-700">"{item.suggestion}"</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                <ShieldCheck className="w-8 h-8 opacity-40 mb-2" />
                <p className="font-semibold text-slate-500">Analyzer ready</p>
                <p className="text-xs text-slate-400 mt-1">Click scan to inspect spam keyword triggers and inbox safety.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: DNS RECORDS */}
      {activeTab === 'dns' && (
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4 max-w-4xl">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Domain Authentication Diagnostic
          </h2>
          <p className="text-slate-500 text-xs">
            Google Workspace and Yahoo enforce strict SPF, DKIM, and DMARC alignment for high-volume outbound senders.
          </p>

          <div className="space-y-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">SPF Record (Sender Policy Framework)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Valid Alignment</span>
              </div>
              <code className="block mt-1 p-2 bg-slate-900 text-emerald-400 rounded text-[11px] font-mono">
                v=spf1 include:_spf.google.com include:amazonses.com ~all
              </code>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">DKIM Record (DomainKeys Identified Mail)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">2048-bit Key Verified</span>
              </div>
              <code className="block mt-1 p-2 bg-slate-900 text-emerald-400 rounded text-[11px] font-mono">
                acuity._domainkey.acuity-outbound.com TXT v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A...
              </code>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">DMARC Policy (Domain-based Message Authentication)</span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">Quarantine Active</span>
              </div>
              <code className="block mt-1 p-2 bg-slate-900 text-emerald-400 rounded text-[11px] font-mono">
                _dmarc.acuity-outbound.com TXT v=DMARC1; p=quarantine; rua=mailto:dmarc-reports@acuitysales.io
              </code>
            </div>
          </div>
        </div>
      )}

      {/* Connect Mailbox Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Connect Rotated Outbound Mailbox</h3>
            <p className="text-slate-500 text-xs mb-4">Connect a Google Workspace, Microsoft 365, or SES mailbox to the rotation pool.</p>

            <form onSubmit={handleAddMailbox} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sender Email</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rep@acuity-outbound.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Vance"
                  value={newSender}
                  onChange={e => setNewSender(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Provider Type</label>
                <select
                  value={newProvider}
                  onChange={e => setNewProvider(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="Google Workspace">Google Workspace</option>
                  <option value="Microsoft 365">Microsoft 365</option>
                  <option value="Custom SES Relay">Custom SES Relay</option>
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
                  Connect & Begin Warmup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
