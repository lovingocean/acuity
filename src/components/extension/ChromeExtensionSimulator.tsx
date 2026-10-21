import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Mail,
  Phone,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Send,
  FolderPlus,
  RefreshCw,
  Search,
  Layers,
  ChevronRight,
  Globe
} from 'lucide-react';
import type { Contact, Company, LeadList, SequenceCampaign } from '../../types';

interface ChromeExtensionSimulatorProps {
  contacts: Contact[];
  companies: Company[];
  leadLists: LeadList[];
  sequences: SequenceCampaign[];
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
  onEnrollSequence: (contactIds: string[], sequenceId: string) => void;
  onAddToList: (contactIds: string[], listId: string) => void;
  onConsumeCredits: (count: number) => boolean;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const ChromeExtensionSimulator: React.FC<ChromeExtensionSimulatorProps> = ({
  contacts,
  companies,
  leadLists,
  sequences,
  isOpen,
  onClose,
  onSelectContact,
  onEnrollSequence,
  onAddToList,
  onConsumeCredits,
  onLogAction
}) => {
  const [selectedContactId, setSelectedContactId] = useState<string>(contacts[0]?.id || '');
  const [revealedPhone, setRevealedPhone] = useState<Record<string, string>>({});
  const [isRevealing, setIsRevealing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentContact = contacts.find(c => c.id === selectedContactId) || contacts[0];
  const company = companies.find(
    c => c.id === currentContact?.companyId || c.domain === currentContact?.companyDomain
  );

  const handleRevealMobile = () => {
    if (!currentContact) return;
    const ok = onConsumeCredits(2);
    if (!ok) {
      alert('Insufficient credits for mobile waterfall reveal.');
      return;
    }

    setIsRevealing(true);
    setTimeout(() => {
      const generatedPhone = currentContact.mobileDirect || '+1 415-882-' + Math.floor(1000 + Math.random() * 8999);
      setRevealedPhone(prev => ({ ...prev, [currentContact.id]: generatedPhone }));
      setIsRevealing(false);
      onLogAction('EXTENSION_MOBILE_REVEAL', 'Extension', `Revealed mobile direct dial for ${currentContact.fullName}`);
      setStatusMessage('Mobile Direct Dial successfully unlocked!');
      setTimeout(() => setStatusMessage(null), 3000);
    }, 600);
  };

  const handlePushToSequence = (seqId: string) => {
    if (!currentContact || !seqId) return;
    onEnrollSequence([currentContact.id], seqId);
    setStatusMessage(`Enrolled ${currentContact.fullName} into sequence.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handlePushToList = (listId: string) => {
    if (!currentContact || !listId) return;
    onAddToList([currentContact.id], listId);
    setStatusMessage(`Saved ${currentContact.fullName} to list.`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl border-l border-slate-300 flex flex-col text-xs font-sans animate-in slide-in-from-right duration-200">
      {/* Top Browser Bar Simulator */}
      <div className="bg-slate-900 text-white p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center font-bold text-white text-[11px] shadow-xs">
            ⚡
          </div>
          <div>
            <div className="font-bold text-xs flex items-center gap-1">
              <span>Acuity Prospector</span>
              <span className="text-[10px] px-1 bg-indigo-500/30 text-indigo-300 rounded">v3.4 Extension</span>
            </div>
            <div className="text-[10px] text-slate-400">Live LinkedIn & Web Inspector</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Target Prospect Selector */}
      <div className="p-3 bg-slate-50 border-b border-slate-200">
        <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
          Active LinkedIn Profile In View
        </label>
        <select
          value={selectedContactId}
          onChange={e => setSelectedContactId(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
        >
          {contacts.map(c => (
            <option key={c.id} value={c.id}>
              {c.fullName} — {c.title} ({c.companyName})
            </option>
          ))}
        </select>
      </div>

      {statusMessage && (
        <div className="p-2.5 bg-emerald-50 border-b border-emerald-200 text-emerald-800 font-semibold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Extension Body */}
      {currentContact ? (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Contact Card */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-white shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-sm">
                {currentContact.firstName[0]}
                {currentContact.lastName[0]}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-900 text-sm truncate">{currentContact.fullName}</h3>
                <p className="text-slate-600 font-medium truncate">{currentContact.title}</p>
                <p className="text-indigo-600 text-[11px] font-semibold mt-0.5 truncate">{currentContact.companyName}</p>
              </div>
            </div>

            {/* Email deliverability */}
            <div className="mt-3.5 pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono text-slate-800 truncate">{currentContact.email}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0 flex items-center gap-1">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>

              {/* Direct Phone Reveal */}
              <div className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {revealedPhone[currentContact.id] ? (
                    <span className="font-mono text-slate-900 font-bold">
                      {revealedPhone[currentContact.id]}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic">+1 415-•••-•••• (Locked)</span>
                  )}
                </div>

                {!revealedPhone[currentContact.id] && (
                  <button
                    onClick={handleRevealMobile}
                    disabled={isRevealing}
                    className="px-2 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-[10px] flex items-center gap-1 transition shrink-0"
                  >
                    {isRevealing ? (
                      <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                    )}
                    Unlock Mobile (2 cr)
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Company Firmographics Card */}
          {company && (
            <div className="border border-slate-200 rounded-lg p-3.5 bg-white shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>Company Firmographics</span>
                </div>
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-indigo-600"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                  <span className="text-slate-400 block text-[10px]">Headcount</span>
                  <span className="font-bold text-slate-800">{company.employeeCount.toLocaleString()} employees</span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-100 rounded">
                  <span className="text-slate-400 block text-[10px]">Annual Revenue</span>
                  <span className="font-bold text-emerald-700">{company.revenueRange}</span>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <span className="text-slate-400 block text-[10px] font-bold mb-1">Detected Tech Stack</span>
                <div className="flex items-center gap-1 flex-wrap">
                  {company.technologies.slice(0, 5).map(tech => (
                    <span
                      key={tech}
                      className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick CRM & Outbound Actions */}
          <div className="border border-slate-200 rounded-lg p-3.5 bg-white shadow-xs space-y-3">
            <h4 className="font-bold text-slate-900 text-xs">Instant Sales Actions</h4>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Push to Sequence</label>
              <div className="flex items-center gap-1.5">
                <select
                  id="ext-seq-select"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs"
                >
                  {sequences.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const el = document.getElementById('ext-seq-select') as HTMLSelectElement;
                    if (el) handlePushToSequence(el.value);
                  }}
                  className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-xs flex items-center gap-1 transition shrink-0"
                >
                  <Send className="w-3 h-3" />
                  Enroll
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Save to Lead List</label>
              <div className="flex items-center gap-1.5">
                <select
                  id="ext-list-select"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1.5 text-xs"
                >
                  {leadLists.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    const el = document.getElementById('ext-list-select') as HTMLSelectElement;
                    if (el) handlePushToList(el.value);
                  }}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded font-bold text-xs flex items-center gap-1 transition shrink-0"
                >
                  <FolderPlus className="w-3 h-3" />
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-slate-500 text-[11px]">
        <span>Synced with Acuity SaaS Database</span>
        <button
          onClick={() => {
            if (currentContact) onSelectContact(currentContact);
            onClose();
          }}
          className="font-bold text-indigo-600 hover:text-indigo-800"
        >
          Open Full 360° Profile →
        </button>
      </div>
    </div>
  );
};
