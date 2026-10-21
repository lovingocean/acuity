import React from 'react';
import { Search, Building2, UserCheck, ShieldCheck, Zap, Plus, RefreshCw, Menu, Sparkles } from 'lucide-react';
import type { Workspace, User } from '../../types';

interface NavbarProps {
  currentUser: User;
  activeWorkspace: Workspace;
  workspaces: Workspace[];
  onSelectWorkspace: (wsId: string) => void;
  onOpenImport: () => void;
  onOpenCreateContact: () => void;
  onOpenExtension?: () => void;
  onOpenLandingPage?: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  activeTabTitle: string;
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeWorkspace,
  workspaces,
  onSelectWorkspace,
  onOpenImport,
  onOpenCreateContact,
  onOpenExtension,
  onOpenLandingPage,
  searchQuery,
  onSearchChange,
  activeTabTitle,
  onToggleMobileMenu
}) => {
  const creditsLeft = activeWorkspace.creditsTotal - activeWorkspace.creditsUsed;

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-4 sm:px-6 shrink-0 z-10">
      {/* Zone 1: Mobile toggle, Workspace selector & Breadcrumb */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            type="button"
            onClick={onToggleMobileMenu}
            className="md:hidden p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded"
            aria-label="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2">
          <label htmlFor="workspace-select" className="sr-only">Active Workspace</label>
          <div className="relative">
            <select
              id="workspace-select"
              value={activeWorkspace.id}
              onChange={(e) => onSelectWorkspace(e.target.value)}
              className="appearance-none bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs py-1.5 pl-3 pr-7 rounded-md cursor-pointer border border-transparent focus:border-slate-300 focus:outline-none transition-colors max-w-[140px] sm:max-w-[220px] truncate"
            >
              {workspaces.map(ws => (
                <option key={ws.id} value={ws.id}>
                  {ws.name} ({ws.plan})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">
              ▼
            </div>
          </div>
        </div>

        <div className="hidden sm:block h-4 w-[1px] bg-slate-200" aria-hidden="true" />

        <div className="hidden sm:flex text-xs text-slate-500 items-center gap-1.5">
          <span className="text-slate-400">Workspace</span>
          <span aria-hidden="true">/</span>
          <span className="font-medium text-slate-700 truncate max-w-[160px]">{activeTabTitle}</span>
        </div>
      </div>

      {/* Zone 2: Global Fast Search */}
      <div className="hidden lg:block flex-1 max-w-sm mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search prospects, companies, tech..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs text-slate-900 placeholder:text-slate-400 pl-9 pr-4 py-1.5 rounded-md border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Zone 3: Credits Meter, Actions & User */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Credits Counter with tabular numbers */}
        <div className="flex items-center gap-2 px-2.5 py-1 bg-slate-50 rounded border border-slate-200 text-xs">
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <div className="flex items-center gap-1">
            <span className="text-slate-500 hidden sm:inline">Credits:</span>
            <span className="font-mono font-semibold tabular-nums text-slate-800">{creditsLeft.toLocaleString()}</span>
            <span className="text-slate-400 hidden sm:inline">/ {activeWorkspace.creditsTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Platform Overview Trigger */}
        {onOpenLandingPage && (
          <button
            onClick={onOpenLandingPage}
            className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shadow-2xs"
            title="View Billion Dollar Platform Overview & Vision"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Platform Overview</span>
          </button>
        )}

        {/* Chrome Extension Simulator Trigger */}
        {onOpenExtension && (
          <button
            onClick={onOpenExtension}
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-md transition-colors whitespace-nowrap shadow-2xs"
            title="Open Apollo Chrome Extension & LinkedIn Prospector Simulator"
          >
            <span className="text-amber-500">⚡</span>
            <span>Extension</span>
          </button>
        )}

        {/* Quick Actions */}
        <button
          onClick={onOpenImport}
          className="text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 px-2.5 sm:px-3 py-1.5 rounded-md transition-colors whitespace-nowrap"
          title="Import authorized CSV records"
        >
          Import
        </button>

        <button
          onClick={onOpenCreateContact}
          className="flex items-center gap-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition-colors whitespace-nowrap shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Lead</span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-xs flex items-center justify-center">
            {currentUser.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-medium text-slate-800 leading-tight">{currentUser.name}</div>
            <div className="text-[11px] text-slate-500 capitalize">{currentUser.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
