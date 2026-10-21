import React, { useState } from 'react';
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Send,
  Sparkles,
  Calculator,
  Search,
  Filter,
  ArrowRight,
  Clock,
  Layers,
  ChevronRight,
  Sliders,
  Percent,
  FileText,
  Handshake,
  Phone,
  Mail,
  Copy,
  Check,
  AlertTriangle,
  ArrowUpRight,
  MapPin,
  Download,
  Printer
} from 'lucide-react';
import type { BuyerProfile, SellerInquiry, PropertyListing, BridgeDeal } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface BuyerSellerPortalHubProps {
  onLogAction: (action: string, resource: string, details: string) => void;
  targetPropertyForMatch?: PropertyListing | null;
}

export const BuyerSellerPortalHub: React.FC<BuyerSellerPortalHubProps> = ({
  onLogAction,
  targetPropertyForMatch
}) => {
  const [activeTab, setActiveTab] = useState<'bridge' | 'buyers' | 'sellers' | 'calculator'>('bridge');

  // Properties list from storage
  const [allProperties, setAllProperties] = useState<PropertyListing[]>(() => AcuityStorage.getProperties());
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    targetPropertyForMatch?.id || allProperties[0]?.id || ''
  );

  // Bridge Deals state
  const [bridgeDeals, setBridgeDeals] = useState<BridgeDeal[]>(() => AcuityStorage.getBridgeDeals());
  const [activeContractDeal, setActiveContractDeal] = useState<BridgeDeal | null>(null);

  // Active Property selected for match
  const currentProperty =
    allProperties.find(p => p.id === selectedPropertyId) || targetPropertyForMatch || allProperties[0];

  // Selected buyer for bridge matching
  const [selectedBuyerId, setSelectedBuyerId] = useState<string>(
    currentProperty?.matchedBuyers[0]?.buyerId || 'buy-01'
  );

  // Commission sliders state
  const [bridgePrice, setBridgePrice] = useState<number>(
    currentProperty?.historicalRates?.suggestedTargetOfferPrice || currentProperty?.zestimate || 15000000
  );
  const [sellerFeePct, setSellerFeePct] = useState<number>(
    currentProperty?.sellerContact?.commissionAgreedPct || 2.5
  );
  const [buyerFeePct, setBuyerFeePct] = useState<number>(
    currentProperty?.matchedBuyers[0]?.buyFeeAgreedPct || 2.0
  );

  // Buyers state
  const [buyers, setBuyers] = useState<BuyerProfile[]>(() => AcuityStorage.getBuyers());
  const [buyerSearch, setBuyerSearch] = useState('');
  const [selectedBuyerType, setSelectedBuyerType] = useState('all');
  const [dispatchedDecks, setDispatchedDecks] = useState<Record<string, boolean>>({});

  // Sellers state
  const [sellerInquiries, setSellerInquiries] = useState<SellerInquiry[]>(() => AcuityStorage.getSellerInquiries());
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [sellerAddress, setSellerAddress] = useState('');
  const [sellerCityState, setSellerCityState] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [sellerAsking, setSellerAsking] = useState('8500000');
  const [sellerSqft, setSellerSqft] = useState('24000');
  const [sellerType, setSellerType] = useState('Commercial Office');
  const [sellerReason, setSellerReason] = useState('Retiring / Liquidating real estate portfolio');
  const [sellerTimeline, setSellerTimeline] = useState<'Immediate (14-30 days cash)' | '60-90 days' | 'Flexible'>('Immediate (14-30 days cash)');

  // Dialer & Copy states
  const [callingEntity, setCallingEntity] = useState<string | null>(null);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Deal Underwriting Calculator State
  const [calcPrice, setCalcPrice] = useState<number>(12500000);
  const [calcDownPct, setCalcDownPct] = useState<number>(30); // 30%
  const [calcInterestRate, setCalcInterestRate] = useState<number>(6.5); // 6.5%
  const [calcAmortYears, setCalcAmortYears] = useState<number>(25);
  const [calcGrossRent, setCalcGrossRent] = useState<number>(1450000); // $1.45M gross
  const [calcOpexRatio, setCalcOpexRatio] = useState<number>(38); // 38%

  // Calculator math
  const downPayment = (calcPrice * calcDownPct) / 100;
  const loanAmount = calcPrice - downPayment;
  const monthlyRate = calcInterestRate / 100 / 12;
  const totalMonths = calcAmortYears * 12;
  const monthlyPayment =
    loanAmount > 0 && monthlyRate > 0
      ? (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths))) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
      : 0;
  const annualDebtService = monthlyPayment * 12;
  const operatingExpenses = (calcGrossRent * calcOpexRatio) / 100;
  const netOperatingIncome = calcGrossRent - operatingExpenses;
  const cashFlowBeforeTaxes = netOperatingIncome - annualDebtService;
  const capRate = ((netOperatingIncome / calcPrice) * 100).toFixed(2);
  const cashOnCash = downPayment > 0 ? ((cashFlowBeforeTaxes / downPayment) * 100).toFixed(2) : '0';
  const dscr = annualDebtService > 0 ? (netOperatingIncome / annualDebtService).toFixed(2) : 'N/A';

  // Dual Commission Calculations
  const sellerCommissionDollar = (bridgePrice * sellerFeePct) / 100;
  const buyerCommissionDollar = (bridgePrice * buyerFeePct) / 100;
  const totalBridgeCommission = sellerCommissionDollar + buyerCommissionDollar;

  // Selected buyer object
  const currentBuyer = buyers.find(b => b.id === selectedBuyerId) || buyers[0];

  const handleDispatchDeck = (buyerId: string, buyerName: string) => {
    setDispatchedDecks(prev => ({ ...prev, [buyerId]: true }));
    onLogAction('Dispatched Off-Market Deal Deck', 'DealRoom', `Sent confidential teaser to ${buyerName}`);
  };

  const handleSimulateCall = (name: string, phone: string, role: string) => {
    setCallingEntity(`${name} (${role})`);
    onLogAction('Bridge Dialer Connected', 'Telephony', `Connecting dual-sided bridge call to ${name} at ${phone}`);
    setTimeout(() => setCallingEntity(null), 3500);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(label);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Create and Save a new Bridge Deal
  const handleCreateBridgeDeal = () => {
    if (!currentProperty || !currentBuyer) return;

    const newDeal: BridgeDeal = {
      id: `bridge-${Date.now()}`,
      propertyId: currentProperty.id,
      propertyAddress: `${currentProperty.address}, ${currentProperty.city}, ${currentProperty.state}`,
      propertyType: currentProperty.propertyType,
      searchArea: currentProperty.searchArea,
      imageUrl: currentProperty.imageUrl,
      sellerName: currentProperty.sellerContact.name,
      sellerEntity: currentProperty.sellerContact.entity,
      sellerPhone: currentProperty.sellerContact.phone,
      sellerEmail: currentProperty.sellerContact.email,
      sellerCommissionPct: sellerFeePct,
      buyerId: currentBuyer.id,
      buyerName: currentBuyer.name,
      buyerEntity: currentBuyer.entityName,
      buyerContactName: currentBuyer.name + ' Acquisitions Lead',
      buyerPhone: currentBuyer.contactPhone,
      buyerEmail: currentBuyer.contactEmail,
      buyerCommissionPct: buyerFeePct,
      agreedPrice: bridgePrice,
      sellerCommissionFee: sellerCommissionDollar,
      buyerCommissionFee: buyerCommissionDollar,
      totalCommission: totalBridgeCommission,
      oldRatePerSqFt: currentProperty.historicalRates.oldPricePerSqFt,
      suggestedRatePerSqFt: Math.round(bridgePrice / currentProperty.squareFeet),
      dealStatus: 'Dual Agreements Out for Signature',
      createdAt: new Date().toISOString(),
      targetCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      escrowRef: `ESC-${currentProperty.state}-${Math.floor(10000 + Math.random() * 90000)}-DUAL`
    };

    AcuityStorage.saveBridgeDeal(newDeal);
    setBridgeDeals(prev => [newDeal, ...prev]);
    setActiveContractDeal(newDeal);
    onLogAction(
      'Executed Dual Commission Bridge Match',
      'BridgeExchange',
      `Bridged ${currentProperty.address} with ${currentBuyer.name} — $${totalBridgeCommission.toLocaleString()} Commission Secured`
    );
  };

  const handleAdvanceDealStatus = (dealId: string, currentStatus: BridgeDeal['dealStatus']) => {
    let nextStatus: BridgeDeal['dealStatus'] = 'Dual Agreements Out for Signature';
    if (currentStatus === 'Bridge Match Discovered') nextStatus = 'Dual Agreements Out for Signature';
    else if (currentStatus === 'Dual Agreements Out for Signature') nextStatus = 'LOI / Underwriting';
    else if (currentStatus === 'LOI / Underwriting') nextStatus = 'In Escrow';
    else if (currentStatus === 'In Escrow') nextStatus = 'Closed & Commission Distributed';

    AcuityStorage.updateBridgeDealStatus(dealId, nextStatus);
    setBridgeDeals(AcuityStorage.getBridgeDeals());
    onLogAction('Advanced Bridge Deal Pipeline', 'BridgeExchange', `Updated ${dealId} to ${nextStatus}`);
  };

  const handleNewSellerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerAddress || !sellerName || !sellerEmail) return;

    const asking = parseFloat(sellerAsking) || 5000000;
    const sqft = parseFloat(sellerSqft) || 20000;
    const estimatedZestimate = Math.round(sqft * 380 * 1.05);

    const newInquiry: SellerInquiry = {
      id: `sell-${Date.now()}`,
      propertyAddress: sellerAddress,
      cityStateZip: sellerCityState || 'Austin, TX 78701',
      sellerName,
      sellerEmail,
      sellerPhone: sellerPhone || '+1 (555) 392-1100',
      askingPrice: asking,
      estimatedZestimate,
      timeline: sellerTimeline,
      reasonForSelling: sellerReason,
      propertyType: sellerType,
      submittedAt: new Date().toISOString(),
      status: 'Matched to 4 Buyers'
    };

    AcuityStorage.saveSellerInquiry(newInquiry);
    setSellerInquiries(prev => [newInquiry, ...prev]);
    setShowSellerForm(false);
    onLogAction('Submitted Seller Intake & Instant Valuation', 'SellerPortal', `${sellerAddress} ($${(asking / 1000000).toFixed(1)}M)`);

    setSellerAddress('');
    setSellerCityState('');
    setSellerName('');
    setSellerEmail('');
    setSellerPhone('');
  };

  const filteredBuyers = buyers.filter(b => {
    const matchesSearch =
      b.name.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.entityName.toLowerCase().includes(buyerSearch.toLowerCase()) ||
      b.targetMarkets.some(m => m.toLowerCase().includes(buyerSearch.toLowerCase())) ||
      b.targetAssetClasses.some(a => a.toLowerCase().includes(buyerSearch.toLowerCase()));

    const matchesType = selectedBuyerType === 'all' || b.buyerType === selectedBuyerType;
    return matchesSearch && matchesType;
  });

  const totalCapturedCommissionRevenue = bridgeDeals.reduce((sum, d) => sum + d.totalCommission, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white shadow-sm border border-indigo-900/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-indigo-500/30 flex items-center gap-1">
                <Handshake className="w-3.5 h-3.5" />
                Autonomous Bridge Engine & Commission Split
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Dual-Sided Payout: Collect from Both Parties
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Dual-Party Bridge Engine & Deal Exchange
            </h1>
            <p className="text-indigo-200/80 text-sm mt-1 max-w-2xl leading-relaxed">
              We create the bridge: our algorithmic engine discovers off-market and MLS properties, calculates old vs. suggested rates, connects sellers with qualified institutional buyers, and collects dual commissions from both sides upon escrow closing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-indigo-900/60 border border-indigo-700/60 rounded-lg p-2.5 text-center min-w-[150px]">
              <div className="text-[10px] text-indigo-300 uppercase font-semibold">Total Bridge Fee Pipeline</div>
              <div className="text-lg font-bold text-emerald-400">
                ${(totalCapturedCommissionRevenue / 1000000).toFixed(2)}M
              </div>
              <div className="text-[10px] text-indigo-300">Dual Seller & Buyer Payouts</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-indigo-900/80">
          <button
            onClick={() => setActiveTab('bridge')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'bridge'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Handshake className="w-3.5 h-3.5" />
            Bridge Matchmaker & Dual Commissions ({bridgeDeals.length})
          </button>

          <button
            onClick={() => setActiveTab('buyers')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'buyers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Verified Buyer Network ({buyers.length})
          </button>

          <button
            onClick={() => setActiveTab('sellers')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'sellers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Motivated Seller Intake & Leads ({sellerInquiries.length})
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              activeTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Interactive Deal Underwriter (NOI & DSCR)
          </button>
        </div>
      </div>

      {/* Simulated Call Notification */}
      {callingEntity && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-emerald-500 flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center animate-pulse">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-semibold uppercase">Dialing Bridge Match...</div>
            <div className="text-sm font-bold text-white">{callingEntity}</div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: BRIDGE MATCHMAKER & DUAL COMMISSIONS                      */}
      {/* ============================================================== */}
      {activeTab === 'bridge' && (
        <div className="space-y-6">
          {/* Section 1: Interactive Bridge Coordinator */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Handshake className="w-5 h-5 text-emerald-600" />
                  Bridge Match Coordinator: Select Property to Bridge
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Connect seller with matching institutional capital and collect fee from both sides
                </p>
              </div>

              {/* Property Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Select Property:</span>
                <select
                  value={selectedPropertyId}
                  onChange={e => {
                    const id = e.target.value;
                    setSelectedPropertyId(id);
                    const prop = allProperties.find(p => p.id === id);
                    if (prop) {
                      setBridgePrice(prop.historicalRates.suggestedTargetOfferPrice || prop.zestimate);
                      setSellerFeePct(prop.sellerContact.commissionAgreedPct || 2.5);
                    }
                  }}
                  className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {allProperties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.address} ({p.city}, {p.state}) — ${(p.zestimate / 1000000).toFixed(1)}M
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {currentProperty && (
              <div className="space-y-6">
                {/* 3-Column Bridge Architecture: Property Rates | Seller Side | Buyer Side */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Column 1: Property Rates (Old vs Suggested) */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="relative h-32 rounded-lg overflow-hidden mb-3">
                        <img
                          src={currentProperty.imageUrl}
                          alt={currentProperty.address}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded backdrop-blur-sm">
                          {currentProperty.propertyType}
                        </div>
                        <div className="absolute bottom-2 left-2 bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-sm">
                          Zestimate: ${(currentProperty.zestimate / 1000000).toFixed(2)}M
                        </div>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm">{currentProperty.address}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {currentProperty.city}, {currentProperty.state} · {currentProperty.searchArea}
                        </p>
                      </div>

                      {/* Rates Breakdown */}
                      <div className="mt-4 space-y-2 pt-3 border-t border-slate-200 text-xs">
                        <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                          <span className="text-slate-500 font-medium">Old Deed Purchase Rate:</span>
                          <span className="font-bold text-slate-800">
                            ${currentProperty.historicalRates.oldPricePerSqFt}/sqft{' '}
                            <span className="text-[10px] text-slate-400">
                              (${(currentProperty.historicalRates.oldSalePrice / 1000000).toFixed(1)}M)
                            </span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
                          <span className="text-slate-500 font-medium">Current Market Rate (AVM):</span>
                          <span className="font-bold text-slate-900">${currentProperty.pricePerSqFt}/sqft</span>
                        </div>
                        <div className="flex justify-between items-center bg-emerald-50 p-2 rounded border border-emerald-200">
                          <span className="text-emerald-800 font-bold">Suggested Target Buy Rate:</span>
                          <span className="font-bold text-emerald-700">
                            ${currentProperty.historicalRates.suggestedTargetRatePerSqFt}/sqft{' '}
                            <span className="text-[10px] text-emerald-600">
                              (${(currentProperty.historicalRates.suggestedTargetOfferPrice / 1000000).toFixed(1)}M)
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 bg-white p-2.5 rounded border border-slate-200">
                      <strong>AI Suggestion Note:</strong> {currentProperty.historicalRates.rateRecommendationReasoning}
                    </div>
                  </div>

                  {/* Column 2: Seller Side Contact & Commission */}
                  <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-amber-700" />
                          Seller Principal & Entity
                        </span>
                        <span className="text-[11px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                          Seller Fee: {sellerFeePct}%
                        </span>
                      </div>

                      <div className="bg-white p-3 rounded-lg border border-amber-200/80 space-y-2 text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Primary Contact</div>
                          <div className="font-bold text-slate-900 text-sm">
                            {currentProperty.sellerContact.name}
                          </div>
                          <div className="text-slate-600">{currentProperty.sellerContact.role}</div>
                        </div>

                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Holding Entity</div>
                          <div className="font-semibold text-slate-800">{currentProperty.sellerContact.entity}</div>
                        </div>

                        <div className="space-y-1 pt-1 font-mono text-slate-700">
                          <div className="flex items-center justify-between">
                            <span>{currentProperty.sellerContact.phone}</span>
                            <div className="flex items-center gap-1 font-sans">
                              <button
                                onClick={() =>
                                  handleSimulateCall(
                                    currentProperty.sellerContact.name,
                                    currentProperty.sellerContact.phone,
                                    'Seller'
                                  )
                                }
                                className="p-1 text-slate-600 hover:text-emerald-600 rounded hover:bg-slate-100"
                                title="Call Seller"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCopy(currentProperty.sellerContact.phone, 'seller-phone')}
                                className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100"
                                title="Copy Phone"
                              >
                                {copiedItem === 'seller-phone' ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between truncate">
                            <span className="truncate">{currentProperty.sellerContact.email}</span>
                            <button
                              onClick={() => handleCopy(currentProperty.sellerContact.email, 'seller-email')}
                              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 font-sans"
                              title="Copy Email"
                            >
                              {copiedItem === 'seller-email' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900">
                          <strong>Motivation:</strong> {currentProperty.sellerContact.motivation}
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-100/70 p-2.5 rounded-lg border border-amber-300/80 flex items-center justify-between text-xs">
                      <span className="text-amber-900 font-semibold">Seller Commission Yield:</span>
                      <span className="font-bold text-amber-950 text-sm">
                        ${sellerCommissionDollar.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Column 3: Buyer Side Contact & Finder Fee */}
                  <div className="bg-indigo-50/60 border border-indigo-200 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                          <Users className="w-4 h-4 text-indigo-700" />
                          Institutional Buyer Lead
                        </span>
                        <span className="text-[11px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">
                          Buyer Fee: {buyerFeePct}%
                        </span>
                      </div>

                      {/* Buyer Selector */}
                      <select
                        value={selectedBuyerId}
                        onChange={e => setSelectedBuyerId(e.target.value)}
                        className="w-full text-xs border border-indigo-200 rounded-lg p-2 bg-white font-bold text-slate-800 mb-2 focus:ring-2 focus:ring-indigo-500"
                      >
                        {buyers.map(b => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.buyerType})
                          </option>
                        ))}
                      </select>

                      <div className="bg-white p-3 rounded-lg border border-indigo-200/80 space-y-2 text-xs">
                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Acquisitions Principal</div>
                          <div className="font-bold text-slate-900 text-sm">{currentBuyer.name}</div>
                          <div className="text-slate-600">{currentBuyer.entityName}</div>
                        </div>

                        <div>
                          <div className="text-[10px] text-slate-400 font-semibold uppercase">Verified Proof of Funds</div>
                          <div className="font-medium text-emerald-700">{currentBuyer.verifiedFundsProof}</div>
                        </div>

                        <div className="space-y-1 pt-1 font-mono text-slate-700">
                          <div className="flex items-center justify-between">
                            <span>{currentBuyer.contactPhone}</span>
                            <div className="flex items-center gap-1 font-sans">
                              <button
                                onClick={() => handleSimulateCall(currentBuyer.name, currentBuyer.contactPhone, 'Buyer')}
                                className="p-1 text-slate-600 hover:text-emerald-600 rounded hover:bg-slate-100"
                                title="Call Buyer"
                              >
                                <Phone className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleCopy(currentBuyer.contactPhone, 'buyer-phone')}
                                className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100"
                                title="Copy Phone"
                              >
                                {copiedItem === 'buyer-phone' ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center justify-between truncate">
                            <span className="truncate">{currentBuyer.contactEmail}</span>
                            <button
                              onClick={() => handleCopy(currentBuyer.contactEmail, 'buyer-email')}
                              className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 font-sans"
                              title="Copy Email"
                            >
                              {copiedItem === 'buyer-email' ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="p-2 bg-indigo-50 rounded border border-indigo-200 text-[11px] text-indigo-900">
                          <strong>Active Buy Box:</strong> {currentBuyer.activeBuyBoxDescription}
                        </div>
                      </div>
                    </div>

                    <div className="bg-indigo-100/70 p-2.5 rounded-lg border border-indigo-300/80 flex items-center justify-between text-xs">
                      <span className="text-indigo-900 font-semibold">Buyer Finder Fee Yield:</span>
                      <span className="font-bold text-indigo-950 text-sm">
                        ${buyerCommissionDollar.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Live Dual Commission Calculator & Bridge Agreement Trigger */}
                <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-xl p-6 text-white space-y-5 shadow-lg border border-indigo-800/60">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-indigo-900 pb-4">
                    <div>
                      <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1.5">
                        <Handshake className="w-4 h-4 text-amber-400" />
                        Dual-Sided Commission Capture Engine
                      </div>
                      <h4 className="text-xl font-bold mt-0.5">
                        Total Dual Fee: ${(totalBridgeCommission).toLocaleString()}
                      </h4>
                      <p className="text-xs text-slate-300">
                        Commission collected simultaneously from Seller ({sellerFeePct}%) and Buyer ({buyerFeePct}%)
                      </p>
                    </div>

                    <button
                      onClick={handleCreateBridgeDeal}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95"
                    >
                      <Handshake className="w-4 h-4" />
                      Generate Bridge Agreement & Send to Escrow
                    </button>
                  </div>

                  {/* Interactive Sliders */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    <div>
                      <label className="text-slate-300 font-medium block mb-1.5">
                        Agreed Purchase Price ($)
                      </label>
                      <input
                        type="number"
                        value={bridgePrice}
                        onChange={e => setBridgePrice(Number(e.target.value) || 0)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="text-[11px] text-slate-400 mt-1">
                        Est. ${Math.round(bridgePrice / (currentProperty.squareFeet || 1))}/sqft
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-slate-300 font-medium">Seller Commission: {sellerFeePct}%</label>
                        <span className="text-amber-300 font-bold font-mono">
                          ${sellerCommissionDollar.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="4"
                        step="0.25"
                        value={sellerFeePct}
                        onChange={e => setSellerFeePct(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                      <div className="text-[11px] text-slate-400 mt-1">Deducted from seller proceeds at escrow close</div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-slate-300 font-medium">Buyer Finder Fee: {buyerFeePct}%</label>
                        <span className="text-indigo-300 font-bold font-mono">
                          ${buyerCommissionDollar.toLocaleString()}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.25"
                        value={buyerFeePct}
                        onChange={e => setBuyerFeePct(Number(e.target.value))}
                        className="w-full accent-indigo-500 cursor-pointer"
                      />
                      <div className="text-[11px] text-slate-400 mt-1">Direct wire to bridge escrow account</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Active Bridge Deals Pipeline & Escrow Ledger */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Handshake className="w-4 h-4 text-emerald-600" />
                  Active Bridge Deals & Escrow Pipeline ({bridgeDeals.length})
                </h3>
                <p className="text-xs text-slate-500">
                  Live tracking of properties bridged between verified sellers and institutional buyers
                </p>
              </div>

              <div className="text-xs text-slate-500">
                Total Bridge Revenue: <strong className="text-emerald-700 font-bold">${totalCapturedCommissionRevenue.toLocaleString()}</strong>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {bridgeDeals.map(deal => (
                <div key={deal.id} className="p-5 hover:bg-slate-50 transition-colors space-y-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <img
                        src={deal.imageUrl}
                        alt={deal.propertyAddress}
                        className="w-20 h-20 object-cover rounded-xl border border-slate-200 shadow-sm"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-slate-900 text-sm">{deal.propertyAddress}</span>
                          <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded">
                            {deal.propertyType}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              deal.dealStatus === 'In Escrow'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : deal.dealStatus === 'Closed & Commission Distributed'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                            }`}
                          >
                            {deal.dealStatus}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 flex items-center gap-4 flex-wrap">
                          <span>
                            <strong>Agreed Price:</strong> ${(deal.agreedPrice / 1000000).toFixed(2)}M
                          </span>
                          <span>
                            <strong>Rate:</strong> ${deal.suggestedRatePerSqFt}/sqft (Old: ${deal.oldRatePerSqFt}/sqft)
                          </span>
                          <span>
                            <strong>Escrow Ref:</strong> <span className="font-mono">{deal.escrowRef}</span>
                          </span>
                        </div>

                        {/* Two Parties Quick Readout */}
                        <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                          <div className="bg-amber-50 p-2 rounded border border-amber-200/60">
                            <div className="text-[10px] font-semibold text-amber-900 uppercase">Seller</div>
                            <div className="font-bold text-slate-800">{deal.sellerName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{deal.sellerPhone}</div>
                            <div className="text-[11px] text-amber-800 font-semibold mt-0.5">
                              Fee: ${deal.sellerCommissionFee.toLocaleString()} ({deal.sellerCommissionPct}%)
                            </div>
                          </div>

                          <div className="bg-indigo-50 p-2 rounded border border-indigo-200/60">
                            <div className="text-[10px] font-semibold text-indigo-900 uppercase">Buyer</div>
                            <div className="font-bold text-slate-800">{deal.buyerName}</div>
                            <div className="text-[11px] text-slate-500 font-mono">{deal.buyerPhone}</div>
                            <div className="text-[11px] text-indigo-800 font-semibold mt-0.5">
                              Fee: ${deal.buyerCommissionFee.toLocaleString()} ({deal.buyerCommissionPct}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Action Stack */}
                    <div className="flex flex-col lg:items-end justify-between gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Total Dual Commission</div>
                        <div className="text-xl font-bold text-emerald-600">
                          ${deal.totalCommission.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setActiveContractDeal(deal)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          View Agreement
                        </button>

                        <button
                          onClick={() => handleAdvanceDealStatus(deal.id, deal.dealStatus)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                        >
                          Advance Stage
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* LEGAL AGREEMENT MODAL PREVIEW */}
          {activeContractDeal && (
            <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
                <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                      Dual-Party Brokerage & Co-Broker Commission Agreement
                    </div>
                    <h2 className="text-lg font-bold">Escrow Reference: {activeContractDeal.escrowRef}</h2>
                  </div>
                  <button
                    onClick={() => setActiveContractDeal(null)}
                    className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto font-serif text-slate-800 text-xs leading-relaxed">
                  <div className="text-center pb-4 border-b border-slate-200">
                    <h3 className="text-base font-bold uppercase tracking-widest text-slate-900 font-sans">
                      CONFIDENTIAL DUAL REPRESENTATION & FEE ESCROW CONTRACT
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans mt-1">
                      Executed pursuant to Commercial Real Estate Intermediary Rules
                    </p>
                  </div>

                  <p>
                    <strong>THIS AGREEMENT</strong> is made as of{' '}
                    <strong>{activeContractDeal.createdAt.split('T')[0]}</strong>, by and between{' '}
                    <strong>{activeContractDeal.sellerName}</strong> representing{' '}
                    <em>{activeContractDeal.sellerEntity}</em> ("Seller"),{' '}
                    <strong>{activeContractDeal.buyerName}</strong> ("Buyer"), and{' '}
                    <strong>Acuity Real Estate Bridge Engine</strong> ("Transaction Broker / Intermediary").
                  </p>

                  <div className="bg-slate-50 p-4 rounded border border-slate-200 font-sans space-y-2">
                    <div className="font-bold text-slate-900 text-xs uppercase">Deal Terms & Subject Asset</div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div>
                        <strong>Subject Property:</strong> {activeContractDeal.propertyAddress}
                      </div>
                      <div>
                        <strong>Agreed Purchase Price:</strong> ${activeContractDeal.agreedPrice.toLocaleString()}
                      </div>
                      <div>
                        <strong>Old Deed Rate:</strong> ${activeContractDeal.oldRatePerSqFt}/sqft
                      </div>
                      <div>
                        <strong>Suggested Target Rate:</strong> ${activeContractDeal.suggestedRatePerSqFt}/sqft
                      </div>
                      <div>
                        <strong>Seller Commission ({activeContractDeal.sellerCommissionPct}%):</strong> $
                        {activeContractDeal.sellerCommissionFee.toLocaleString()}
                      </div>
                      <div>
                        <strong>Buyer Finder Fee ({activeContractDeal.buyerCommissionPct}%):</strong> $
                        {activeContractDeal.buyerCommissionFee.toLocaleString()}
                      </div>
                      <div className="col-span-2 pt-1 font-bold text-emerald-700 text-xs">
                        Total Dual Commission Payable to Bridge Platform: $
                        {activeContractDeal.totalCommission.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <p>
                    <strong>1. Dual Representation Disclosure:</strong> Both Seller and Buyer acknowledge and consent that
                    the Intermediary acts as a neutral transaction coordinator and bridge engine, and is entitled to receive
                    a dual-sided commission consisting of {activeContractDeal.sellerCommissionPct}% from Seller's closing
                    proceeds and {activeContractDeal.buyerCommissionPct}% from Buyer's acquisition funds.
                  </p>

                  <p>
                    <strong>2. Escrow Instruction:</strong> The Title Company & Closing Officer is irrevocably instructed
                    to disburse the sum of ${activeContractDeal.totalCommission.toLocaleString()} directly from escrow funds
                    to Acuity Intermediary Escrow upon conveyance of title on or before{' '}
                    {activeContractDeal.targetCloseDate}.
                  </p>

                  {/* Signature Blocks */}
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-200 font-sans text-xs">
                    <div className="space-y-3">
                      <div className="font-bold text-slate-800">SELLER:</div>
                      <div className="h-10 border-b border-slate-400 flex items-end pb-1 font-mono text-indigo-700 italic">
                        {activeContractDeal.sellerName} (Digital Signature)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {activeContractDeal.sellerEntity} · Verified Direct Dial: {activeContractDeal.sellerPhone}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="font-bold text-slate-800">BUYER:</div>
                      <div className="h-10 border-b border-slate-400 flex items-end pb-1 font-mono text-emerald-700 italic">
                        {activeContractDeal.buyerName} (Digital Signature)
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Acquisitions Principal · Verified Dial: {activeContractDeal.buyerPhone}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    onClick={() => setActiveContractDeal(null)}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Close
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        window.print();
                        onLogAction('Printed Bridge Representation Agreement', 'Legal', activeContractDeal.escrowRef);
                      }}
                      className="px-3.5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Print
                    </button>
                    <button
                      onClick={() => {
                        handleCopy(
                          JSON.stringify(activeContractDeal, null, 2),
                          `contract-${activeContractDeal.id}`
                        );
                        onLogAction('Exported Escrow Agreement JSON', 'Legal', activeContractDeal.escrowRef);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Export Escrow Dossier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: VERIFIED BUYERS DIRECTORY                                */}
      {/* ============================================================== */}
      {activeTab === 'buyers' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={buyerSearch}
                onChange={e => setBuyerSearch(e.target.value)}
                placeholder="Search buyers by fund name, asset class, or target markets..."
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                <Filter className="w-3.5 h-3.5" />
                Type:
              </div>
              <select
                value={selectedBuyerType}
                onChange={e => setSelectedBuyerType(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 font-medium focus:outline-none"
              >
                <option value="all">All Buyer Classes</option>
                <option value="Institutional Private Equity">Institutional Private Equity</option>
                <option value="Family Office">Family Office</option>
                <option value="1031 Exchange Buyer">1031 Exchange Buyer</option>
                <option value="Value-Add Syndicator">Value-Add Syndicator</option>
              </select>
            </div>
          </div>

          {/* Buyers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredBuyers.map(buyer => {
              const isDeckSent = !!dispatchedDecks[buyer.id];

              return (
                <div
                  key={buyer.id}
                  className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base">{buyer.name}</h3>
                          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/80 px-2 py-0.5 rounded-full font-semibold">
                            {buyer.buyerType}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{buyer.entityName}</p>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-semibold text-emerald-600">
                          ${(buyer.minBudget / 1000000).toFixed(0)}M - ${(buyer.maxBudget / 1000000).toFixed(0)}M
                        </div>
                        <div className="text-[10px] text-slate-400">Capital Allocation</div>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 flex items-center gap-2 text-xs text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-medium text-[11px] truncate">{buyer.verifiedFundsProof}</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-700">Target Asset Classes:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {buyer.targetAssetClasses.map(a => (
                            <span key={a} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-700">Focus Metro Areas:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {buyer.targetMarkets.map(m => (
                            <span key={m} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 rounded text-slate-600 text-[11px]">
                        <strong>Active Buy Box:</strong> {buyer.activeBuyBoxDescription}
                      </div>

                      <div className="border-t border-slate-100 pt-2 font-mono text-slate-700 flex items-center justify-between">
                        <span>{buyer.contactPhone}</span>
                        <span className="truncate max-w-[180px]">{buyer.contactEmail}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between">
                    <div className="text-xs text-slate-500">
                      Closing Timeline: <strong className="text-slate-800">{buyer.closingTimelineDays} days</strong>
                    </div>

                    <button
                      onClick={() => handleDispatchDeck(buyer.id, buyer.name)}
                      disabled={isDeckSent}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm ${
                        isDeckSent
                          ? 'bg-emerald-100 text-emerald-800 cursor-default'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }`}
                    >
                      {isDeckSent ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Teaser Sent
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          Dispatch Teaser Deck
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: MOTIVATED SELLER INTAKE & INQUIRIES                      */}
      {/* ============================================================== */}
      {activeTab === 'sellers' && (
        <div className="space-y-6">
          {showSellerForm && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">Direct-from-Owner Seller Intake</h3>
                  <p className="text-xs text-slate-500">
                    Instant algorithmic AVM valuation and syndication to pre-qualified buyers
                  </p>
                </div>
                <button onClick={() => setShowSellerForm(false)} className="text-xs text-slate-400 hover:text-slate-600">
                  Cancel
                </button>
              </div>

              <form onSubmit={handleNewSellerSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Property Address</label>
                    <input
                      type="text"
                      required
                      value={sellerAddress}
                      onChange={e => setSellerAddress(e.target.value)}
                      placeholder="e.g. 500 E 4th St"
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City, State & Zip</label>
                    <input
                      type="text"
                      required
                      value={sellerCityState}
                      onChange={e => setSellerCityState(e.target.value)}
                      placeholder="e.g. Austin, TX 78701"
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner / Principal Name</label>
                    <input
                      type="text"
                      required
                      value={sellerName}
                      onChange={e => setSellerName(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Direct Email</label>
                    <input
                      type="email"
                      required
                      value={sellerEmail}
                      onChange={e => setSellerEmail(e.target.value)}
                      placeholder="owner@domain.com"
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Cell / Direct Dial</label>
                    <input
                      type="text"
                      value={sellerPhone}
                      onChange={e => setSellerPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Asking Price ($)</label>
                    <input
                      type="number"
                      value={sellerAsking}
                      onChange={e => setSellerAsking(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Square Feet</label>
                    <input
                      type="number"
                      value={sellerSqft}
                      onChange={e => setSellerSqft(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Property Type</label>
                    <select
                      value={sellerType}
                      onChange={e => setSellerType(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Commercial Office">Commercial Office</option>
                      <option value="Multifamily (5+ Units)">Multifamily (5+ Units)</option>
                      <option value="Industrial Warehouse">Industrial Warehouse</option>
                      <option value="Retail & Mixed Use">Retail & Mixed Use</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Calculate Zestimate & Syndicate Deal
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Seller Inquiries List */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Active Seller Inquiries & Motivated Leads</h3>
                <p className="text-xs text-slate-500">
                  Off-market sellers seeking liquidity or non-contingent buyer matches
                </p>
              </div>

              {!showSellerForm && (
                <button
                  onClick={() => setShowSellerForm(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Off-Market Lead
                </button>
              )}
            </div>

            <div className="divide-y divide-slate-100">
              {sellerInquiries.map(inquiry => (
                <div
                  key={inquiry.id}
                  className="p-5 hover:bg-slate-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{inquiry.propertyAddress}</span>
                      <span className="text-xs text-slate-500">· {inquiry.cityStateZip}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded">
                        {inquiry.propertyType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600">
                      <span className="font-semibold text-slate-800">Motivation:</span> {inquiry.reasonForSelling}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>
                        Seller: <strong className="text-slate-700">{inquiry.sellerName}</strong> ({inquiry.sellerPhone})
                      </span>
                      <span>Timeline: {inquiry.timeline}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Asking Price</div>
                      <div className="text-sm font-bold text-slate-900">
                        ${(inquiry.askingPrice / 1000000).toFixed(2)}M
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('bridge');
                      }}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Handshake className="w-3.5 h-3.5" />
                      Bridge to Buyers
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB: DEAL UNDERWRITER (NOI & DSCR)                             */}
      {/* ============================================================== */}
      {activeTab === 'calculator' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-indigo-600" />
              Institutional Financial Underwriter & Levered Yield Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Run real-time debt service coverage ratio (DSCR), levered cash-on-cash yield, and loan amortization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Acquisition Price: ${(calcPrice / 1000000).toFixed(2)}M
                </label>
                <input
                  type="number"
                  value={calcPrice}
                  onChange={e => setCalcPrice(Number(e.target.value) || 0)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Down Payment: {calcDownPct}% (${(downPayment / 1000000).toFixed(2)}M equity)
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={calcDownPct}
                  onChange={e => setCalcDownPct(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Interest Rate: {calcInterestRate}%
                </label>
                <input
                  type="range"
                  min="4.0"
                  max="10.0"
                  step="0.1"
                  value={calcInterestRate}
                  onChange={e => setCalcInterestRate(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Amortization Period: {calcAmortYears} Years
                </label>
                <input
                  type="number"
                  value={calcAmortYears}
                  onChange={e => setCalcAmortYears(Number(e.target.value))}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Projected Annual Gross Revenue: ${(calcGrossRent / 1000).toFixed(0)}k/yr
                </label>
                <input
                  type="number"
                  value={calcGrossRent}
                  onChange={e => setCalcGrossRent(Number(e.target.value) || 0)}
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Operating Expense Ratio: {calcOpexRatio}% (${(operatingExpenses / 1000).toFixed(0)}k/yr)
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={calcOpexRatio}
                  onChange={e => setCalcOpexRatio(Number(e.target.value))}
                  className="w-full accent-indigo-600"
                />
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Loan Amount:</span>
                  <span className="font-bold text-slate-800">${loanAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Monthly Debt Service:</span>
                  <span className="font-bold text-slate-800">${Math.round(monthlyPayment).toLocaleString()}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Annual Debt Service:</span>
                  <span className="font-bold text-slate-800">${Math.round(annualDebtService).toLocaleString()}/yr</span>
                </div>
              </div>
            </div>

            {/* Metrics Output Card */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl p-6 text-white flex flex-col justify-between shadow-md">
              <div>
                <div className="text-xs text-indigo-300 uppercase font-semibold">Underwritten Pro-Forma Results</div>
                <div className="mt-4 space-y-4">
                  <div>
                    <div className="text-[11px] text-slate-400">Net Operating Income (NOI)</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      ${Math.round(netOperatingIncome).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <div className="text-[10px] text-slate-400">Cap Rate</div>
                      <div className="text-lg font-bold text-white">{capRate}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Cash-on-Cash Return</div>
                      <div className="text-lg font-bold text-emerald-400">{cashOnCash}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">DSCR Ratio</div>
                      <div
                        className={`text-lg font-bold ${
                          Number(dscr) >= 1.25 ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {dscr}x
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Pre-Tax Cash Flow</div>
                      <div className="text-lg font-bold text-white">
                        ${Math.round(cashFlowBeforeTaxes / 1000).toLocaleString()}k/yr
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-300">
                {Number(dscr) >= 1.25 ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Meets institutional debt underwriting thresholds
                  </span>
                ) : (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Tight DSCR coverage; consider higher down payment
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
