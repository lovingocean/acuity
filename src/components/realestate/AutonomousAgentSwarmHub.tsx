import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  ShieldCheck,
  CheckCircle2,
  Phone,
  FileText,
  DollarSign,
  TrendingUp,
  Building2,
  Users,
  Search,
  ArrowRight,
  Printer,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink,
  Sliders,
  Volume2,
  VolumeX,
  FileCheck,
  Flame,
  Clock,
  Landmark,
  Scale,
  LayoutGrid,
  Radio,
  Activity,
  Download,
  Server,
  SlidersHorizontal,
  Lock,
  Hash,
  Award,
  Zap,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import type { PropertyListing, BuyerProfile, SwarmAgent, SwarmExecution, AgentPhase, SwarmLog } from '../../types';
import { AcuityStorage } from '../../lib/storage';

interface AutonomousAgentSwarmHubProps {
  initialProperty?: PropertyListing | null;
  onLogAction?: (action: string, resource: string, details: string) => void;
  onNavigateToBridgeRoom?: (propertyId: string) => void;
}

export const AutonomousAgentSwarmHub: React.FC<AutonomousAgentSwarmHubProps> = ({
  initialProperty,
  onLogAction,
  onNavigateToBridgeRoom
}) => {
  // Storage Data
  const [properties] = useState<PropertyListing[]>(() => AcuityStorage.getProperties());
  const [buyers] = useState<BuyerProfile[]>(() => AcuityStorage.getBuyers());
  const [agents] = useState<SwarmAgent[]>(() => AcuityStorage.getSwarmAgents());
  const [executions, setExecutions] = useState<SwarmExecution[]>(() => AcuityStorage.getSwarmExecutions());

  // Active Selected Property
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>(
    initialProperty?.id || properties[0]?.id || ''
  );

  // Active Execution (find or initialize)
  const currentProperty = properties.find(p => p.id === selectedPropertyId) || properties[0];
  const activeExecution = executions.find(e => e.propertyId === selectedPropertyId) || executions[0];

  // UI State
  const [activeTabPhase, setActiveTabPhase] = useState<AgentPhase>('scout');
  const [isRunning, setIsRunning] = useState<boolean>(activeExecution?.status === 'running');
  const [speedMode, setSpeedMode] = useState<'realtime' | 'turbo'>('turbo');
  const [activeCallAudio, setActiveCallAudio] = useState<boolean>(false);
  const [showDocModal, setShowDocModal] = useState<string | null>(null);

  // Execution Step Timer
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Swarm View Mode: Single Asset Deep Dive vs Fleet Orchestrator (Scalability Engine)
  const [swarmMode, setSwarmMode] = useState<'single' | 'fleet'>('single');
  const [fleetCorridor, setFleetCorridor] = useState<string>('All');
  const [fleetRunning, setFleetRunning] = useState<boolean>(false);
  const fleetTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Phase 2 Speech & Audio State
  const [activeSpeechLineIdx, setActiveSpeechLineIdx] = useState<number | null>(null);

  // Phase 4 Dynamic Hurdle & Debt Sensitivity
  const [seniorDebtLtv, setSeniorDebtLtv] = useState<number>(65);
  const [sofrBenchmark, setSofrBenchmark] = useState<number>(6.5);
  const [buyerHurdleIrr, setBuyerHurdleIrr] = useState<number>(14.5);

  // 24/7 Autonomous Radar & Continuous Auto-Pilot State (World-First Scalability)
  const [autoPilotActive, setAutoPilotActive] = useState<boolean>(false);
  const [radarCount, setRadarCount] = useState<number>(48290);
  const [radarDistressCount, setRadarDistressCount] = useState<number>(14);
  const autoPilotTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [radarLogs, setRadarLogs] = useState<Array<{ id: string; time: string; text: string; tag: string }>>([
    { id: 'r1', time: '10:52:04 AM', text: 'Travis County Registrar: 1031 tax deadline distress detected on deed #74012 ($12.8M)', tag: 'Distress Signal' },
    { id: 'r2', time: '10:52:19 AM', text: 'Miami-Dade Clerk API: Beneficial owner skip-traced to Brickell Real Estate Trust GP', tag: 'Skip-Trace' },
    { id: 'r3', time: '10:52:32 AM', text: 'Agent Argus: Ingested historical deed comps across 1.4M sqft commercial radius', tag: 'Deed Scrape' },
    { id: 'r4', time: '10:52:45 AM', text: 'Agent Aria: Dispatched automated voice dialer — bilateral mandate secured', tag: 'Voice Outreach' },
    { id: 'r5', time: '10:52:58 AM', text: 'Agent Sterling: Auto-matched buy-box with Starwood Real Estate Debt Fund', tag: 'Capital Match' }
  ]);

  // Phase 2 Interactive Tough Seller Objection Simulator State
  const [selectedObjectionIdx, setSelectedObjectionIdx] = useState<number>(0);
  const [isSpeakingObjection, setIsSpeakingObjection] = useState<boolean>(false);

  const sellerObjections = [
    {
      id: 'fee',
      title: 'Broker Commission Fee',
      sellerQuestion: 'Why should our LLC pay a 2.5% fee on an unlisted, off-market transaction?',
      ariaCounter: 'Understood, Mr. Thornton. Because our institutional purchaser pays their own 2.0% finder fee directly and clears at a 12% valuation premium over last year’s deed basis ($412/sqft), your net proceeds after our fee exceed an open auction by $740,000—with zero public marketing exposure.',
      winRate: '+98% Mandate Acceptance'
    },
    {
      id: '1031',
      title: '1031 Exchange Deadline',
      sellerQuestion: 'We have a strict 45-day 1031 identification timeline and cannot risk closing delays.',
      ariaCounter: 'Agent Nexus has already integrated First American Qualified Intermediary into the escrow instructions. We have structured a guaranteed 21-day expedited close backed by a $385,000 non-refundable earnest money deposit released on Day 5.',
      winRate: '+95% 1031 Safe-Harbor Lock'
    },
    {
      id: 'retrade',
      title: 'Buyer Re-Trading Risk',
      sellerQuestion: 'Institutional syndicates always re-trade price during the 30-day inspection period.',
      ariaCounter: 'Agent Veritas completed algorithmic due diligence prior to this call, including Phase I environmental and structural review. The buyer’s LOI explicitly waives renegotiation contingencies once the $385,000 hard deposit clears escrow.',
      winRate: '+99% Zero Retrade Guarantee'
    },
    {
      id: 'allcash',
      title: 'Financing Contingencies',
      sellerQuestion: 'We will only consider 100% all-cash offers with no lender financing hurdles.',
      ariaCounter: 'Agent Sterling has verified Palisades Real Estate Partners’ irrevocable $150M credit balance with JP Morgan Chase Private Bank. This is a 100% cash settlement with zero debt financing hurdles.',
      winRate: '+100% Proof of Funds Verified'
    }
  ];

  // Fleet properties filtered by corridor
  const fleetProperties = useMemo(() => {
    if (fleetCorridor === 'All') return properties;
    return properties.filter(
      p => p.searchArea.toLowerCase().includes(fleetCorridor.toLowerCase()) || 
           p.city.toLowerCase().includes(fleetCorridor.toLowerCase())
    );
  }, [properties, fleetCorridor]);

  // Fleet status mapping for parallel multi-agent executions
  const [fleetStatusMap, setFleetStatusMap] = useState<Record<string, { currentPhase: AgentPhase; progress: number; status: 'idle' | 'running' | 'completed' }>>(() => {
    const map: Record<string, any> = {};
    properties.forEach((p, idx) => {
      const exec = executions.find(e => e.propertyId === p.id);
      map[p.id] = {
        currentPhase: exec?.currentPhase || (idx < 2 ? 'closing' : 'scout'),
        progress: exec?.phaseProgress || (idx < 2 ? 100 : 15),
        status: exec?.status || (idx < 2 ? 'completed' : 'idle')
      };
    });
    return map;
  });

  // Telecom Dial Tone Simulator (Web Audio API)
  const playTelecomTone = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc1.frequency.value = 350;
      osc2.frequency.value = 440;
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.5);
      osc2.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio context may require user gesture
    }
  };

  // Real-Time Speech Synthesis & Synchronized Audio Playback
  const handleToggleVoicePlayback = () => {
    if (activeCallAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setActiveCallAudio(false);
      setActiveSpeechLineIdx(null);
      return;
    }

    setActiveCallAudio(true);
    playTelecomTone();

    const transcript = activeExecution?.sellerEngagement?.callTranscript || [];
    if (!transcript.length || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    let lineIdx = 0;
    const speakNext = () => {
      if (lineIdx >= transcript.length) {
        setActiveCallAudio(false);
        setActiveSpeechLineIdx(null);
        return;
      }

      setActiveSpeechLineIdx(lineIdx);
      const line = transcript[lineIdx];
      const isAria = line.speaker.includes('Aria');
      const utterance = new SpeechSynthesisUtterance(line.text);
      utterance.rate = 1.05;
      utterance.pitch = isAria ? 1.2 : 0.85;

      utterance.onend = () => {
        lineIdx++;
        setTimeout(speakNext, 350);
      };

      utterance.onerror = () => {
        lineIdx++;
        setTimeout(speakNext, 350);
      };

      window.speechSynthesis.speak(utterance);
    };

    window.speechSynthesis.cancel();
    speakNext();
  };

  // Fleet Swarm Launch across all corridor properties
  const handleStartFleetSwarm = () => {
    setFleetRunning(true);
    if (onLogAction) {
      onLogAction(
        'Autonomous Fleet Swarm Deployed',
        'FleetEngine',
        `Dispatched 36 parallel neural agent threads across ${fleetProperties.length} corridor properties`
      );
    }

    const phases: AgentPhase[] = ['scout', 'seller_call', 'buyer_match', 'negotiation', 'due_diligence', 'closing'];
    let step = 0;
    if (fleetTimerRef.current) clearInterval(fleetTimerRef.current);

    fleetTimerRef.current = setInterval(() => {
      step++;
      setFleetStatusMap(prev => {
        const next = { ...prev };
        fleetProperties.forEach(p => {
          const currentProgress = next[p.id]?.progress || 0;
          if (currentProgress < 100) {
            const increment = speedMode === 'turbo' ? 22 : 12;
            const newProgress = Math.min(currentProgress + increment, 100);
            const phaseIdx = Math.min(Math.floor((newProgress / 100) * phases.length), phases.length - 1);
            next[p.id] = {
              currentPhase: phases[phaseIdx],
              progress: newProgress,
              status: newProgress >= 100 ? 'completed' : 'running'
            };
          }
        });
        return next;
      });

      if (step >= (speedMode === 'turbo' ? 6 : 10)) {
        if (fleetTimerRef.current) clearInterval(fleetTimerRef.current);
        setFleetRunning(false);
        setFleetStatusMap(prev => {
          const next = { ...prev };
          fleetProperties.forEach(p => {
            next[p.id] = {
              currentPhase: 'closing',
              progress: 100,
              status: 'completed'
            };
          });
          return next;
        });
        if (onLogAction) {
          onLogAction(
            'Fleet Swarm Completed Corridor Execution',
            'FleetEngine',
            `All assets in ${fleetCorridor} corridor bridged and escrow settlement dockets generated`
          );
        }
      }
    }, speedMode === 'turbo' ? 600 : 1800);
  };

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
      if (fleetTimerRef.current) clearInterval(fleetTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (initialProperty) {
      setSelectedPropertyId(initialProperty.id);
    }
  }, [initialProperty]);

  // Keep activeTabPhase in sync with running phase
  useEffect(() => {
    if (activeExecution && isRunning) {
      setActiveTabPhase(activeExecution.currentPhase);
    }
  }, [activeExecution?.currentPhase, isRunning]);

  // 24/7 Autonomous Auto-Pilot Radar Loop
  useEffect(() => {
    if (!autoPilotActive) {
      if (autoPilotTimerRef.current) clearInterval(autoPilotTimerRef.current);
      return;
    }

    const radarFeedPool = [
      { text: 'Austin Travis County: Deed Book #9102 flagged with 1031 tax deadline ($14.2M)', tag: 'Distress Signal' },
      { text: 'Miami Brickell Corridor: Beneficial owner Delaware LLC unmasked to Sunbelt GP', tag: 'Skip-Trace' },
      { text: 'Agent Argus: Municipal deed comps ingested — historical rate spread calculated +14.2%', tag: 'Deed Scrape' },
      { text: 'Agent Aria: Autonomous voice dialer outbound to managing partner — LOI term secured', tag: 'Voice Outreach' },
      { text: 'Agent Sterling: Blackstone Real Estate Debt buy-box match confirmed (POF verified)', tag: 'Capital Match' },
      { text: 'Agent Solon: Nash equilibrium clearance rate calculated at 99.4% game-theory confidence', tag: 'Arbiter' },
      { text: 'Agent Veritas: Phase I Environmental & ALTA boundary audit clean without exception', tag: 'Title Audit' },
      { text: 'Agent Nexus: Fedwire RTGS escrow settlement docket generated — $640,000 dual take locked', tag: 'Dual Settlement' }
    ];

    let poolIdx = 0;
    autoPilotTimerRef.current = setInterval(() => {
      setRadarCount(prev => prev + Math.floor(Math.random() * 8) + 4);
      if (Math.random() > 0.6) {
        setRadarDistressCount(prev => prev + 1);
      }

      const item = radarFeedPool[poolIdx % radarFeedPool.length];
      poolIdx++;

      setRadarLogs(prev => [
        {
          id: `r-${Date.now()}`,
          time: new Date().toLocaleTimeString(),
          text: item.text,
          tag: item.tag
        },
        ...prev.slice(0, 9)
      ]);

      if (onLogAction) {
        onLogAction('24/7 Auto-Pilot Radar Sweep', 'AutoPilotRadar', item.text);
      }
    }, 4500);

    return () => {
      if (autoPilotTimerRef.current) clearInterval(autoPilotTimerRef.current);
    };
  }, [autoPilotActive, onLogAction]);

  // Phase 2: Dynamic Voice Objection Simulator Runner
  const handleSimulateObjection = (idx: number) => {
    setSelectedObjectionIdx(idx);
    setIsSpeakingObjection(true);
    playTelecomTone();

    const obj = sellerObjections[idx];
    if (!obj || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSpeakingObjection(false);
      return;
    }

    window.speechSynthesis.cancel();

    // 1. Speak Seller Question
    const sellerUtterance = new SpeechSynthesisUtterance(obj.sellerQuestion);
    sellerUtterance.rate = 1.0;
    sellerUtterance.pitch = 0.85;

    sellerUtterance.onend = () => {
      setTimeout(() => {
        // 2. Speak Agent Aria Counter
        playTelecomTone();
        const ariaUtterance = new SpeechSynthesisUtterance(obj.ariaCounter);
        ariaUtterance.rate = 1.08;
        ariaUtterance.pitch = 1.25;
        ariaUtterance.onend = () => setIsSpeakingObjection(false);
        ariaUtterance.onerror = () => setIsSpeakingObjection(false);
        window.speechSynthesis.speak(ariaUtterance);
      }, 400);
    };

    sellerUtterance.onerror = () => setIsSpeakingObjection(false);
    window.speechSynthesis.speak(sellerUtterance);
  };

  // Institutional 1-Click IC Memorandum (.txt / .md) Downloader
  const handleDownloadICMemo = () => {
    const grossPrice = activeExecution?.closingSettlement?.grossSalePrice || currentProperty.zestimate;
    const memoContent = `================================================================================
INSTITUTIONAL INVESTMENT COMMITTEE (IC) MEMORANDUM & SETTLEMENT BINDER
ACUITY CAPITAL AUTONOMOUS DEAL SWARM — CONFIDENTIAL
================================================================================

SUBJECT PROPERTY:
Address: ${currentProperty.address}, ${currentProperty.city}, ${currentProperty.state}
Property Type: ${currentProperty.propertyType}
Rentable Square Feet: ${currentProperty.squareFeet.toLocaleString()} sqft
Current In-Place NOI: $${currentProperty.currentNoi?.toLocaleString()}
Zestimate AVM: $${currentProperty.zestimate.toLocaleString()}

AUTONOMOUS EXECUTION SUMMARY:
Execution Reference: ${activeExecution?.id || 'EXEC-SWARM-2026'}
Clearing Agreed Valuation: $${grossPrice.toLocaleString()}
Suggested Rate: $${Math.round(grossPrice / currentProperty.squareFeet)}/sqft
Historical Deed Rate: $${currentProperty.historicalRates.oldPricePerSqFt}/sqft (+${currentProperty.historicalRates.appreciationSpreadPct}% historical spread)

SELLER SIDE (VOICE MANDATE SECURED BY AGENT ARIA):
Beneficial Owner: ${currentProperty.sellerContact.name}
Legal Entity: ${currentProperty.sellerContact.entity}
Verified Direct Cellular: ${currentProperty.sellerContact.phone}
Exclusive Representation Fee: ${activeExecution?.sellerEngagement?.sellerCommissionAgreedPct || 2.5}%
Seller Net Proceeds: $${(activeExecution?.closingSettlement?.netSellerProceeds || Math.round(grossPrice * 0.975)).toLocaleString()}
1031 Qualified Intermediary: First American Qualified Exchange Intermediary Trust #1031-TX

INSTITUTIONAL BUYER SIDE (MATCHED BY AGENT STERLING):
Acquiring Entity: ${activeExecution?.buyerMatchResult?.entityName || 'Palisades Real Estate Partners'}
Managing Director: ${activeExecution?.buyerMatchResult?.buyerName || 'Julian Vance'}
Verified Proof of Funds: $150,000,000 (JP Morgan Private Bank RTGS Verified)
Buyer Finder Fee: 2.0% ($${Math.round(grossPrice * 0.02).toLocaleString()})

DUAL ESCROW & SETTLEMENT (AGENT NEXUS):
Gross Purchase Price: $${grossPrice.toLocaleString()}
Seller Fee (2.5%): $${Math.round(grossPrice * 0.025).toLocaleString()}
Buyer Fee (2.0%): $${Math.round(grossPrice * 0.020).toLocaleString()}
TOTAL DUAL PLATFORM REVENUE: $${Math.round(grossPrice * 0.045).toLocaleString()}
Earnest Money Deposit (3% Hard): $${Math.round(grossPrice * 0.03).toLocaleString()}
Escrow Wire Ref: ${activeExecution?.closingSettlement?.escrowWireRef || 'WIRE-ESCROW-TX-99021'}
Closing Velocity: 14 Days

ALGORITHMIC DUE DILIGENCE AUDIT (AGENT VERITAS):
1. Title & Encumbrance: Clean Title Search — Zero Senior Liens
2. Environmental ESA: Clean Phase I Environmental Assessment
3. Structural / Mechanical: 94/100 Building Quality Score (Zero Deferred CapEx)
4. ALTA Survey: Clean Boundary Survey Recorded
5. Tenant Estoppels: 100% Leases Audited & Certified

CRYPTOGRAPHIC ATTESTATION:
Consensus Engine: SHA-256 Merkle Proof v4.2
Root Hash: 0x89e47bf14e59002a7b8e19273c51f4632dbb74b12aa31e902b3765e908da2241
Signatures: secp256k1 signed by Argus, Aria, Sterling, Solon, Veritas, Nexus
Certified Date: ${new Date().toUTCString()}
================================================================================`;

    const blob = new Blob([memoContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Acuity-IC-Memo-${currentProperty.address.replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Cryptographic Merkle Audit Downloader
  const handleDownloadCryptoAudit = () => {
    const auditData = {
      dealId: activeExecution?.id || 'SWARM-CRYPTO-2026',
      timestamp: new Date().toISOString(),
      property: {
        address: currentProperty.address,
        city: currentProperty.city,
        state: currentProperty.state,
        clearingPrice: activeExecution?.closingSettlement?.grossSalePrice || currentProperty.zestimate
      },
      merkleRoot: '0x89e47bf14e59002a7b8e19273c51f4632dbb74b12aa31e902b3765e908da2241',
      consensusEngine: 'Acuity Swarm Cryptographic Proof v4.2 (secp256k1)',
      agentSignatures: [
        { agent: 'Argus (Deed Scraper)', blockIndex: 1, hash: '0x7f10a8b92c4e51928374a6b5c0d1e2f3a4b5c6d7', verified: true },
        { agent: 'Aria (Voice Mandate)', blockIndex: 2, hash: '0x4e3189bc01a74284b7264a938c5f6e1d2a3b4c5d', verified: true },
        { agent: 'Sterling (Capital Match)', blockIndex: 3, hash: '0x9e88a51203d94b7e8c1a2b3c4d5e6f7a8b9c0d1e', verified: true },
        { agent: 'Solon (Game Theory)', blockIndex: 4, hash: '0x2b4c77109a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d', verified: true },
        { agent: 'Veritas (Title & Diligence)', blockIndex: 5, hash: '0x6189db093e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', verified: true },
        { agent: 'Nexus (Escrow Wire Closer)', blockIndex: 6, hash: '0x442199bc1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', verified: true }
      ],
      dualPlatformTake: activeExecution?.closingSettlement?.totalPlatformTake || Math.round(currentProperty.zestimate * 0.045)
    };
    const blob = new Blob([JSON.stringify(auditData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Acuity-Merkle-Proof-${activeExecution?.id || 'deal'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Fleet CSV Downloader
  const handleDownloadPortfolioCSV = () => {
    const headers = ['Property', 'City', 'State', 'Type', 'SqFt', 'AVM Valuation', 'Suggested Target', 'Historical SqFt', 'Seller Take (2.5%)', 'Buyer Take (2.0%)', 'Total Platform Take', 'Status'];
    const rows = fleetProperties.map(p => [
      `"${p.address}"`,
      p.city,
      p.state,
      p.propertyType,
      p.squareFeet,
      p.zestimate,
      p.historicalRates.suggestedTargetOfferPrice,
      p.historicalRates.oldPricePerSqFt,
      Math.round(p.historicalRates.suggestedTargetOfferPrice * 0.025),
      Math.round(p.historicalRates.suggestedTargetOfferPrice * 0.020),
      Math.round(p.historicalRates.suggestedTargetOfferPrice * 0.045),
      fleetStatusMap[p.id]?.status || 'completed'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Acuity-Corridor-Portfolio-${fleetCorridor.replace(/\s+/g, '-')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle switching target property
  const handleSelectProperty = (propId: string) => {
    setSelectedPropertyId(propId);
    const existing = executions.find(e => e.propertyId === propId);
    if (existing) {
      setActiveTabPhase(existing.currentPhase);
      setIsRunning(existing.status === 'running');
    } else {
      setActiveTabPhase('scout');
      setIsRunning(false);
    }
  };

  // Start Autonomous Swarm Run from Start to Finish
  const handleStartAutonomousSwarm = () => {
    if (!currentProperty) return;

    setIsRunning(true);
    const bestBuyer = currentProperty.matchedBuyers?.[0] || {
      buyerId: buyers[0].id,
      buyerName: buyers[0].name,
      entityName: buyers[0].entityName,
      contactName: 'Julian Vance',
      contactPhone: '+1 (305) 910-4422',
      contactEmail: 'deals@palisadespartners.com',
      maxBudget: buyers[0].maxBudget,
      fitScore: 97,
      buyFeeAgreedPct: 2.0,
      estDualCommission: Math.round(currentProperty.historicalRates.suggestedTargetOfferPrice * 0.045)
    };

    const targetPrice = currentProperty.historicalRates.suggestedTargetOfferPrice;
    const sellerFee = Math.round((targetPrice * (currentProperty.sellerContact.commissionAgreedPct || 2.5)) / 100);
    const buyerFee = Math.round((targetPrice * 2.0) / 100);
    const totalFee = sellerFee + buyerFee;

    // Create fresh or updated execution
    const newExec: SwarmExecution = {
      id: `swarm-exec-${Date.now()}`,
      propertyId: currentProperty.id,
      propertyAddress: `${currentProperty.address}, ${currentProperty.city}, ${currentProperty.state}`,
      searchArea: currentProperty.searchArea,
      status: 'running',
      currentPhase: 'scout',
      phaseProgress: 15,
      startedAt: new Date().toISOString(),
      speedMode,
      logs: [
        {
          id: `log-${Date.now()}-1`,
          timestamp: new Date().toLocaleTimeString(),
          phase: 'scout',
          agentName: 'Argus',
          agentRole: 'Deed Forensics Scout',
          message: `Scanned public records for ${currentProperty.address}. Historical deed from ${currentProperty.historicalRates.oldSaleDate.split('-')[0]} at $${currentProperty.historicalRates.oldPricePerSqFt}/sqft. Target rate calculated at $${Math.round(targetPrice / currentProperty.squareFeet)}/sqft.`,
          type: 'scout'
        }
      ],
      deedForensics: {
        scannedRegistry: `${currentProperty.city} County Deed Registry & Property Assessor`,
        deedYear: currentProperty.historicalRates.oldSaleDate.split('-')[0],
        originalPriceSqFt: currentProperty.historicalRates.oldPricePerSqFt,
        currentAvmSqFt: currentProperty.pricePerSqFt,
        targetOfferPrice: targetPrice,
        targetPriceSqFt: Math.round(targetPrice / currentProperty.squareFeet),
        appreciationPct: currentProperty.historicalRates.historicalAppreciationPct,
        liquidationTrigger: currentProperty.sellerContact.motivation,
        equityBuildUpUsd: Math.round(currentProperty.zestimate - currentProperty.mortgageBalance),
        inPlaceNetNoi: currentProperty.estimatedNetOperatingIncome,
        capRateEstimated: currentProperty.capRate
      },
      sellerEngagement: {
        sellerName: currentProperty.sellerContact.name,
        unmaskedEntity: currentProperty.sellerContact.entity,
        verifiedCell: currentProperty.sellerContact.phone,
        verifiedEmail: currentProperty.sellerContact.email,
        callDurationSeconds: 182,
        callStatus: 'In Progress',
        callTranscript: [
          { speaker: 'Agent Aria', text: `Hello ${currentProperty.sellerContact.name}, I am Aria with Acuity Capital Intelligence reaching out regarding your asset at ${currentProperty.address}.`, time: '00:03', sentiment: 'neutral' },
          { speaker: currentProperty.sellerContact.name, text: 'We were considering quiet options given our 1031 timeline. What is your proposed buyer profile?', time: '00:16', sentiment: 'positive' },
          { speaker: 'Agent Aria', text: `We represent verified institutional capital seeking a 21-day escrow at $${(targetPrice / 1000000).toFixed(2)}M. We charge a standard 2.5% representation fee collected strictly at title close.`, time: '00:35', sentiment: 'neutral' },
          { speaker: currentProperty.sellerContact.name, text: 'If they can close with zero financing contingency at that valuation, I agree to the off-market representation mandate.', time: '01:05', sentiment: 'closed' }
        ],
        sellerCommissionAgreedPct: currentProperty.sellerContact.commissionAgreedPct || 2.5,
        representationAgreementRef: `AGR-MANDATE-${Date.now()}`,
        agreementSignedAt: new Date().toISOString()
      },
      buyerMatchResult: {
        buyerId: bestBuyer.buyerId,
        buyerName: bestBuyer.buyerName,
        entityName: bestBuyer.entityName,
        buyerType: 'Institutional Capital Allocator',
        contactName: 'Katherine Reynolds, Acquisitions GP',
        contactPhone: '+1 (212) 880-9200',
        contactEmail: 'acquisitions@clarionridge.com',
        maxBudget: 25000000,
        fitScore: 98,
        memoDelivered: true,
        memoRef: `MEMO-DEAL-${Date.now()}`,
        buyerFinderFeeAgreedPct: 2.0
      },
      negotiationArbitration: {
        clearingPrice: targetPrice,
        sellerDiscountPct: 6.8,
        buyerEquityBufferUsd: Math.round(currentProperty.zestimate - targetPrice),
        roundsNegotiated: 3,
        optimalStructure: 'All-Cash Direct Title Escrow',
        loiSignedBilateral: true,
        loiRef: `LOI-${Date.now()}`,
        loiSignedAt: new Date().toISOString(),
        roundsSummary: [
          { round: 1, sellerBid: Math.round(targetPrice * 1.05), buyerOffer: Math.round(targetPrice * 0.94), note: 'Initial bid-ask spread factoring debt yield hurdles.' },
          { round: 2, sellerBid: Math.round(targetPrice * 1.02), buyerOffer: Math.round(targetPrice * 0.98), note: 'Agent Solon reconciled 14-day diligence credit.' },
          { round: 3, sellerBid: targetPrice, buyerOffer: targetPrice, note: 'Equilibrium clearing price locked. Bilateral LOI executed.' }
        ]
      },
      dueDiligenceAudit: {
        titleSearchStatus: 'Clean Title Commitment Issued',
        delawareGoodStanding: true,
        taxLienSearch: 'No Municipal Liens Detected',
        environmentalPhase1: 'Clean Phase I Environmental ESA',
        estoppelCertificatesVerified: 12,
        totalTenantLeasesAudited: 12,
        auditPassed: true,
        auditRef: `AUDIT-DILIGENCE-${Date.now()}`
      },
      closingSettlement: {
        grossSalePrice: targetPrice,
        sellerCommissionTake: sellerFee,
        buyerFinderFeeTake: buyerFee,
        totalPlatformTake: totalFee,
        netSellerProceeds: targetPrice - sellerFee,
        earnestDepositHeld: Math.round(targetPrice * 0.03),
        escrowWireRef: `WIRE-ESCROW-${Date.now()}`,
        altaStatementRef: `ALTA-STMT-${Date.now()}`,
        settlementCompletedAt: new Date().toISOString(),
        fundsDistributed: true,
        qualifiedIntermediary1031Routing: 'First American Qualified Exchange Intermediary Trust #1031-TX'
      }
    };

    AcuityStorage.saveSwarmExecution(newExec);
    setExecutions(AcuityStorage.getSwarmExecutions());

    if (onLogAction) {
      onLogAction('Autonomous Agent Swarm Launched', 'AgentSwarm', `Deployed 6 neural agents on ${currentProperty.address}`);
    }

    // Step-by-step progression through all 6 phases
    const delay = speedMode === 'turbo' ? 800 : 2500;
    const phases: AgentPhase[] = ['scout', 'seller_call', 'buyer_match', 'negotiation', 'due_diligence', 'closing'];

    let currentPhaseIdx = 0;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      currentPhaseIdx++;
      if (currentPhaseIdx < phases.length) {
        const nextPhase = phases[currentPhaseIdx];
        const progress = Math.round(((currentPhaseIdx + 1) / phases.length) * 100);
        newExec.currentPhase = nextPhase;
        newExec.phaseProgress = progress;

        // Add log for this phase
        const agent = agents.find(a => a.phase === nextPhase);
        if (agent) {
          newExec.logs.unshift({
            id: `log-${Date.now()}-${currentPhaseIdx}`,
            timestamp: new Date().toLocaleTimeString(),
            phase: nextPhase,
            agentName: agent.name,
            agentRole: agent.role,
            message: `Completed phase "${agent.role}". Next autonomous milestone unlocked.`,
            type: nextPhase === 'closing' ? 'success' : 'deal' as any
          });
        }

        AcuityStorage.saveSwarmExecution(newExec);
        setExecutions([...AcuityStorage.getSwarmExecutions()]);
        setActiveTabPhase(nextPhase);
      } else {
        // All 6 phases completed!
        if (timerRef.current) clearInterval(timerRef.current);
        newExec.status = 'completed';
        newExec.phaseProgress = 100;
        newExec.completedAt = new Date().toISOString();
        AcuityStorage.saveSwarmExecution(newExec);
        setExecutions([...AcuityStorage.getSwarmExecutions()]);
        setIsRunning(false);

        // Also save this deal to Bridge Deals
        AcuityStorage.saveBridgeDeal({
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
          sellerCommissionPct: currentProperty.sellerContact.commissionAgreedPct || 2.5,
          buyerId: bestBuyer.buyerId,
          buyerName: bestBuyer.buyerName,
          buyerEntity: bestBuyer.entityName,
          buyerContactName: 'Julian Vance, Director',
          buyerPhone: '+1 (305) 910-4422',
          buyerEmail: 'deals@palisadespartners.com',
          buyerCommissionPct: 2.0,
          agreedPrice: targetPrice,
          sellerCommissionFee: sellerFee,
          buyerCommissionFee: buyerFee,
          totalCommission: totalFee,
          oldRatePerSqFt: currentProperty.historicalRates.oldPricePerSqFt,
          suggestedRatePerSqFt: Math.round(targetPrice / currentProperty.squareFeet),
          dealStatus: 'Closed & Commission Distributed',
          createdAt: new Date().toISOString(),
          targetCloseDate: new Date(Date.now() + 21 * 86400000).toISOString().split('T')[0],
          escrowRef: `ESC-${Date.now().toString().slice(-5)}`
        });

        if (onLogAction) {
          onLogAction('Autonomous Swarm Closed Deal', 'AgentSwarm', `Captured $${totalFee.toLocaleString()} dual commission on ${currentProperty.address}`);
        }
      }
    }, delay);
  };

  const handlePauseSwarm = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
  };

  const phasesInfo: { id: AgentPhase; number: string; title: string; agent: string; role: string }[] = [
    { id: 'scout', number: '01', title: 'Scout & Forensics', agent: 'Argus', role: 'Deed Scraper' },
    { id: 'seller_call', number: '02', title: 'Seller Voice Closer', agent: 'Aria', role: 'Voice AI' },
    { id: 'buyer_match', number: '03', title: 'Capital Matchmaker', agent: 'Sterling', role: 'Buy-Box Match' },
    { id: 'negotiation', number: '04', title: 'Clearing Price Arbiter', agent: 'Solon', role: 'Game Theory' },
    { id: 'due_diligence', number: '05', title: 'Title & Diligence Audit', agent: 'Veritas', role: 'Legal Auditor' },
    { id: 'closing', number: '06', title: 'Escrow & Dual Payout', agent: 'Nexus', role: 'Settlement' }
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* ============================================================== */}
      {/* 1. TOP COMMAND BAR & SWARM CONTROLS                            */}
      {/* ============================================================== */}
      <div className="border-b border-slate-800 bg-slate-900/90 px-6 py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Swarm Title & Mode Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-bold text-base shadow-inner">
              <Cpu className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                <span>Autonomous Multi-Agent System</span>
                <span aria-hidden="true">·</span>
                <span className="text-slate-400 font-normal">
                  {swarmMode === 'single' ? '6 Neural Agents Active' : '36 Parallel Corridor Workers'}
                </span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                {swarmMode === 'single' ? 'Full-Lifecycle Deal Execution Engine' : 'Autonomous Corridor Fleet Orchestrator'}
              </h1>
            </div>
          </div>

          <div className="h-6 w-[1px] bg-slate-800 hidden sm:block" />

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSwarmMode('single')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                swarmMode === 'single'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Asset Workbench</span>
            </button>
            <button
              onClick={() => setSwarmMode('fleet')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                swarmMode === 'fleet'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Fleet Orchestrator</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1 rounded border border-emerald-500/30 font-mono">
                Fleet
              </span>
            </button>
          </div>

          {/* Asset Selector (Single Mode) or Corridor Selector (Fleet Mode) */}
          {swarmMode === 'single' ? (
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Asset</label>
              <select
                value={selectedPropertyId}
                onChange={e => handleSelectProperty(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[260px] truncate"
              >
                {properties.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.address} ({p.city}) — ${(p.zestimate / 1000000).toFixed(1)}M
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Target Corridor Filter</label>
              <select
                value={fleetCorridor}
                onChange={e => setFleetCorridor(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[220px]"
              >
                <option value="All">All Corridors (Nationwide)</option>
                <option value="Austin">Austin Sunbelt Corridor</option>
                <option value="Miami">Miami Brickell Waterfront</option>
                <option value="Scottsdale">Scottsdale Class-A Corridor</option>
                <option value="Denver">Denver Logistics Hub</option>
                <option value="San Francisco">SF Biotech Corridor</option>
                <option value="Dallas">Dallas Mixed-Use Corridor</option>
              </select>
            </div>
          )}
        </div>

        {/* Right: Swarm Execution Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* 24/7 Continuous Autonomous Radar Auto-Pilot Toggle */}
          <button
            onClick={() => setAutoPilotActive(prev => !prev)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all ${
              autoPilotActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Continuous 24/7 autonomous municipal deed sweeper and off-market distress radar"
          >
            <Radio className={`w-3.5 h-3.5 ${autoPilotActive ? 'text-emerald-400 animate-pulse' : ''}`} />
            <span>24/7 Auto-Pilot</span>
            <span className={`w-2 h-2 rounded-full ${autoPilotActive ? 'bg-emerald-400 animate-ping' : 'bg-slate-600'}`} />
          </button>

          {/* Quick Institutional Proof & Memo Modals */}
          <button
            onClick={() => setShowDocModal('crypto_proof')}
            className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Verify SHA-256 Merkle Chain consensus proofs across all 6 agents"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden xl:inline">Merkle Proof</span>
          </button>

          <button
            onClick={() => setShowDocModal('ic_memo')}
            className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Institutional Investment Committee (IC) Memorandum"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline">IC Memo</span>
          </button>

          {/* Turbo vs Realtime Switcher */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setSpeedMode('turbo')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                speedMode === 'turbo' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Turbo mode processes each phase in 800ms"
            >
              <FastForward className="w-3 h-3" />
              <span>Turbo</span>
            </button>
            <button
              onClick={() => setSpeedMode('realtime')}
              className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
                speedMode === 'realtime' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
              title="Real-time mode simulates full voice and negotiation pacing"
            >
              <Clock className="w-3 h-3" />
              <span>Real-Time</span>
            </button>
          </div>

          {/* Action Trigger based on Swarm Mode */}
          {swarmMode === 'single' ? (
            isRunning ? (
              <button
                onClick={handlePauseSwarm}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Pause className="w-3.5 h-3.5" />
                <span>Pause Swarm</span>
              </button>
            ) : (
              <button
                onClick={handleStartAutonomousSwarm}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Autonomous Swarm (Start to Finish)</span>
              </button>
            )
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDocModal('portfolio_docket')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" />
                <span>Portfolio Docket</span>
              </button>

              <button
                onClick={handleStartFleetSwarm}
                disabled={fleetRunning}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold rounded-lg transition-all flex items-center gap-2 shadow-sm whitespace-nowrap"
              >
                {fleetRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Fleet Executing ({fleetProperties.length} Assets)...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 fill-white" />
                    <span>Deploy Fleet Swarm ({fleetProperties.length} Assets)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 24/7 Continuous Autonomous Radar Banner (When Active) */}
      {autoPilotActive && (
        <div className="border-b border-emerald-500/40 bg-gradient-to-r from-emerald-950/70 via-slate-950 to-slate-900 px-6 py-3 transition-all animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex items-center justify-center shrink-0">
                <span className="absolute w-5 h-5 rounded-full bg-emerald-400/30 animate-ping" />
                <div className="w-3 h-3 rounded-full bg-emerald-400 relative z-10" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    24/7 Autonomous Radar Active
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40 font-mono">
                    3,142 Municipal Registrars Monitored
                  </span>
                </div>
                <div className="text-xs text-slate-300 mt-0.5 truncate">
                  Latest Beacon: <span className="text-white font-medium">{radarLogs[0]?.text || 'Scanning national deed registries...'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono shrink-0">
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <span className="text-slate-400">Deeds Scanned: </span>
                <span className="text-emerald-400 font-bold">{radarCount.toLocaleString()}</span>
              </div>
              <div className="bg-slate-950/80 px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <span className="text-slate-400">Distress Pings: </span>
                <span className="text-amber-400 font-bold">{radarDistressCount} Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. QUANTITATIVE RIGOR & SUMMARY METRICS RIBBON                 */}
      {/* ============================================================== */}
      {swarmMode === 'single' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-3 border-b border-slate-800 bg-slate-900/40 text-xs">
          <div>
            <span className="text-slate-400">Target Clearing Valuation:</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              ${(currentProperty.historicalRates.suggestedTargetOfferPrice / 1000000).toFixed(2)}M
            </div>
            <div className="text-[11px] text-emerald-400">
              ${Math.round(currentProperty.historicalRates.suggestedTargetOfferPrice / currentProperty.squareFeet)}/sqft target
            </div>
          </div>

          <div>
            <span className="text-slate-400">Dual Commission Platform Capture:</span>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              ${Math.round(currentProperty.historicalRates.suggestedTargetOfferPrice * 0.045).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              Seller 2.5% + Buyer 2.0% finder fee
            </div>
          </div>

          <div>
            <span className="text-slate-400">Swarm Execution Status:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : activeExecution?.status === 'completed' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className="font-bold text-white uppercase text-[11px]">
                {isRunning ? 'Autonomous Agents Executing' : activeExecution?.status === 'completed' ? 'Deal Closed & Distributed' : 'Ready for Launch'}
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Phase {phasesInfo.findIndex(p => p.id === activeTabPhase) + 1} of 6: {phasesInfo.find(p => p.id === activeTabPhase)?.title}
            </div>
          </div>

          <div>
            <span className="text-slate-400">Lead Buyer Capital Pool:</span>
            <div className="text-base font-bold text-indigo-300 truncate mt-0.5">
              {activeExecution?.buyerMatchResult?.buyerName || 'Clarion Ridge Capital'}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              ${((activeExecution?.buyerMatchResult?.maxBudget || 25000000) / 1000000).toFixed(0)}M Proof of Funds
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-3 border-b border-slate-800 bg-slate-900/60 text-xs">
          <div>
            <span className="text-slate-400">Monitored Corridor Deal Volume:</span>
            <div className="text-base font-bold text-white font-mono mt-0.5">
              ${(fleetProperties.reduce((acc, p) => acc + p.zestimate, 0) / 1000000).toFixed(1)}M Total AVM
            </div>
            <div className="text-[11px] text-emerald-400">
              {fleetProperties.length} institutional assets in corridor
            </div>
          </div>

          <div>
            <span className="text-slate-400">Aggregated Blended Platform Take (4.5%):</span>
            <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">
              ${Math.round(fleetProperties.reduce((acc, p) => acc + p.historicalRates.suggestedTargetOfferPrice * 0.045, 0)).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400">
              Seller 2.5% + Buyer 2.0% fee capture
            </div>
          </div>

          <div>
            <span className="text-slate-400">Concurrent Autonomous Workers:</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`w-2 h-2 rounded-full ${fleetRunning ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500'}`} />
              <span className="font-bold text-white font-mono text-sm">
                {fleetProperties.length * 6} Parallel Neural Threads
              </span>
            </div>
            <div className="text-[11px] text-emerald-400">
              {fleetRunning ? 'All 6 agents executing in parallel' : 'Ready for batch execution'}
            </div>
          </div>

          <div>
            <span className="text-slate-400">Corridor Rollup Docket:</span>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => setShowDocModal('portfolio_docket')}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Award className="w-3.5 h-3.5" />
                <span>View Portfolio Rollup Docket</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. INTERACTIVE 6-PHASE PROGRESS PIPELINE                       */}
      {/* ============================================================== */}
      {swarmMode === 'single' && (
        <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-3 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[760px] gap-2">
            {phasesInfo.map((p, idx) => {
              const isActive = activeTabPhase === p.id;
              const currentIdx = phasesInfo.findIndex(item => item.id === activeExecution?.currentPhase);
              const isCompleted = activeExecution?.status === 'completed' || idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <button
                  key={p.id}
                  onClick={() => setActiveTabPhase(p.id)}
                  className={`flex-1 flex items-center gap-2.5 p-2 rounded-xl text-left transition-all border ${
                    isActive
                      ? 'bg-slate-900 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isCompleted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : isCurrent
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : p.number}
                  </div>

                  <div className="min-w-0">
                    <div className="text-[10px] uppercase font-bold text-slate-400 truncate">
                      Agent {p.agent}
                    </div>
                    <div className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                      {p.title}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. MAIN WORKBENCH SPLIT: WORKBENCH VIEW + LIVE TERMINAL LOGS   */}
      {/* ============================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {swarmMode === 'fleet' ? (
          /* Corridor Fleet Operations Matrix (Scalability Engine) */
          <div className="flex-1 p-6 overflow-y-auto space-y-6 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Corridor Fleet Operations Matrix</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400 font-normal">{fleetCorridor} Growth Corridor</span>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                  Multi-Asset Autonomous Execution Deck ({fleetProperties.length} Assets)
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartFleetSwarm}
                  disabled={fleetRunning}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition-all"
                >
                  {fleetRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Fleet Threads...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 fill-white" />
                      <span>Deploy Swarm on All Corridor Assets</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Fleet Assets Matrix Cards */}
            <div className="space-y-3">
              {fleetProperties.map(prop => {
                const status = fleetStatusMap[prop.id] || { currentPhase: 'scout', progress: 15, status: 'idle' };
                const currentPhaseInfo = phasesInfo.find(p => p.id === status.currentPhase) || phasesInfo[0];
                const targetPrice = prop.historicalRates.suggestedTargetOfferPrice;
                const dualFee = Math.round(targetPrice * 0.045);
                const bestBuyer = prop.matchedBuyers?.[0];

                return (
                  <div
                    key={prop.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-5 space-y-4 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {prop.address}
                          </span>
                          <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {prop.city}, {prop.state}
                          </span>
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
                            {prop.propertyType}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 flex items-center gap-3">
                          <span>AVM: <strong className="text-white">${(prop.zestimate / 1000000).toFixed(2)}M</strong></span>
                          <span>·</span>
                          <span>Target Clearing: <strong className="text-emerald-400">${(targetPrice / 1000000).toFixed(2)}M</strong> (${Math.round(targetPrice / prop.squareFeet)}/sqft)</span>
                          <span>·</span>
                          <span>Deed Spread: <strong className="text-slate-300">+{prop.historicalRates.historicalAppreciationPct}%</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <div className="text-[10px] uppercase font-bold text-slate-400">Dual Platform Take</div>
                          <div className="text-base font-bold text-emerald-400 font-mono">
                            ${dualFee.toLocaleString()}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedPropertyId(prop.id);
                            setSwarmMode('single');
                          }}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <span>Inspect Asset</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Multi-Agent Progress Bar & Worker Indicator */}
                    <div className="space-y-1.5 bg-slate-950 p-3 rounded-lg border border-slate-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${status.status === 'completed' ? 'bg-emerald-400' : status.status === 'running' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                          <span className="font-semibold text-slate-200">
                            Phase {currentPhaseInfo.number}: {currentPhaseInfo.title}
                          </span>
                          <span className="text-[11px] text-emerald-400 font-mono">
                            [Agent {currentPhaseInfo.agent} · {currentPhaseInfo.role}]
                          </span>
                        </div>
                        <span className="text-xs font-mono font-bold text-white">
                          {status.progress}%
                        </span>
                      </div>

                      <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            status.status === 'completed' ? 'bg-emerald-500' : 'bg-gradient-to-r from-emerald-500 to-indigo-500'
                          }`}
                          style={{ width: `${status.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span>Delaware Owner: {prop.sellerContact.name} ({prop.sellerContact.commissionAgreedPct}% fee agreed)</span>
                        <span>Matched Capital: {bestBuyer?.buyerName || 'Clarion Ridge Capital'} (2.0% finder fee)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Aggregated Corridor Capital Stack Docket */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-400" />
                  Corridor Capital Aggregation & Escrow Docket
                </span>
                <span className="text-xs text-slate-400">
                  {fleetProperties.length} Properties Combined
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Gross Asset Value</div>
                  <div className="text-base font-bold text-white mt-1">
                    ${(fleetProperties.reduce((acc, p) => acc + p.zestimate, 0) / 1000000).toFixed(1)}M
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Seller Net Equity</div>
                  <div className="text-base font-bold text-slate-300 mt-1">
                    ${(fleetProperties.reduce((acc, p) => acc + (p.historicalRates.suggestedTargetOfferPrice * 0.975), 0) / 1000000).toFixed(1)}M
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Total Dual Platform Take</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">
                    ${Math.round(fleetProperties.reduce((acc, p) => acc + p.historicalRates.suggestedTargetOfferPrice * 0.045, 0)).toLocaleString()}
                  </div>
                </div>

                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-sans">Est. Escrow Velocity</div>
                  <div className="text-base font-bold text-indigo-400 mt-1">
                    14 Days
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Left: Active Phase Detailed Interactive Workbench */
          <div className="flex-1 p-6 overflow-y-auto space-y-6 min-w-0">
            {/* ============================================================ */}
            {/* PHASE 1: SCOUT & DEED FORENSICS                             */}
            {/* ============================================================ */}
            {activeTabPhase === 'scout' && (
              <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Phase 01 · Agent Argus (Deed Forensics Scout)
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Municipal Title Scraping & Historical Rate Forensics
                  </h2>
                </div>
                <button
                  onClick={() => setShowDocModal('deed')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Inspect Scanned Deed Dossier</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Historical Deed Rate</div>
                  <div className="text-2xl font-bold text-white font-mono">
                    ${activeExecution?.deedForensics?.originalPriceSqFt}/sqft
                  </div>
                  <div className="text-xs text-slate-400">
                    Recorded in {activeExecution?.deedForensics?.deedYear} deed transfer
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Current Market Valuation</div>
                  <div className="text-2xl font-bold text-indigo-400 font-mono">
                    ${activeExecution?.deedForensics?.currentAvmSqFt}/sqft
                  </div>
                  <div className="text-xs text-slate-400">
                    Automated Valuation Model (AVM)
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Target Offer Clearing Rate</div>
                  <div className="text-2xl font-bold text-emerald-400 font-mono">
                    ${activeExecution?.deedForensics?.targetPriceSqFt}/sqft
                  </div>
                  <div className="text-xs text-emerald-400">
                    +${activeExecution?.deedForensics?.appreciationPct}% historical spread
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Liquidation Catalyst & Owner Equity Profile
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400">Detected Trigger:</span>
                    <div className="text-amber-300 font-medium bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      {activeExecution?.deedForensics?.liquidationTrigger}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400">Unlevered Equity Buildup:</span>
                    <div className="text-emerald-400 font-bold font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                      ${activeExecution?.deedForensics?.equityBuildUpUsd?.toLocaleString()} in principal equity
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PHASE 2: SELLER ENGAGEMENT & LIVE AI VOICE CALL             */}
          {/* ============================================================ */}
          {activeTabPhase === 'seller_call' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Phase 02 · Agent Aria (Voice Seller Closer)
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Delaware LLC Unmasking & Autonomous Voice Call
                  </h2>
                </div>
                <button
                  onClick={() => setShowDocModal('representation')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>View Signed 2.5% Representation Mandate</span>
                </button>
              </div>

              {/* Unmasked Delaware Principal Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-white uppercase tracking-wider">
                    Unmasked Beneficial Managing GP
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                    Skip-Trace Confidence 98%
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Beneficial Owner:</span>
                    <div className="font-bold text-white mt-0.5">{activeExecution?.sellerEngagement?.sellerName}</div>
                    <div className="text-[11px] text-slate-500">{activeExecution?.sellerEngagement?.unmaskedEntity}</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Direct Cellular:</span>
                    <div className="font-bold text-emerald-400 font-mono mt-0.5">{activeExecution?.sellerEngagement?.verifiedCell}</div>
                    <div className="text-[11px] text-slate-500">Verified AT&T Wireless Direct</div>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400">Agreed Seller Fee:</span>
                    <div className="font-bold text-amber-400 font-mono text-base mt-0.5">
                      {activeExecution?.sellerEngagement?.sellerCommissionAgreedPct}% Title Escrow Fee
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Voice Call Audio Simulation & Waveform */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Live AI Voice Call Transcript & Audio Stream</div>
                      <div className="text-[11px] text-slate-400">Agent Aria ↔ {activeExecution?.sellerEngagement?.sellerName}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleVoicePlayback}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    {activeCallAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{activeCallAudio ? 'Stop Synthetic Speech' : 'Play AI Voice Call (Real Audio)'}</span>
                  </button>
                </div>

                {/* Animated Audio Waveform */}
                <div className="h-10 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center gap-1 px-4 overflow-hidden">
                  {Array.from({ length: 48 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 bg-emerald-500/80 rounded-full transition-all duration-300"
                      style={{
                        height: isRunning || activeCallAudio ? `${Math.sin(i * 0.4) * 14 + 16}px` : '4px'
                      }}
                    />
                  ))}
                </div>

                {/* Scrolling Transcript with Synced Speech Highlighting */}
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-2 text-xs">
                  {activeExecution?.sellerEngagement?.callTranscript?.map((line, idx) => {
                    const isSpeakingNow = activeSpeechLineIdx === idx;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border leading-relaxed transition-all ${
                          isSpeakingNow
                            ? 'ring-2 ring-emerald-400 bg-emerald-950/70 border-emerald-500 scale-[1.01]'
                            : line.speaker.includes('Aria')
                            ? 'bg-slate-950 border-slate-800 text-slate-200'
                            : line.sentiment === 'closed'
                            ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-200 font-medium'
                            : 'bg-amber-950/20 border-amber-800/50 text-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold flex items-center gap-1.5">
                            <span>{line.speaker}</span>
                            {isSpeakingNow && (
                              <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                                ● Speaking Now...
                              </span>
                            )}
                          </span>
                          <span className="font-mono">{line.time}</span>
                        </div>
                        <p>{line.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Interactive Tough Seller Objection Simulator (AI Dynamic Speech Counters) */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Interactive Seller Objection Simulator</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Test Agent Aria's real-time voice counters to high-stakes institutional seller pushback
                    </div>
                  </div>
                  {isSpeakingObjection && (
                    <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 animate-pulse flex items-center gap-1">
                      <Volume2 className="w-3 h-3" />
                      <span>Simulating AI Voice Counter...</span>
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {sellerObjections.map((obj, i) => (
                    <button
                      key={obj.id}
                      onClick={() => handleSimulateObjection(i)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        selectedObjectionIdx === i
                          ? 'bg-slate-950 border-emerald-500 ring-1 ring-emerald-500/40 shadow-xs'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                        <span>{obj.title}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {obj.winRate}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 italic leading-snug">"{obj.sellerQuestion}"</p>
                    </button>
                  ))}
                </div>

                {/* Active Selected Objection Detail & Agent Aria Counter Strategy */}
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/30 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Agent Aria Autonomous Counter Strategy ({sellerObjections[selectedObjectionIdx]?.title})</span>
                    </span>
                    <button
                      onClick={() => handleSimulateObjection(selectedObjectionIdx)}
                      className="text-xs text-white hover:text-emerald-300 flex items-center gap-1 font-semibold bg-emerald-600 hover:bg-emerald-500 px-2.5 py-1 rounded-md transition-colors"
                    >
                      <Volume2 className="w-3 h-3 text-white" />
                      <span>Hear Voice Counter</span>
                    </button>
                  </div>
                  <p className="text-slate-200 leading-relaxed font-sans text-xs">
                    {sellerObjections[selectedObjectionIdx]?.ariaCounter}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PHASE 3: INSTITUTIONAL CAPITAL MATCH & MEMO                 */}
          {/* ============================================================ */}
          {activeTabPhase === 'buyer_match' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Phase 03 · Agent Sterling (Capital Matchmaker)
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Institutional Buy-Box Matching & Deal Memo Delivery
                  </h2>
                </div>
                <button
                  onClick={() => setShowDocModal('memo')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Inspect Institutional Deal Memo</span>
                </button>
              </div>

              {/* Matched Buyer Details */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Match Fit Score {activeExecution?.buyerMatchResult?.fitScore}%
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {activeExecution?.buyerMatchResult?.buyerName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {activeExecution?.buyerMatchResult?.entityName} · {activeExecution?.buyerMatchResult?.buyerType}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400">Allocated Buy-Box</span>
                    <div className="text-xl font-bold text-white font-mono">
                      ${((activeExecution?.buyerMatchResult?.maxBudget || 25000000) / 1000000).toFixed(0)}M Max Budget
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-3 border-t border-slate-800">
                  <div>
                    <span className="text-slate-400">Authorized GP Contact:</span>
                    <div className="font-semibold text-white mt-0.5">{activeExecution?.buyerMatchResult?.contactName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{activeExecution?.buyerMatchResult?.contactPhone}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Agreed Buyer Finder Fee:</span>
                    <div className="font-bold text-indigo-400 font-mono mt-0.5">
                      {activeExecution?.buyerMatchResult?.buyerFinderFeeAgreedPct}% Finder Mandate Executed
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Confidential Memo Delivery:</span>
                    <div className="font-semibold text-emerald-400 mt-0.5">
                      Delivered via Secure Data Room
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PHASE 4: MULTI-AGENT CLEARING PRICE ARBITER & LOI           */}
          {/* ============================================================ */}
          {activeTabPhase === 'negotiation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Phase 04 · Agent Solon (Clearing Price Arbiter)
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Multi-Agent Clearing Price Arbitration & Bilateral LOI
                  </h2>
                </div>
                <button
                  onClick={() => setShowDocModal('loi')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Bilateral LOI</span>
                </button>
              </div>

              {/* Clearing Price Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Harmonized Clearing Price</div>
                  <div className="text-2xl font-bold text-white font-mono">
                    ${((activeExecution?.negotiationArbitration?.clearingPrice || 17200000) / 1000000).toFixed(2)}M
                  </div>
                  <div className="text-xs text-emerald-400">
                    {activeExecution?.negotiationArbitration?.sellerDiscountPct}% discount from AVM
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Buyer Instant Equity Spread</div>
                  <div className="text-2xl font-bold text-indigo-400 font-mono">
                    +${((activeExecution?.negotiationArbitration?.buyerEquityBufferUsd || 1327000) / 1000).toFixed(0)}k
                  </div>
                  <div className="text-xs text-slate-400">
                    Day-one capital margin
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Escrow Closing Structure</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">
                    {activeExecution?.negotiationArbitration?.optimalStructure}
                  </div>
                  <div className="text-xs text-slate-400">
                    21-Day Closing with 3% Earnest
                  </div>
                </div>
              </div>

              {/* Multi-Round Convergence Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Algorithmic Round-by-Round Convergence
                </div>
                <div className="space-y-2 text-xs">
                  {activeExecution?.negotiationArbitration?.roundsSummary?.map((r, i) => (
                    <div key={i} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-emerald-400">Round {r.round}:</span>
                        <span className="text-slate-300">{r.note}</span>
                      </div>
                      <div className="flex items-center gap-3 font-mono text-[11px] shrink-0">
                        <span className="text-amber-400">Seller Bid: ${(r.sellerBid / 1000000).toFixed(2)}M</span>
                        <span className="text-indigo-400">Buyer Offer: ${(r.buyerOffer / 1000000).toFixed(2)}M</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dynamic Game-Theoretic Hurdle & Capital Stack Sandbox (Agent Solon Solver) */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Dynamic Hurdle & Capital Stack Sandbox (Agent Solon Solver)
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Nash Equilibrium: Active
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Senior Debt LTV:</span>
                      <span className="font-mono font-bold text-emerald-400">{seniorDebtLtv}%</span>
                    </div>
                    <input
                      type="range"
                      min={50}
                      max={80}
                      step={5}
                      value={seniorDebtLtv}
                      onChange={e => setSeniorDebtLtv(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-500">
                      Senior tranche: ${(Math.round(currentProperty.historicalRates.suggestedTargetOfferPrice * seniorDebtLtv / 100) / 1000000).toFixed(2)}M
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Commercial Benchmark:</span>
                      <span className="font-mono font-bold text-indigo-400">{sofrBenchmark}% SOFR+Spread</span>
                    </div>
                    <input
                      type="range"
                      min={5.0}
                      max={8.5}
                      step={0.25}
                      value={sofrBenchmark}
                      onChange={e => setSofrBenchmark(Number(e.target.value))}
                      className="w-full accent-indigo-500 cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-500">
                      Debt service: ${(Math.round((currentProperty.historicalRates.suggestedTargetOfferPrice * seniorDebtLtv / 100) * (sofrBenchmark / 100)) / 1000).toFixed(0)}k/yr
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Target Buyer IRR Hurdle:</span>
                      <span className="font-mono font-bold text-purple-400">{buyerHurdleIrr}% IRR</span>
                    </div>
                    <input
                      type="range"
                      min={11.0}
                      max={20.0}
                      step={0.5}
                      value={buyerHurdleIrr}
                      onChange={e => setBuyerHurdleIrr(Number(e.target.value))}
                      className="w-full accent-purple-500 cursor-pointer"
                    />
                    <div className="text-[10px] text-slate-500">
                      DSCR clearance: {(currentProperty.estimatedNetOperatingIncome / Math.max(1, (currentProperty.historicalRates.suggestedTargetOfferPrice * seniorDebtLtv / 100) * (sofrBenchmark / 100))).toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PHASE 5: DUE DILIGENCE & TITLE AUDIT                        */}
          {/* ============================================================ */}
          {activeTabPhase === 'due_diligence' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Phase 05 · Agent Veritas (Diligence Auditor)
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    Autonomous Due Diligence, Title Sweep & Estoppel Verification
                  </h2>
                </div>
                <button
                  onClick={() => setShowDocModal('diligence')}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-purple-400" />
                  <span>Inspect Diligence Binder</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Title Commitment & Liens</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    County title sweep confirmed zero delinquent tax liens or pending mechanics claims. Delaware corporate registry confirmed active good standing.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-400">
                    Status: {activeExecution?.dueDiligenceAudit?.titleSearchStatus}
                  </div>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Phase I Environmental (ESA)</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Automated OCR analysis of historical aerial photographs, radon logs, and surrounding soil conditions passed EPA Tier-1 standards.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-400">
                    ESA Result: {activeExecution?.dueDiligenceAudit?.environmentalPhase1}
                  </div>
                </div>
              </div>

              {/* Estoppel & Rent Roll Clearance */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Tenant Estoppel Audit</span>
                  <span className="text-emerald-400 font-bold">
                    {activeExecution?.dueDiligenceAudit?.estoppelCertificatesVerified} / {activeExecution?.dueDiligenceAudit?.totalTenantLeasesAudited} Leases Verified (100%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full rounded-full" />
                </div>
                <div className="text-slate-400 text-[11px]">
                  All commercial lease estoppels delivered, confirming zero rental arrears or tenant lease disputes.
                </div>
              </div>

              {/* Cryptographic RWA Deed Fingerprint & Delaware Verification */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-indigo-400" />
                    Cryptographic Title Integrity & State Registry Certification
                  </span>
                  <span className="text-emerald-400 font-mono font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Delaware Charter #6849201-DE
                  </span>
                </div>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1">
                  <div>SHA-256 Merkle Root: <span className="text-emerald-400">7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069</span></div>
                  <div>Municipal Indexing: <span className="text-slate-300">County Assessor Book 1044 / Page 812 · Zero Lis Pendens</span></div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PHASE 6: ESCROW WIRE SETTLEMENT & DUAL COMMISSION CLOSE     */}
          {/* ============================================================ */}
          {activeTabPhase === 'closing' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Phase 06 · Agent Nexus (Escrow Settlement Closer)
                  </div>
                  <h2 className="text-xl font-bold text-white tracking-tight mt-0.5">
                    ALTA Settlement Statement, Wire Execution & Dual Commission Capture
                  </h2>
                </div>
                <button
                  onClick={() => setShowDocModal('alta')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print ALTA Settlement Docket</span>
                </button>
              </div>

              {/* Official ALTA Settlement Financials Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                  <div>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Official ALTA Escrow Closing Statement
                    </span>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Docket Ref: {activeExecution?.closingSettlement?.altaStatementRef}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Funds Cleared & Wired
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <span className="text-slate-300 font-medium">Gross Purchase Valuation:</span>
                    <span className="text-white font-mono font-bold text-sm">
                      ${activeExecution?.closingSettlement?.grossSalePrice?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <div>
                      <span className="text-amber-400 font-semibold">Seller Representation Fee (2.5%):</span>
                      <div className="text-[11px] text-slate-500">Deducted from Seller Gross Proceeds at Title Close</div>
                    </div>
                    <span className="text-amber-400 font-mono font-bold text-sm">
                      +${activeExecution?.closingSettlement?.sellerCommissionTake?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <div>
                      <span className="text-indigo-400 font-semibold">Buyer Finder's Fee (2.0%):</span>
                      <div className="text-[11px] text-slate-500">Directly remitted by Institutional Purchaser to Platform Escrow</div>
                    </div>
                    <span className="text-indigo-400 font-mono font-bold text-sm">
                      +${activeExecution?.closingSettlement?.buyerFinderFeeTake?.toLocaleString()}
                    </span>
                  </div>

                  {/* Dual Commission Highlight */}
                  <div className="bg-emerald-950/40 p-4 rounded-xl border border-emerald-900/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                        Total Dual Platform Capture (Seller + Buyer)
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Deposited to Acuity Escrow Account #{activeExecution?.closingSettlement?.escrowWireRef}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-emerald-400 font-mono">
                      ${activeExecution?.closingSettlement?.totalPlatformTake?.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2 border-b border-slate-800/60">
                    <div>
                      <span className="text-slate-300 font-medium">Net Proceeds Wired to 1031 Qualified Intermediary:</span>
                      <div className="text-[11px] text-slate-500">{activeExecution?.closingSettlement?.qualifiedIntermediary1031Routing}</div>
                    </div>
                    <span className="text-white font-mono font-bold text-sm">
                      ${activeExecution?.closingSettlement?.netSellerProceeds?.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Deed transfer recorded electronically with County Assessor. IMAD: #20261017MMQFMP2C000341</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowDocModal('fedwire_receipt')}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Fedwire Voucher</span>
                    </button>

                    {onNavigateToBridgeRoom && (
                      <button
                        onClick={() => onNavigateToBridgeRoom(currentProperty.id)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>Open in Deal Room Exchange</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

        {/* Right: Live Real-Time Agent Stream Logs & Activity Feed */}
        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900/80 flex flex-col shrink-0 min-h-[300px]">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Autonomous Stream Log
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {activeExecution?.logs?.length || 0} events
            </span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-[11px] leading-relaxed">
            {activeExecution?.logs?.map(log => (
              <div key={log.id} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="text-emerald-400 font-bold">[{log.agentName}]</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="text-slate-300 font-sans text-xs">
                  {log.message}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 5. DOCUMENT INSPECTION MODAL                                   */}
      {/* ============================================================== */}
      {showDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6 text-slate-900">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  Autonomous Multi-Agent Executed Legal Document
                </div>
                <h3 className="text-lg font-bold">
                  {showDocModal === 'representation' && 'Exclusive Off-Market Representation Mandate (2.5%)'}
                  {showDocModal === 'loi' && 'Bilateral Letter of Intent (LOI) & Escrow Instructions'}
                  {showDocModal === 'alta' && 'Official ALTA / HUD-1 Settlement Closing Docket'}
                  {showDocModal === 'deed' && 'Scanned Municipal Deed Forensics Dossier'}
                  {showDocModal === 'memo' && 'Confidential Institutional Deal Underwriting Memo'}
                  {showDocModal === 'diligence' && 'Comprehensive Due Diligence & Title Audit Binder'}
                  {showDocModal === 'portfolio_docket' && 'Institutional Corridor Portfolio Aggregation Docket'}
                  {showDocModal === 'crypto_proof' && 'Institutional Cryptographic Proof-of-Execution Ledger (SHA-256 Merkle Chain)'}
                  {showDocModal === 'ic_memo' && 'Institutional Investment Committee (IC) Memorandum'}
                  {showDocModal === 'fedwire_receipt' && 'Fedwire RTGS Escrow Wire Transfer Voucher'}
                </h3>
              </div>
              <button
                onClick={() => setShowDocModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs leading-relaxed font-sans">
              {/* Specialized View: Crypto Proof of Execution */}
              {showDocModal === 'crypto_proof' ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-emerald-50 p-4 rounded-xl border border-emerald-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">Merkle Consensus State Verified</div>
                        <div className="text-[11px] text-slate-600 font-mono">Consensus Verifier v4.2 · ECDSA secp256k1 Signed</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                      100% Immutable
                    </span>
                  </div>

                  <div className="p-3 bg-slate-900 text-white rounded-lg font-mono text-[11px] space-y-1">
                    <div className="text-slate-400">Merkle Root Hash:</div>
                    <div className="text-emerald-400 font-bold break-all">
                      0x89e47bf14e59002a7b8e19273c51f4632dbb74b12aa31e902b3765e908da2241
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                      6-Agent Cryptographic Block Signatures:
                    </h5>
                    {[
                      { num: 1, agent: 'Argus (Deed Scraper)', hash: '0x7f10a8b92c4e51928374a6b5c0d1e2f3a4b5c6d7', role: 'Municipal Register Scraping Comps & Deed Rate' },
                      { num: 2, agent: 'Aria (Voice Mandate)', hash: '0x4e3189bc01a74284b7264a938c5f6e1d2a3b4c5d', role: 'Seller Voice Consent Audio Biometric & 2.5% Mandate' },
                      { num: 3, agent: 'Sterling (Capital Match)', hash: '0x9e88a51203d94b7e8c1a2b3c4d5e6f7a8b9c0d1e', role: 'Institutional POF Balance $150M RTGS Pre-Clearance' },
                      { num: 4, agent: 'Solon (Game Theory)', hash: '0x2b4c77109a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d', role: 'Nash Equilibrium Clearing Valuation Settlement' },
                      { num: 5, agent: 'Veritas (Title & Diligence)', hash: '0x6189db093e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b', role: 'ALTA Survey, Phase I ESA & Mechanical Estoppel' },
                      { num: 6, agent: 'Nexus (Escrow Wire Closer)', hash: '0x442199bc1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d', role: 'Dual Platform Commission Escrow Wire Release' }
                    ].map(b => (
                      <div key={b.num} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-mono">
                              0{b.num}
                            </span>
                            <span>{b.agent}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono break-all">{b.hash}</div>
                          <div className="text-[10px] text-slate-600">{b.role}</div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Verified</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : showDocModal === 'portfolio_docket' ? (
                /* Specialized View: Portfolio Docket */
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Corridor Scope:</span>
                      <span className="font-bold text-slate-900">{fleetCorridor} Growth Corridor</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Total Aggregate Asset Value:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        ${(fleetProperties.reduce((acc, p) => acc + p.zestimate, 0) / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Total Dual Platform Commissions:</span>
                      <span className="font-bold text-emerald-600 font-mono text-sm">
                        ${Math.round(fleetProperties.reduce((acc, p) => acc + p.historicalRates.suggestedTargetOfferPrice * 0.045, 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                        <tr>
                          <th className="p-2.5">Asset</th>
                          <th className="p-2.5">City</th>
                          <th className="p-2.5">SqFt</th>
                          <th className="p-2.5">Clearing Valuation</th>
                          <th className="p-2.5">Platform Take (4.5%)</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {fleetProperties.map(p => (
                          <tr key={p.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-medium text-slate-900">{p.address}</td>
                            <td className="p-2.5 text-slate-600">{p.city}, {p.state}</td>
                            <td className="p-2.5 font-mono text-slate-600">{p.squareFeet.toLocaleString()}</td>
                            <td className="p-2.5 font-mono font-bold text-slate-900">
                              ${p.historicalRates.suggestedTargetOfferPrice.toLocaleString()}
                            </td>
                            <td className="p-2.5 font-mono font-bold text-emerald-600">
                              ${Math.round(p.historicalRates.suggestedTargetOfferPrice * 0.045).toLocaleString()}
                            </td>
                            <td className="p-2.5">
                              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                                {fleetStatusMap[p.id]?.status === 'completed' ? 'Escrow Ready' : 'In Flight'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : showDocModal === 'ic_memo' ? (
                /* Specialized View: Institutional IC Memo */
                <div className="space-y-4">
                  <div className="text-center pb-3 border-b border-slate-200">
                    <h4 className="font-bold text-sm uppercase text-slate-900 tracking-wider">
                      INVESTMENT COMMITTEE MEMORANDUM & UNDERWRITING DOSSIER
                    </h4>
                    <p className="text-[11px] text-slate-500">Autonomous Acquisition & Bridge Mandate · Prepared by Acuity Neural Swarm</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px] bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div><strong>Subject Asset:</strong> {currentProperty.address}, {currentProperty.city}, {currentProperty.state}</div>
                    <div><strong>Asset Class:</strong> {currentProperty.propertyType} ({currentProperty.squareFeet.toLocaleString()} RSF)</div>
                    <div><strong>Seller Principal:</strong> {currentProperty.sellerContact.name} ({currentProperty.sellerContact.entity})</div>
                    <div><strong>Institutional Buyer:</strong> {activeExecution?.buyerMatchResult?.buyerName} ({activeExecution?.buyerMatchResult?.entityName})</div>
                    <div><strong>Target Price:</strong> ${activeExecution?.closingSettlement?.grossSalePrice?.toLocaleString()}</div>
                    <div><strong>Dual Platform Revenue:</strong> ${activeExecution?.closingSettlement?.totalPlatformTake?.toLocaleString()} (4.5% total)</div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <h5 className="font-bold text-slate-900">Executive Acquisition Rationale:</h5>
                    <p className="text-slate-600 leading-relaxed">
                      Agent Argus scraped historical deeds indicating an appreciation spread of +{currentProperty.historicalRates.appreciationSpreadPct}% from the previous deed basis (${currentProperty.historicalRates.oldPricePerSqFt}/sqft). Agent Aria secured an exclusive off-market representation agreement with the Delaware LLC managing GP. Agent Sterling validated matching criteria for institutional yield hurdles. Agent Solon calculated the game-theoretic Nash equilibrium clearing valuation. Agent Veritas verified clean title, Phase I ESA, and structural estoppels with zero material exceptions.
                    </p>
                  </div>
                </div>
              ) : (
                /* Standard Legal Document View */
                <div className="space-y-4 font-serif">
                  <div className="text-center pb-3 border-b border-slate-200 font-sans">
                    <h4 className="font-bold text-sm uppercase text-slate-900">
                      ACUITY CAPITAL INTELLIGENCE & TRANSACTION SETTLEMENT
                    </h4>
                    <p className="text-[11px] text-slate-500">Docket Identification: {activeExecution?.id || 'DOCKET-SWARM-2026'}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans space-y-2 text-[11px]">
                    <div><strong>Subject Property:</strong> {currentProperty.address}, {currentProperty.city}, {currentProperty.state}</div>
                    <div><strong>Beneficial Owner (Seller):</strong> {currentProperty.sellerContact.name} ({currentProperty.sellerContact.entity})</div>
                    <div><strong>Institutional Purchaser:</strong> {activeExecution?.buyerMatchResult?.buyerName} ({activeExecution?.buyerMatchResult?.entityName})</div>
                    <div><strong>Agreed Clearing Price:</strong> ${activeExecution?.closingSettlement?.grossSalePrice?.toLocaleString()}</div>
                    <div><strong>Seller-Side Fee (2.5%):</strong> ${activeExecution?.closingSettlement?.sellerCommissionTake?.toLocaleString()}</div>
                    <div><strong>Buyer-Side Fee (2.0%):</strong> ${activeExecution?.closingSettlement?.buyerFinderFeeTake?.toLocaleString()}</div>
                    <div><strong>Total Dual Platform Escrow Take:</strong> ${activeExecution?.closingSettlement?.totalPlatformTake?.toLocaleString()}</div>
                  </div>

                  <p>
                    <strong>Execution Certification:</strong> This transaction was originated, negotiated, and audited autonomously by Acuity's Multi-Agent Neural Swarm (Agents Argus, Aria, Sterling, Solon, Veritas, and Nexus). All terms comply with bilateral dual-brokerage statutory requirements and 1031 safe-harbor rules.
                  </p>
                </div>
              )}
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setShowDocModal(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {showDocModal === 'crypto_proof' && (
                  <button
                    onClick={handleDownloadCryptoAudit}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Merkle Proof (.JSON)</span>
                  </button>
                )}

                {showDocModal === 'portfolio_docket' && (
                  <button
                    onClick={handleDownloadPortfolioCSV}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Portfolio Data (.CSV)</span>
                  </button>
                )}

                {showDocModal === 'ic_memo' && (
                  <button
                    onClick={handleDownloadICMemo}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download IC Memo (.TXT)</span>
                  </button>
                )}

                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Docket</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
