import React from 'react';
import {
  Users,
  Building2,
  FolderKanban,
  Mail,
  Sparkles,
  BarChart3,
  Cable,
  Settings,
  ShieldCheck,
  Flame,
  UserCheck,
  Bot,
  DollarSign,
  Activity,
  PhoneCall,
  Home,
  Layers,
  Handshake,
  ArrowRight,
  Cpu,
  X
} from 'lucide-react';

export type NavigationTab = 
  | 'prospects'
  | 'companies'
  | 'intent'
  | 'jobchanges'
  | 'properties'
  | 'buyerportal'
  | 'swarm'
  | 'lists'
  | 'sequences'
  | 'aisdr'
  | 'deals'
  | 'enrichment'
  | 'warmup'
  | 'conversations'
  | 'analytics'
  | 'integrations'
  | 'settings';

interface SidebarProps {
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  contactCount: number;
  companyCount: number;
  listsCount: number;
  sequencesCount: number;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  onOpenLandingPage?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  contactCount,
  companyCount,
  listsCount,
  sequencesCount,
  isMobileOpen,
  onCloseMobile,
  onOpenLandingPage
}) => {
  const handleItemClick = (tab: NavigationTab) => {
    onSelectTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const prospectingItems = [
    {
      id: 'prospects' as NavigationTab,
      label: 'People Search',
      icon: Users,
      count: contactCount
    },
    {
      id: 'companies' as NavigationTab,
      label: 'Companies',
      icon: Building2,
      count: companyCount
    },
    {
      id: 'intent' as NavigationTab,
      label: 'Buyer Intent Signals',
      icon: Flame,
      badge: '6sense'
    },
    {
      id: 'jobchanges' as NavigationTab,
      label: 'Job Changes & Champions',
      icon: UserCheck,
      badge: 'UserGems'
    },
    {
      id: 'lists' as NavigationTab,
      label: 'Lead Lists',
      icon: FolderKanban,
      count: listsCount
    },
    {
      id: 'deals' as NavigationTab,
      label: 'Deals & Attribution',
      icon: DollarSign,
      badge: 'Clari'
    }
  ];

  const realEstateItems = [
    {
      id: 'properties' as NavigationTab,
      label: 'Properties & Rates (Zillow)',
      icon: Home,
      badge: 'Zillow'
    },
    {
      id: 'buyerportal' as NavigationTab,
      label: 'Bridge & Dual Commission',
      icon: Handshake,
      badge: 'Bridge'
    },
    {
      id: 'swarm' as NavigationTab,
      label: 'Autonomous Agent Swarm',
      icon: Cpu,
      badge: 'Start-to-Finish'
    }
  ];

  const engagementItems = [
    {
      id: 'sequences' as NavigationTab,
      label: 'Sequences & Outreach',
      icon: Mail,
      count: sequencesCount
    },
    {
      id: 'aisdr' as NavigationTab,
      label: 'Autonomous AI SDR',
      icon: Bot,
      badge: '11x'
    },
    {
      id: 'enrichment' as NavigationTab,
      label: 'Enrichment & Waterfall',
      icon: Sparkles,
      badge: 'Clay'
    },
    {
      id: 'warmup' as NavigationTab,
      label: 'Mailbox Pool & Warmup',
      icon: Activity,
      badge: 'Instantly'
    },
    {
      id: 'conversations' as NavigationTab,
      label: 'Meeting Intelligence',
      icon: PhoneCall,
      badge: 'Gong'
    }
  ];

  const operationsItems = [
    {
      id: 'analytics' as NavigationTab,
      label: 'Analytics & Pipeline',
      icon: BarChart3
    },
    {
      id: 'integrations' as NavigationTab,
      label: 'Integrations & CRM',
      icon: Cable
    },
    {
      id: 'settings' as NavigationTab,
      label: 'Workspace & Team',
      icon: Settings
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 z-40 md:hidden backdrop-blur-2xs"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        ${isMobileOpen ? 'fixed inset-y-0 left-0 z-50 flex' : 'hidden md:flex'}
        w-64 bg-slate-900 text-slate-300 flex-col shrink-0 border-r border-slate-800 select-none
      `}>
        {/* Brand Header */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-indigo-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white leading-none">
                Acuity B2B
              </span>
              <span className="text-[11px] text-slate-400 mt-1 font-normal leading-none">
                Sales Intelligence Platform
              </span>
            </div>
          </div>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded"
              aria-label="Close sidebar navigation"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Navigation List */}
        <div className="p-3 flex-1 overflow-y-auto space-y-1">
          {/* Platform Overview Trigger */}
          {onOpenLandingPage && (
            <button
              onClick={onOpenLandingPage}
              className="w-full mb-3 flex items-center justify-between px-3 py-2.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all text-left group"
              title="View the Billion Dollar Landing Page & Vision"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-400 group-hover:rotate-12 transition-transform" />
                <span>Platform Overview & Vision</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          )}

          {/* Section 1: Prospecting & Pipeline */}
          <div className="px-3 pt-2 pb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Prospecting & Accounts
          </div>

          {prospectingItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && (
                    <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Section: Real Estate & Deal Exchange (Zillow & Buyer/Seller Portal) */}
          <div className="px-3 pt-4 pb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Real Estate & Deal Exchange
          </div>

          {realEstateItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-700/60 font-semibold shrink-0">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Section 2: Engagement & AI Automation */}
          <div className="px-3 pt-4 pb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Engagement & AI Outbound
          </div>

          {engagementItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {item.badge && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-semibold">
                      {item.badge}
                    </span>
                  )}
                  {typeof item.count === 'number' && (
                    <span className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Section 3: Operations & Governance */}
          <div className="px-3 pt-4 pb-1.5 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Platform & Governance
          </div>

          {operationsItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Compliance & Security trust marker in sidebar footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/40 shrink-0">
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>CAN-SPAM & GDPR Compliant</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Multi-tenant isolated data cloud
          </div>
        </div>
      </aside>
    </>
  );
};
