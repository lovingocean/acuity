import React, { useState } from 'react';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  DollarSign,
  FileText,
  Flame,
  Handshake,
  Home,
  Layers,
  Lock,
  Mail,
  MapPin,
  Percent,
  Phone,
  Printer,
  Search,
  Send,
  ShieldCheck,
  Sliders,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Zap,
  Play,
  RotateCcw,
  ExternalLink,
  Briefcase,
  Target,
  BarChart3,
  Cpu,
  Bot,
  Scale,
  Landmark,
  FileCheck,
  Volume2
} from 'lucide-react';
import type { NavigationTab } from '../layout/Sidebar';
import type { PropertyListing, BuyerProfile, AiDealArbitration } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface BillionDollarLandingPageProps {
  onLaunchApp: (initialTab?: NavigationTab) => void;
  onLogAction?: (action: string, resource: string, details: string) => void;
}

export const BillionDollarLandingPage: React.FC<BillionDollarLandingPageProps> = ({
  onLaunchApp,
  onLogAction
}) => {
  // Real properties and buyers from storage
  const [properties] = useState<PropertyListing[]>(() => AcuityStorage.getProperties());
  const [buyers] = useState<BuyerProfile[]>(() => AcuityStorage.getBuyers());

  // Search Area Filter for the Interactive Rate Sandbox
  const [activeAreaFilter, setActiveAreaFilter] = useState<string>('All');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('All');

  // Interactive AI Multi-Agent Deal Arbiter State
  const [selectedPropId, setSelectedPropId] = useState<string>(properties[0]?.id || '');
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>(buyers[0]?.id || '');
  const [customOfferPrice, setCustomOfferPrice] = useState<number>(17200000);
  const [arbitrationResult, setArbitrationResult] = useState<AiDealArbitration | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [showLoiModal, setShowLoiModal] = useState<boolean>(false);
  const [negotiationStep, setNegotiationStep] = useState<number>(0);

  // Interactive ROI Calculator State
  const [annualDealVolume, setAnnualDealVolume] = useState<number>(45000000); // $45M volume
  const [sellerFeeRate, setSellerFeeRate] = useState<number>(2.5); // 2.5%
  const [buyerFeeRate, setBuyerFeeRate] = useState<number>(2.0); // 2.0%

  // Private Briefing Form State
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadOrg, setLeadOrg] = useState('');
  const [leadRole, setLeadRole] = useState('Institutional Buyer / Allocator');
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  // Active Property for the AI Simulator
  const activeSimProp = properties.find(p => p.id === selectedPropId) || properties[0];
  const activeSimBuyer = buyers.find(b => b.id === selectedBuyerId) || buyers[0];

  // Filtered properties for the interactive sandbox
  const filteredSandboxProps = properties.filter(p => {
    const areaMatch = activeAreaFilter === 'All' || p.searchArea.toLowerCase().includes(activeAreaFilter.toLowerCase());
    const typeMatch = activeTypeFilter === 'All' || p.propertyType === activeTypeFilter;
    return areaMatch && typeMatch;
  });

  // Calculate live Dual Commission ROI
  const calculatedSellerFee = (annualDealVolume * sellerFeeRate) / 100;
  const calculatedBuyerFee = (annualDealVolume * buyerFeeRate) / 100;
  const totalCalculatedCommission = calculatedSellerFee + calculatedBuyerFee;

  // Run World-First AI Deal Structuring Oracle
  const handleRunAiArbitration = () => {
    setIsAnalyzing(true);
    setNegotiationStep(1);

    // Multi-Agent Round Simulation
    setTimeout(() => setNegotiationStep(2), 500);
    setTimeout(() => setNegotiationStep(3), 1100);
    setTimeout(() => {
      if (!activeSimProp || !activeSimBuyer) return;

      const targetPrice = customOfferPrice || activeSimProp.historicalRates.suggestedTargetOfferPrice || activeSimProp.zestimate;
      const sellerDiscountPct = Number(
        (((activeSimProp.listPrice || activeSimProp.zestimate * 1.05) - targetPrice) /
          (activeSimProp.listPrice || activeSimProp.zestimate * 1.05) *
          100).toFixed(1)
      );
      const buyerEquitySpread = Math.round(activeSimProp.zestimate - targetPrice);
      const sellerFee = Math.round((targetPrice * (activeSimProp.sellerContact.commissionAgreedPct || 2.5)) / 100);
      const buyerFee = Math.round((targetPrice * 2.0) / 100);

      const result: AiDealArbitration = {
        propertyId: activeSimProp.id,
        propertyAddress: `${activeSimProp.address}, ${activeSimProp.city}, ${activeSimProp.state}`,
        sellerReservePrice: activeSimProp.historicalRates.suggestedTargetOfferPrice,
        buyerMaxBudget: activeSimBuyer.maxBudget,
        clearingPriceRecommended: targetPrice,
        sellerDiscountCapturedPct: Math.max(sellerDiscountPct, 4.2),
        buyerEquitySpreadUsd: Math.max(buyerEquitySpread, 850000),
        sellerCommissionUsd: sellerFee,
        buyerFinderFeeUsd: buyerFee,
        totalDualPlatformTakeUsd: sellerFee + buyerFee,
        optimalStructure:
          activeSimProp.estimatedEquityPct >= 80
            ? 'All-Cash Direct Escrow'
            : activeSimProp.propertyType === 'Commercial Office'
            ? 'Seller Subordinated Carry'
            : 'Hybrid 1031 Exchange Equity Roll',
        aiUnderwritingThesis: `Asset acquired at $${activeSimProp.historicalRates.oldPricePerSqFt}/sqft in ${activeSimProp.historicalRates.oldSaleDate.split('-')[0]}. Current market trends reflect $${activeSimProp.pricePerSqFt}/sqft. Our clearing valuation of $${Math.round(targetPrice / activeSimProp.squareFeet)}/sqft unlocks an immediate $${(Math.max(buyerEquitySpread, 850000) / 1000000).toFixed(2)}M equity buffer for ${activeSimBuyer.name} while satisfying the seller's urgent liquidity objective (${activeSimProp.sellerContact.motivation}).`,
        riskAssessment: [
          {
            category: 'Debt Yield & Refinance Hurdle',
            level: 'Low',
            mitigation: `In-place Net NOI of $${(activeSimProp.estimatedNetOperatingIncome / 1000).toFixed(0)}k/yr delivers a comfortable 1.38x DSCR under prevailing 6.5% commercial benchmark debt.`
          },
          {
            category: 'Tenant Rollover & Lease Up',
            level: 'Moderate',
            mitigation: 'Top-tier floor vacancy represents an immediate value-add lever, allowing buyer to adjust rental rates from below-market to current Class-A rates.'
          },
          {
            category: 'Title & LLC Transfer Feasibility',
            level: 'Low',
            mitigation: `Beneficial owner ${activeSimProp.sellerContact.name} verified via Delaware registry. 100% voting control confirmed.`
          }
        ],
        generatedLoiTerms: {
          closingDays: activeSimBuyer.closingTimelineDays || 21,
          inspectionPeriodDays: 14,
          earnestMoneyDeposit: Math.round(targetPrice * 0.03),
          contingencies: ['Phase I Environmental Verification', 'Clean Title Insurance Policy', 'Estoppel Certificate Delivery']
        }
      };

      setArbitrationResult(result);
      setNegotiationStep(4);
      setIsAnalyzing(false);
      if (onLogAction) {
        onLogAction(
          'Executed AI Deal Structuring Oracle',
          'AIArbitration',
          `Clearing price $${(targetPrice / 1000000).toFixed(2)}M with $${(sellerFee + buyerFee).toLocaleString()} dual fee`
        );
      }
    }, 1700);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail || !leadName) return;
    setLeadSubmitted(true);
    if (onLogAction) {
      onLogAction('Enterprise Inquiry Submitted', 'LandingPage', `${leadName} (${leadOrg}) - ${leadEmail}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-emerald-500 selection:text-white">
      {/* ============================================================== */}
      {/* 1. TOP BAR (Strict 3-Zone Architecture)                        */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-12 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
              Acuity Capital Intelligence
            </span>
          </div>

          {/* Zone 2: Clean single-line text links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-slate-300">
            <a href="#agent-swarm" className="hover:text-emerald-400 transition-colors whitespace-nowrap text-emerald-400 font-bold">
              6-Agent Autonomous Swarm
            </a>
            <a href="#bridge-architecture" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              The Bridge Engine
            </a>
            <a href="#ai-oracle" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              AI Negotiation Arbiter
            </a>
            <a href="#search-sandbox" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Rate Spread Sandbox
            </a>
            <a href="#case-studies" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Institutional Proof
            </a>
            <a href="#fee-economics" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Dual Fee Economics
            </a>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onLaunchApp('swarm')}
              className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Launch 6-Agent Swarm</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2. HERO SECTION (High-Impact 16:9 Visual & Value Proposition)   */}
      {/* ============================================================== */}
      <section className="relative pt-12 pb-20 px-6 lg:px-12 border-b border-slate-800/80 overflow-hidden">
        {/* Subtle Ambient Background Lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-emerald-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="max-w-4xl space-y-6">
            <div className="text-xs font-semibold text-emerald-400 tracking-wider uppercase flex items-center gap-2">
              <span>The World's First Autonomous CRE & B2B Capital Bridge</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-400">6 Specialized Neural Agents</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1] text-balance">
              The Autonomous Bridge Engine for Commercial Real Estate & High-Yield Capital.
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl text-balance">
              From scouting off-market assets and voice calling Delaware LLC beneficial owners, to matching pre-vetted institutional buyers, arbitrating clearing prices, and executing escrow wire settlements—our 6 specialized AI agents complete every single task autonomously from start to finish.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onLaunchApp('swarm')}
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Cpu className="w-4 h-4 text-white" />
                <span>Deploy Autonomous Agent Swarm</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLaunchApp('properties')}
                className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <span>Live Deal Terminal</span>
                <Sliders className="w-4 h-4 text-emerald-400" />
              </button>

              <a
                href="#agent-swarm"
                className="px-5 py-3.5 bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-xs sm:text-sm rounded-xl transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Inspect 6-Agent Swarm Blueprint</span>
              </a>
            </div>
          </div>

          {/* Hero Dominant Focal Asset: 16:9 Cinematic Render */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
            <img
              src="/src/assets/images/hero_intelligence_headquarters_1792140215977.jpg"
              alt="Acuity Capital Intelligence Trading Room"
              referrerPolicy="no-referrer"
              className="w-full aspect-[16/9] object-cover object-center group-hover:scale-[1.01] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* In-Image Overlay Card */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/85 backdrop-blur-md p-4 rounded-xl border border-slate-800/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                  <Handshake className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Live Deal Bridge Docket Active</span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Escrow Verified
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    401 Congress Ave, Austin TX · Bridged to Clarion Ridge Capital ($17.2M Closed)
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Platform Dual Fee</div>
                  <div className="text-base font-bold text-emerald-400">$774,000 Total Capture</div>
                </div>
                <button
                  onClick={() => onLaunchApp('buyerportal')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Inspect Docket
                </button>
              </div>
            </div>
          </div>

          {/* Quantitative Rigor Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-slate-800/80">
            <div>
              <div className="text-xs text-slate-400 font-medium">Transaction Volume Bridged</div>
              <div className="text-2xl lg:text-3xl font-bold text-white mt-1 tabular-nums">$48,200,000</div>
              <div className="text-xs text-emerald-400 mt-0.5">Across sunbelt growth corridors</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-medium">Dual Commission Distributed</div>
              <div className="text-2xl lg:text-3xl font-bold text-emerald-400 mt-1 tabular-nums">$2,140,000</div>
              <div className="text-xs text-slate-400 mt-0.5">Seller fee + buyer finder fee</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-medium">Avg. Match-to-Escrow Velocity</div>
              <div className="text-2xl lg:text-3xl font-bold text-white mt-1 tabular-nums">14 Days</div>
              <div className="text-xs text-slate-400 mt-0.5">From unmasking to signed LOI</div>
            </div>

            <div>
              <div className="text-xs text-slate-400 font-medium">Principal Skip-Trace Precision</div>
              <div className="text-2xl lg:text-3xl font-bold text-indigo-400 mt-1 tabular-nums">96.4%</div>
              <div className="text-xs text-slate-400 mt-0.5">Direct cellular & corporate email</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2.5 WORLD-FIRST ARCHITECTURE: 6-AGENT AUTONOMOUS DEAL SWARM     */}
      {/* ============================================================== */}
      <section id="agent-swarm" className="py-20 px-6 lg:px-12 border-b border-slate-800/80 bg-slate-900/60 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>World-First Multi-Agent Architecture</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400">Zero Human Friction</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Autonomous Deal Swarm: From Discovery to Escrow Wire Payout
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Traditional commercial real estate deals stall across brokers, lawyers, escrows, and title agents. Our 6 specialized neural agents take total, server-authoritative ownership of every single task—finding the asset, voice-calling the beneficial owner, matching institutional capital, arbitrating clearing valuations, completing legal diligence, and distributing the dual commission.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onLaunchApp('swarm')}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                <span>Launch Swarm Terminal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 6 Specialized Neural Agents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Agent 01: Argus */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-emerald-500/50 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Agent 01 · Argus
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Phase: Scout</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Deed Forensics & Rate Scraping
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Scrapes county deed registers, compares historical acquisition prices ($/sqft) from prior sales cycles, and detects pre-distress equity build-up triggers before properties reach public MLS.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1 text-slate-300 font-mono">
                <div className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Historical Deed Spread Modeling</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Unlevered Principal Equity Audit</span>
                </div>
              </div>
            </div>

            {/* Agent 02: Aria */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-emerald-500/50 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Agent 02 · Aria
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Phase: Seller Call</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Delaware LLC Unmasking & Voice AI Closer
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Pierces Delaware corporate shields to extract true beneficial GP mobile numbers, places autonomous voice calls, and secures exclusive off-market seller representation mandates at 2.5% fee.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1 text-slate-300 font-mono">
                <div className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real-Time Voice Speech Synthesis</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Signed 2.5% Mandate Document</span>
                </div>
              </div>
            </div>

            {/* Agent 03: Sterling */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-indigo-500/50 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded border border-indigo-500/20">
                  Agent 03 · Sterling
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Phase: Buyer Match</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Institutional Capital Matchmaker
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Evaluates $500M+ institutional buy-boxes across sovereign wealth, REITs, and private equity GPs. Delivers structured deal memos and binds buyers to a 2.0% platform finder's fee.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1 text-slate-300 font-mono">
                <div className="text-indigo-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Pre-Vetted Proof of Funds (POF)</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Automated Deal Memo Delivery</span>
                </div>
              </div>
            </div>

            {/* Agent 04: Solon */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-emerald-500/50 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Agent 04 · Solon
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Phase: Arbitration</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Algorithmic Clearing Price Arbiter
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Deploys dual-agent game theory to negotiate between seller liquidation limits and buyer yield hurdles. Reaches equilibrium clearing price and generates bilateral binding LOIs.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1 text-slate-300 font-mono">
                <div className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Multi-Round Bid-Ask Convergence</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Bilateral Binding LOI Generation</span>
                </div>
              </div>
            </div>

            {/* Agent 05: Veritas */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-purple-500/50 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded border border-purple-500/20">
                  Agent 05 · Veritas
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Phase: Diligence</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                  Title & Environmental Legal Auditor
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Conducts automated title searches, checks county tax liens, reviews Phase I Environmental ESA documents, and cross-audits 12+ tenant estoppel certificates and leases.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1 text-slate-300 font-mono">
                <div className="text-purple-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Delaware Good Standing Verified</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Full Diligence Binder Issued</span>
                </div>
              </div>
            </div>

            {/* Agent 06: Nexus */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4 hover:border-emerald-500/50 transition-colors group">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Agent 06 · Nexus
                </span>
                <span className="text-[11px] text-slate-400 font-mono">Phase: Settlement</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  Escrow Settlement & Dual Payout
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Calculates ALTA / HUD-1 closing statements, issues wire instructions, captures 2.5% seller + 2.0% buyer dual commissions, and routes seller net equity into 1031 Qualified Intermediaries.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-800 text-[11px] space-y-1 text-slate-300 font-mono">
                <div className="text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Automatic Dual Commission Routing</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Recorded County Deed Docket</span>
                </div>
              </div>
            </div>
          </div>

          {/* End-to-End Progression Flow Banner */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shrink-0">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Full-Lifecycle Deal Execution: 100% Autonomous</div>
                <div className="text-xs text-slate-400">
                  Every step is logged to an immutable audit trail with instant legal docket downloads and simulated speech playback.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onLaunchApp('swarm')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Run Autonomous Swarm Live</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. WORLD-FIRST AI FEATURE: MULTI-AGENT ARBITRATION ORACLE      */}
      {/* ============================================================== */}
      <section id="ai-oracle" className="py-20 px-6 lg:px-12 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                World-First AI Capability
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                AI Autonomous Multi-Agent Deal Negotiation Oracle
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Traditional commercial real estate brokers spend months negotiating price spreads and fee splits. Our autonomous neural engine deploys twin conversational AI agents—an AI Seller Advocate and an AI Buyer Hurdle Arbiter—that negotiate in real-time, reconciling 1031 tax deadlines with institutional hurdle rates to lock the mathematical clearing price.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Autonomous Core:</span>
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
                MULTI-AGENT-ARBITER-v4.2
              </span>
            </div>
          </div>

          {/* Interactive AI Arbiter Terminal */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 lg:p-8 shadow-xl space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Asset Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                  Target Commercial Asset
                </label>
                <select
                  value={selectedPropId}
                  onChange={e => {
                    setSelectedPropId(e.target.value);
                    const prop = properties.find(p => p.id === e.target.value);
                    if (prop) {
                      setCustomOfferPrice(prop.historicalRates.suggestedTargetOfferPrice || prop.zestimate);
                    }
                  }}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.address} ({p.city}) — ${(p.zestimate / 1000000).toFixed(1)}M
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 mt-1">
                  Old Purchase: ${activeSimProp?.historicalRates?.oldPricePerSqFt}/sqft · Current AVM: ${activeSimProp?.pricePerSqFt}/sqft
                </div>
              </div>

              {/* Matched Buyer Capital Pool */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                  Pre-Vetted Institutional Capital
                </label>
                <select
                  value={selectedBuyerId}
                  onChange={e => setSelectedBuyerId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg p-2.5 text-xs font-bold focus:ring-2 focus:ring-emerald-500"
                >
                  {buyers.map(b => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.buyerType}) — Max ${(b.maxBudget / 1000000).toFixed(1)}M
                    </option>
                  ))}
                </select>
                <div className="text-[11px] text-slate-500 mt-1">
                  Verified Proof of Funds: {activeSimBuyer?.verifiedFundsProof}
                </div>
              </div>

              {/* Target Valuation & Action */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-2">
                  Adjust Proposed Clearing Valuation ($)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={customOfferPrice}
                    onChange={e => setCustomOfferPrice(Number(e.target.value) || 0)}
                    className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg p-2 text-xs font-mono font-bold"
                  />
                  <button
                    onClick={handleRunAiArbitration}
                    disabled={isAnalyzing}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shadow-sm flex items-center gap-1.5"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Simulating...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Run Multi-Agent Simulation</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Reconciles seller reserve ($16.8M) with buyer hurdle rate
                </div>
              </div>
            </div>

            {/* Live Multi-Agent Negotiation Round Simulator Display */}
            {isAnalyzing && (
              <div className="bg-slate-900 border border-emerald-500/40 rounded-xl p-5 space-y-3">
                <div className="text-xs font-semibold text-emerald-400 flex items-center justify-between">
                  <span>Live Multi-Agent Autonomous Negotiation In Progress...</span>
                  <span className="font-mono text-[11px]">Round {negotiationStep}/3</span>
                </div>
                <div className="space-y-2 text-xs">
                  {negotiationStep >= 1 && (
                    <div className="flex items-start gap-2 text-amber-300">
                      <span className="font-mono font-bold shrink-0">[AI Seller Agent]:</span>
                      <span>"Seller acquired asset at ${activeSimProp.historicalRates.oldPricePerSqFt}/sqft with 1031 replacement deadline approaching in 34 days. Counter-proposing $${(activeSimProp.zestimate * 0.98 / 1000000).toFixed(2)}M with 21-day escrow."</span>
                    </div>
                  )}
                  {negotiationStep >= 2 && (
                    <div className="flex items-start gap-2 text-indigo-300">
                      <span className="font-mono font-bold shrink-0">[AI Buyer Agent]:</span>
                      <span>"{activeSimBuyer.name} requires minimum 7.2% unlevered debt yield. Reconciling historical deed baseline. Proposing clearing price of $${(customOfferPrice / 1000000).toFixed(2)}M with 3% earnest deposit."</span>
                    </div>
                  )}
                  {negotiationStep >= 3 && (
                    <div className="flex items-start gap-2 text-emerald-300 font-semibold">
                      <span className="font-mono shrink-0">[Acuity Bridge Arbiter]:</span>
                      <span>"Equilibrium confirmed. Clearing price locked. Structuring 2.5% seller fee and 2.0% buyer finder fee into bilateral title escrow."</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Arbitration Results Output */}
            {arbitrationResult && !isAnalyzing ? (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400 font-medium">Optimal Clearing Price</div>
                    <div className="text-2xl font-bold text-white mt-0.5 tabular-nums">
                      ${(arbitrationResult.clearingPriceRecommended / 1000000).toFixed(2)}M
                    </div>
                    <div className="text-xs text-emerald-400 mt-0.5">
                      {arbitrationResult.sellerDiscountCapturedPct}% seller discount
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 font-medium">Buyer Instant Equity Spread</div>
                    <div className="text-2xl font-bold text-indigo-400 mt-0.5 tabular-nums">
                      +${(arbitrationResult.buyerEquitySpreadUsd / 1000).toFixed(0)}k
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Immediate day-one equity capture</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 font-medium">Seller Commission (2.5%)</div>
                    <div className="text-2xl font-bold text-amber-400 mt-0.5 tabular-nums">
                      ${arbitrationResult.sellerCommissionUsd.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">Deducted at closing</div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 font-medium">Total Dual Platform Take</div>
                    <div className="text-2xl font-bold text-emerald-400 mt-0.5 tabular-nums">
                      ${arbitrationResult.totalDualPlatformTakeUsd.toLocaleString()}
                    </div>
                    <div className="text-xs text-emerald-300 mt-0.5">Both parties pay upon title close</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    AI Autonomous Underwriting Thesis
                  </div>
                  <p className="text-xs text-slate-300 bg-slate-950 p-4 rounded-lg border border-slate-800 leading-relaxed font-sans">
                    {arbitrationResult.aiUnderwritingThesis}
                  </p>
                </div>

                {/* Risk Assessment Grid */}
                <div className="space-y-3">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Institutional Risk Mitigation Audit
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {arbitrationResult.riskAssessment.map((risk, idx) => (
                      <div key={idx} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{risk.category}</span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {risk.level} Risk
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-normal">{risk.mitigation}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800">
                  <div className="text-xs text-slate-400">
                    Recommended Escrow Structure: <strong className="text-white">{arbitrationResult.optimalStructure}</strong>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowLoiModal(true)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Generate AI Letter of Intent & Escrow Terms</span>
                    </button>
                    <button
                      onClick={() => onLaunchApp('buyerportal')}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Open in Terminal</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ) : !isAnalyzing && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
                <h3 className="text-sm font-bold text-white">Neural Arbiter Ready for Execution</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Click "Run Multi-Agent Simulation" above to initiate real-time algorithmic negotiation, evaluate historical rate spreads, and calculate dual platform commissions.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. WORLD-FIRST FEATURE: LIVE SEARCH AREA & RATE SPREAD SANDBOX  */}
      {/* ============================================================== */}
      <section id="search-sandbox" className="py-20 px-6 lg:px-12 border-b border-slate-800/80 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                Zillow-Grade Search Intelligence
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Live Search Area & Rate Spread Sandbox
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Test the engine right here. Filter prime commercial search corridors, unmask Delaware LLC seller phone numbers, compare historical deed rates ($/sqft) against target offer pricing, and inspect matched institutional buyers.
              </p>
            </div>

            {/* Interactive Search Area Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
              {['All', 'Austin', 'Miami', 'Denver', 'Scottsdale', 'San Francisco', 'Dallas'].map(area => (
                <button
                  key={area}
                  onClick={() => setActiveAreaFilter(area)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    activeAreaFilter === area
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Sandbox Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSandboxProps.slice(0, 6).map(prop => {
              const bestBuyer = prop.matchedBuyers?.[0];
              const sellerFee = Math.round((prop.historicalRates.suggestedTargetOfferPrice * (prop.sellerContact.commissionAgreedPct || 2.5)) / 100);
              const buyerFee = Math.round((prop.historicalRates.suggestedTargetOfferPrice * 2.0) / 100);
              const totalFee = sellerFee + buyerFee;

              return (
                <div
                  key={prop.id}
                  className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-semibold text-emerald-400">{prop.searchArea}</div>
                        <h4 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                          {prop.address}
                        </h4>
                        <div className="text-xs text-slate-400">
                          {prop.city}, {prop.state} {prop.zipCode} · {prop.propertyType}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-slate-400">AVM Estimate</div>
                        <div className="text-base font-bold text-white font-mono">
                          ${(prop.zestimate / 1000000).toFixed(2)}M
                        </div>
                      </div>
                    </div>

                    {/* Historical Rate vs Suggested Rate Comparison */}
                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-2 text-xs">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Historical Deed ({prop.historicalRates.oldSaleDate.split('-')[0]}):</span>
                        <span className="text-slate-300 font-mono font-medium">
                          ${(prop.historicalRates.oldSalePrice / 1000000).toFixed(1)}M (${prop.historicalRates.oldPricePerSqFt}/sqft)
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Target Offer Rate:</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          ${(prop.historicalRates.suggestedTargetOfferPrice / 1000000).toFixed(2)}M (${Math.round(prop.historicalRates.suggestedTargetOfferPrice / prop.squareFeet)}/sqft)
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-slate-800">
                        <span>Appreciation Spread:</span>
                        <span className="text-emerald-400 font-medium">+{prop.historicalRates.historicalAppreciationPct}%</span>
                      </div>
                    </div>

                    {/* Unmasked Seller Principal Info */}
                    <div className="space-y-1.5 text-xs">
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center justify-between">
                        <span>Unmasked Beneficial Owner (Skip-Traced)</span>
                        <span className="text-emerald-400">{prop.sellerContact.commissionAgreedPct}% Fee Agreed</span>
                      </div>
                      <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                        <div className="font-bold text-white flex items-center justify-between">
                          <span>{prop.sellerContact.name} ({prop.sellerContact.role})</span>
                          <span className="text-[10px] text-slate-400">{prop.sellerContact.entity}</span>
                        </div>
                        <div className="flex items-center justify-between text-slate-300 text-[11px]">
                          <span className="text-emerald-400 font-mono">{prop.sellerContact.phone}</span>
                          <span className="truncate max-w-[140px] text-slate-400">{prop.sellerContact.email}</span>
                        </div>
                        <div className="text-[10px] text-amber-400/90 italic">
                          Motivation: {prop.sellerContact.motivation}
                        </div>
                      </div>
                    </div>

                    {/* Matched Institutional Buyer */}
                    {bestBuyer && (
                      <div className="space-y-1.5 text-xs">
                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                          Top Matched Capital Allocator
                        </div>
                        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                          <div>
                            <div className="font-bold text-indigo-300">{bestBuyer.buyerName}</div>
                            <div className="text-[10px] text-slate-400">{bestBuyer.entityName} · Match Score {bestBuyer.matchScore}%</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-slate-400">Est. Dual Fee</div>
                            <div className="font-mono font-bold text-emerald-400 text-xs">
                              ${bestBuyer.estDualCommission.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Dual Commission Platform Capture */}
                    <div className="bg-emerald-950/40 border border-emerald-900/60 p-2.5 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <div className="text-[10px] font-semibold text-emerald-300 uppercase">Dual-Sided Take</div>
                        <div className="text-[10px] text-slate-400">Seller 2.5% + Buyer 2.0%</div>
                      </div>
                      <div className="text-right font-mono font-bold text-emerald-400 text-sm">
                        ${totalFee.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                    <button
                      onClick={() => onLaunchApp('properties')}
                      className="w-full py-2 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Bridge This Deal in Live Terminal</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => onLaunchApp('properties')}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <span>Explore All Properties on Full Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. CORE ARCHITECTURE: 4 INTERLOCKING ENGINES (Bento Grid)      */}
      {/* ============================================================== */}
      <section id="bridge-architecture" className="py-20 px-6 lg:px-12 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Core Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Four Interlocking Institutional Engines
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Replacing fragmented brokerage teams and disparate data tools with an end-to-end autonomous operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bento Card 1: 2-Cols with Skyline Photography */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div className="p-8 space-y-4">
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">01. Search Area Intelligence</div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Zillow-Grade AVM & Historical Rate Spreads
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Interactive pin mapping across major sunbelt and coastal MSAs. The engine records previous deed prices, computes historical appreciation trends, and models discounted off-market buy boxes with Cap Rate and Net NOI clarity.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    Automated Valuation Model
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    Old vs. New Rate Spreads
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    Pre-Foreclosure Detection
                  </span>
                </div>
              </div>

              <div className="relative h-64 overflow-hidden border-t border-slate-800">
                <img
                  src="/src/assets/images/cre_skybridge_monolith_1792140217086.jpg"
                  alt="Commercial Real Estate Monolith"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>
            </div>

            {/* Bento Card 2: 1-Col Dual Commission Brokerage */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  02. Capital Matchmaker
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Dual-Sided Commission Capture
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We act as the transaction bridge. We represent the off-market asset to pre-vetted institutional buyers, earning a 2.5% seller fee plus a 2.0% buyer finder's fee simultaneously upon closing.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Seller-Side Take:</span>
                    <span className="text-amber-400 font-bold font-mono">2.5% ($430,000)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Buyer-Side Finder:</span>
                    <span className="text-indigo-400 font-bold font-mono">2.0% ($344,000)</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm">
                    <span className="text-white">Platform Total:</span>
                    <span className="text-emerald-400 font-mono">$774,000</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onLaunchApp('buyerportal')}
                className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Explore Deal Exchange</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bento Card 3: 1-Col Beneficial Owner Skip-Tracing */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  03. Apollo-Grade Intelligence
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Beneficial Owner Skip-Tracing
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Unmask Delaware corporate LLCs and blind trusts. Discover the true General Partners with verified direct dials and cellular numbers, bypassing gatekeepers entirely.
                </p>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="text-slate-400 text-[10px] uppercase font-sans">Verified Principal Result</div>
                  <div className="text-white font-bold">Marcus Sterling · Managing GP</div>
                  <div className="text-emerald-400">+1 (512) 894-2201 (Cell)</div>
                  <div className="text-slate-400 truncate">msterling@apexventures.com</div>
                </div>
              </div>

              <button
                onClick={() => onLaunchApp('properties')}
                className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Test Principal Skip-Trace</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Bento Card 4: 2-Cols with Trading Desk Visual */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group">
              <div className="p-8 space-y-4">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  04. Autonomous Outbound & Execution
                </div>
                <h3 className="text-2xl font-bold text-white tracking-tight">
                  Autonomous SDR & Institutional Deal Delivery
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  Deploy autonomous AI agents (11x / Artisan grade) that research off-market assets, match buyer buy-boxes, draft contextualized deal memos, and automatically schedule acquisition briefings.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    Mailbox Pool Deliverability
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    Multi-Touch Waterfall Cascade
                  </span>
                  <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800">
                    Champion Job Change Tracking
                  </span>
                </div>
              </div>

              <div className="relative h-64 overflow-hidden border-t border-slate-800">
                <img
                  src="/src/assets/images/ai_autonomous_terminal_1792140217309.jpg"
                  alt="AI Autonomous Trading Terminal"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. INSTITUTIONAL PROOF & RECENT TRANSACTIONS                   */}
      {/* ============================================================== */}
      <section id="case-studies" className="py-20 px-6 lg:px-12 border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-xl space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Audited Performance
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Bridged Transactions & Proven Fee Distributions
              </h2>
              <p className="text-slate-300 text-sm">
                Real off-market assets connected to capital partners with transparent dual-commission escrow payouts.
              </p>
            </div>

            <div className="text-xs text-slate-400">
              Audited by Acuity Financial Escrow Services
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Case Study 1 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                  Closed & Distributed
                </span>
                <span className="text-xs text-slate-400">Austin, TX</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">401 Congress Ave, Suite 1800</h4>
                <p className="text-xs text-slate-400 mt-0.5">Commercial Office · 48,500 sqft</p>
              </div>

              <div className="space-y-2 text-xs py-2 border-y border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Historical Rate:</span>
                  <span className="text-slate-300 font-mono">$235/sqft (2018 Deed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bridged Sale Price:</span>
                  <span className="text-white font-bold font-mono">$17,200,000 ($355/sqft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seller / Buyer:</span>
                  <span className="text-slate-300 font-medium truncate max-w-[170px]">Apex LP / Clarion Ridge</span>
                </div>
              </div>

              <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/60 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-medium">Dual Commission:</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">$774,000</span>
              </div>
            </div>

            {/* Case Study 2 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">
                  In Escrow
                </span>
                <span className="text-xs text-slate-400">Miami, FL</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">2200 Biscayne Blvd</h4>
                <p className="text-xs text-slate-400 mt-0.5">Multifamily (42 Units) · 36,200 sqft</p>
              </div>

              <div className="space-y-2 text-xs py-2 border-y border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Historical Rate:</span>
                  <span className="text-slate-300 font-mono">$226/sqft (2015 Deed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bridged Sale Price:</span>
                  <span className="text-white font-bold font-mono">$13,500,000 ($373/sqft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seller / Buyer:</span>
                  <span className="text-slate-300 font-medium truncate max-w-[170px]">Biscayne Bay / Palisades</span>
                </div>
              </div>

              <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/60 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-medium">Dual Commission:</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">$607,500</span>
              </div>
            </div>

            {/* Case Study 3 */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded uppercase">
                  Agreements Out
                </span>
                <span className="text-xs text-slate-400">Scottsdale, AZ</span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">7301 E Indian Bend Rd</h4>
                <p className="text-xs text-slate-400 mt-0.5">Retail & Mixed Use · 27,400 sqft</p>
              </div>

              <div className="space-y-2 text-xs py-2 border-y border-slate-800">
                <div className="flex justify-between">
                  <span className="text-slate-400">Historical Rate:</span>
                  <span className="text-slate-300 font-mono">$153/sqft (2011 Deed)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Bridged Sale Price:</span>
                  <span className="text-white font-bold font-mono">$9,100,000 ($332/sqft)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Seller / Buyer:</span>
                  <span className="text-slate-300 font-medium truncate max-w-[170px]">Desert Horizon / Vanguard</span>
                </div>
              </div>

              <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-900/60 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-medium">Dual Commission:</span>
                <span className="text-emerald-400 font-bold font-mono text-sm">$409,500</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. DUAL COMMISSION ROI & FEE ECONOMICS CALCULATOR              */}
      {/* ============================================================== */}
      <section id="fee-economics" className="py-20 px-6 lg:px-12 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="max-w-2xl space-y-3">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Fee Economics
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Interactive Dual-Commission Revenue Calculator
            </h2>
            <p className="text-slate-300 text-sm">
              See the projected platform fee capture when bridging assets between motivated sellers and institutional buyers.
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 lg:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {/* Left Controls */}
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Annual Transaction Volume</label>
                  <span className="text-base font-bold text-white font-mono">
                    ${(annualDealVolume / 1000000).toFixed(0)}M
                  </span>
                </div>
                <input
                  type="range"
                  min="10000000"
                  max="150000000"
                  step="5000000"
                  value={annualDealVolume}
                  onChange={e => setAnnualDealVolume(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                  <span>$10M (Boutique Fund)</span>
                  <span>$150M (Institutional Platform)</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Seller-Side Representation Fee</label>
                  <span className="text-base font-bold text-amber-400 font-mono">{sellerFeeRate}%</span>
                </div>
                <input
                  type="range"
                  min="1.5"
                  max="4.0"
                  step="0.25"
                  value={sellerFeeRate}
                  onChange={e => setSellerFeeRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400 mt-1">
                  Collected from seller's title proceeds: ${calculatedSellerFee.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-300 uppercase">Buyer-Side Finder's Fee</label>
                  <span className="text-base font-bold text-indigo-400 font-mono">{buyerFeeRate}%</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.25"
                  value={buyerFeeRate}
                  onChange={e => setBuyerFeeRate(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="text-[11px] text-slate-400 mt-1">
                  Direct buyer acquisition fee: ${calculatedBuyerFee.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Right Output Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-8 space-y-6 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  Projected Platform Net Dual Take
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mt-3 font-mono tabular-nums">
                  ${totalCalculatedCommission.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  Based on a blended {(sellerFeeRate + buyerFeeRate).toFixed(2)}% dual-sided take across $
                  {(annualDealVolume / 1000000).toFixed(0)}M in bridged deal volume.
                </p>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-800 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Seller Gross Payout:</span>
                  <span className="font-mono">${(annualDealVolume - calculatedSellerFee).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Escrow Co-Broker Fee Spread:</span>
                  <span className="font-mono text-emerald-400 font-bold">${totalCalculatedCommission.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => onLaunchApp('buyerportal')}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Launch Deal Terminal with This Configuration</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. ENTERPRISE PRIVATE BRIEFING INTAKE                         */}
      {/* ============================================================== */}
      <section className="py-20 px-6 lg:px-12 border-b border-slate-800/80 bg-slate-900/40">
        <div className="max-w-4xl mx-auto space-y-8 text-center">
          <div className="space-y-3">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Confidential Access
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Request Private Allocation & Deal Room Briefing
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Join institutional funds, family offices, and verified property owners deploying through the Acuity Capital Bridge.
            </p>
          </div>

          {leadSubmitted ? (
            <div className="bg-emerald-950/40 border border-emerald-800 rounded-xl p-8 max-w-md mx-auto space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-lg font-bold text-white">Briefing Requested</h3>
              <p className="text-xs text-slate-300">
                Our managing partners have received your allocation inquiry. An institutional deal docket will be delivered within 4 business hours.
              </p>
              <button
                onClick={() => onLaunchApp('properties')}
                className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg"
              >
                Enter Sandbox While You Wait
              </button>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="max-w-md mx-auto space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={e => setLeadName(e.target.value)}
                  placeholder="e.g. Katherine Reynolds"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Institutional Work Email</label>
                <input
                  type="email"
                  required
                  value={leadEmail}
                  onChange={e => setLeadEmail(e.target.value)}
                  placeholder="name@funddomain.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Organization / Entity Name</label>
                <input
                  type="text"
                  required
                  value={leadOrg}
                  onChange={e => setLeadOrg(e.target.value)}
                  placeholder="e.g. Meridian Capital Partners"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Entity Role</label>
                <select
                  value={leadRole}
                  onChange={e => setLeadRole(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Institutional Buyer / Allocator">Institutional Buyer / Allocator</option>
                  <option value="Family Office CIO">Family Office CIO</option>
                  <option value="1031 Exchange Intermediary">1031 Exchange Intermediary</option>
                  <option value="Off-Market Property Owner / Sponsor">Off-Market Property Owner / Sponsor</option>
                  <option value="B2B Enterprise Sales Leader">B2B Enterprise Sales Leader</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                <span>Request Private Allocation Briefing</span>
                <Send className="w-3.5 h-3.5" />
              </button>

              <div className="text-[10px] text-slate-500 text-center">
                All inquiries handled under strict bilateral non-disclosure agreement.
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. INSTITUTIONAL FOOTER                                       */}
      {/* ============================================================== */}
      <footer className="py-12 px-6 lg:px-12 bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-white text-sm">Acuity Capital Intelligence</div>
            <div>Autonomous B2B Growth Platform & Commercial Real Estate Bridge Engine.</div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <button onClick={() => onLaunchApp('properties')} className="hover:text-white transition-colors">
              Properties & Rates (Zillow)
            </button>
            <button onClick={() => onLaunchApp('buyerportal')} className="hover:text-white transition-colors">
              Bridge Deal Room
            </button>
            <button onClick={() => onLaunchApp('prospects')} className="hover:text-white transition-colors">
              B2B Prospector
            </button>
            <button onClick={() => onLaunchApp('aisdr')} className="hover:text-white transition-colors">
              Autonomous AI SDR
            </button>
            <button onClick={() => onLaunchApp('deals')} className="hover:text-white transition-colors">
              Revenue Deals
            </button>
          </div>

          <div className="text-slate-500 text-center md:text-right">
            © 2026 Acuity Intelligence Inc. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ============================================================== */}
      {/* LOI MODAL PREVIEW                                              */}
      {/* ============================================================== */}
      {showLoiModal && arbitrationResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6 text-slate-900">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  AI Autonomous Letter of Intent (LOI) Generator
                </div>
                <h3 className="text-lg font-bold">Offer Docket: {arbitrationResult.propertyAddress}</h3>
              </div>
              <button
                onClick={() => setShowLoiModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs font-serif leading-relaxed">
              <div className="text-center pb-3 border-b border-slate-200 font-sans">
                <h4 className="font-bold text-sm uppercase text-slate-900">
                  NON-BINDING LETTER OF INTENT FOR REAL ESTATE PURCHASE
                </h4>
                <p className="text-[11px] text-slate-500">Autonomous Settlement Docket Ref: LOI-{Date.now()}</p>
              </div>

              <p>
                <strong>Date:</strong> {new Date().toLocaleDateString()}<br />
                <strong>Purchaser:</strong> {activeSimBuyer?.name} ({activeSimBuyer?.entityName})<br />
                <strong>Seller:</strong> {activeSimProp?.sellerContact.name} ({activeSimProp?.sellerContact.entity})<br />
                <strong>Subject Asset:</strong> {arbitrationResult.propertyAddress}
              </p>

              <div className="bg-slate-50 p-3.5 rounded border border-slate-200 font-sans space-y-1.5 text-[11px]">
                <div><strong>Purchase Price:</strong> ${arbitrationResult.clearingPriceRecommended.toLocaleString()}</div>
                <div><strong>Earnest Money Deposit:</strong> ${arbitrationResult.generatedLoiTerms.earnestMoneyDeposit.toLocaleString()} (Held in Title Escrow)</div>
                <div><strong>Due Diligence Period:</strong> {arbitrationResult.generatedLoiTerms.inspectionPeriodDays} Days</div>
                <div><strong>Closing Date:</strong> {arbitrationResult.generatedLoiTerms.closingDays} Days following expiration of Due Diligence</div>
                <div><strong>Intermediary Brokerage Fee:</strong> ${arbitrationResult.totalDualPlatformTakeUsd.toLocaleString()} (${arbitrationResult.sellerCommissionUsd.toLocaleString()} from Seller + ${arbitrationResult.buyerFinderFeeUsd.toLocaleString()} from Purchaser)</div>
              </div>

              <p>
                <strong>Underwriting Rationale:</strong> {arbitrationResult.aiUnderwritingThesis}
              </p>

              <p>
                <strong>Contingencies:</strong> {arbitrationResult.generatedLoiTerms.contingencies.join(', ')}.
              </p>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setShowLoiModal(false)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print LOI</span>
                </button>
                <button
                  onClick={() => {
                    setShowLoiModal(false);
                    onLaunchApp('buyerportal');
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <span>Open in Live Deal Room</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
