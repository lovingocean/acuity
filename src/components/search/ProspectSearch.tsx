import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckSquare,
  Square,
  Download,
  FolderPlus,
  Mail,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  Sparkles,
  SlidersHorizontal,
  Bookmark,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  MoreHorizontal,
  Trash2
} from 'lucide-react';
import type { Contact, Company, LeadList, SequenceCampaign, FilterState, EmailStatus } from '../../types';
import { filterContacts } from '../../lib/filterEngine';
import { verifyEmailAddress } from '../../lib/emailVerifier';
import { exportContactsToCsv } from '../../lib/csvParser';
import { FilterDrawer } from './FilterDrawer';

interface ProspectSearchProps {
  contacts: Contact[];
  companies: Company[];
  leadLists: LeadList[];
  sequences: SequenceCampaign[];
  onSelectContact: (contact: Contact) => void;
  onSelectCompany: (company: Company) => void;
  onAddContactsToList: (contactIds: string[], listId: string) => void;
  onEnrollContactsInSequence: (contactIds: string[], sequenceId: string) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onConsumeCredits: (count: number) => boolean;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const ProspectSearch: React.FC<ProspectSearchProps> = ({
  contacts,
  companies,
  leadLists,
  sequences,
  onSelectContact,
  onSelectCompany,
  onAddContactsToList,
  onEnrollContactsInSequence,
  onUpdateContact,
  onDeleteContact,
  onConsumeCredits,
  onLogAction
}) => {
  const [filters, setFilters] = useState<FilterState>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(() => (typeof window !== 'undefined' ? window.innerWidth >= 1024 : true));
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [showSequenceModal, setShowSequenceModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string>(leadLists[0]?.id || '');
  const [selectedSequenceId, setSelectedSequenceId] = useState<string>(sequences[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'all' | 'verified' | 'uncontacted'>('all');

  // Fast search + filter
  const filteredContacts = useMemo(() => {
    let result = filterContacts(contacts, { ...filters, query: searchQuery });
    if (activeTab === 'verified') {
      result = result.filter(c => c.emailStatus === 'verified');
    } else if (activeTab === 'uncontacted') {
      result = result.filter(c => c.leadStatus === 'New');
    }
    return result;
  }, [contacts, filters, searchQuery, activeTab]);

  // Bulk selection handlers
  const isAllSelected = filteredContacts.length > 0 && selectedIds.size === filteredContacts.length;
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredContacts.map(c => c.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Export selected or all filtered to CSV
  const handleExportCsv = () => {
    const targetContacts = selectedIds.size > 0
      ? contacts.filter(c => selectedIds.has(c.id))
      : filteredContacts;

    if (targetContacts.length === 0) return;

    const csvData = exportContactsToCsv(targetContacts);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `acuity_prospects_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onLogAction('EXPORT_CSV', 'Prospects', `Exported ${targetContacts.length} contacts to authorized CSV.`);
  };

  // Single or bulk verify
  const handleVerifyEmail = (contact: Contact) => {
    const success = onConsumeCredits(1);
    if (!success) {
      alert('Insufficient credits in workspace. Please upgrade plan or request more credits.');
      return;
    }

    const verification = verifyEmailAddress(contact.email);
    const updated: Contact = {
      ...contact,
      emailStatus: verification.status,
      emailConfidence: verification.confidence,
      lastVerifiedAt: verification.verifiedAt
    };
    onUpdateContact(updated);
    onLogAction('VERIFY_EMAIL', 'Contact', `Verified email ${contact.email}: ${verification.status} (${verification.confidence}% confidence).`);
  };

  const handleBulkVerify = () => {
    const targetIds = Array.from(selectedIds);
    if (targetIds.length === 0) return;

    const neededCredits = targetIds.length;
    const ok = onConsumeCredits(neededCredits);
    if (!ok) {
      alert(`Need ${neededCredits} credits to verify selected contacts. Please check workspace credit limits.`);
      return;
    }

    targetIds.forEach(id => {
      const c = contacts.find(item => item.id === id);
      if (c) {
        const verification = verifyEmailAddress(c.email);
        onUpdateContact({
          ...c,
          emailStatus: verification.status,
          emailConfidence: verification.confidence,
          lastVerifiedAt: verification.verifiedAt
        });
      }
    });

    onLogAction('BULK_VERIFY_EMAIL', 'Contacts', `Bulk verified ${targetIds.length} contact emails.`);
    setSelectedIds(new Set());
  };

  const handleBulkAddToList = () => {
    if (!selectedListId || selectedIds.size === 0) return;
    onAddContactsToList(Array.from(selectedIds), selectedListId);
    onLogAction('ADD_TO_LIST', 'LeadList', `Added ${selectedIds.size} contacts to list.`);
    setShowAddToListModal(false);
    setSelectedIds(new Set());
  };

  const handleBulkEnrollSequence = () => {
    if (!selectedSequenceId || selectedIds.size === 0) return;
    onEnrollContactsInSequence(Array.from(selectedIds), selectedSequenceId);
    onLogAction('ENROLL_SEQUENCE', 'Campaign', `Enrolled ${selectedIds.size} contacts into sequence.`);
    setShowSequenceModal(false);
    setSelectedIds(new Set());
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* Facet Filter Drawer */}
      <FilterDrawer
        filters={filters}
        onChangeFilters={setFilters}
        onResetFilters={() => setFilters({})}
        onSaveSearch={() => {
          const name = prompt('Name this filter preset:', 'My Custom Prospect Filter');
          if (name) {
            alert(`Filter preset "${name}" saved to workspace.`);
          }
        }}
        isOpen={isFilterOpen}
        onToggle={() => setIsFilterOpen(!isFilterOpen)}
        totalResultsCount={filteredContacts.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Control Bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                isFilterOpen
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
            </button>

            {/* Segmented view controls */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-md border border-slate-200 text-xs">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({contacts.length})
              </button>
              <button
                onClick={() => setActiveTab('verified')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'verified'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Verified Only
              </button>
              <button
                onClick={() => setActiveTab('uncontacted')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeTab === 'uncontacted'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New / Uncontacted
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Bulk Action Strip (Visible when items selected) */}
        {selectedIds.size > 0 && (
          <div className="bg-indigo-50/90 border-b border-indigo-100 px-6 py-2.5 flex items-center justify-between text-xs text-indigo-900 shrink-0">
            <div className="flex items-center gap-2 font-medium">
              <span className="font-mono font-bold tabular-nums">{selectedIds.size}</span>
              <span>prospects selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddToListModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 rounded text-xs font-semibold text-indigo-700 transition-colors shadow-xs"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Add to List</span>
              </button>
              <button
                onClick={() => setShowSequenceModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-indigo-50 border border-indigo-200 rounded text-xs font-semibold text-indigo-700 transition-colors shadow-xs"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Enroll in Sequence</span>
              </button>
              <button
                onClick={handleBulkVerify}
                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs font-semibold text-white transition-colors shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verify Emails</span>
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="text-xs text-indigo-600 hover:text-indigo-900 px-2 py-1"
              >
                Deselect all
              </button>
            </div>
          </div>
        )}

        {/* Table View */}
        <div className="flex-1 overflow-auto">
          {filteredContacts.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No prospects matched your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Try widening your search terms, removing specific seniority or headcount constraints, or importing new records.
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  setSearchQuery('');
                  setActiveTab('all');
                }}
                className="mt-4 px-3.5 py-1.5 text-xs font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 rounded-md border border-indigo-200"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/80 sticky top-0 z-1 border-b border-slate-200 select-none">
                <tr className="text-slate-600 text-[11px] font-semibold tracking-wider">
                  <th className="py-2.5 px-4 w-10">
                    <button
                      type="button"
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-slate-700 flex items-center"
                    >
                      {isAllSelected ? (
                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 px-3">Contact</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">Email & Deliverability</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Score</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredContacts.map((contact) => {
                  const isSelected = selectedIds.has(contact.id);
                  const matchingCompany = companies.find(c => c.id === contact.companyId || c.domain === contact.companyDomain);

                  return (
                    <tr
                      key={contact.id}
                      className={`hover:bg-slate-50/80 transition-colors group ${
                        isSelected ? 'bg-indigo-50/40' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(contact.id)}
                          className="text-slate-400 hover:text-slate-700 flex items-center"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Contact Info */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0 border border-slate-200">
                            {contact.firstName[0]}
                            {contact.lastName[0]}
                          </div>
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectContact(contact)}
                              className="font-semibold text-slate-900 hover:text-indigo-600 text-left transition-colors flex items-center gap-1"
                            >
                              <span>{contact.fullName}</span>
                              {contact.linkedinUrl && (
                                <a
                                  href={contact.linkedinUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="text-slate-400 hover:text-blue-600 ml-0.5"
                                  title="Open LinkedIn"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </button>
                            <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                              {contact.title}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Company Info */}
                      <td className="py-3 px-3">
                        {matchingCompany ? (
                          <div>
                            <button
                              type="button"
                              onClick={() => onSelectCompany(matchingCompany)}
                              className="font-medium text-slate-800 hover:text-indigo-600 text-left block"
                            >
                              {matchingCompany.name}
                            </button>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                              <span>{matchingCompany.domain}</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums">{matchingCompany.employeeRange}</span>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium text-slate-800">{contact.companyName}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{contact.companyDomain}</div>
                          </div>
                        )}
                      </td>

                      {/* Email & Deliverability */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          {contact.emailStatus === 'verified' && (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Verified</span>
                            </span>
                          )}
                          {contact.emailStatus === 'catch_all' && (
                            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded">
                              <HelpCircle className="w-3 h-3 text-amber-600" />
                              <span>Catch-All</span>
                            </span>
                          )}
                          {contact.emailStatus === 'unverified' && (
                            <button
                              type="button"
                              onClick={() => handleVerifyEmail(contact)}
                              className="flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-indigo-700 bg-slate-100 hover:bg-indigo-50 border border-slate-200 px-1.5 py-0.5 rounded transition-colors"
                              title="Click to run live verification (1 credit)"
                            >
                              <ShieldCheck className="w-3 h-3" />
                              <span>Verify</span>
                            </button>
                          )}
                          <span className="text-slate-600 font-mono text-[11px] truncate max-w-[170px]" title={contact.email}>
                            {contact.email}
                          </span>
                        </div>
                        {contact.emailConfidence > 0 && (
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 tabular-nums">
                            {contact.emailConfidence}% confidence
                          </div>
                        )}
                      </td>

                      {/* Location */}
                      <td className="py-3 px-3 text-slate-600">
                        <div>{contact.city}</div>
                        <div className="text-[11px] text-slate-400">{contact.country}</div>
                      </td>

                      {/* Lead Score */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className={`w-2 h-2 rounded-full ${
                            contact.leadScore >= 70
                              ? 'bg-emerald-500'
                              : contact.leadScore >= 40
                              ? 'bg-amber-500'
                              : 'bg-slate-300'
                          }`} />
                          <span className="font-semibold text-slate-800 tabular-nums">
                            {contact.leadScore}
                          </span>
                        </div>
                      </td>

                      {/* Lead Pipeline Status */}
                      <td className="py-3 px-3">
                        <span className="text-[11px] font-medium text-slate-600">
                          {contact.leadStatus}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => onSelectContact(contact)}
                          className="px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded border border-slate-200 transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-6 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500 shrink-0 select-none">
          <div>
            Showing <span className="font-mono font-semibold text-slate-700 tabular-nums">{filteredContacts.length}</span> of{' '}
            <span className="font-mono font-semibold text-slate-700 tabular-nums">{contacts.length}</span> total contacts
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span>Powered by Acuity B2B Data Engine</span>
          </div>
        </div>
      </div>

      {/* Modal: Add to Lead List */}
      {showAddToListModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5 border border-slate-200 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Add to Lead List</h3>
            <p className="text-xs text-slate-500 mb-4">
              Add {selectedIds.size} selected prospects to an existing lead list.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Select List</label>
              <select
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded p-2 text-slate-900 bg-white focus:outline-none focus:border-indigo-600"
              >
                {leadLists.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.contactCount} contacts)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAddToListModal(false)}
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkAddToList}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
              >
                Confirm Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Enroll in Sequence */}
      {showSequenceModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5 border border-slate-200 animate-in fade-in duration-150">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Enroll in Sequence</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enroll {selectedIds.size} prospects into an automated sales engagement sequence.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Target Sequence</label>
              <select
                value={selectedSequenceId}
                onChange={(e) => setSelectedSequenceId(e.target.value)}
                className="w-full text-xs border border-slate-200 rounded p-2 text-slate-900 bg-white focus:outline-none focus:border-indigo-600"
              >
                {sequences.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.steps.length} steps)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowSequenceModal(false)}
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkEnrollSequence}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700"
              >
                Confirm Enrollment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
