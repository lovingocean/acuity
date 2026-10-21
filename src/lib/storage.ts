import type {
  Contact,
  Company,
  LeadList,
  SavedSearch,
  SequenceCampaign,
  CrmIntegration,
  LeadScoreRule,
  SuppressionRecord,
  Workspace,
  User,
  AuditLog,
  JobChangeAlert,
  WaterfallProvider,
  WaterfallExecutionResult,
  AiSdrAgent,
  AiSdrPersonalizedDraft,
  MailboxAccount,
  SalesCallRecording,
  RevenueAttributionOpportunity,
  PropertyListing,
  BuyerProfile,
  SellerInquiry,
  BridgeDeal,
  SwarmAgent,
  SwarmExecution
} from '../types/index';
import {
  CURRENT_USER,
  INITIAL_WORKSPACES,
  INITIAL_COMPANIES,
  INITIAL_CONTACTS,
  INITIAL_LEAD_LISTS,
  INITIAL_SEQUENCES,
  INITIAL_INTEGRATIONS,
  INITIAL_SUPPRESSION,
  INITIAL_JOB_CHANGES,
  INITIAL_WATERFALL_PROVIDERS,
  INITIAL_AI_SDR,
  INITIAL_AI_SDR_DRAFTS,
  INITIAL_MAILBOX_POOL,
  INITIAL_SALES_CALLS,
  INITIAL_ATTRIBUTIONS,
  INITIAL_PROPERTIES,
  INITIAL_BUYERS,
  INITIAL_SELLER_INQUIRIES,
  INITIAL_BRIDGE_DEALS,
  SWARM_AGENTS,
  INITIAL_SWARM_EXECUTIONS
} from '../data/seedData';
import { DEFAULT_LEAD_RULES } from './leadScorer';

const STORAGE_KEY_PREFIX = 'acuity_b2b_';

export class AcuityStorage {
  public static getItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  public static setItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('Storage quota exceeded or unavailable', e);
    }
  }

  // Workspaces
  static getWorkspaces(): Workspace[] {
    return this.getItem<Workspace[]>('workspaces', INITIAL_WORKSPACES);
  }

  static saveWorkspaces(workspaces: Workspace[]): void {
    this.setItem('workspaces', workspaces);
  }

  static getActiveWorkspaceId(): string {
    return this.getItem<string>('active_workspace_id', 'ws-main');
  }

  static setActiveWorkspaceId(id: string): void {
    this.setItem('active_workspace_id', id);
  }

  static getCurrentUser(): User {
    return this.getItem<User>('current_user', CURRENT_USER);
  }

  // Companies
  static getCompanies(workspaceId: string): Company[] {
    const all = this.getItem<Company[]>('companies', INITIAL_COMPANIES);
    return all.filter(c => c.workspaceId === workspaceId);
  }

  static saveCompany(company: Company): void {
    const all = this.getItem<Company[]>('companies', INITIAL_COMPANIES);
    const idx = all.findIndex(c => c.id === company.id);
    if (idx >= 0) {
      all[idx] = company;
    } else {
      all.unshift(company);
    }
    this.setItem('companies', all);
  }

  static bulkAddCompanies(companies: Company[]): void {
    const all = this.getItem<Company[]>('companies', INITIAL_COMPANIES);
    for (const comp of companies) {
      const idx = all.findIndex(c => c.id === comp.id || c.domain.toLowerCase() === comp.domain.toLowerCase());
      if (idx >= 0) {
        all[idx] = comp;
      } else {
        all.unshift(comp);
      }
    }
    this.setItem('companies', all);
  }

  // Contacts
  static getContacts(workspaceId: string): Contact[] {
    const all = this.getItem<Contact[]>('contacts', INITIAL_CONTACTS);
    return all.filter(c => c.workspaceId === workspaceId);
  }

  static saveContact(contact: Contact): void {
    const all = this.getItem<Contact[]>('contacts', INITIAL_CONTACTS);
    const idx = all.findIndex(c => c.id === contact.id);
    if (idx >= 0) {
      all[idx] = contact;
    } else {
      all.unshift(contact);
    }
    this.setItem('contacts', all);
  }

  static deleteContact(id: string): void {
    const all = this.getItem<Contact[]>('contacts', INITIAL_CONTACTS);
    this.setItem('contacts', all.filter(c => c.id !== id));
  }

  static bulkAddContacts(contacts: Contact[]): void {
    const all = this.getItem<Contact[]>('contacts', INITIAL_CONTACTS);
    for (const cnt of contacts) {
      const idx = all.findIndex(c => c.id === cnt.id || c.email.toLowerCase() === cnt.email.toLowerCase());
      if (idx >= 0) {
        all[idx] = cnt;
      } else {
        all.unshift(cnt);
      }
    }
    this.setItem('contacts', all);
  }

  // Lists
  static getLeadLists(workspaceId: string): LeadList[] {
    const all = this.getItem<LeadList[]>('lead_lists', INITIAL_LEAD_LISTS);
    return all.filter(l => l.workspaceId === workspaceId);
  }

  static saveLeadList(list: LeadList): void {
    const all = this.getItem<LeadList[]>('lead_lists', INITIAL_LEAD_LISTS);
    const idx = all.findIndex(l => l.id === list.id);
    if (idx >= 0) {
      all[idx] = list;
    } else {
      all.unshift(list);
    }
    this.setItem('lead_lists', all);
  }

  static deleteLeadList(id: string): void {
    const all = this.getItem<LeadList[]>('lead_lists', INITIAL_LEAD_LISTS);
    this.setItem('lead_lists', all.filter(l => l.id !== id));
  }

  // Saved Searches
  static getSavedSearches(workspaceId: string): SavedSearch[] {
    const all = this.getItem<SavedSearch[]>('saved_searches', []);
    return all.filter(s => s.workspaceId === workspaceId);
  }

  // Sequences
  static getSequences(workspaceId: string): SequenceCampaign[] {
    const all = this.getItem<SequenceCampaign[]>('sequences', INITIAL_SEQUENCES);
    return all.filter(s => s.workspaceId === workspaceId);
  }

  static saveSequence(seq: SequenceCampaign): void {
    const all = this.getItem<SequenceCampaign[]>('sequences', INITIAL_SEQUENCES);
    const idx = all.findIndex(s => s.id === seq.id);
    if (idx >= 0) {
      all[idx] = seq;
    } else {
      all.unshift(seq);
    }
    this.setItem('sequences', all);
  }

  // Suppression
  static getSuppressionRecords(workspaceId: string): SuppressionRecord[] {
    const all = this.getItem<SuppressionRecord[]>('suppression', INITIAL_SUPPRESSION);
    return all.filter(s => s.workspaceId === workspaceId);
  }

  static saveSuppressionRecord(rec: SuppressionRecord): void {
    const all = this.getItem<SuppressionRecord[]>('suppression', INITIAL_SUPPRESSION);
    all.unshift(rec);
    this.setItem('suppression', all);
  }

  static deleteSuppressionRecord(id: string): void {
    const all = this.getItem<SuppressionRecord[]>('suppression', INITIAL_SUPPRESSION);
    this.setItem('suppression', all.filter(s => s.id !== id));
  }

  // Integrations
  static getIntegrations(): CrmIntegration[] {
    return this.getItem<CrmIntegration[]>('integrations', INITIAL_INTEGRATIONS);
  }

  static saveIntegration(integration: CrmIntegration): void {
    const all = this.getItem<CrmIntegration[]>('integrations', INITIAL_INTEGRATIONS);
    const idx = all.findIndex(i => i.id === integration.id);
    if (idx >= 0) {
      all[idx] = integration;
    } else {
      all.push(integration);
    }
    this.setItem('integrations', all);
  }

  // Lead Score Rules
  static getLeadRules(): LeadScoreRule[] {
    return this.getItem<LeadScoreRule[]>('lead_rules', DEFAULT_LEAD_RULES);
  }

  static saveLeadRules(rules: LeadScoreRule[]): void {
    this.setItem('lead_rules', rules);
  }

  // Credits Usage
  static consumeCredits(workspaceId: string, count: number): boolean {
    const workspaces = this.getWorkspaces();
    const ws = workspaces.find(w => w.id === workspaceId);
    if (!ws) return false;
    if (ws.creditsTotal - ws.creditsUsed < count) return false;
    ws.creditsUsed += count;
    this.saveWorkspaces(workspaces);
    return true;
  }

  // Audit Logs
  static getAuditLogs(workspaceId: string): AuditLog[] {
    const all = this.getItem<AuditLog[]>('audit_logs', []);
    return all.filter(l => l.workspaceId === workspaceId);
  }

  static logAction(workspaceId: string, action: string, resource: string, details: string): void {
    const user = this.getCurrentUser();
    const logs = this.getItem<AuditLog[]>('audit_logs', []);
    logs.unshift({
      id: 'log-' + Date.now(),
      workspaceId,
      userId: user.id,
      userName: user.name,
      action,
      resource,
      details,
      timestamp: new Date().toISOString()
    });
    this.setItem('audit_logs', logs.slice(0, 100));
  }

  // ----------------------------------------------------
  // BILLION-DOLLAR FEATURE STORAGE METHODS
  // ----------------------------------------------------

  // 1. Job Change & Champion Tracker (UserGems)
  static getJobChanges(workspaceId: string): JobChangeAlert[] {
    const all = this.getItem<JobChangeAlert[]>('job_changes', INITIAL_JOB_CHANGES);
    return all.filter(j => j.workspaceId === workspaceId);
  }

  static saveJobChange(alert: JobChangeAlert): void {
    const all = this.getItem<JobChangeAlert[]>('job_changes', INITIAL_JOB_CHANGES);
    const idx = all.findIndex(a => a.id === alert.id);
    if (idx >= 0) all[idx] = alert;
    else all.unshift(alert);
    this.setItem('job_changes', all);
  }

  // 2. Waterfall Providers (Clay)
  static getWaterfallProviders(): WaterfallProvider[] {
    return this.getItem<WaterfallProvider[]>('waterfall_providers', INITIAL_WATERFALL_PROVIDERS);
  }

  static saveWaterfallProviders(providers: WaterfallProvider[]): void {
    this.setItem('waterfall_providers', providers);
  }

  static executeWaterfall(email: string, domain: string): WaterfallExecutionResult {
    const providers = this.getWaterfallProviders().filter(p => p.isEnabled);
    const steps: WaterfallExecutionResult['steps'] = [];
    let credits = 0;

    let foundEmail = email;
    let foundPhone = '+1 415-' + Math.floor(100 + Math.random() * 899) + '-' + Math.floor(1000 + Math.random() * 8999);

    providers.forEach((p, idx) => {
      credits += p.costCredits;
      const isMatch = Math.random() < (p.matchRate / 100);
      steps.push({
        providerName: p.name,
        status: isMatch ? 'FOUND' : 'NO_MATCH',
        latencyMs: Math.floor(80 + Math.random() * 120),
        foundFields: isMatch ? (p.providerType === 'Mobile Phone' ? ['mobileDirect'] : ['email', 'confidence']) : []
      });
    });

    return {
      id: 'wf-res-' + Date.now(),
      targetEmail: email,
      targetDomain: domain,
      resolvedAt: new Date().toISOString(),
      steps,
      finalEmail: foundEmail,
      finalDirectPhone: foundPhone,
      overallMatch: true,
      creditsCharged: credits
    };
  }

  // 3. Autonomous AI SDR (11x / Artisan)
  static getAiSdrAgent(): AiSdrAgent {
    return this.getItem<AiSdrAgent>('ai_sdr_agent', INITIAL_AI_SDR);
  }

  static saveAiSdrAgent(agent: AiSdrAgent): void {
    this.setItem('ai_sdr_agent', agent);
  }

  static getAiSdrDrafts(): AiSdrPersonalizedDraft[] {
    return this.getItem<AiSdrPersonalizedDraft[]>('ai_sdr_drafts', INITIAL_AI_SDR_DRAFTS);
  }

  static saveAiSdrDraft(draft: AiSdrPersonalizedDraft): void {
    const all = this.getItem<AiSdrPersonalizedDraft[]>('ai_sdr_drafts', INITIAL_AI_SDR_DRAFTS);
    const idx = all.findIndex(d => d.id === draft.id);
    if (idx >= 0) all[idx] = draft;
    else all.unshift(draft);
    this.setItem('ai_sdr_drafts', all);
  }

  // 4. Mailbox Pool & Reputation Warmup (Instantly / Smartlead)
  static getMailboxPool(): MailboxAccount[] {
    return this.getItem<MailboxAccount[]>('mailbox_pool', INITIAL_MAILBOX_POOL);
  }

  static saveMailboxPool(pool: MailboxAccount[]): void {
    this.setItem('mailbox_pool', pool);
  }

  // 5. Conversation Intelligence (Gong)
  static getSalesCalls(): SalesCallRecording[] {
    return this.getItem<SalesCallRecording[]>('sales_calls', INITIAL_SALES_CALLS);
  }

  static saveSalesCall(call: SalesCallRecording): void {
    const all = this.getItem<SalesCallRecording[]>('sales_calls', INITIAL_SALES_CALLS);
    all.unshift(call);
    this.setItem('sales_calls', all);
  }

  // 6. Revenue Attributions (Clari)
  static getRevenueAttributions(): RevenueAttributionOpportunity[] {
    return this.getItem<RevenueAttributionOpportunity[]>('revenue_attributions', INITIAL_ATTRIBUTIONS);
  }

  // 7. Real Estate Intelligence & Zestimate Engine
  static getProperties(): PropertyListing[] {
    return this.getItem<PropertyListing[]>('real_estate_properties', INITIAL_PROPERTIES);
  }

  static saveProperty(prop: PropertyListing): void {
    const all = this.getProperties();
    const existingIdx = all.findIndex(p => p.id === prop.id);
    if (existingIdx >= 0) {
      all[existingIdx] = prop;
    } else {
      all.unshift(prop);
    }
    this.setItem('real_estate_properties', all);
  }

  // 8. Find Buyer & Seller Portal
  static getBuyers(): BuyerProfile[] {
    return this.getItem<BuyerProfile[]>('deal_buyers', INITIAL_BUYERS);
  }

  static saveBuyer(buyer: BuyerProfile): void {
    const all = this.getBuyers();
    const existingIdx = all.findIndex(b => b.id === buyer.id);
    if (existingIdx >= 0) {
      all[existingIdx] = buyer;
    } else {
      all.unshift(buyer);
    }
    this.setItem('deal_buyers', all);
  }

  static getSellerInquiries(): SellerInquiry[] {
    return this.getItem<SellerInquiry[]>('seller_inquiries', INITIAL_SELLER_INQUIRIES);
  }

  static saveSellerInquiry(inquiry: SellerInquiry): void {
    const all = this.getSellerInquiries();
    const existingIdx = all.findIndex(s => s.id === inquiry.id);
    if (existingIdx >= 0) {
      all[existingIdx] = inquiry;
    } else {
      all.unshift(inquiry);
    }
    this.setItem('seller_inquiries', all);
  }

  // 9. Dual-Commission Bridge Deals Engine
  static getBridgeDeals(): BridgeDeal[] {
    return this.getItem<BridgeDeal[]>('bridge_deals', INITIAL_BRIDGE_DEALS);
  }

  static saveBridgeDeal(deal: BridgeDeal): void {
    const all = this.getBridgeDeals();
    const existingIdx = all.findIndex(d => d.id === deal.id);
    if (existingIdx >= 0) {
      all[existingIdx] = deal;
    } else {
      all.unshift(deal);
    }
    this.setItem('bridge_deals', all);
  }

  static updateBridgeDealStatus(dealId: string, status: BridgeDeal['dealStatus']): void {
    const all = this.getBridgeDeals();
    const existingIdx = all.findIndex(d => d.id === dealId);
    if (existingIdx >= 0) {
      all[existingIdx].dealStatus = status;
      this.setItem('bridge_deals', all);
    }
  }

  // Autonomous Multi-Agent Swarm Methods
  static getSwarmAgents(): SwarmAgent[] {
    return this.getItem<SwarmAgent[]>('swarm_agents', SWARM_AGENTS);
  }

  static getSwarmExecutions(): SwarmExecution[] {
    return this.getItem<SwarmExecution[]>('swarm_executions', INITIAL_SWARM_EXECUTIONS);
  }

  static getSwarmExecutionById(id: string): SwarmExecution | undefined {
    const all = this.getSwarmExecutions();
    return all.find(e => e.id === id);
  }

  static saveSwarmExecution(exec: SwarmExecution): void {
    const all = this.getSwarmExecutions();
    const existingIdx = all.findIndex(e => e.id === exec.id);
    if (existingIdx >= 0) {
      all[existingIdx] = exec;
    } else {
      all.unshift(exec);
    }
    this.setItem('swarm_executions', all);
  }

  // Reset to seed
  static resetToSeed(): void {
    this.setItem('workspaces', INITIAL_WORKSPACES);
    this.setItem('companies', INITIAL_COMPANIES);
    this.setItem('contacts', INITIAL_CONTACTS);
    this.setItem('lead_lists', INITIAL_LEAD_LISTS);
    this.setItem('sequences', INITIAL_SEQUENCES);
    this.setItem('integrations', INITIAL_INTEGRATIONS);
    this.setItem('suppression', INITIAL_SUPPRESSION);
    this.setItem('lead_rules', DEFAULT_LEAD_RULES);
    this.setItem('job_changes', INITIAL_JOB_CHANGES);
    this.setItem('waterfall_providers', INITIAL_WATERFALL_PROVIDERS);
    this.setItem('ai_sdr_agent', INITIAL_AI_SDR);
    this.setItem('ai_sdr_drafts', INITIAL_AI_SDR_DRAFTS);
    this.setItem('mailbox_pool', INITIAL_MAILBOX_POOL);
    this.setItem('sales_calls', INITIAL_SALES_CALLS);
    this.setItem('revenue_attributions', INITIAL_ATTRIBUTIONS);
    this.setItem('real_estate_properties', INITIAL_PROPERTIES);
    this.setItem('deal_buyers', INITIAL_BUYERS);
    this.setItem('seller_inquiries', INITIAL_SELLER_INQUIRIES);
    this.setItem('bridge_deals', INITIAL_BRIDGE_DEALS);
    this.setItem('swarm_agents', SWARM_AGENTS);
    this.setItem('swarm_executions', INITIAL_SWARM_EXECUTIONS);
  }
}
