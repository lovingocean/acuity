import React, { useState } from 'react';
import { X, Plus, UserPlus, Building2, Mail } from 'lucide-react';
import type { Contact } from '../../types';
import { calculateLeadScore } from '../../lib/leadScorer';

interface CreateContactModalProps {
  workspaceId: string;
  onClose: () => void;
  onCreateContact: (contact: Contact) => void;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const CreateContactModal: React.FC<CreateContactModalProps> = ({
  workspaceId,
  onClose,
  onCreateContact,
  onLogAction
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyDomain, setCompanyDomain] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [country, setCountry] = useState('United States');
  const [seniority, setSeniority] = useState<Contact['seniority']>('VP');
  const [department, setDepartment] = useState<Contact['department']>('Engineering');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !companyName.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    const domain = companyDomain.trim() || email.split('@')[1] || 'domain.com';
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const newContact: Contact = {
      id: 'cnt-' + Date.now(),
      workspaceId,
      companyId: 'comp-' + Date.now(),
      companyName: companyName.trim(),
      companyDomain: domain,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      fullName,
      title: title.trim() || 'Executive',
      seniority,
      department,
      email: email.trim().toLowerCase(),
      emailStatus: 'unverified',
      emailConfidence: 50,
      phone: phone.trim() || undefined,
      city: city.trim(),
      country: country.trim(),
      linkedinUrl: `https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(fullName)}`,
      leadScore: 60,
      leadStatus: 'New',
      lists: [],
      tags: ['manual-lead'],
      dataSource: 'Direct User Entry',
      createdAt: new Date().toISOString()
    };

    const scored = calculateLeadScore(newContact);
    newContact.leadScore = scored.score;

    onCreateContact(newContact);
    onLogAction('CREATE_CONTACT', 'Contact', `Created lead ${fullName} (${newContact.email}).`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Add New B2B Lead</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Rachel"
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Zhao"
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Job Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VP of Infrastructure Engineering"
              className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Seniority</label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white text-slate-900"
              >
                <option value="C-Level">C-Level</option>
                <option value="VP">VP</option>
                <option value="Director">Director</option>
                <option value="Manager">Manager</option>
                <option value="Senior">Senior</option>
                <option value="Entry">Entry</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value as any)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded bg-white text-slate-900"
              >
                <option value="Executive">Executive</option>
                <option value="Engineering">Engineering</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Product">Product</option>
                <option value="Operations">Operations</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. Snowflake"
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company Domain</label>
              <input
                type="text"
                value={companyDomain}
                onChange={(e) => setCompanyDomain(e.target.value)}
                placeholder="e.g. snowflake.com"
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rachel.zhao@company.com"
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Direct Phone (Optional)</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 415-555-0199"
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Country</label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-200 rounded text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 shadow-2xs"
            >
              Save Prospect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
