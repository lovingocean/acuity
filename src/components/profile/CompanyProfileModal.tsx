import React from 'react';
import {
  X,
  Building2,
  ExternalLink,
  MapPin,
  Users,
  Layers,
  Calendar,
  DollarSign,
  Mail,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import type { Company, Contact } from '../../types';

interface CompanyProfileModalProps {
  company: Company | null;
  contacts: Contact[];
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
}

export const CompanyProfileModal: React.FC<CompanyProfileModalProps> = ({
  company,
  contacts,
  onClose,
  onSelectContact
}) => {
  if (!company) return null;

  const associatedContacts = contacts.filter(
    c => c.companyId === company.id || c.companyDomain.toLowerCase() === company.domain.toLowerCase()
  );

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-start justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-lg bg-slate-900 text-white font-bold text-xl flex items-center justify-center shadow-xs">
              {company.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 leading-tight">
                  {company.name}
                </h2>
                <a
                  href={company.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-indigo-600"
                  title="Visit Website"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{company.domain}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span className="font-semibold text-slate-700">{company.industry}</span>
                {company.subIndustry && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{company.subIndustry}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{company.city}, {company.country}</span>
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
          {/* Firmographics Summary Grid */}
          <div className="grid grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Headcount</div>
              <div className="font-mono font-bold text-sm text-slate-900 mt-0.5 tabular-nums">
                {company.employeeCount.toLocaleString()}
              </div>
              <div className="text-[10px] text-slate-500">{company.employeeRange}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Annual Revenue</div>
              <div className="font-mono font-bold text-sm text-slate-900 mt-0.5">
                {company.revenueRange}
              </div>
              <div className="text-[10px] text-slate-500">Estimated</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Founded Year</div>
              <div className="font-mono font-bold text-sm text-slate-900 mt-0.5 tabular-nums">
                {company.foundedYear}
              </div>
              <div className="text-[10px] text-slate-500">Private/Public</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-medium">Data Confidence</div>
              <div className="font-mono font-bold text-sm text-emerald-700 mt-0.5 tabular-nums">
                {company.confidenceScore}%
              </div>
              <div className="text-[10px] text-slate-500">Verified</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-1.5">Overview</h4>
            <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200 p-3 rounded-md">
              {company.description}
            </p>
          </div>

          {/* Technology Telemetry */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Detected Technology Stack ({company.technologies.length})</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {company.technologies.map(tech => (
                <span
                  key={tech}
                  className="font-mono text-xs text-slate-700 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Associated Contacts at this Company */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Associated Decision Makers ({associatedContacts.length})</span>
              </div>
            </h4>

            {associatedContacts.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-lg text-slate-400">
                No individual contacts indexed yet for this company.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-lg divide-y divide-slate-100">
                {associatedContacts.map(cnt => (
                  <div
                    key={cnt.id}
                    onClick={() => {
                      onClose();
                      onSelectContact(cnt);
                    }}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{cnt.fullName}</div>
                      <div className="text-slate-500 text-[11px]">{cnt.title} · {cnt.department}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      {cnt.emailStatus === 'verified' && (
                        <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      )}
                      <span className="text-indigo-600 font-medium text-xs">View Contact →</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Source: <span className="font-medium text-slate-700">{company.dataSource}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white rounded font-semibold hover:bg-slate-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
