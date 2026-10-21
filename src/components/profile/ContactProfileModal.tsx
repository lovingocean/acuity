import React, { useState } from 'react';
import {
  X,
  Building2,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Plus,
  Send,
  Trash2,
  Bookmark,
  Calendar,
  Briefcase
} from 'lucide-react';
import type { Contact, Company, LeadList, SequenceCampaign } from '../../types';
import { verifyEmailAddress } from '../../lib/emailVerifier';

interface ContactProfileModalProps {
  contact: Contact | null;
  company?: Company;
  leadLists: LeadList[];
  sequences: SequenceCampaign[];
  onClose: () => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onAddToList: (contactIds: string[], listId: string) => void;
  onEnrollSequence: (contactIds: string[], seqId: string) => void;
  onConsumeCredits: (count: number) => boolean;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const ContactProfileModal: React.FC<ContactProfileModalProps> = ({
  contact,
  company,
  leadLists,
  sequences,
  onClose,
  onUpdateContact,
  onDeleteContact,
  onAddToList,
  onEnrollSequence,
  onConsumeCredits,
  onLogAction
}) => {
  if (!contact) return null;

  const [notes, setNotes] = useState(contact.notes || '');
  const [tagInput, setTagInput] = useState('');
  const [selectedListId, setSelectedListId] = useState(leadLists[0]?.id || '');
  const [selectedSeqId, setSelectedSeqId] = useState(sequences[0]?.id || '');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSaveNotes = () => {
    onUpdateContact({
      ...contact,
      notes
    });
    onLogAction('UPDATE_NOTES', 'Contact', `Updated notes for ${contact.fullName}.`);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().toLowerCase();
    if (!contact.tags.includes(cleanTag)) {
      onUpdateContact({
        ...contact,
        tags: [...contact.tags, cleanTag]
      });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    onUpdateContact({
      ...contact,
      tags: contact.tags.filter(t => t !== tag)
    });
  };

  const handleRunVerify = () => {
    setIsVerifying(true);
    const ok = onConsumeCredits(1);
    if (!ok) {
      alert('Workspace credits depleted. Please upgrade plan.');
      setIsVerifying(false);
      return;
    }

    setTimeout(() => {
      const res = verifyEmailAddress(contact.email);
      onUpdateContact({
        ...contact,
        emailStatus: res.status,
        emailConfidence: res.confidence,
        lastVerifiedAt: res.verifiedAt
      });
      setIsVerifying(false);
      onLogAction('VERIFY_EMAIL', 'Contact', `Audited ${contact.email} -> ${res.status} (${res.confidence}%).`);
    }, 400);
  };

  const handleQuickAddList = () => {
    if (!selectedListId) return;
    onAddToList([contact.id], selectedListId);
    onClose();
  };

  const handleQuickEnrollSeq = () => {
    if (!selectedSeqId) return;
    onEnrollSequence([contact.id], selectedSeqId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
              {contact.firstName[0]}
              {contact.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {contact.fullName}
                </h2>
                {contact.linkedinUrl && (
                  <a
                    href={contact.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-blue-600"
                    title="LinkedIn Profile"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{contact.title}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="font-semibold text-slate-700">{contact.companyName}</span>
                <span aria-hidden="true">·</span>
                <span>{contact.department} ({contact.seniority})</span>
                <span aria-hidden="true">·</span>
                <span>{contact.city}, {contact.country}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-200 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Email Deliverability Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>Email Deliverability Intelligence</span>
              </span>
              <button
                type="button"
                onClick={handleRunVerify}
                disabled={isVerifying}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded transition-colors shadow-2xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isVerifying ? 'Checking MX...' : 'Re-verify (1 credit)'}</span>
              </button>
            </div>

            <div className="flex items-center justify-between bg-white p-3 rounded border border-slate-200">
              <div>
                <div className="font-mono text-xs font-semibold text-slate-900">{contact.email}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Last audited: {contact.lastVerifiedAt ? new Date(contact.lastVerifiedAt).toLocaleDateString() : 'Pending audit'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {contact.emailStatus === 'verified' && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                )}
                {contact.emailStatus === 'catch_all' && (
                  <span className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Catch-All</span>
                  </span>
                )}
                {contact.emailStatus === 'unverified' && (
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    Unverified
                  </span>
                )}
                <span className="font-mono text-xs text-slate-600 font-semibold tabular-nums">
                  {contact.emailConfidence}% conf
                </span>
              </div>
            </div>
          </div>

          {/* Lead Score & Provenance */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="text-slate-500 mb-1">Lead Score Assessment</div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {contact.leadScore}
                </span>
                <span className="text-slate-400 font-mono">/ 100</span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                  contact.leadScore >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {contact.leadScore >= 70 ? 'Hot Lead' : 'Warm Lead'}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Score based on Seniority ({contact.seniority}), Department ({contact.department}), and verified inbox status.
              </div>
            </div>

            <div className="p-4 border border-slate-200 rounded-lg">
              <div className="text-slate-500 mb-1">Data Source Provenance</div>
              <div className="font-semibold text-slate-800 text-xs mt-1">
                {contact.dataSource}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Indexed on: {new Date(contact.createdAt).toLocaleDateString()}
              </div>
              <div className="text-[11px] text-slate-400">
                Workspace ID: {contact.workspaceId}
              </div>
            </div>
          </div>

          {/* Employment History */}
          {contact.employmentHistory && contact.employmentHistory.length > 0 && (
            <div>
              <div className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>Employment History</span>
              </div>
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                {contact.employmentHistory.map((hist, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-800">{hist.title}</div>
                      <div className="text-slate-500 text-[11px]">{hist.companyName}</div>
                    </div>
                    <div className="text-right text-[11px] text-slate-400 font-mono">
                      <span>{hist.startDate}</span>
                      <span> - </span>
                      <span>{hist.isCurrent ? 'Present' : hist.endDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Tags */}
          <div className="space-y-3">
            <div>
              <div className="font-semibold text-slate-800 mb-1.5">Tags</div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {contact.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add custom tag (e.g. key-sponsor)..."
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-600"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded font-medium text-xs"
                >
                  Add
                </button>
              </div>
            </div>

            <div>
              <div className="font-semibold text-slate-800 mb-1.5">Sales Intelligence Notes</div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add meeting takeaways, buying signals, or outreach context..."
                className="w-full p-2.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-600 text-slate-800"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                className="mt-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-xs font-semibold"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => {
              if (confirm(`Delete prospect ${contact.fullName}?`)) {
                onDeleteContact(contact.id);
                onClose();
              }
            }}
            className="flex items-center gap-1 text-red-600 hover:text-red-700 px-2 py-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Record</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleQuickAddList}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Bookmark className="w-3.5 h-3.5 text-slate-400" />
              <span>Add to List</span>
            </button>
            <button
              type="button"
              onClick={handleQuickEnrollSeq}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Enroll in Sequence</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
