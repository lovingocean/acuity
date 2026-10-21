import React from 'react';
import { Filter, X, RotateCcw, Check, BookmarkPlus } from 'lucide-react';
import type { FilterState, EmailStatus } from '../../types';

interface FilterDrawerProps {
  filters: FilterState;
  onChangeFilters: (next: FilterState) => void;
  onResetFilters: () => void;
  onSaveSearch: () => void;
  isOpen: boolean;
  onToggle: () => void;
  totalResultsCount: number;
}

const SENIORITY_OPTIONS = ['C-Level', 'VP', 'Director', 'Manager', 'Senior', 'Entry'];
const DEPARTMENT_OPTIONS = ['Executive', 'Engineering', 'Sales', 'Marketing', 'Product', 'Operations', 'Finance', 'HR'];
const INDUSTRY_OPTIONS = [
  'Data & AI',
  'Cloud Software',
  'Fintech',
  'Cybersecurity',
  'HealthTech',
  'Developer Tools',
  'Logistics',
  'Enterprise Software'
];
const HEADCOUNT_OPTIONS = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1001-5000', '5001+'];
const COUNTRY_OPTIONS = ['United States', 'United Kingdom', 'Germany', 'Estonia', 'Singapore'];
const EMAIL_STATUS_OPTIONS: { label: string; value: EmailStatus }[] = [
  { label: 'Verified Only', value: 'verified' },
  { label: 'Catch-All Accepted', value: 'catch_all' },
  { label: 'Unverified / Raw', value: 'unverified' }
];
const TECH_OPTIONS = ['AWS', 'React', 'PostgreSQL', 'Python', 'Kubernetes', 'Docker', 'GraphQL', 'TypeScript'];

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filters,
  onChangeFilters,
  onResetFilters,
  onSaveSearch,
  isOpen,
  onToggle,
  totalResultsCount
}) => {
  if (!isOpen) return null;

  const toggleArrayItem = (key: keyof FilterState, val: any) => {
    const list = (filters[key] as any[]) || [];
    const exists = list.includes(val);
    const updated = exists ? list.filter(item => item !== val) : [...list, val];
    onChangeFilters({
      ...filters,
      [key]: updated.length > 0 ? updated : undefined
    });
  };

  const activeFilterCount =
    (filters.seniority?.length || 0) +
    (filters.departments?.length || 0) +
    (filters.industries?.length || 0) +
    (filters.employeeRanges?.length || 0) +
    (filters.countries?.length || 0) +
    (filters.emailStatuses?.length || 0) +
    (filters.technologies?.length || 0) +
    (filters.minLeadScore ? 1 : 0);

  return (
    <aside className="fixed inset-y-14 left-0 z-30 w-72 sm:static sm:inset-auto bg-white border-r border-slate-200 flex flex-col shrink-0 h-[calc(100vh-3.5rem)] sm:h-full overflow-hidden select-none shadow-xl sm:shadow-none">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-semibold text-slate-800">Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="font-mono text-[10px] bg-indigo-100 text-indigo-700 font-semibold px-1.5 py-0.2 rounded">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onResetFilters}
            title="Reset filters"
            className="text-[11px] text-slate-500 hover:text-slate-800 p-1 hover:bg-slate-200 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggle}
            className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* Quick action: Save current search */}
        {activeFilterCount > 0 && (
          <button
            onClick={onSaveSearch}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-md transition-colors"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>Save Filter Preset</span>
          </button>
        )}

        {/* 1. Seniority */}
        <div>
          <div className="font-semibold text-slate-700 mb-2">Job Seniority</div>
          <div className="grid grid-cols-2 gap-1.5">
            {SENIORITY_OPTIONS.map(sen => {
              const checked = filters.seniority?.includes(sen) ?? false;
              return (
                <button
                  key={sen}
                  type="button"
                  onClick={() => toggleArrayItem('seniority', sen)}
                  className={`text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between border ${
                    checked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{sen}</span>
                  {checked && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Department */}
        <div>
          <div className="font-semibold text-slate-700 mb-2">Department / Function</div>
          <div className="grid grid-cols-2 gap-1.5">
            {DEPARTMENT_OPTIONS.map(dept => {
              const checked = filters.departments?.includes(dept) ?? false;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => toggleArrayItem('departments', dept)}
                  className={`text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between border ${
                    checked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{dept}</span>
                  {checked && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Email Verification Status */}
        <div>
          <div className="font-semibold text-slate-700 mb-2">Email Deliverability</div>
          <div className="space-y-1">
            {EMAIL_STATUS_OPTIONS.map(item => {
              const checked = filters.emailStatuses?.includes(item.value) ?? false;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => toggleArrayItem('emailStatuses', item.value)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors flex items-center justify-between border ${
                    checked
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {checked && <Check className="w-3 h-3 text-emerald-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Industry */}
        <div>
          <div className="font-semibold text-slate-700 mb-2">Target Industry</div>
          <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
            {INDUSTRY_OPTIONS.map(ind => {
              const checked = filters.industries?.includes(ind) ?? false;
              return (
                <button
                  key={ind}
                  type="button"
                  onClick={() => toggleArrayItem('industries', ind)}
                  className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between border ${
                    checked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="truncate">{ind}</span>
                  {checked && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Company Headcount */}
        <div>
          <div className="font-semibold text-slate-700 mb-2">Employee Count Range</div>
          <div className="grid grid-cols-2 gap-1.5">
            {HEADCOUNT_OPTIONS.map(range => {
              const checked = filters.employeeRanges?.includes(range) ?? false;
              return (
                <button
                  key={range}
                  type="button"
                  onClick={() => toggleArrayItem('employeeRanges', range)}
                  className={`text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between border ${
                    checked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span className="font-mono text-[11px] tabular-nums">{range}</span>
                  {checked && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 6. Technology Stack */}
        <div>
          <div className="font-semibold text-slate-700 mb-2">Technologies Used</div>
          <div className="flex flex-wrap gap-1">
            {TECH_OPTIONS.map(t => {
              const checked = filters.technologies?.includes(t) ?? false;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleArrayItem('technologies', t)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors border ${
                    checked
                      ? 'bg-indigo-600 text-white border-indigo-600 font-medium'
                      : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* 7. Geography */}
        <div>
          <div className="font-semibold text-slate-700 mb-2">Country / Region</div>
          <div className="space-y-1">
            {COUNTRY_OPTIONS.map(country => {
              const checked = filters.countries?.includes(country) ?? false;
              return (
                <button
                  key={country}
                  type="button"
                  onClick={() => toggleArrayItem('countries', country)}
                  className={`w-full text-left px-2 py-1 rounded text-xs transition-colors flex items-center justify-between border ${
                    checked
                      ? 'bg-indigo-50 border-indigo-300 text-indigo-900 font-medium'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{country}</span>
                  {checked && <Check className="w-3 h-3 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* 8. Minimum Lead Score Threshold */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-slate-700">Min Lead Score</span>
            <span className="font-mono text-slate-600 font-semibold tabular-nums">
              {filters.minLeadScore ? `${filters.minLeadScore} pts` : 'Any'}
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="90"
            step="10"
            value={filters.minLeadScore || 0}
            onChange={(e) => {
              const val = Number(e.target.value);
              onChangeFilters({
                ...filters,
                minLeadScore: val > 0 ? val : undefined
              });
            }}
            className="w-full accent-indigo-600 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
            <span>0</span>
            <span>40 (Warm)</span>
            <span>70 (Hot)</span>
          </div>
        </div>
      </div>

      {/* Footer result count */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
        <span className="text-slate-500">Matching prospects:</span>
        <span className="font-mono font-semibold text-slate-900 tabular-nums">
          {totalResultsCount}
        </span>
      </div>
    </aside>
  );
};
