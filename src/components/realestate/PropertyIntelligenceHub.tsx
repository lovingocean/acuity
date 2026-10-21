import React, { useState, useMemo } from 'react';
import {
  Home,
  Building2,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Search,
  Filter,
  Phone,
  Mail,
  ExternalLink,
  ChevronRight,
  Sparkles,
  MapPin,
  Layers,
  Flame,
  CheckCircle2,
  Calendar,
  Send,
  Sliders,
  Percent,
  Calculator,
  ArrowRight,
  Eye,
  Copy,
  Check,
  Compass,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  Handshake,
  AlertTriangle,
  ArrowUpRight,
  UserCheck,
  Briefcase,
  Cpu
} from 'lucide-react';
import type { PropertyListing, SequenceCampaign, BridgeDeal } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface PropertyIntelligenceHubProps {
  onEnrollInSequence?: (contactName: string, company: string, email: string) => void;
  onOpenBuyerMatch?: (property: PropertyListing) => void;
  onDeploySwarm?: (property: PropertyListing) => void;
  onLogAction: (action: string, resource: string, details: string) => void;
  sequences: SequenceCampaign[];
}

export const PropertyIntelligenceHub: React.FC<PropertyIntelligenceHubProps> = ({
  onEnrollInSequence,
  onOpenBuyerMatch,
  onDeploySwarm,
  onLogAction,
  sequences
}) => {
  const [properties, setProperties] = useState<PropertyListing[]>(() => AcuityStorage.getProperties());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<PropertyListing | null>(null);
  const [hoveredProperty, setHoveredProperty] = useState<PropertyListing | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('split');
  const [mapZoom, setMapZoom] = useState<number>(1);
  const [mapCenter, setMapCenter] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [radiusFilter, setRadiusFilter] = useState<string>('all');

  // Contact and Bridge Actions State
  const [revealedContacts, setRevealedContacts] = useState<Record<string, boolean>>({});
  const [enrolledStatus, setEnrolledStatus] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [callingContact, setCallingContact] = useState<string | null>(null);

  // Bridge Deal Generation Modal
  const [bridgeModalProperty, setBridgeModalProperty] = useState<PropertyListing | null>(null);
  const [sellerFeePct, setSellerFeePct] = useState<number>(2.5);
  const [buyerFeePct, setBuyerFeePct] = useState<number>(2.0);
  const [customDealPrice, setCustomDealPrice] = useState<number>(0);
  const [selectedBuyerIdx, setSelectedBuyerIdx] = useState<number>(0);
  const [bridgeCreatedSuccess, setBridgeCreatedSuccess] = useState<boolean>(false);

  // Available Search Areas with counts
  const searchAreas = useMemo(() => {
    const areas = Array.from(new Set(properties.map(p => p.searchArea).filter(Boolean)));
    return ['all', ...areas];
  }, [properties]);

  // Filter properties
  const filtered = useMemo(() => {
    return properties.filter(prop => {
      const matchesSearch =
        prop.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.searchArea?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.ownerRecord.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.ownerRecord.holdingEntity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.sellerContact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.matchedBuyers.some(b => b.buyerName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesArea = selectedArea === 'all' || prop.searchArea === selectedArea;
      const matchesType = selectedType === 'all' || prop.propertyType === selectedType;
      const matchesStatus = selectedStatus === 'all' || prop.status === selectedStatus;

      return matchesSearch && matchesArea && matchesType && matchesStatus;
    });
  }, [properties, searchQuery, selectedArea, selectedType, selectedStatus]);

  const totalPortfolioValue = properties.reduce((sum, p) => sum + p.zestimate, 0);
  const avgCapRate = (properties.reduce((sum, p) => sum + p.capRate, 0) / (properties.length || 1)).toFixed(1);
  const totalDualCommissionPipeline = properties.reduce((sum, p) => {
    const topBuyer = p.matchedBuyers[0];
    return sum + (topBuyer?.estDualCommission || 0);
  }, 0);

  const handleRevealContact = (propId: string) => {
    setRevealedContacts(prev => ({ ...prev, [propId]: true }));
    onLogAction('Skip-Traced Beneficial Property Owner', 'RealEstate', `Unmasked true owner and direct contact for ${propId}`);
  };

  const handleEnrollOwner = (prop: PropertyListing) => {
    if (onEnrollInSequence) {
      onEnrollInSequence(prop.sellerContact.name, prop.sellerContact.entity, prop.sellerContact.email);
    }
    setEnrolledStatus(prev => ({ ...prev, [prop.id]: true }));
    onLogAction('Enrolled Property Owner in Acquisition Sequence', 'Sequences', `${prop.sellerContact.name} (${prop.address})`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSimulateCall = (name: string, phone: string, role: string) => {
    setCallingContact(`${name} (${role})`);
    onLogAction('Initiated Bridge Outreach Call', 'Telephony', `Connecting direct dial to ${name} at ${phone}`);
    setTimeout(() => {
      setCallingContact(null);
    }, 3500);
  };

  // Open Bridge Deal Modal
  const openBridgeModal = (prop: PropertyListing) => {
    setBridgeModalProperty(prop);
    setSellerFeePct(prop.sellerContact.commissionAgreedPct || 2.5);
    setBuyerFeePct(prop.matchedBuyers[0]?.buyFeeAgreedPct || 2.0);
    setCustomDealPrice(prop.historicalRates.suggestedTargetOfferPrice || prop.zestimate);
    setSelectedBuyerIdx(0);
    setBridgeCreatedSuccess(false);
  };

  const handleConfirmBridgeDeal = () => {
    if (!bridgeModalProperty) return;
    const matchedBuyer = bridgeModalProperty.matchedBuyers[selectedBuyerIdx] || bridgeModalProperty.matchedBuyers[0];
    const sellerFee = (customDealPrice * sellerFeePct) / 100;
    const buyerFee = (customDealPrice * buyerFeePct) / 100;
    const totalFee = sellerFee + buyerFee;

    const newDeal: BridgeDeal = {
      id: `bridge-deal-${Date.now()}`,
      propertyId: bridgeModalProperty.id,
      propertyAddress: `${bridgeModalProperty.address}, ${bridgeModalProperty.city}, ${bridgeModalProperty.state}`,
      propertyType: bridgeModalProperty.propertyType,
      searchArea: bridgeModalProperty.searchArea,
      imageUrl: bridgeModalProperty.imageUrl,
      sellerName: bridgeModalProperty.sellerContact.name,
      sellerEntity: bridgeModalProperty.sellerContact.entity,
      sellerPhone: bridgeModalProperty.sellerContact.phone,
      sellerEmail: bridgeModalProperty.sellerContact.email,
      sellerCommissionPct: sellerFeePct,
      buyerId: matchedBuyer.buyerId,
      buyerName: matchedBuyer.buyerName,
      buyerEntity: matchedBuyer.entityName,
      buyerContactName: matchedBuyer.contactName,
      buyerPhone: matchedBuyer.contactPhone,
      buyerEmail: matchedBuyer.contactEmail,
      buyerCommissionPct: buyerFeePct,
      agreedPrice: customDealPrice,
      sellerCommissionFee: sellerFee,
      buyerCommissionFee: buyerFee,
      totalCommission: totalFee,
      oldRatePerSqFt: bridgeModalProperty.historicalRates.oldPricePerSqFt,
      suggestedRatePerSqFt: Math.round(customDealPrice / bridgeModalProperty.squareFeet),
      dealStatus: 'Dual Agreements Out for Signature',
      createdAt: new Date().toISOString(),
      targetCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      escrowRef: `ESC-${bridgeModalProperty.state}-${Math.floor(10000 + Math.random() * 90000)}-BR`
    };

    AcuityStorage.saveBridgeDeal(newDeal);
    setBridgeCreatedSuccess(true);
    onLogAction(
      'Executed Dual-Commission Bridge Match',
      'BridgeExchange',
      `Bridged ${bridgeModalProperty.address} between Seller (${bridgeModalProperty.sellerContact.name}) and Buyer (${matchedBuyer.buyerName}) with $${totalFee.toLocaleString()} Total Commission`
    );

    setTimeout(() => {
      setBridgeModalProperty(null);
      setBridgeCreatedSuccess(false);
    }, 2000);
  };

  // Convert lat/lng coordinates to relative percentages on SVG map
  // Bounds encompass continental US key metros
  const mapCoordinates = useMemo(() => {
    return filtered.map((prop, idx) => {
      // Map to visual canvas positions based on known city or pseudo coordinates
      let x = 50;
      let y = 50;
      if (prop.city === 'Austin') {
        x = 52 + (idx === 0 ? -4 : 4);
        y = 66 + (idx === 0 ? -3 : 3);
      } else if (prop.city === 'Miami') {
        x = 84 + (idx === 0 ? -3 : 3);
        y = 82 + (idx === 0 ? -2 : 2);
      } else if (prop.city === 'Denver') {
        x = 42;
        y = 44;
      } else if (prop.city === 'Scottsdale') {
        x = 24;
        y = 60;
      } else if (prop.city === 'San Francisco') {
        x = 12;
        y = 42;
      } else if (prop.city === 'Dallas') {
        x = 54;
        y = 60;
      } else {
        x = 30 + ((idx * 17) % 60);
        y = 30 + ((idx * 13) % 50);
      }
      return { prop, x, y };
    });
  }, [filtered]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-xl p-6 text-white shadow-sm border border-emerald-800/40">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-emerald-500/30 flex items-center gap-1">
                <Home className="w-3.5 h-3.5" />
                Zillow MLS & Off-Market Search Area Engine
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
                <Handshake className="w-3.5 h-3.5" />
                Dual-Sided Bridge Brokerage & Commission Split
              </span>
              <span className="bg-indigo-500/20 text-indigo-300 text-xs px-2.5 py-0.5 rounded-full font-medium">
                Old vs. Algorithm Suggested Rates Engine
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">
              Zillow Search Area Intelligence & Dual-Party Bridge Engine
            </h1>
            <p className="text-emerald-100/80 text-sm mt-1 max-w-3xl leading-relaxed">
              Explore every property listed in your target search area with interactive map pins. Direct unmasked contact details for both sellers and institutional buyers, historical rate tracking (old purchase rate vs. algorithm suggested pricing), and automated dual-commission bridge agreement issuance.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="bg-emerald-900/60 border border-emerald-700/60 rounded-lg p-2.5 text-center min-w-[140px]">
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">Dual Commission Pipeline</div>
              <div className="text-lg font-bold text-white">${(totalDualCommissionPipeline / 1000000).toFixed(2)}M</div>
              <div className="text-[10px] text-emerald-400">Seller + Buyer Fees</div>
            </div>
          </div>
        </div>

        {/* Quick KPI stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-emerald-800/60">
          <div>
            <div className="text-xs text-emerald-200/70 font-medium">Active Search Area Assets</div>
            <div className="text-xl font-bold text-white mt-0.5">{filtered.length} Properties Plotted</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Across {searchAreas.length - 1} Metro MSA bounds</div>
          </div>
          <div>
            <div className="text-xs text-emerald-200/70 font-medium">Historical Rate Delta</div>
            <div className="text-xl font-bold text-emerald-300 mt-0.5">+58.4% Avg Spread</div>
            <div className="text-[11px] text-emerald-300/80 mt-0.5">Old deed vs suggested rate</div>
          </div>
          <div>
            <div className="text-xs text-emerald-200/70 font-medium">Direct Sellers Unmasked</div>
            <div className="text-xl font-bold text-white mt-0.5">100% Direct Cell & Email</div>
            <div className="text-[11px] text-emerald-300 mt-0.5">LLC beneficial owners verified</div>
          </div>
          <div>
            <div className="text-xs text-emerald-200/70 font-medium">Qualified Buyers Matched</div>
            <div className="text-xl font-bold text-amber-300 mt-0.5">$119.7M Verified Funds</div>
            <div className="text-[11px] text-amber-300/80 mt-0.5">Ready for bridge intro</div>
          </div>
        </div>
      </div>

      {/* Zillow Search Area Control Bar & View Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        {/* Top search & area row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by address, city, search area, seller name, or buyer firm..."
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Search Area Selector Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              Search Area:
            </span>
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">Every Property in All Search Areas ({properties.length})</option>
              {searchAreas
                .filter(a => a !== 'all')
                .map(area => (
                  <option key={area} value={area}>
                    {area} ({properties.filter(p => p.searchArea === area).length})
                  </option>
                ))}
            </select>
          </div>

          {/* View Mode Toggle: Split / Grid / Map */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 self-end md:self-auto">
            <button
              onClick={() => setViewMode('split')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              Split View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              Cards
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Full Map
            </button>
          </div>
        </div>

        {/* Secondary filters row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-medium text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              Filters:
            </div>

            <select
              value={selectedType}
              onChange={e => setSelectedType(e.target.value)}
              className="border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Asset Classes</option>
              <option value="Commercial Office">Commercial Office</option>
              <option value="Multifamily (5+ Units)">Multifamily (5+ Units)</option>
              <option value="Industrial Warehouse">Industrial Warehouse</option>
              <option value="Retail & Mixed Use">Retail & Mixed Use</option>
              <option value="Single Family Residential">Single Family Residential</option>
            </select>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Deal Stages</option>
              <option value="Off-Market Deal">Off-Market Deal</option>
              <option value="Motivated Seller">Motivated Seller</option>
              <option value="Pre-Foreclosure / Distressed">Pre-Foreclosure / Distressed</option>
            </select>

            <select
              value={radiusFilter}
              onChange={e => setRadiusFilter(e.target.value)}
              className="border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-700 font-medium"
            >
              <option value="all">All Search Radius</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
            </select>
          </div>

          <div className="text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-900">{filtered.length}</span> properties in{' '}
            <span className="font-bold text-emerald-700">
              {selectedArea === 'all' ? 'Every Search Area' : selectedArea}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN VIEWPORT: SPLIT / GRID / MAP */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Property Cards List */}
          <div className="lg:col-span-7 space-y-4 max-h-[850px] overflow-y-auto pr-1">
            {filtered.map(prop => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isHovered={hoveredProperty?.id === prop.id}
                isRevealed={!!revealedContacts[prop.id]}
                isEnrolled={!!enrolledStatus[prop.id]}
                onSelectComp={() => setSelectedProperty(prop)}
                onRevealContact={() => handleRevealContact(prop.id)}
                onEnrollOwner={() => handleEnrollOwner(prop)}
                onOpenBridgeModal={() => openBridgeModal(prop)}
                onSimulateCall={handleSimulateCall}
                onCopy={copyToClipboard}
                copiedField={copiedField}
                onMouseEnter={() => setHoveredProperty(prop)}
                onMouseLeave={() => setHoveredProperty(null)}
              />
            ))}
          </div>

          {/* Right Column: Sticky Interactive Zillow Map */}
          <div className="lg:col-span-5 sticky top-4">
            <InteractiveZillowMap
              coordinates={mapCoordinates}
              selectedArea={selectedArea}
              hoveredProperty={hoveredProperty}
              onSelectProperty={prop => setSelectedProperty(prop)}
              onHoverProperty={prop => setHoveredProperty(prop)}
              zoom={mapZoom}
              onZoomIn={() => setMapZoom(z => Math.min(z + 0.3, 2.2))}
              onZoomOut={() => setMapZoom(z => Math.max(z - 0.3, 0.7))}
              onResetZoom={() => {
                setMapZoom(1);
                setMapCenter({ x: 0, y: 0 });
              }}
              onOpenBridgeModal={openBridgeModal}
            />
          </div>
        </div>
      )}

      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(prop => (
            <PropertyCard
              key={prop.id}
              property={prop}
              isHovered={hoveredProperty?.id === prop.id}
              isRevealed={!!revealedContacts[prop.id]}
              isEnrolled={!!enrolledStatus[prop.id]}
              onSelectComp={() => setSelectedProperty(prop)}
              onRevealContact={() => handleRevealContact(prop.id)}
              onEnrollOwner={() => handleEnrollOwner(prop)}
              onOpenBridgeModal={() => openBridgeModal(prop)}
              onDeploySwarm={onDeploySwarm ? () => onDeploySwarm(prop) : undefined}
              onSimulateCall={handleSimulateCall}
              onCopy={copyToClipboard}
              copiedField={copiedField}
              onMouseEnter={() => setHoveredProperty(prop)}
              onMouseLeave={() => setHoveredProperty(null)}
            />
          ))}
        </div>
      )}

      {viewMode === 'map' && (
        <div className="space-y-4">
          <InteractiveZillowMap
            coordinates={mapCoordinates}
            selectedArea={selectedArea}
            hoveredProperty={hoveredProperty}
            onSelectProperty={prop => setSelectedProperty(prop)}
            onHoverProperty={prop => setHoveredProperty(prop)}
            zoom={mapZoom}
            onZoomIn={() => setMapZoom(z => Math.min(z + 0.3, 2.2))}
            onZoomOut={() => setMapZoom(z => Math.max(z - 0.3, 0.7))}
            onResetZoom={() => {
              setMapZoom(1);
              setMapCenter({ x: 0, y: 0 });
            }}
            isFullScreen={true}
            onOpenBridgeModal={openBridgeModal}
          />

          {/* Quick list below full map */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.slice(0, 3).map(prop => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isHovered={hoveredProperty?.id === prop.id}
                isRevealed={!!revealedContacts[prop.id]}
                isEnrolled={!!enrolledStatus[prop.id]}
                onSelectComp={() => setSelectedProperty(prop)}
                onRevealContact={() => handleRevealContact(prop.id)}
                onEnrollOwner={() => handleEnrollOwner(prop)}
                onOpenBridgeModal={() => openBridgeModal(prop)}
                onDeploySwarm={onDeploySwarm ? () => onDeploySwarm(prop) : undefined}
                onSimulateCall={handleSimulateCall}
                onCopy={copyToClipboard}
                copiedField={copiedField}
                onMouseEnter={() => setHoveredProperty(prop)}
                onMouseLeave={() => setHoveredProperty(null)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Simulated Phone Call Overlay */}
      {callingContact && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white rounded-xl shadow-2xl p-4 border border-emerald-500/50 flex items-center gap-3 animate-bounce">
          <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center animate-pulse">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
              Bridge Dialer Connecting...
            </div>
            <div className="text-sm font-bold text-white">{callingContact}</div>
          </div>
        </div>
      )}

      {/* BRIDGE DEAL & DUAL-COMMISSION AGREEMENT MODAL */}
      {bridgeModalProperty && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Handshake className="w-4 h-4" />
                  Dual-Party Bridge Agreement & Commission Escrow
                </div>
                <h2 className="text-lg font-bold mt-0.5">
                  Bridge Deal: {bridgeModalProperty.address}
                </h2>
                <p className="text-xs text-slate-300">
                  {bridgeModalProperty.city}, {bridgeModalProperty.state} · Search Area:{' '}
                  {bridgeModalProperty.searchArea}
                </p>
              </div>
              <button
                onClick={() => setBridgeModalProperty(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {bridgeCreatedSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-950">Bridge Deal Agreement Generated!</h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto">
                    Dual co-brokerage agreement dispatched to Seller (
                    {bridgeModalProperty.sellerContact.name}) and Buyer (
                    {bridgeModalProperty.matchedBuyers[selectedBuyerIdx]?.buyerName}). Commission escrow docket recorded.
                  </p>
                </div>
              ) : (
                <>
                  {/* Two Parties Side-by-Side: Seller & Buyer Contacts */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Seller Side */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                          Seller Information
                        </span>
                        <span className="text-[11px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded">
                          Pays {sellerFeePct}% Commission
                        </span>
                      </div>
                      <div className="text-xs text-slate-800 space-y-1">
                        <div className="font-bold text-sm text-slate-900">{bridgeModalProperty.sellerContact.name}</div>
                        <div className="text-slate-600">{bridgeModalProperty.sellerContact.entity}</div>
                        <div className="font-mono text-slate-700">{bridgeModalProperty.sellerContact.phone}</div>
                        <div className="font-mono text-slate-700 truncate">{bridgeModalProperty.sellerContact.email}</div>
                        <div className="pt-1 text-[11px] text-amber-800 italic">
                          "{bridgeModalProperty.sellerContact.motivation}"
                        </div>
                      </div>
                    </div>

                    {/* Buyer Side */}
                    <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-indigo-700" />
                          Matched Buyer Information
                        </span>
                        <span className="text-[11px] bg-indigo-200 text-indigo-900 font-bold px-2 py-0.5 rounded">
                          Pays {buyerFeePct}% Finder Fee
                        </span>
                      </div>
                      {bridgeModalProperty.matchedBuyers.length > 1 && (
                        <select
                          value={selectedBuyerIdx}
                          onChange={e => setSelectedBuyerIdx(Number(e.target.value))}
                          className="w-full text-xs border border-indigo-200 rounded p-1 bg-white font-medium"
                        >
                          {bridgeModalProperty.matchedBuyers.map((b, idx) => (
                            <option key={b.buyerId} value={idx}>
                              {b.buyerName} ({b.matchScore}% Buy-Box Match)
                            </option>
                          ))}
                        </select>
                      )}
                      {(() => {
                        const buyer =
                          bridgeModalProperty.matchedBuyers[selectedBuyerIdx] || bridgeModalProperty.matchedBuyers[0];
                        return (
                          <div className="text-xs text-slate-800 space-y-1">
                            <div className="font-bold text-sm text-slate-900">{buyer.buyerName}</div>
                            <div className="text-slate-600">{buyer.contactName}</div>
                            <div className="font-mono text-slate-700">{buyer.contactPhone}</div>
                            <div className="font-mono text-slate-700 truncate">{buyer.contactEmail}</div>
                            <div className="pt-1 text-[11px] text-indigo-800 font-semibold">
                              Buy-Box Match: {buyer.matchScore}%
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Pricing and Historical Rate Spread */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Rate Comparison & Valuation Spread
                    </h4>
                    <div className="grid grid-cols-3 gap-3 text-center text-xs">
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-semibold">Old Deed Rate</div>
                        <div className="text-sm font-bold text-slate-700">
                          ${bridgeModalProperty.historicalRates.oldPricePerSqFt}/sqft
                        </div>
                        <div className="text-[10px] text-slate-400">
                          ${(bridgeModalProperty.historicalRates.oldSalePrice / 1000000).toFixed(1)}M (
                          {bridgeModalProperty.historicalRates.oldSaleDate.split('-')[0]})
                        </div>
                      </div>
                      <div className="bg-white p-2.5 rounded border border-slate-200">
                        <div className="text-[10px] text-slate-500 font-semibold">Zillow AVM Market</div>
                        <div className="text-sm font-bold text-slate-900">${bridgeModalProperty.pricePerSqFt}/sqft</div>
                        <div className="text-[10px] text-slate-400">
                          ${(bridgeModalProperty.zestimate / 1000000).toFixed(1)}M
                        </div>
                      </div>
                      <div className="bg-emerald-50 p-2.5 rounded border border-emerald-200">
                        <div className="text-[10px] text-emerald-700 font-semibold">Suggested Buy Offer</div>
                        <div className="text-sm font-bold text-emerald-700">
                          ${bridgeModalProperty.historicalRates.suggestedTargetRatePerSqFt}/sqft
                        </div>
                        <div className="text-[10px] text-emerald-600">
                          ${(bridgeModalProperty.historicalRates.suggestedTargetOfferPrice / 1000000).toFixed(1)}M target
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 bg-white p-2 rounded border border-slate-200">
                      <span className="font-semibold text-slate-800">Engine Analysis:</span>{' '}
                      {bridgeModalProperty.historicalRates.rateRecommendationReasoning}
                    </div>
                  </div>

                  {/* Dual Commission Calculator */}
                  <div className="bg-slate-900 text-white rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Calculator className="w-4 h-4 text-emerald-400" />
                        Dual-Sided Commission Capture
                      </h4>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                        Total Rate: {(sellerFeePct + buyerFeePct).toFixed(1)}%
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Target Bridge Price ($)</label>
                        <input
                          type="number"
                          value={customDealPrice}
                          onChange={e => setCustomDealPrice(Number(e.target.value) || 0)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2.5 py-1.5 text-sm text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Seller Fee (%): {sellerFeePct}%</label>
                        <input
                          type="range"
                          min="1"
                          max="4"
                          step="0.25"
                          value={sellerFeePct}
                          onChange={e => setSellerFeePct(Number(e.target.value))}
                          className="w-full accent-amber-500"
                        />
                        <div className="text-[11px] text-amber-300 font-mono mt-0.5">
                          ${((customDealPrice * sellerFeePct) / 100).toLocaleString()} from Seller
                        </div>
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-400 block mb-1">Buyer Fee (%): {buyerFeePct}%</label>
                        <input
                          type="range"
                          min="1"
                          max="3"
                          step="0.25"
                          value={buyerFeePct}
                          onChange={e => setBuyerFeePct(Number(e.target.value))}
                          className="w-full accent-indigo-500"
                        />
                        <div className="text-[11px] text-indigo-300 font-mono mt-0.5">
                          ${((customDealPrice * buyerFeePct) / 100).toLocaleString()} from Buyer
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs text-slate-400">Total Bridge Commission Earned</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          ${(((customDealPrice * sellerFeePct) / 100) + ((customDealPrice * buyerFeePct) / 100)).toLocaleString()}
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-400">
                        Dual Escrow Distribution at Close of Title
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setBridgeModalProperty(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              {!bridgeCreatedSuccess && (
                <button
                  onClick={handleConfirmBridgeDeal}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition-colors"
                >
                  <Handshake className="w-4 h-4" />
                  Execute Bridge Deal & Issue Escrow Agreement
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL PROPERTY COMPS & UNDERWRITING MODAL */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  Zillow Verified Comps & Underwriting Engine
                </div>
                <h2 className="text-lg font-bold">{selectedProperty.address}</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {selectedProperty.city}, {selectedProperty.state} · Search Area: {selectedProperty.searchArea}
                </p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Financial Snapshot */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <div className="text-xs text-slate-500 font-medium">Acuity AVM (Zestimate)</div>
                  <div className="text-xl font-bold text-slate-900">
                    ${(selectedProperty.zestimate / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">${selectedProperty.pricePerSqFt}/sqft</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Annual Net NOI</div>
                  <div className="text-xl font-bold text-emerald-600">
                    ${selectedProperty.estimatedNetOperatingIncome.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    {selectedProperty.capRate}% Cap Rate
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Mortgage & Equity</div>
                  <div className="text-xl font-bold text-indigo-600">
                    {selectedProperty.estimatedEquityPct}% Equity
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    ${(selectedProperty.mortgageBalance / 1000000).toFixed(2)}M loan balance
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Suggested Target Buy Offer</div>
                  <div className="text-xl font-bold text-emerald-700">
                    ${(selectedProperty.historicalRates.suggestedTargetOfferPrice / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    ${selectedProperty.historicalRates.suggestedTargetRatePerSqFt}/sqft (Discounted Buy-Box)
                  </div>
                </div>
              </div>

              {/* Comparable Sales */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  Recent Comparable Sales in Search Area
                </h4>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
                      <tr>
                        <th className="py-2.5 px-3">Comp Address</th>
                        <th className="py-2.5 px-3">Sale Price</th>
                        <th className="py-2.5 px-3">Distance</th>
                        <th className="py-2.5 px-3">Recorded Date</th>
                        <th className="py-2.5 px-3 text-right">AVM Variance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedProperty.comps.map((comp, idx) => {
                        const variance =
                          ((comp.soldPrice - selectedProperty.zestimate) / selectedProperty.zestimate) * 100;
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3 font-semibold text-slate-900">{comp.address}</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-600">
                              ${(comp.soldPrice / 1000000).toFixed(2)}M
                            </td>
                            <td className="py-2.5 px-3 text-slate-500">{comp.distanceMiles} miles</td>
                            <td className="py-2.5 px-3 text-slate-500">{comp.soldDate}</td>
                            <td className="py-2.5 px-3 text-right font-medium">
                              <span className={variance >= 0 ? 'text-emerald-600' : 'text-slate-600'}>
                                {variance >= 0 ? '+' : ''}
                                {variance.toFixed(1)}%
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedProperty(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close Underwriting
              </button>
              <button
                onClick={() => {
                  const p = selectedProperty;
                  setSelectedProperty(null);
                  openBridgeModal(p);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Handshake className="w-3.5 h-3.5" />
                Bridge Deal & Issue Agreement
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: PROPERTY CARD
// ==========================================
interface PropertyCardProps {
  property: PropertyListing;
  isHovered: boolean;
  isRevealed: boolean;
  isEnrolled: boolean;
  onSelectComp: () => void;
  onRevealContact: () => void;
  onEnrollOwner: () => void;
  onOpenBridgeModal: () => void;
  onDeploySwarm?: () => void;
  onSimulateCall: (name: string, phone: string, role: string) => void;
  onCopy: (text: string, label: string) => void;
  copiedField: string | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isHovered,
  isRevealed,
  isEnrolled,
  onSelectComp,
  onRevealContact,
  onEnrollOwner,
  onOpenBridgeModal,
  onDeploySwarm,
  onSimulateCall,
  onCopy,
  copiedField,
  onMouseEnter,
  onMouseLeave
}) => {
  const topBuyer = property.matchedBuyers[0];
  const dualCommissionTotal = topBuyer?.estDualCommission || 0;

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 flex flex-col justify-between ${
        isHovered
          ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Photo Header with Zillow Badges */}
        <div className="relative h-48 w-full bg-slate-100 overflow-hidden group">
          <img
            src={property.imageUrl}
            alt={property.address}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-transparent to-transparent" />

          {/* Status & Search Area Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-md font-semibold text-white shadow-sm ${
                property.status === 'Pre-Foreclosure / Distressed'
                  ? 'bg-rose-600'
                  : property.status === 'Off-Market Deal'
                  ? 'bg-indigo-600'
                  : 'bg-amber-600'
              }`}
            >
              {property.status}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-md font-medium bg-black/60 text-white backdrop-blur-sm">
              {property.propertyType}
            </span>
          </div>

          {/* Area Pin Badge */}
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              {property.searchArea}
            </span>
          </div>

          {/* Zestimate & Cap Rate Pill */}
          <div className="absolute bottom-3 left-3 text-white">
            <div className="text-[11px] font-medium text-emerald-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Acuity Zestimate
            </div>
            <div className="text-xl font-bold tracking-tight">${(property.zestimate / 1000000).toFixed(2)}M</div>
          </div>

          <div className="absolute bottom-3 right-3 text-right text-white">
            <div className="text-[10px] text-slate-300">Cap Rate</div>
            <div className="text-sm font-bold text-emerald-300">{property.capRate}%</div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-4">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center justify-between">
              <span>{property.address}</span>
            </h3>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              {property.city}, {property.state} {property.zipCode}
            </p>
          </div>

          {/* Specs Row */}
          <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-lg text-center text-xs">
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Square Feet</div>
              <div className="font-bold text-slate-700">{property.squareFeet.toLocaleString()} sqft</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Est. Equity</div>
              <div className="font-bold text-emerald-600">{property.estimatedEquityPct}%</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px] uppercase font-semibold">Annual Net NOI</div>
              <div className="font-bold text-slate-700">${(property.estimatedNetOperatingIncome / 1000).toFixed(0)}k/yr</div>
            </div>
          </div>

          {/* HISTORICAL RATES VS SUGGESTED RATES ENGINE */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-950 uppercase tracking-wide">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Historical Rates vs. Suggested Pricing
              </span>
              <span className="text-emerald-700 font-semibold">
                +{property.historicalRates.historicalAppreciationPct}% Appreciation
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white p-2 rounded border border-emerald-100">
                <div className="text-[10px] text-slate-500 font-medium">Old Recorded Deed Rate</div>
                <div className="font-bold text-slate-800">
                  ${property.historicalRates.oldPricePerSqFt}/sqft{' '}
                  <span className="text-[10px] text-slate-500 font-normal">
                    (${(property.historicalRates.oldSalePrice / 1000000).toFixed(2)}M)
                  </span>
                </div>
                <div className="text-[10px] text-slate-400">Recorded: {property.historicalRates.oldSaleDate}</div>
              </div>

              <div className="bg-white p-2 rounded border border-emerald-100">
                <div className="text-[10px] text-emerald-700 font-medium">Suggested Target Buy Offer</div>
                <div className="font-bold text-emerald-700">
                  ${property.historicalRates.suggestedTargetRatePerSqFt}/sqft{' '}
                  <span className="text-[10px] text-emerald-600 font-normal">
                    (${(property.historicalRates.suggestedTargetOfferPrice / 1000000).toFixed(2)}M)
                  </span>
                </div>
                <div className="text-[10px] text-emerald-600 font-medium">Discounted Buy-Box Target</div>
              </div>
            </div>
          </div>

          {/* DUAL CONTACT INFORMATION: SELLER & BUYER */}
          <div className="border border-slate-200 rounded-lg p-3 space-y-3 bg-slate-50/50">
            {/* Seller Contact Info */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 uppercase">
                <span className="flex items-center gap-1 text-amber-800">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                  Seller Contact: {property.sellerContact.name}
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded font-bold">
                  {property.sellerContact.commissionAgreedPct}% Fee
                </span>
              </div>
              <div className="text-xs text-slate-600 font-mono flex items-center justify-between">
                <span>{property.sellerContact.phone}</span>
                <div className="flex items-center gap-1 font-sans">
                  <button
                    onClick={() => onSimulateCall(property.sellerContact.name, property.sellerContact.phone, 'Seller')}
                    className="p-1 text-slate-600 hover:text-emerald-600 rounded hover:bg-slate-200/60"
                    title="Call Seller"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onCopy(property.sellerContact.email, `seller-email-${property.id}`)}
                    className="p-1 text-slate-600 hover:text-indigo-600 rounded hover:bg-slate-200/60"
                    title="Copy Email"
                  >
                    {copiedField === `seller-email-${property.id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-2">
              {/* Matched Buyer Contact Info */}
              {topBuyer && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700 uppercase">
                    <span className="flex items-center gap-1 text-indigo-800">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-600" />
                      Matched Buyer: {topBuyer.buyerName}
                    </span>
                    <span className="text-[10px] bg-indigo-100 text-indigo-900 px-1.5 py-0.5 rounded font-bold">
                      {topBuyer.buyFeeAgreedPct}% Finder
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-mono flex items-center justify-between">
                    <span className="truncate">{topBuyer.contactName} · {topBuyer.contactPhone}</span>
                    <div className="flex items-center gap-1 font-sans">
                      <button
                        onClick={() => onSimulateCall(topBuyer.contactName, topBuyer.contactPhone, 'Institutional Buyer')}
                        className="p-1 text-slate-600 hover:text-emerald-600 rounded hover:bg-slate-200/60"
                        title="Call Buyer Lead"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onCopy(topBuyer.contactEmail, `buyer-email-${property.id}`)}
                        className="p-1 text-slate-600 hover:text-indigo-600 rounded hover:bg-slate-200/60"
                        title="Copy Buyer Email"
                      >
                        {copiedField === `buyer-email-${property.id}` ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DUAL COMMISSION BANNER */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-lg p-2.5 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-emerald-300 uppercase font-semibold">Dual Commission Captured</div>
              <div className="text-base font-bold text-white">${dualCommissionTotal.toLocaleString()}</div>
            </div>
            <button
              onClick={onOpenBridgeModal}
              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
            >
              <Handshake className="w-3.5 h-3.5" />
              Bridge Deal
            </button>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="border-t border-slate-100 p-3 bg-slate-50/50 flex flex-wrap items-center justify-between gap-2">
        <button
          onClick={onSelectComp}
          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-md transition-colors flex items-center gap-1"
        >
          <Calculator className="w-3.5 h-3.5 text-slate-500" />
          <span>Comps</span>
        </button>

        {onDeploySwarm && (
          <button
            onClick={onDeploySwarm}
            className="px-2.5 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors flex items-center gap-1"
            title="Deploy autonomous AI agent swarm on this property from start to finish"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>Agent Swarm</span>
          </button>
        )}

        <button
          onClick={onOpenBridgeModal}
          className="px-2.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/60 rounded-md transition-colors flex items-center gap-1"
        >
          <span>Bridge</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

// ==========================================
// SUB-COMPONENT: INTERACTIVE ZILLOW MAP
// ==========================================
interface InteractiveZillowMapProps {
  coordinates: { prop: PropertyListing; x: number; y: number }[];
  selectedArea: string;
  hoveredProperty: PropertyListing | null;
  onSelectProperty: (prop: PropertyListing) => void;
  onHoverProperty: (prop: PropertyListing | null) => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isFullScreen?: boolean;
  onOpenBridgeModal: (prop: PropertyListing) => void;
}

const InteractiveZillowMap: React.FC<InteractiveZillowMapProps> = ({
  coordinates,
  selectedArea,
  hoveredProperty,
  onSelectProperty,
  onHoverProperty,
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isFullScreen = false,
  onOpenBridgeModal
}) => {
  return (
    <div
      className={`bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-md relative flex flex-col ${
        isFullScreen ? 'h-[650px]' : 'h-[620px]'
      }`}
    >
      {/* Top Map Header / Indicator */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-2 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            {selectedArea === 'all' ? 'All Plotted Search Areas' : selectedArea} ({coordinates.length} Properties)
          </span>
        </div>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-1 rounded-lg">
        <button
          onClick={onZoomIn}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={onResetZoom}
          className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
          title="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* SVG Canvas with Streets, Water, and Property Pins */}
      <div className="w-full h-full relative overflow-hidden bg-[#0f172a] select-none">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: '50% 50%' }}
        >
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#1e293b" strokeWidth="0.3" />
            </pattern>
            <radialGradient id="waterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0369a1" stopOpacity="0.15" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100" height="100" fill="#0b1120" />
          <rect width="100" height="100" fill="url(#grid)" />

          {/* Simulated River / Waterway */}
          <path
            d="M 0,65 Q 25,60 50,68 T 100,62 L 100,75 Q 75,70 50,78 T 0,73 Z"
            fill="url(#waterGrad)"
          />

          {/* Simulated Highways / Arterial Roads */}
          <path d="M 0,35 Q 45,30 100,45" fill="none" stroke="#334155" strokeWidth="0.8" />
          <path d="M 45,0 Q 48,50 52,100" fill="none" stroke="#334155" strokeWidth="0.8" />
          <path d="M 15,10 Q 55,55 90,95" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeDasharray="1,1" />

          {/* Area labels on map */}
          <text x="52" y="62" fill="#64748b" fontSize="2.8" fontWeight="600" textAnchor="middle">
            AUSTIN DOWNTOWN
          </text>
          <text x="84" y="78" fill="#64748b" fontSize="2.8" fontWeight="600" textAnchor="middle">
            MIAMI BRICKELL
          </text>
          <text x="42" y="40" fill="#64748b" fontSize="2.8" fontWeight="600" textAnchor="middle">
            DENVER RiNo
          </text>
          <text x="24" y="56" fill="#64748b" fontSize="2.8" fontWeight="600" textAnchor="middle">
            SCOTTSDALE
          </text>
          <text x="14" y="38" fill="#64748b" fontSize="2.8" fontWeight="600" textAnchor="middle">
            SF SOMA
          </text>
          <text x="54" y="55" fill="#64748b" fontSize="2.8" fontWeight="600" textAnchor="middle">
            DALLAS UPTOWN
          </text>

          {/* Property Pins */}
          {coordinates.map(({ prop, x, y }) => {
            const isHovered = hoveredProperty?.id === prop.id;
            const priceTag = `$${(prop.zestimate / 1000000).toFixed(1)}M`;
            const isDistressed = prop.status === 'Pre-Foreclosure / Distressed';
            const isMotivated = prop.status === 'Motivated Seller';
            const pinColor = isDistressed ? '#e11d48' : isMotivated ? '#d97706' : '#10b981';

            return (
              <g
                key={prop.id}
                className="cursor-pointer transition-all duration-200"
                onClick={() => onSelectProperty(prop)}
                onMouseEnter={() => onHoverProperty(prop)}
                onMouseLeave={() => onHoverProperty(null)}
              >
                {/* Glow ring if hovered */}
                {isHovered && (
                  <circle cx={x} cy={y} r="5" fill={pinColor} fillOpacity="0.25" className="animate-ping" />
                )}

                {/* Pin base circle */}
                <circle cx={x} cy={y} r={isHovered ? '2.4' : '1.8'} fill={pinColor} stroke="#ffffff" strokeWidth="0.4" />

                {/* Price Tag Pill */}
                <g transform={`translate(${x}, ${y - 4.5})`}>
                  <rect
                    x="-6"
                    y="-2"
                    width="12"
                    height="3.6"
                    rx="1"
                    fill={isHovered ? '#059669' : '#0f172a'}
                    stroke={isHovered ? '#ffffff' : pinColor}
                    strokeWidth="0.3"
                  />
                  <text
                    x="0"
                    y="0.6"
                    fill="#ffffff"
                    fontSize="1.9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {priceTag}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hovered Property Mini Card Tooltip */}
        {hoveredProperty && (
          <div className="absolute bottom-4 left-4 right-4 z-30 bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl backdrop-blur-md text-white flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-3">
              <img
                src={hoveredProperty.imageUrl}
                alt={hoveredProperty.address}
                className="w-14 h-14 object-cover rounded-lg border border-slate-700"
              />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>{hoveredProperty.address}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                    ${(hoveredProperty.zestimate / 1000000).toFixed(2)}M
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  {hoveredProperty.city}, {hoveredProperty.state} · Old Rate: $
                  {hoveredProperty.historicalRates.oldPricePerSqFt}/sqft · Suggested Buy Offer: $
                  {hoveredProperty.historicalRates.suggestedTargetRatePerSqFt}/sqft
                </div>
                <div className="text-[11px] text-amber-300 mt-0.5 font-medium">
                  Seller: {hoveredProperty.sellerContact.name} ({hoveredProperty.sellerContact.phone})
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onSelectProperty(hoveredProperty)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-semibold"
              >
                Underwrite
              </button>
              <button
                onClick={() => onOpenBridgeModal(hoveredProperty)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Handshake className="w-3.5 h-3.5" />
                Bridge Deal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom map footer legend */}
      <div className="bg-slate-950 px-4 py-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Active MLS / Stabilized
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> Motivated Seller
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> Pre-Foreclosure
          </span>
        </div>
        <div className="text-slate-400">Click any pin to inspect rates & bridge to buyers</div>
      </div>
    </div>
  );
};
