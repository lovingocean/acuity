import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Trash2,
  Edit2,
  Download,
  Users,
  Search,
  ExternalLink,
  ChevronRight,
  MoreVertical,
  CheckCircle2
} from 'lucide-react';
import type { LeadList, Contact, Company } from '../../types';
import { exportContactsToCsv } from '../../lib/csvParser';

interface ListsManagerProps {
  lists: LeadList[];
  contacts: Contact[];
  companies: Company[];
  onCreateList: (name: string, description?: string, tags?: string[]) => void;
  onDeleteList: (id: string) => void;
  onUpdateContact: (contact: Contact) => void;
  onSelectContact: (contact: Contact) => void;
  onLogAction: (action: string, resource: string, details: string) => void;
}

const PIPELINE_STAGES: Contact['leadStatus'][] = [
  'New',
  'Contacted',
  'Engaged',
  'Qualified',
  'Unqualified',
  'Customer'
];

export const ListsManager: React.FC<ListsManagerProps> = ({
  lists,
  contacts,
  companies,
  onCreateList,
  onDeleteList,
  onUpdateContact,
  onSelectContact,
  onLogAction
}) => {
  const [selectedListId, setSelectedListId] = useState<string>(lists[0]?.id || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [newListTags, setNewListTags] = useState('');
  const [searchInList, setSearchInList] = useState('');

  const currentList = lists.find(l => l.id === selectedListId) || lists[0];

  const listContacts = contacts.filter(c => c.lists && c.lists.includes(currentList?.id || ''));

  const filteredListContacts = listContacts.filter(c => {
    if (!searchInList) return true;
    const q = searchInList.toLowerCase();
    return (
      c.fullName.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.companyName.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    const tags = newListTags.split(',').map(t => t.trim()).filter(Boolean);
    onCreateList(newListName.trim(), newListDesc.trim(), tags);
    setNewListName('');
    setNewListDesc('');
    setNewListTags('');
    setShowCreateModal(false);
  };

  const handleExportList = () => {
    if (!currentList || listContacts.length === 0) return;
    const csv = exportContactsToCsv(listContacts);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `acuity_list_${currentList.name.toLowerCase().replace(/\s+/g, '_')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onLogAction('EXPORT_CSV', 'LeadList', `Exported list ${currentList.name} (${listContacts.length} contacts).`);
  };

  const handleRemoveFromList = (contact: Contact) => {
    const nextLists = contact.lists.filter(l => l !== currentList.id);
    onUpdateContact({
      ...contact,
      lists: nextLists
    });
    onLogAction('REMOVE_FROM_LIST', 'Contact', `Removed ${contact.fullName} from list ${currentList.name}.`);
  };

  const handleChangeStage = (contact: Contact, newStage: Contact['leadStatus']) => {
    onUpdateContact({
      ...contact,
      leadStatus: newStage
    });
    onLogAction('STAGE_CHANGE', 'Contact', `Updated ${contact.fullName} stage to ${newStage}.`);
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-50">
      {/* Sidebar List of Lead Lists */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-900 leading-tight">Lead Lists</h3>
            <p className="text-[11px] text-slate-500 mt-0.5">Segmented prospect cohorts</p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New List</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {lists.map(list => {
            const count = contacts.filter(c => c.lists && c.lists.includes(list.id)).length;
            const isSelected = (currentList?.id === list.id);

            return (
              <div
                key={list.id}
                onClick={() => setSelectedListId(list.id)}
                className={`p-3.5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-indigo-50/70 border-l-2 border-indigo-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-semibold text-xs text-slate-900 line-clamp-1">{list.name}</h4>
                  <span className="font-mono text-[11px] tabular-nums text-slate-600 font-semibold bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                    {count}
                  </span>
                </div>
                {list.description && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{list.description}</p>
                )}
                {list.tags && list.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {list.tags.map(t => (
                      <span key={t} className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main List Details & Table */}
      <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
        {currentList ? (
          <>
            {/* List Header */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900 leading-tight">
                    {currentList.name}
                  </h2>
                  <span className="font-mono text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded font-semibold tabular-nums">
                    {listContacts.length} contacts
                  </span>
                </div>
                {currentList.description && (
                  <p className="text-xs text-slate-500 mt-1">{currentList.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportList}
                  disabled={listContacts.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded transition-colors disabled:opacity-50"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Delete list "${currentList.name}"? Contacts will remain in database.`)) {
                      onDeleteList(currentList.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded border border-transparent hover:border-slate-200 transition-colors"
                  title="Delete list"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* List Search */}
            <div className="p-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter within this list..."
                  value={searchInList}
                  onChange={(e) => setSearchInList(e.target.value)}
                  className="w-full pl-8 pr-3 py-1 bg-white border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-600 text-slate-900"
                />
              </div>
              <div className="text-xs text-slate-500">
                Created: {new Date(currentList.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Contacts Table in List */}
            <div className="flex-1 overflow-auto">
              {filteredListContacts.length === 0 ? (
                <div className="p-16 text-center text-slate-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No contacts in this list yet.</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Search for prospects in the "People Search" view and click "Add to List".
                  </p>
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                    <tr>
                      <th className="py-2.5 px-4">Contact</th>
                      <th className="py-2.5 px-3">Company</th>
                      <th className="py-2.5 px-3">Email</th>
                      <th className="py-2.5 px-3">Pipeline Stage</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredListContacts.map(contact => (
                      <tr key={contact.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => onSelectContact(contact)}
                            className="font-semibold text-slate-900 hover:text-indigo-600 text-left block"
                          >
                            {contact.fullName}
                          </button>
                          <div className="text-[11px] text-slate-500">{contact.title}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-medium text-slate-800">{contact.companyName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{contact.companyDomain}</div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-mono text-[11px] text-slate-700">{contact.email}</div>
                          <div className="text-[10px] text-emerald-600 font-medium capitalize">{contact.emailStatus}</div>
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={contact.leadStatus}
                            onChange={(e) => handleChangeStage(contact, e.target.value as Contact['leadStatus'])}
                            className="text-xs border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 font-medium focus:outline-none focus:border-indigo-600"
                          >
                            {PIPELINE_STAGES.map(stage => (
                              <option key={stage} value={stage}>{stage}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-semibold text-slate-800 tabular-nums">
                            {contact.leadScore} pts
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveFromList(contact)}
                            className="text-[11px] text-slate-400 hover:text-red-600 px-2 py-1"
                            title="Remove from this list"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        ) : (
          <div className="p-12 text-center text-slate-400">
            Select or create a lead list to view prospects.
          </div>
        )}
      </div>

      {/* Modal: Create List */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <form onSubmit={handleCreateSubmit} className="bg-white rounded-lg shadow-xl max-w-sm w-full p-5 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Create New Lead List</h3>
            <p className="text-xs text-slate-500 mb-4">Organize contacts by campaign, territory, or tier.</p>

            <div className="space-y-3 mb-5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">List Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Fintech Executives"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-indigo-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Target criteria and campaign goals..."
                  value={newListDesc}
                  onChange={(e) => setNewListDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-indigo-600 text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Q3, Inbound, C-Suite"
                  value={newListTags}
                  onChange={(e) => setNewListTags(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded focus:outline-none focus:border-indigo-600 text-slate-900"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 shadow-xs"
              >
                Create List
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
