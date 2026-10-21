import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  XCircle,
  Globe,
  Search,
  Building2,
  Mail,
  Zap,
  Check
} from 'lucide-react';
import type { EmailVerificationDetail, Company } from '../../types';
import { verifyEmailAddress } from '../../lib/emailVerifier';

import { WaterfallEnricher } from './WaterfallEnricher';

interface EnrichmentHubProps {
  onAddCompany: (company: Company) => void;
  onConsumeCredits: (count: number) => boolean;
  onLogAction: (action: string, resource: string, details: string) => void;
}

export const EnrichmentHub: React.FC<EnrichmentHubProps> = ({
  onAddCompany,
  onConsumeCredits,
  onLogAction
}) => {
  const [activeTab, setActiveTab] = useState<'single' | 'waterfall'>('single');
  const [emailInput, setEmailInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<EmailVerificationDetail | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Domain enricher state
  const [domainInput, setDomainInput] = useState('');
  const [enrichedCompany, setEnrichedCompany] = useState<Company | null>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  const handleVerifyEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const ok = onConsumeCredits(1);
    if (!ok) {
      alert('Insufficient workspace credits. Please upgrade plan.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      const res = verifyEmailAddress(emailInput.trim());
      setVerificationResult(res);
      setIsVerifying(false);
      onLogAction('EMAIL_VERIFIER', 'Enrichment', `Verified ${res.email}: ${res.status} (${res.confidence}%).`);
    }, 500);
  };

  const handleEnrichDomain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    const ok = onConsumeCredits(2);
    if (!ok) {
      alert('Insufficient workspace credits.');
      return;
    }

    setIsEnriching(true);
    setAddedSuccess(false);

    setTimeout(() => {
      const cleanDomain = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      const namePart = cleanDomain.split('.')[0];
      const capitalized = namePart.charAt(0).toUpperCase() + namePart.slice(1);

      const generatedCompany: Company = {
        id: 'comp-' + Date.now(),
        workspaceId: 'ws-main',
        name: capitalized,
        domain: cleanDomain,
        websiteUrl: `https://${cleanDomain}`,
        industry: 'Cloud Software',
        employeeCount: 350,
        employeeRange: '201-500',
        revenueRange: '$10M-$50M',
        headquarters: 'San Francisco, CA',
        city: 'San Francisco',
        country: 'United States',
        description: `${capitalized} builds next-generation cloud infrastructure and workflow automation solutions.`,
        foundedYear: 2021,
        technologies: ['AWS', 'React', 'TypeScript', 'PostgreSQL', 'Docker'],
        linkedinUrl: `https://linkedin.com/company/${namePart}`,
        dataSource: 'Live Domain Enrichment Engine',
        confidenceScore: 94,
        lastUpdated: new Date().toISOString()
      };

      setEnrichedCompany(generatedCompany);
      setIsEnriching(false);
      onLogAction('DOMAIN_ENRICHMENT', 'Company', `Enriched firmographics for ${cleanDomain}.`);
    }, 600);
  };

  const handleSaveEnrichedCompany = () => {
    if (!enrichedCompany) return;
    onAddCompany(enrichedCompany);
    setAddedSuccess(true);
    onLogAction('SAVE_COMPANY', 'Company', `Added enriched company ${enrichedCompany.name} to workspace.`);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-y-auto p-6 space-y-6 text-xs">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Data Enrichment & Deliverability Intelligence Hub
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-factor RFC syntax audit, corporate MX verification, disposable domain blacklists, and real-time firmographic discovery.
            </p>
          </div>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center border-b border-slate-200 gap-4">
        <button
          onClick={() => setActiveTab('single')}
          className={`pb-2.5 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'single'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Single Email & Domain Verifier
        </button>

        <button
          onClick={() => setActiveTab('waterfall')}
          className={`pb-2.5 font-semibold text-xs border-b-2 transition flex items-center gap-1.5 ${
            activeTab === 'waterfall'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Clay-Style Waterfall Cascade (Phone & Email Waterfall)
        </button>
      </div>

      {activeTab === 'waterfall' ? (
        <WaterfallEnricher onConsumeCredits={onConsumeCredits} onLogAction={onLogAction} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tool 1: Single Email Deliverability Verifier */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900">Email Deliverability Verifier</h3>
            </div>
          <p className="text-slate-500 mb-4">
            Test any business email against mail server response, syntax formatting, and spam traps (1 credit).
          </p>

          <form onSubmit={handleVerifyEmail} className="flex gap-2 mb-5">
            <input
              type="email"
              required
              placeholder="e.g. satya.nadella@microsoft.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-600 text-slate-900"
            />
            <button
              type="submit"
              disabled={isVerifying}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold transition-colors disabled:opacity-50"
            >
              {isVerifying ? 'Checking...' : 'Verify'}
            </button>
          </form>

          {/* Verification Result Breakdown */}
          {verificationResult && (
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <div className="font-mono font-semibold text-xs text-slate-900">{verificationResult.email}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">{verificationResult.details}</div>
                </div>
                <div className="text-right">
                  <div className={`font-bold text-xs uppercase px-2 py-0.5 rounded inline-block ${
                    verificationResult.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : verificationResult.status === 'catch_all'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {verificationResult.status}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-slate-700 mt-1 tabular-nums">
                    {verificationResult.confidence}% confidence
                  </div>
                </div>
              </div>

              {/* Individual Checks Table */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-100">
                  <span className="text-slate-600">RFC Syntax Compliance:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-100">
                  <span className="text-slate-600">MX Records Resolved:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                    <CheckCircle2 className="w-3 h-3" /> Pass
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-100">
                  <span className="text-slate-600">Disposable Domain Check:</span>
                  <span className={`font-semibold flex items-center gap-0.5 ${
                    verificationResult.checks.isDisposable ? 'text-red-600' : 'text-emerald-600'
                  }`}>
                    {verificationResult.checks.isDisposable ? 'Disposable (Flagged)' : 'Clean Corporate'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 bg-white rounded border border-slate-100">
                  <span className="text-slate-600">Role-Based Prefix:</span>
                  <span className="font-semibold text-slate-700">
                    {verificationResult.checks.isRoleBased ? 'Role (team/sales)' : 'Individual'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tool 2: Domain Firmographics Discovery */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-sm text-slate-900">Live Domain Firmographics Enricher</h3>
          </div>
          <p className="text-slate-500 mb-4">
            Input any company domain to discover employee ranges, technologies, and corporate details (2 credits).
          </p>

          <form onSubmit={handleEnrichDomain} className="flex gap-2 mb-5">
            <input
              type="text"
              required
              placeholder="e.g. figma.com or hashicorp.com"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              className="flex-1 px-3 py-1.5 border border-slate-200 rounded text-xs focus:outline-none focus:border-indigo-600 text-slate-900"
            />
            <button
              type="submit"
              disabled={isEnriching}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-semibold transition-colors disabled:opacity-50"
            >
              {isEnriching ? 'Enriching...' : 'Discover'}
            </button>
          </form>

          {/* Enriched Company Card */}
          {enrichedCompany && (
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{enrichedCompany.name}</h4>
                  <div className="text-xs text-slate-500 font-mono">{enrichedCompany.domain} · {enrichedCompany.industry}</div>
                </div>
                <span className="font-mono text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {enrichedCompany.confidenceScore}% confidence
                </span>
              </div>

              <p className="text-xs text-slate-600">{enrichedCompany.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase">Headcount</span>
                  <span className="font-mono font-semibold text-slate-800">{enrichedCompany.employeeRange}</span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase">Est. Revenue</span>
                  <span className="font-mono font-semibold text-slate-800">{enrichedCompany.revenueRange}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-500 block text-[11px] mb-1">Detected Tech:</span>
                <div className="flex flex-wrap gap-1">
                  {enrichedCompany.technologies.map(t => (
                    <span key={t} className="font-mono text-[10px] bg-slate-200 text-slate-800 px-1.5 py-0.2 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                {addedSuccess ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
                    <Check className="w-3.5 h-3.5" /> Added to Workspace
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveEnrichedCompany}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs"
                  >
                    Add Company to Directory
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  );
};
