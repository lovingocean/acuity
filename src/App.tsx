import React, { useState, useEffect } from 'react';
import type {
  Workspace,
  User,
  Contact,
  Company,
  LeadList,
  SequenceCampaign,
  CrmIntegration,
  SuppressionRecord,
  LeadScoreRule,
  AuditLog,
  PropertyListing
} from './types';
import { AcuityStorage } from './lib/storage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar, type NavigationTab } from './components/layout/Sidebar';
import { ProspectSearch } from './components/search/ProspectSearch';
import { CompanyDirectory } from './components/companies/CompanyDirectory';
import { IntentSurgeHub } from './components/intent/IntentSurgeHub';
import { JobChangesHub } from './components/champions/JobChangesHub';
import { ListsManager } from './components/lists/ListsManager';
import { SequencesManager } from './components/sequences/SequencesManager';
import { AiSdrHub } from './components/aisdr/AiSdrHub';
import { DealsAttributionHub } from './components/deals/DealsAttributionHub';
import { PropertyIntelligenceHub } from './components/realestate/PropertyIntelligenceHub';
import { BuyerSellerPortalHub } from './components/realestate/BuyerSellerPortalHub';
import { AutonomousAgentSwarmHub } from './components/realestate/AutonomousAgentSwarmHub';
import { EnrichmentHub } from './components/enrichment/EnrichmentHub';
import { MailboxWarmupHub } from './components/warmup/MailboxWarmupHub';
import { MeetingIntelligenceHub } from './components/conversations/MeetingIntelligenceHub';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { CrmIntegrations } from './components/crm/CrmIntegrations';
import { WorkspaceSettings } from './components/settings/WorkspaceSettings';
import { ContactProfileModal } from './components/profile/ContactProfileModal';
import { CompanyProfileModal } from './components/profile/CompanyProfileModal';
import { CsvImportModal } from './components/import/CsvImportModal';
import { CreateContactModal } from './components/profile/CreateContactModal';
import { ChromeExtensionSimulator } from './components/extension/ChromeExtensionSimulator';
import { BillionDollarLandingPage } from './components/landing/BillionDollarLandingPage';

export default function App() {
  // Mode: Landing Page vs Full Terminal App
  const [viewMode, setViewMode] = useState<'landing' | 'app'>('landing');

  // Workspaces & user
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => AcuityStorage.getWorkspaces());
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => AcuityStorage.getActiveWorkspaceId());
  const [currentUser] = useState<User>(() => AcuityStorage.getCurrentUser());

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<NavigationTab>('prospects');

  // Global search input
  const [globalSearch, setGlobalSearch] = useState('');

  // Tenant-isolated entities
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [leadLists, setLeadLists] = useState<LeadList[]>([]);
  const [sequences, setSequences] = useState<SequenceCampaign[]>([]);
  const [integrations, setIntegrations] = useState<CrmIntegration[]>([]);
  const [suppression, setSuppression] = useState<SuppressionRecord[]>([]);
  const [leadRules, setLeadRules] = useState<LeadScoreRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Modals state
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [matchedProperty, setMatchedProperty] = useState<PropertyListing | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showCreateContactModal, setShowCreateContactModal] = useState(false);
  const [showExtensionSimulator, setShowExtensionSimulator] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Active workspace object
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId) || workspaces[0];

  // Reload data whenever active workspace changes
  const refreshWorkspaceData = (wsId: string) => {
    setContacts(AcuityStorage.getContacts(wsId));
    setCompanies(AcuityStorage.getCompanies(wsId));
    setLeadLists(AcuityStorage.getLeadLists(wsId));
    setSequences(AcuityStorage.getSequences(wsId));
    setIntegrations(AcuityStorage.getIntegrations());
    setSuppression(AcuityStorage.getSuppressionRecords(wsId));
    setLeadRules(AcuityStorage.getLeadRules());
    setAuditLogs(AcuityStorage.getAuditLogs(wsId));
  };

  useEffect(() => {
    refreshWorkspaceData(activeWorkspaceId);
  }, [activeWorkspaceId]);

  // Workspace switch
  const handleSelectWorkspace = (wsId: string) => {
    setActiveWorkspaceId(wsId);
    AcuityStorage.setActiveWorkspaceId(wsId);
  };

  // Credit consumption
  const handleConsumeCredits = (count: number): boolean => {
    const success = AcuityStorage.consumeCredits(activeWorkspaceId, count);
    if (success) {
      setWorkspaces(AcuityStorage.getWorkspaces());
    }
    return success;
  };

  // Audit logging
  const handleLogAction = (action: string, resource: string, details: string) => {
    AcuityStorage.logAction(activeWorkspaceId, action, resource, details);
    setAuditLogs(AcuityStorage.getAuditLogs(activeWorkspaceId));
  };

  // Contacts handlers
  const handleUpdateContact = (updated: Contact) => {
    AcuityStorage.saveContact(updated);
    setContacts(AcuityStorage.getContacts(activeWorkspaceId));
    if (selectedContact && selectedContact.id === updated.id) {
      setSelectedContact(updated);
    }
  };

  const handleDeleteContact = (id: string) => {
    AcuityStorage.deleteContact(id);
    setContacts(AcuityStorage.getContacts(activeWorkspaceId));
    if (selectedContact && selectedContact.id === id) {
      setSelectedContact(null);
    }
  };

  const handleAddContactsToList = (contactIds: string[], listId: string) => {
    const all = AcuityStorage.getContacts(activeWorkspaceId);
    contactIds.forEach(id => {
      const c = all.find(item => item.id === id);
      if (c && (!c.lists || !c.lists.includes(listId))) {
        c.lists = [...(c.lists || []), listId];
        AcuityStorage.saveContact(c);
      }
    });
    setContacts(AcuityStorage.getContacts(activeWorkspaceId));
    handleLogAction('ADD_TO_LIST', 'LeadList', `Added ${contactIds.length} contact(s) to list ${listId}`);
  };

  const handleEnrollContactsInSequence = (contactIds: string[], sequenceId: string) => {
    const seqs = AcuityStorage.getSequences(activeWorkspaceId);
    const targetSeq = seqs.find(s => s.id === sequenceId);
    if (targetSeq) {
      const mergedEnrolled = Array.from(new Set([...targetSeq.enrolledContactIds, ...contactIds]));
      targetSeq.enrolledContactIds = mergedEnrolled;
      targetSeq.enrolledCount = mergedEnrolled.length;
      AcuityStorage.saveSequence(targetSeq);
      setSequences(AcuityStorage.getSequences(activeWorkspaceId));
      handleLogAction('ENROLL_SEQUENCE', 'Sequence', `Enrolled ${contactIds.length} contact(s) into ${targetSeq.name}`);
    }
  };

  const handleImportContacts = (imported: Contact[]) => {
    AcuityStorage.bulkAddContacts(imported);
    setContacts(AcuityStorage.getContacts(activeWorkspaceId));
  };

  // Lists handlers
  const handleCreateList = (name: string, description?: string, tags?: string[]) => {
    const newList: LeadList = {
      id: 'list-' + Date.now(),
      workspaceId: activeWorkspaceId,
      name,
      description,
      contactCount: 0,
      companyCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags
    };
    AcuityStorage.saveLeadList(newList);
    setLeadLists(AcuityStorage.getLeadLists(activeWorkspaceId));
    handleLogAction('CREATE_LIST', 'LeadList', `Created list "${name}".`);
  };

  const handleDeleteList = (id: string) => {
    AcuityStorage.deleteLeadList(id);
    setLeadLists(AcuityStorage.getLeadLists(activeWorkspaceId));
  };

  // Sequences handlers
  const handleSaveSequence = (seq: SequenceCampaign) => {
    AcuityStorage.saveSequence(seq);
    setSequences(AcuityStorage.getSequences(activeWorkspaceId));
  };

  // Suppression handlers
  const handleAddSuppression = (type: 'email' | 'domain', value: string, reason: SuppressionRecord['reason']) => {
    const rec: SuppressionRecord = {
      id: 'sup-' + Date.now(),
      workspaceId: activeWorkspaceId,
      type,
      value,
      reason,
      createdAt: new Date().toISOString()
    };
    AcuityStorage.saveSuppressionRecord(rec);
    setSuppression(AcuityStorage.getSuppressionRecords(activeWorkspaceId));
    handleLogAction('ADD_SUPPRESSION', 'Compliance', `Added ${type} suppression: ${value}.`);
  };

  const handleDeleteSuppression = (id: string) => {
    AcuityStorage.deleteSuppressionRecord(id);
    setSuppression(AcuityStorage.getSuppressionRecords(activeWorkspaceId));
  };

  // Integrations handlers
  const handleUpdateIntegration = (integration: CrmIntegration) => {
    AcuityStorage.saveIntegration(integration);
    setIntegrations(AcuityStorage.getIntegrations());
  };

  // Lead scoring rules handler
  const handleUpdateLeadRules = (rules: LeadScoreRule[]) => {
    AcuityStorage.saveLeadRules(rules);
    setLeadRules(rules);
  };

  // Workspace updates
  const handleUpdateWorkspace = (ws: Workspace) => {
    const all = workspaces.map(w => (w.id === ws.id ? ws : w));
    setWorkspaces(all);
    AcuityStorage.saveWorkspaces(all);
  };

  // Seed Reset
  const handleResetSeedData = () => {
    AcuityStorage.resetToSeed();
    setWorkspaces(AcuityStorage.getWorkspaces());
    refreshWorkspaceData(activeWorkspaceId);
  };

  const tabTitles: Record<NavigationTab, string> = {
    prospects: 'People Search & Firmographics',
    companies: 'Company Directory & Technographics',
    intent: 'Buyer Intent Signals & Topic Surges',
    jobchanges: 'Job Changes & Champion Tracking',
    properties: 'Real Estate Intelligence & AVM (Zillow / PropStream)',
    buyerportal: 'Institutional Buyer & Seller Portal (Deal Exchange)',
    swarm: 'Autonomous AI Multi-Agent Swarm (Start-to-Finish Deal Engine)',
    lists: 'Lead Lists & Account Groups',
    sequences: 'Multi-Touch Outreach Sequences',
    aisdr: 'Autonomous AI SDR & Pitch Copilot',
    deals: 'Deals Pipeline & Revenue Attribution',
    enrichment: 'Data Enrichment & Waterfall Cascade',
    warmup: 'Mailbox Rotation Pool & Deliverability Warmup',
    conversations: 'Conversation & Meeting Intelligence',
    analytics: 'Analytics & Pipeline Performance',
    integrations: 'Integrations & Suppression Lists',
    settings: 'Workspace & Team Governance'
  };

  // If in Landing Page mode, render full-fidelity Billion Dollar Landing Page
  if (viewMode === 'landing') {
    return (
      <BillionDollarLandingPage
        onLaunchApp={(initialTab) => {
          if (initialTab) {
            setActiveTab(initialTab);
          }
          setViewMode('app');
        }}
        onLogAction={handleLogAction}
      />
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-100 font-sans antialiased text-slate-900">
      {/* Primary Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        contactCount={contacts.length}
        companyCount={companies.length}
        listsCount={leadLists.length}
        sequencesCount={sequences.length}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenLandingPage={() => setViewMode('landing')}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          currentUser={currentUser}
          activeWorkspace={activeWorkspace}
          workspaces={workspaces}
          onSelectWorkspace={handleSelectWorkspace}
          onOpenImport={() => setShowImportModal(true)}
          onOpenCreateContact={() => setShowCreateContactModal(true)}
          onOpenExtension={() => setShowExtensionSimulator(true)}
          onOpenLandingPage={() => setViewMode('landing')}
          searchQuery={globalSearch}
          onSearchChange={setGlobalSearch}
          activeTabTitle={tabTitles[activeTab]}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Tab Viewport */}
        <main className="flex-1 flex min-h-0 overflow-hidden">
          {activeTab === 'prospects' && (
            <ProspectSearch
              contacts={contacts}
              companies={companies}
              leadLists={leadLists}
              sequences={sequences}
              onSelectContact={setSelectedContact}
              onSelectCompany={setSelectedCompany}
              onAddContactsToList={handleAddContactsToList}
              onEnrollContactsInSequence={handleEnrollContactsInSequence}
              onUpdateContact={handleUpdateContact}
              onDeleteContact={handleDeleteContact}
              onConsumeCredits={handleConsumeCredits}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'companies' && (
            <CompanyDirectory
              companies={companies}
              contacts={contacts}
              onSelectCompany={setSelectedCompany}
              onSelectContact={setSelectedContact}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'intent' && (
            <IntentSurgeHub
              companies={companies}
              contacts={contacts}
              onSelectCompany={setSelectedCompany}
              onSelectContact={setSelectedContact}
              onEnrollInSequence={handleEnrollContactsInSequence}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'jobchanges' && (
            <JobChangesHub
              workspaceId={activeWorkspaceId}
              contacts={contacts}
              sequences={sequences}
              leadLists={leadLists}
              onSelectContact={setSelectedContact}
              onEnrollInSequence={handleEnrollContactsInSequence}
              onAddToList={handleAddContactsToList}
              onConsumeCredits={handleConsumeCredits}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'lists' && (
            <ListsManager
              lists={leadLists}
              contacts={contacts}
              companies={companies}
              onCreateList={handleCreateList}
              onDeleteList={handleDeleteList}
              onUpdateContact={handleUpdateContact}
              onSelectContact={setSelectedContact}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'sequences' && (
            <SequencesManager
              sequences={sequences}
              contacts={contacts}
              onSaveSequence={handleSaveSequence}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'aisdr' && (
            <AiSdrHub
              contacts={contacts}
              sequences={sequences}
              onConsumeCredits={handleConsumeCredits}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'deals' && (
            <DealsAttributionHub
              companies={companies}
              sequences={sequences}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'properties' && (
            <PropertyIntelligenceHub
              sequences={sequences}
              onLogAction={handleLogAction}
              onOpenBuyerMatch={(prop) => {
                setMatchedProperty(prop);
                setActiveTab('buyerportal');
              }}
              onDeploySwarm={(prop) => {
                setMatchedProperty(prop);
                setActiveTab('swarm');
              }}
              onEnrollInSequence={(contactName, company, email) => {
                handleLogAction('ENROLL_OWNER', 'PropertyListing', `Enrolled owner ${contactName} (${company} - ${email}) into acquisition sequence`);
              }}
            />
          )}

          {activeTab === 'buyerportal' && (
            <BuyerSellerPortalHub
              targetPropertyForMatch={matchedProperty}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'swarm' && (
            <AutonomousAgentSwarmHub
              initialProperty={matchedProperty}
              onLogAction={handleLogAction}
              onNavigateToBridgeRoom={() => setActiveTab('buyerportal')}
            />
          )}

          {activeTab === 'enrichment' && (
            <EnrichmentHub
              onAddCompany={(c) => {
                AcuityStorage.saveCompany(c);
                setCompanies(AcuityStorage.getCompanies(activeWorkspaceId));
              }}
              onConsumeCredits={handleConsumeCredits}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'warmup' && (
            <MailboxWarmupHub
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'conversations' && (
            <MeetingIntelligenceHub
              contacts={contacts}
              companies={companies}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsDashboard
              contacts={contacts}
              companies={companies}
              sequences={sequences}
              workspace={activeWorkspace}
            />
          )}

          {activeTab === 'integrations' && (
            <CrmIntegrations
              integrations={integrations}
              suppressionRecords={suppression}
              onUpdateIntegration={handleUpdateIntegration}
              onAddSuppression={handleAddSuppression}
              onDeleteSuppression={handleDeleteSuppression}
              onLogAction={handleLogAction}
            />
          )}

          {activeTab === 'settings' && (
            <WorkspaceSettings
              workspace={activeWorkspace}
              currentUser={currentUser}
              leadRules={leadRules}
              auditLogs={auditLogs}
              onUpdateWorkspace={handleUpdateWorkspace}
              onUpdateLeadRules={handleUpdateLeadRules}
              onResetSeedData={handleResetSeedData}
              onLogAction={handleLogAction}
            />
          )}
        </main>
      </div>

      {/* Apollo Chrome Extension Simulator Overlay */}
      <ChromeExtensionSimulator
        contacts={contacts}
        companies={companies}
        leadLists={leadLists}
        sequences={sequences}
        isOpen={showExtensionSimulator}
        onClose={() => setShowExtensionSimulator(false)}
        onSelectContact={(c) => {
          setSelectedContact(c);
        }}
        onEnrollSequence={handleEnrollContactsInSequence}
        onAddToList={handleAddContactsToList}
        onConsumeCredits={handleConsumeCredits}
        onLogAction={handleLogAction}
      />

      {/* Contact Profile Modal */}
      {selectedContact && (
        <ContactProfileModal
          contact={selectedContact}
          company={companies.find(c => c.id === selectedContact.companyId || c.domain === selectedContact.companyDomain)}
          leadLists={leadLists}
          sequences={sequences}
          onClose={() => setSelectedContact(null)}
          onUpdateContact={handleUpdateContact}
          onDeleteContact={handleDeleteContact}
          onAddToList={handleAddContactsToList}
          onEnrollSequence={handleEnrollContactsInSequence}
          onConsumeCredits={handleConsumeCredits}
          onLogAction={handleLogAction}
        />
      )}

      {/* Company Profile Modal */}
      {selectedCompany && (
        <CompanyProfileModal
          company={selectedCompany}
          contacts={contacts}
          onClose={() => setSelectedCompany(null)}
          onSelectContact={(c) => {
            setSelectedCompany(null);
            setSelectedContact(c);
          }}
        />
      )}

      {/* CSV Import Modal */}
      {showImportModal && (
        <CsvImportModal
          workspaceId={activeWorkspaceId}
          existingContacts={contacts}
          onClose={() => setShowImportModal(false)}
          onImportComplete={handleImportContacts}
          onLogAction={handleLogAction}
        />
      )}

      {/* Manual Lead Creation Modal */}
      {showCreateContactModal && (
        <CreateContactModal
          workspaceId={activeWorkspaceId}
          onClose={() => setShowCreateContactModal(false)}
          onCreateContact={(newLead) => {
            AcuityStorage.saveContact(newLead);
            setContacts(AcuityStorage.getContacts(activeWorkspaceId));
          }}
          onLogAction={handleLogAction}
        />
      )}
    </div>
  );
}
