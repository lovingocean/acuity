import React, { useState, useMemo } from 'react';
import {
  Building2,
  Search,
  ExternalLink,
  Users,
  Globe,
  MapPin,
  Calendar,
  Layers,
  Download,
  Plus
} from 'lucide-react';
import type { Company, Contact, FilterState } from '../../types';
import { filterCompanies } from '../../lib/filterEngine';
import { exportCompaniesToCsv } from '../../lib/csvParser';

interface CompanyDirectoryProps {
  companies: Company[];
  contacts: Contact[];
  onSelectCompany: (company: Company) => void;
  onSelectContact: (contact: Contact) => void;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const CompanyDirectory: React.FC<CompanyDirectoryProps> = ({
  companies,
  contacts,
  onSelectCompany,
  onSelectContact,
  onLogAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('All');
  const [selectedTech, setSelectedTech] = useState<string>('All');

  const industries = useMemo(() => {
    return ['All', ...Array.from(new Set(companies.map(c => c.industry)))];
  }, [companies]);

  const allTechnologies = useMemo(() => {
    const set = new Set<string>();
    companies.forEach(c => c.technologies.forEach(t => set.add(t)));
    return ['All', ...Array.from(set).sort()];
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const match =
          c.name.toLowerCase().includes(q) ||
          c.domain.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.technologies.some(t => t.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (selectedIndustry !== 'All' && c.industry !== selectedIndustry) {
        return false;
      }
      if (selectedTech !== 'All' && !c.technologies.includes(selectedTech)) {
        return false;
      }
      return true;
    });
  }, [companies, searchQuery, selectedIndustry, selectedTech]);

  const handleExportCsv = () => {
    const csv = exportCompaniesToCsv(filteredCompanies);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `acuity_companies_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onLogAction('EXPORT_CSV', 'Companies', `Exported ${filteredCompanies.length} companies to CSV.`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden">
      {/* Header bar */}
      <div className="p-4 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">B2B Company Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Discover verified corporate firmographics, technology telemetry, and executive org charts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-md transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Export Companies ({filteredCompanies.length})</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 border-b border-slate-200 bg-white flex flex-wrap items-center gap-3 shrink-0 text-xs">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter companies by name, domain, tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-md bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition-colors"
          />
        </div>

        {/* Industry dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Industry:</span>
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
        </div>

        {/* Tech dropdown */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Technology:</span>
          <select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            className="border border-slate-200 rounded px-2 py-1 bg-white text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
          >
            {allTechnologies.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.map(company => {
            const companyContacts = contacts.filter(
              c => c.companyId === company.id || c.companyDomain.toLowerCase() === company.domain.toLowerCase()
            );

            return (
              <div
                key={company.id}
                className="bg-white border border-slate-200 rounded-lg p-5 hover:border-indigo-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top line: Name & Domain */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3
                        onClick={() => onSelectCompany(company)}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors"
                      >
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono text-slate-600">{company.domain}</span>
                        <span aria-hidden="true">·</span>
                        <span>{company.industry}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      {company.confidenceScore}% conf
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {company.description}
                  </p>

                  {/* Firmographics metrics */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Headcount</div>
                      <div className="font-mono font-semibold tabular-nums text-slate-800">
                        {company.employeeCount.toLocaleString()} ({company.employeeRange})
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Est. Revenue</div>
                      <div className="font-mono font-semibold text-slate-800">
                        {company.revenueRange}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Location</div>
                      <div className="truncate text-slate-800">{company.headquarters}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Founded</div>
                      <div className="font-mono text-slate-800 tabular-nums">{company.foundedYear}</div>
                    </div>
                  </div>

                  {/* Technologies */}
                  <div className="mb-4">
                    <div className="text-[10px] text-slate-400 uppercase font-medium mb-1.5">
                      Detected Tech Stack
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {company.technologies.slice(0, 5).map(tech => (
                        <span
                          key={tech}
                          className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                        >
                          {tech}
                        </span>
                      ))}
                      {company.technologies.length > 5 && (
                        <span className="font-mono text-[10px] text-slate-400 px-1">
                          +{company.technologies.length - 5}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer: Contacts count & View Profile */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      <strong className="font-mono font-semibold tabular-nums">{companyContacts.length}</strong> contacts indexed
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectCompany(company)}
                    className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors text-xs"
                  >
                    View Org & Tech →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
