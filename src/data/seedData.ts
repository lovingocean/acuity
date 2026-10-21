import type {
  Company,
  Contact,
  LeadList,
  SequenceCampaign,
  CrmIntegration,
  LeadScoreRule,
  SuppressionRecord,
  Workspace,
  User,
  JobChangeAlert,
  WaterfallProvider,
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

export const CURRENT_USER: User = {
  id: 'usr-acuity-01',
  name: 'Alex Vance',
  email: 'alex.vance@acuitysales.io',
  role: 'owner',
  avatarUrl: ''
};

export const INITIAL_WORKSPACES: Workspace[] = [
  {
    id: 'ws-main',
    name: 'Acuity Global Enterprise',
    slug: 'acuity-global',
    plan: 'Enterprise',
    creditsTotal: 5000,
    creditsUsed: 431,
    ownerId: 'usr-acuity-01',
    createdAt: '2026-01-10T09:00:00Z'
  },
  {
    id: 'ws-growth',
    name: 'North America Outbound Team',
    slug: 'na-outbound',
    plan: 'Professional',
    creditsTotal: 2500,
    creditsUsed: 120,
    ownerId: 'usr-acuity-01',
    createdAt: '2026-02-14T11:00:00Z'
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-databricks',
    workspaceId: 'ws-main',
    name: 'Databricks',
    domain: 'databricks.com',
    websiteUrl: 'https://databricks.com',
    industry: 'Data & AI',
    subIndustry: 'Lakehouse Infrastructure',
    employeeCount: 6500,
    employeeRange: '5001+',
    revenueRange: '$250M+',
    headquarters: 'San Francisco, CA',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    description: 'Data and AI company offering a unified Lakehouse platform for data engineering, science, machine learning and business analytics.',
    foundedYear: 2013,
    technologies: ['Apache Spark', 'Python', 'AWS', 'Kubernetes', 'Delta Lake', 'Go', 'React'],
    linkedinUrl: 'https://linkedin.com/company/databricks',
    dataSource: 'Licensed Data Cloud Index',
    confidenceScore: 99,
    lastUpdated: '2026-03-01T10:00:00Z',
    intentSignals: [
      { topic: 'AI Inference Optimization', score: 94, surgeLevel: 'High', weeklySurgePct: 142, searchVolume: 12500 },
      { topic: 'Distributed Vector Databases', score: 88, surgeLevel: 'High', weeklySurgePct: 98, searchVolume: 8200 },
      { topic: 'Cloud Data Governance', score: 76, surgeLevel: 'Medium', weeklySurgePct: 45, searchVolume: 5100 }
    ],
    technographicScan: {
      domain: 'databricks.com',
      serverBanner: 'Cloudflare / Envoy Gateway',
      tlsIssuer: 'DigiCert Global Root G2',
      cloudProvider: 'Hybrid',
      estimatedCloudSpendMonthly: '$3.4M/mo',
      activeFrameworks: ['React 19', 'Next.js', 'Tailwind', 'gRPC'],
      analyticsTools: ['Segment', 'Amplitude', 'Google Analytics 4'],
      securityTools: ['Cloudflare Enterprise DDoS', 'Okta SSO', 'CrowdStrike Falcon'],
      contractRenewalQuarter: 'Q4 2026'
    }
  },
  {
    id: 'comp-stripe',
    workspaceId: 'ws-main',
    name: 'Stripe',
    domain: 'stripe.com',
    websiteUrl: 'https://stripe.com',
    industry: 'Fintech',
    subIndustry: 'Payment Processing & Financial Infrastructure',
    employeeCount: 7800,
    employeeRange: '5001+',
    revenueRange: '$250M+',
    headquarters: 'San Francisco, CA',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    description: 'Financial infrastructure platform building economic tools for the internet and global payments.',
    foundedYear: 2010,
    technologies: ['Ruby', 'React', 'AWS', 'PostgreSQL', 'Sorbet', 'Kafka', 'Docker'],
    linkedinUrl: 'https://linkedin.com/company/stripe',
    dataSource: 'Verified B2B Directory',
    confidenceScore: 98,
    lastUpdated: '2026-03-02T12:00:00Z',
    intentSignals: [
      { topic: 'Cross-Border FX Liquidity', score: 96, surgeLevel: 'High', weeklySurgePct: 165, searchVolume: 18400 },
      { topic: 'Automated Billing Orchestration', score: 91, surgeLevel: 'High', weeklySurgePct: 110, searchVolume: 9600 }
    ],
    technographicScan: {
      domain: 'stripe.com',
      serverBanner: 'AWS CloudFront / Custom Edge',
      tlsIssuer: 'Amazon RSA 2048 M02',
      cloudProvider: 'AWS',
      estimatedCloudSpendMonthly: '$4.2M/mo',
      activeFrameworks: ['React', 'Custom Web Components', 'Ruby API Gateway'],
      analyticsTools: ['Stripe Sigma', 'Datadog', 'Splunk'],
      securityTools: ['AWS WAF', 'YubiKey Hardware Auth', 'HackerOne Bug Bounty'],
      contractRenewalQuarter: 'Q3 2026'
    }
  },
  {
    id: 'comp-snowflake',
    workspaceId: 'ws-main',
    name: 'Snowflake',
    domain: 'snowflake.com',
    websiteUrl: 'https://snowflake.com',
    industry: 'Cloud Software',
    subIndustry: 'Data Warehousing & Cloud Computing',
    employeeCount: 7000,
    employeeRange: '5001+',
    revenueRange: '$250M+',
    headquarters: 'Bozeman, MT',
    city: 'Bozeman',
    state: 'MT',
    country: 'United States',
    description: 'Cloud data platform providing instant data sharing, data warehousing, and governed compute solutions.',
    foundedYear: 2012,
    technologies: ['C++', 'Java', 'Python', 'React', 'AWS', 'Azure', 'GCP'],
    linkedinUrl: 'https://linkedin.com/company/snowflake-computing',
    dataSource: 'Official Public Registrar',
    confidenceScore: 97,
    lastUpdated: '2026-02-28T14:30:00Z',
    intentSignals: [
      { topic: 'Apache Iceberg Open Table Formats', score: 92, surgeLevel: 'High', weeklySurgePct: 130, searchVolume: 14200 },
      { topic: 'Enterprise LLM Grounding', score: 85, surgeLevel: 'High', weeklySurgePct: 88, searchVolume: 7400 }
    ],
    technographicScan: {
      domain: 'snowflake.com',
      serverBanner: 'AWS / Azure Dual-Cloud Edge',
      tlsIssuer: 'GlobalSign Root CA',
      cloudProvider: 'Hybrid',
      estimatedCloudSpendMonthly: '$5.1M/mo',
      activeFrameworks: ['React', 'TypeScript', 'Java Microservices'],
      analyticsTools: ['Snowflake Cortex', 'Google Analytics', 'Marketo'],
      securityTools: ['FedRAMP High Compliant', 'Palo Alto Prisma', 'Zscaler'],
      contractRenewalQuarter: 'Q1 2027'
    }
  },
  {
    id: 'comp-crowdstrike',
    workspaceId: 'ws-main',
    name: 'CrowdStrike',
    domain: 'crowdstrike.com',
    websiteUrl: 'https://crowdstrike.com',
    industry: 'Cybersecurity',
    subIndustry: 'Endpoint Security & Threat Intelligence',
    employeeCount: 8200,
    employeeRange: '5001+',
    revenueRange: '$250M+',
    headquarters: 'Austin, TX',
    city: 'Austin',
    state: 'TX',
    country: 'United States',
    description: 'Global cybersecurity leader with the Falcon cloud-native platform stopping enterprise breaches.',
    foundedYear: 2011,
    technologies: ['Go', 'C++', 'Kafka', 'Cassandra', 'AWS', 'Elasticsearch'],
    linkedinUrl: 'https://linkedin.com/company/crowdstrike',
    dataSource: 'Licensed Data Cloud Index',
    confidenceScore: 98,
    lastUpdated: '2026-03-05T08:15:00Z',
    intentSignals: [
      { topic: 'Zero Trust Network Architecture', score: 95, surgeLevel: 'High', weeklySurgePct: 180, searchVolume: 21000 },
      { topic: 'Cloud Security Posture Management', score: 89, surgeLevel: 'High', weeklySurgePct: 104, searchVolume: 11300 }
    ]
  },
  {
    id: 'comp-linear',
    workspaceId: 'ws-main',
    name: 'Linear',
    domain: 'linear.app',
    websiteUrl: 'https://linear.app',
    industry: 'Developer Tools',
    subIndustry: 'Project Management & Issue Tracking',
    employeeCount: 85,
    employeeRange: '51-200',
    revenueRange: '$10M-$50M',
    headquarters: 'San Francisco, CA',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    description: 'High-speed issue tracking and product planning tool built for modern high-performance engineering teams.',
    foundedYear: 2019,
    technologies: ['TypeScript', 'GraphQL', 'React', 'Node.js', 'PostgreSQL', 'WebSockets'],
    linkedinUrl: 'https://linkedin.com/company/linear-app',
    dataSource: 'Verified B2B Directory',
    confidenceScore: 98,
    lastUpdated: '2026-03-06T09:10:00Z',
    intentSignals: [
      { topic: 'Developer Velocity Benchmarks', score: 91, surgeLevel: 'High', weeklySurgePct: 115, searchVolume: 4300 }
    ]
  },
  {
    id: 'comp-supabase',
    workspaceId: 'ws-main',
    name: 'Supabase',
    domain: 'supabase.com',
    websiteUrl: 'https://supabase.com',
    industry: 'Developer Tools',
    subIndustry: 'Open Source Backend Infrastructure',
    employeeCount: 140,
    employeeRange: '51-200',
    revenueRange: '$10M-$50M',
    headquarters: 'Singapore',
    city: 'Singapore',
    country: 'Singapore',
    description: 'The open source Firebase alternative providing PostgreSQL databases, authentication, instant APIs, and edge functions.',
    foundedYear: 2020,
    technologies: ['PostgreSQL', 'Elixir', 'Go', 'TypeScript', 'Next.js', 'Docker'],
    linkedinUrl: 'https://linkedin.com/company/supabase',
    dataSource: 'Verified B2B Directory',
    confidenceScore: 96,
    lastUpdated: '2026-03-02T15:00:00Z',
    intentSignals: [
      { topic: 'Self-Hosted PostgreSQL High Availability', score: 88, surgeLevel: 'High', weeklySurgePct: 92, searchVolume: 6500 }
    ]
  }
];

export const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'cnt-ali-ghodsi',
    workspaceId: 'ws-main',
    companyId: 'comp-databricks',
    companyName: 'Databricks',
    companyDomain: 'databricks.com',
    firstName: 'Ali',
    lastName: 'Ghodsi',
    fullName: 'Ali Ghodsi',
    title: 'Chief Executive Officer & Co-Founder',
    seniority: 'C-Level',
    department: 'Executive',
    email: 'ali.ghodsi@databricks.com',
    emailStatus: 'verified',
    emailConfidence: 96,
    phone: '+1 415-555-0142',
    mobileDirect: '+1 415-992-8311',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    linkedinUrl: 'https://linkedin.com/in/alighodsi',
    leadScore: 95,
    leadStatus: 'Qualified',
    lists: ['list-tier1'],
    tags: ['founder', 'lakehouse', 'c-suite'],
    notes: 'Key sponsor for enterprise lakehouse evaluation. Prefers direct data ROI summaries.',
    dataSource: 'Verified B2B Directory',
    createdAt: '2026-01-15T09:00:00Z',
    lastVerifiedAt: '2026-03-01T10:00:00Z',
    buyingRole: 'Economic Buyer',
    employmentHistory: [
      { title: 'Chief Executive Officer', companyName: 'Databricks', startDate: '2016-01-01', isCurrent: true },
      { title: 'VP of Engineering', companyName: 'Databricks', startDate: '2013-09-01', endDate: '2016-01-01', isCurrent: false }
    ]
  },
  {
    id: 'cnt-matei-zaharia',
    workspaceId: 'ws-main',
    companyId: 'comp-databricks',
    companyName: 'Databricks',
    companyDomain: 'databricks.com',
    firstName: 'Matei',
    lastName: 'Zaharia',
    fullName: 'Matei Zaharia',
    title: 'Chief Technologist & Co-Founder',
    seniority: 'C-Level',
    department: 'Engineering',
    email: 'matei@databricks.com',
    emailStatus: 'verified',
    emailConfidence: 94,
    phone: '+1 415-555-0219',
    mobileDirect: '+1 415-883-1490',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    linkedinUrl: 'https://linkedin.com/in/mateizaharia',
    leadScore: 90,
    leadStatus: 'Engaged',
    lists: ['list-tier1'],
    tags: ['apache-spark', 'c-suite', 'technical-decision-maker'],
    notes: 'Creator of Apache Spark. Responded positively to distributed query engine performance metrics.',
    dataSource: 'Verified B2B Directory',
    createdAt: '2026-01-18T10:30:00Z',
    lastVerifiedAt: '2026-03-01T10:00:00Z',
    buyingRole: 'Technical Champion',
    reportsToId: 'cnt-ali-ghodsi'
  },
  {
    id: 'cnt-elena-chen',
    workspaceId: 'ws-main',
    companyId: 'comp-databricks',
    companyName: 'Databricks',
    companyDomain: 'databricks.com',
    firstName: 'Elena',
    lastName: 'Chen',
    fullName: 'Elena Chen',
    title: 'VP of Global Enterprise Sales',
    seniority: 'VP',
    department: 'Sales',
    email: 'elena.chen@databricks.com',
    emailStatus: 'verified',
    emailConfidence: 92,
    phone: '+1 415-555-0891',
    city: 'New York',
    state: 'NY',
    country: 'United States',
    linkedinUrl: 'https://linkedin.com/in/elenachen-sales',
    leadScore: 85,
    leadStatus: 'New',
    lists: ['list-tier1', 'list-outbound'],
    tags: ['sales-leader', 'enterprise-expansion'],
    dataSource: 'Licensed Data Cloud Index',
    createdAt: '2026-02-01T14:15:00Z',
    lastVerifiedAt: '2026-03-05T12:00:00Z',
    buyingRole: 'End User',
    reportsToId: 'cnt-ali-ghodsi'
  },
  {
    id: 'cnt-patrick-collison',
    workspaceId: 'ws-main',
    companyId: 'comp-stripe',
    companyName: 'Stripe',
    companyDomain: 'stripe.com',
    firstName: 'Patrick',
    lastName: 'Collison',
    fullName: 'Patrick Collison',
    title: 'Chief Executive Officer',
    seniority: 'C-Level',
    department: 'Executive',
    email: 'patrick@stripe.com',
    emailStatus: 'verified',
    emailConfidence: 98,
    phone: '+1 415-555-0101',
    mobileDirect: '+1 415-712-4402',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    linkedinUrl: 'https://linkedin.com/in/patrickcollison',
    leadScore: 98,
    leadStatus: 'Qualified',
    lists: ['list-tier1'],
    tags: ['founder', 'fintech-pioneer'],
    notes: 'High intent prospect for global payment orchestration and billing telemetry.',
    dataSource: 'Verified B2B Directory',
    createdAt: '2026-01-10T09:00:00Z',
    lastVerifiedAt: '2026-03-02T12:00:00Z',
    buyingRole: 'Economic Buyer'
  },
  {
    id: 'cnt-david-singleton',
    workspaceId: 'ws-main',
    companyId: 'comp-stripe',
    companyName: 'Stripe',
    companyDomain: 'stripe.com',
    firstName: 'David',
    lastName: 'Singleton',
    fullName: 'David Singleton',
    title: 'Chief Technology Officer',
    seniority: 'C-Level',
    department: 'Engineering',
    email: 'singleton@stripe.com',
    emailStatus: 'verified',
    emailConfidence: 95,
    phone: '+1 415-555-0199',
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    linkedinUrl: 'https://linkedin.com/in/davidsingleton',
    leadScore: 90,
    leadStatus: 'New',
    lists: ['list-tier1'],
    tags: ['engineering-exec'],
    dataSource: 'Verified B2B Directory',
    createdAt: '2026-01-12T11:20:00Z',
    lastVerifiedAt: '2026-03-02T12:00:00Z',
    buyingRole: 'Technical Champion',
    reportsToId: 'cnt-patrick-collison'
  },
  {
    id: 'cnt-christian-kleinerman',
    workspaceId: 'ws-main',
    companyId: 'comp-snowflake',
    companyName: 'Snowflake',
    companyDomain: 'snowflake.com',
    firstName: 'Christian',
    lastName: 'Kleinerman',
    fullName: 'Christian Kleinerman',
    title: 'Executive VP of Product Management',
    seniority: 'VP',
    department: 'Product',
    email: 'christian.kleinerman@snowflake.com',
    emailStatus: 'verified',
    emailConfidence: 93,
    city: 'San Mateo',
    state: 'CA',
    country: 'United States',
    linkedinUrl: 'https://linkedin.com/in/christiankleinerman',
    leadScore: 85,
    leadStatus: 'New',
    lists: ['list-tier1'],
    tags: ['product-strategy', 'data-cloud'],
    dataSource: 'Official Public Registrar',
    createdAt: '2026-02-05T10:00:00Z',
    lastVerifiedAt: '2026-02-28T14:30:00Z',
    buyingRole: 'Technical Champion'
  },
  {
    id: 'cnt-karri-saarinen',
    workspaceId: 'ws-main',
    companyId: 'comp-linear',
    companyName: 'Linear',
    companyDomain: 'linear.app',
    firstName: 'Karri',
    lastName: 'Saarinen',
    fullName: 'Karri Saarinen',
    title: 'Co-Founder & CEO',
    seniority: 'C-Level',
    department: 'Executive',
    email: 'karri@linear.app',
    emailStatus: 'verified',
    emailConfidence: 97,
    city: 'San Francisco',
    state: 'CA',
    country: 'United States',
    linkedinUrl: 'https://linkedin.com/in/karrisaarinen',
    leadScore: 92,
    leadStatus: 'Qualified',
    lists: ['list-tier1'],
    tags: ['designer-founder', 'devtools'],
    dataSource: 'Verified B2B Directory',
    createdAt: '2026-01-30T10:00:00Z',
    lastVerifiedAt: '2026-03-06T09:10:00Z',
    buyingRole: 'Economic Buyer'
  }
];

export const INITIAL_LEAD_LISTS: LeadList[] = [
  {
    id: 'list-tier1',
    workspaceId: 'ws-main',
    name: 'Q2 Tier-1 Enterprise Tech Sponsors',
    description: 'High-conviction C-level executives in Cloud, Fintech, and AI infrastructure.',
    contactCount: 6,
    companyCount: 5,
    createdAt: '2026-02-01T09:00:00Z',
    updatedAt: '2026-03-06T15:20:00Z',
    tags: ['Enterprise', 'High-ARR', 'C-Suite']
  },
  {
    id: 'list-outbound',
    workspaceId: 'ws-main',
    name: 'EMEA & APAC Expansion Targets',
    description: 'Heads of Sales and Engineering decision-makers in European and Asian tech hubs.',
    contactCount: 1,
    companyCount: 1,
    createdAt: '2026-02-15T11:30:00Z',
    updatedAt: '2026-03-04T12:00:00Z',
    tags: ['International', 'Mid-Market']
  }
];

export const INITIAL_SEQUENCES: SequenceCampaign[] = [
  {
    id: 'seq-enterprise-intro',
    workspaceId: 'ws-main',
    name: 'Executive Value Architecture — Cloud & AI Infrastructure',
    status: 'active',
    enrolledCount: 18,
    sentCount: 34,
    openedCount: 26,
    repliedCount: 6,
    bouncedCount: 0,
    attributedRevenue: 285000,
    enrolledContactIds: ['cnt-ali-ghodsi', 'cnt-patrick-collison'],
    createdAt: '2026-02-10T10:00:00Z',
    steps: [
      {
        id: 'step-1',
        stepNumber: 1,
        delayDays: 0,
        channel: 'email',
        subject: 'Quick question regarding data ingestion at {{company}}',
        bodyTemplate: 'Hi {{first_name}},\n\nI noticed your recent expansion in Lakehouse infrastructure at {{company}}. We help engineering leaders reduce warehouse query latency by 42% while cutting egress costs.\n\nWould you be open to a 10-minute briefing on our benchmark against current cloud data warehouses next Tuesday?'
      },
      {
        id: 'step-2',
        stepNumber: 2,
        delayDays: 3,
        channel: 'email',
        subject: 'Re: Quick question regarding data ingestion at {{company}}',
        bodyTemplate: 'Hi {{first_name}},\n\nFollowing up on my previous note. We recently published an architectural benchmark showing how teams similar in scale to {{company}} eliminate duplicate pipeline transforms.\n\nWorth a brief glance?'
      }
    ]
  }
];

// 1. Job Change & Champion Tracker Seed
export const INITIAL_JOB_CHANGES: JobChangeAlert[] = [
  {
    id: 'alert-1',
    workspaceId: 'ws-main',
    contactId: 'cnt-sarah-j',
    contactName: 'Sarah Jenkins',
    contactEmail: 'sarah.j@crowdstrike.com',
    previousCompany: 'Palo Alto Networks',
    previousTitle: 'Director of Cloud Defense',
    newCompany: 'CrowdStrike',
    newCompanyDomain: 'crowdstrike.com',
    newTitle: 'VP of Global Security Architecture',
    changedAt: '2026-02-18T10:00:00Z',
    daysInRole: 25,
    isPastCustomer: true,
    status: 'new_opportunity'
  },
  {
    id: 'alert-2',
    workspaceId: 'ws-main',
    contactId: 'cnt-marcus-v',
    contactName: 'Marcus Vance',
    contactEmail: 'mvance@stripe.com',
    previousCompany: 'Adyen',
    previousTitle: 'Head of Core Ledger',
    newCompany: 'Stripe',
    newCompanyDomain: 'stripe.com',
    newTitle: 'Head of Settlement Infrastructure',
    changedAt: '2026-01-20T14:30:00Z',
    daysInRole: 54,
    isPastCustomer: true,
    status: 'new_opportunity'
  },
  {
    id: 'alert-3',
    workspaceId: 'ws-main',
    contactId: 'cnt-amira-k',
    contactName: 'Amira Kowalski',
    contactEmail: 'amira@snowflake.com',
    previousCompany: 'Teradata',
    previousTitle: 'VP of Data Platforms',
    newCompany: 'Snowflake',
    newCompanyDomain: 'snowflake.com',
    newTitle: 'VP of Iceberg Ecosystem',
    changedAt: '2026-03-01T09:15:00Z',
    daysInRole: 14,
    isPastCustomer: false,
    status: 'new_opportunity'
  }
];

// 2. Waterfall Providers Seed (Clay)
export const INITIAL_WATERFALL_PROVIDERS: WaterfallProvider[] = [
  { id: 'wf-1', name: 'Acuity Tier-1 Executive Registry', tier: 1, providerType: 'Email', matchRate: 72, isEnabled: true, costCredits: 1 },
  { id: 'wf-2', name: 'Global Corporate Registrar Cloud', tier: 2, providerType: 'Email', matchRate: 86, isEnabled: true, costCredits: 1 },
  { id: 'wf-3', name: 'Telco Direct Dial Carrier Network', tier: 3, providerType: 'Mobile Phone', matchRate: 64, isEnabled: true, costCredits: 2 },
  { id: 'wf-4', name: 'Live Realtime SMTP Handshake Prober', tier: 4, providerType: 'Email', matchRate: 98, isEnabled: true, costCredits: 1 }
];

// 3. Autonomous AI SDR Agent Seed (11x / Artisan)
export const INITIAL_AI_SDR: AiSdrAgent = {
  id: 'agent-aria',
  name: 'Aria',
  role: 'Autonomous Senior Enterprise SDR',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
  isActive: true,
  accountsResearched: 84,
  emailsDrafted: 62,
  repliesTriaged: 19,
  meetingBookingsCount: 8
};

export const INITIAL_AI_SDR_DRAFTS: AiSdrPersonalizedDraft[] = [
  {
    id: 'draft-1',
    contactId: 'cnt-matei-zaharia',
    contactName: 'Matei Zaharia',
    contactTitle: 'Chief Technologist',
    companyName: 'Databricks',
    signalHook: 'Recent Databricks Lakehouse vector search latency initiative & Apache Spark 4.0 roadmap',
    subject: 'Vector partition pruning for Spark workloads at Databricks',
    pitchBody: 'Hi Matei,\n\nGiven your focus on distributed query execution and Spark 4.0 vector optimization, thought you would appreciate our latest benchmark: we cut hybrid dense-sparse query latency by 44% without duplicating partition indices.\n\nCould I send over the 2-page architectural teardown for your team?',
    confidenceScore: 97,
    status: 'pending_review'
  },
  {
    id: 'draft-2',
    contactId: 'cnt-david-singleton',
    contactName: 'David Singleton',
    contactTitle: 'Chief Technology Officer',
    companyName: 'Stripe',
    signalHook: 'Expansion into cross-border merchant payout settlement and Sorbet typechecker adoption',
    subject: 'Zero-downtime distributed ledger reconciliations at Stripe',
    pitchBody: 'Hi David,\n\nNoticed Stripe\'s continued scale across multi-currency settlement rails. We recently worked with a Tier-1 fintech to reduce ledger validation overhead from 18ms down to sub-2ms.\n\nOpen to a brief 8-minute technical look next Thursday?',
    confidenceScore: 94,
    status: 'pending_review'
  }
];

// 4. Mailbox Pool & Reputation Warmup Seed (Smartlead / Instantly)
export const INITIAL_MAILBOX_POOL: MailboxAccount[] = [
  {
    id: 'mbx-1',
    email: 'alex.vance@acuity-outbound.com',
    senderName: 'Alex Vance',
    provider: 'Google Workspace',
    dailyLimit: 35,
    sentToday: 14,
    warmupScore: 99,
    warmupEmailsExchanged: 340,
    spfValid: true,
    dkimValid: true,
    dmarcValid: true,
    isPaused: false
  },
  {
    id: 'mbx-2',
    email: 'a.vance@acuity-enterprise.io',
    senderName: 'Alex Vance',
    provider: 'Microsoft 365',
    dailyLimit: 40,
    sentToday: 18,
    warmupScore: 97,
    warmupEmailsExchanged: 288,
    spfValid: true,
    dkimValid: true,
    dmarcValid: true,
    isPaused: false
  },
  {
    id: 'mbx-3',
    email: 'vance@acuitygrowth.co',
    senderName: 'Alex Vance',
    provider: 'Custom SES Relay',
    dailyLimit: 50,
    sentToday: 22,
    warmupScore: 95,
    warmupEmailsExchanged: 195,
    spfValid: true,
    dkimValid: true,
    dmarcValid: true,
    isPaused: false
  }
];

// 5. Conversation & Meeting Intelligence Seed (Gong)
export const INITIAL_SALES_CALLS: SalesCallRecording[] = [
  {
    id: 'call-1',
    title: 'Enterprise Architecture & Query Engine Evaluation',
    prospectName: 'Elena Chen',
    prospectTitle: 'VP of Global Enterprise Sales',
    companyName: 'Databricks',
    durationMinutes: 28,
    recordedAt: '2026-03-04T15:00:00Z',
    overallSentiment: 'Positive',
    talkRatioRep: 38,
    talkRatioProspect: 62,
    competitorMentions: ['Apollo.io', 'ZoomInfo'],
    budgetMentioned: true,
    dealRisks: ['Requires SOC-2 Type II certificate signed by next month'],
    aiExecutiveSummary: 'Prospect confirmed pain with existing vendor deliverability drops (22% bounce rate on EMEA expansion). Validated interest in multi-inbox rotation and waterfall mobile verification. Requested security packet by Friday.'
  },
  {
    id: 'call-2',
    title: 'Outbound Revenue Acceleration Discovery',
    prospectName: 'David Singleton',
    prospectTitle: 'Chief Technology Officer',
    companyName: 'Stripe',
    durationMinutes: 22,
    recordedAt: '2026-03-02T11:00:00Z',
    overallSentiment: 'Neutral',
    talkRatioRep: 48,
    talkRatioProspect: 52,
    competitorMentions: ['Clay'],
    budgetMentioned: true,
    dealRisks: ['Evaluation team wants to test custom webhook payload transforms'],
    aiExecutiveSummary: 'Deep discussion on API rate limits and webhook throughput. Impressed with sub-100ms verification response. Next step: scheduled deep technical demo with senior staff engineer.'
  }
];

// 6. Multi-Touch Revenue Attribution Seed (Clari)
export const INITIAL_ATTRIBUTIONS: RevenueAttributionOpportunity[] = [
  {
    id: 'opp-1',
    dealName: 'Databricks Global Outbound Expansion',
    companyName: 'Databricks',
    dealValue: 145000,
    stage: 'Closed Won',
    originatingSequence: 'Executive Value Architecture — Cloud & AI',
    firstTouchDate: '2026-01-15',
    closedDate: '2026-02-28',
    touchpointsCount: 14,
    winProbability: 100,
    roiMultiplier: 18.4
  },
  {
    id: 'opp-2',
    dealName: 'Stripe Enterprise Multi-Seat Pilot',
    companyName: 'Stripe',
    dealValue: 95000,
    stage: 'Closed Won',
    originatingSequence: 'Executive Value Architecture — Cloud & AI',
    firstTouchDate: '2026-01-20',
    closedDate: '2026-03-01',
    touchpointsCount: 9,
    winProbability: 100,
    roiMultiplier: 12.8
  },
  {
    id: 'opp-3',
    dealName: 'Snowflake Security & Iceberg Ingestion Deal',
    companyName: 'Snowflake',
    dealValue: 180000,
    stage: 'Negotiation',
    originatingSequence: 'Enterprise CTO Cold Outbound',
    firstTouchDate: '2026-02-05',
    closedDate: '2026-03-30 (Projected)',
    touchpointsCount: 11,
    winProbability: 85,
    roiMultiplier: 22.0
  }
];

export const INITIAL_INTEGRATIONS: CrmIntegration[] = [
  {
    id: 'crm-hubspot',
    provider: 'hubspot',
    name: 'HubSpot CRM',
    isConnected: true,
    connectedAt: '2026-02-01T10:00:00Z',
    apiKeyMasked: 'pat-na1-•••••••••••••7f9a',
    syncFrequency: 'realtime',
    lastSyncedAt: '2026-03-07T14:30:00Z',
    recordsSynced: 1420,
    fieldMappings: [
      { internalField: 'email', externalField: 'email' },
      { internalField: 'fullName', externalField: 'firstname' },
      { internalField: 'companyName', externalField: 'company' },
      { internalField: 'leadScore', externalField: 'apollo_lead_score' }
    ]
  },
  {
    id: 'crm-salesforce',
    provider: 'salesforce',
    name: 'Salesforce Enterprise',
    isConnected: false,
    syncFrequency: 'hourly',
    recordsSynced: 0,
    fieldMappings: [
      { internalField: 'email', externalField: 'Email' },
      { internalField: 'fullName', externalField: 'Name' },
      { internalField: 'companyName', externalField: 'Company' }
    ]
  },
  {
    id: 'crm-smtp',
    provider: 'smtp',
    name: 'Dedicated SMTP Relay (Amazon SES / SendGrid)',
    isConnected: true,
    connectedAt: '2026-01-20T12:00:00Z',
    apiKeyMasked: 'smtp-ses-•••••••••••8b21',
    syncFrequency: 'realtime',
    lastSyncedAt: '2026-03-07T14:00:00Z',
    recordsSynced: 34,
    fieldMappings: []
  }
];

export const INITIAL_SUPPRESSION: SuppressionRecord[] = [
  {
    id: 'sup-1',
    workspaceId: 'ws-main',
    type: 'domain',
    value: 'competitorintel.io',
    reason: 'Compliance',
    createdAt: '2026-01-15T10:00:00Z'
  },
  {
    id: 'sup-2',
    workspaceId: 'ws-main',
    type: 'email',
    value: 'legal@donotcontact.com',
    reason: 'Unsubscribed',
    createdAt: '2026-02-03T11:20:00Z'
  }
];

export const INITIAL_PROPERTIES: PropertyListing[] = [
  {
    id: 'prop-austin-01',
    address: '401 Congress Ave, Suite 1800',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    searchArea: 'Austin Downtown & South Congress',
    lat: 30.2672,
    lng: -97.7431,
    propertyType: 'Commercial Office',
    squareFeet: 48500,
    yearBuilt: 2018,
    zestimate: 18450000,
    listPrice: 19200000,
    pricePerSqFt: 380,
    capRate: 7.2,
    grossRentalYield: 9.4,
    estimatedNetOperatingIncome: 1328400,
    status: 'Off-Market Deal',
    estimatedEquityPct: 78,
    mortgageBalance: 4059000,
    taxAssessment: 16800000,
    annualPropertyTaxes: 312000,
    zoning: 'CBD (Central Business District)',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    historicalRates: {
      oldSaleDate: '2018-05-14',
      oldSalePrice: 11400000,
      oldPricePerSqFt: 235,
      priorAssessment2021: 14600000,
      historicalAppreciationPct: 61.8,
      suggestedMarketRatePerSqFt: 380,
      suggestedTargetOfferPrice: 17200000,
      suggestedTargetRatePerSqFt: 355,
      rateRecommendationReasoning: 'Original acquisition rate $235/sqft. Class-A Austin core comps trend at $395/sqft. Discounted bridge buy-box of $355/sqft yields an immediate $1.25M equity buffer.'
    },
    sellerContact: {
      name: 'Marcus Sterling',
      entity: 'Apex Austin Ventures LP (Delaware LLC)',
      phone: '+1 (512) 894-2201',
      email: 'msterling@apexventures.com',
      role: 'Managing General Partner & Sole Asset Manager',
      motivation: '1031 Exchange identification clock ticking (28 days left). Wants fast institutional cash close.',
      commissionAgreedPct: 2.5
    },
    matchedBuyers: [
      {
        buyerId: 'buy-01',
        buyerName: 'Clarion Ridge Capital',
        entityName: 'Clarion Ridge RE Fund IV',
        contactName: 'Katherine Reynolds, VP Acquisitions',
        contactPhone: '+1 (212) 880-9200',
        contactEmail: 'acquisitions@clarionridge.com',
        matchScore: 98,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 774000
      },
      {
        buyerId: 'buy-03',
        buyerName: 'Vanguard 1031 Exchange Trust',
        entityName: 'Vanguard Intermediary Holdings',
        contactName: 'David Chen, Managing Principal',
        contactPhone: '+1 (415) 762-1109',
        contactEmail: 'exchange@vanguardtrust.org',
        matchScore: 94,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 774000
      }
    ],
    ownerRecord: {
      ownerName: 'Apex Commercial Holdings LLC',
      holdingEntity: 'Apex Austin Ventures LP (Delaware)',
      ownerType: 'Absentee Corporate LLC',
      ownershipDurationYears: 7,
      skipTracedContact: {
        contactName: 'Marcus Sterling',
        title: 'Managing General Partner',
        verifiedMobile: '+1 (512) 894-2201',
        verifiedEmail: 'msterling@apexventures.com',
        confidence: 96
      }
    },
    motivatingFactors: [
      'High Equity (78%) with minimal debt hurdle',
      'Absentee Ownership (Out of State LLC)',
      'Lease Rollover on Top 2 Floors in Q4',
      'Tax Assessment 12% below Market'
    ],
    comps: [
      { address: '500 W 2nd St, Austin', soldPrice: 22000000, distanceMiles: 0.4, soldDate: '2025-11-14' },
      { address: '300 Colorado St, Austin', soldPrice: 17800000, distanceMiles: 0.3, soldDate: '2026-01-22' }
    ]
  },
  {
    id: 'prop-austin-02',
    address: '1210 S Congress Ave',
    city: 'Austin',
    state: 'TX',
    zipCode: '78704',
    searchArea: 'Austin Downtown & South Congress',
    lat: 30.2520,
    lng: -97.7495,
    propertyType: 'Retail & Mixed Use',
    units: 8,
    squareFeet: 19800,
    lotSizeAcres: 1.1,
    yearBuilt: 2016,
    zestimate: 11200000,
    listPrice: 11800000,
    pricePerSqFt: 565,
    capRate: 7.6,
    grossRentalYield: 9.8,
    estimatedNetOperatingIncome: 851200,
    status: 'Motivated Seller',
    estimatedEquityPct: 84,
    mortgageBalance: 1792000,
    taxAssessment: 10400000,
    annualPropertyTaxes: 184000,
    zoning: 'CS-MU (Commercial Services Mixed)',
    imageUrl: 'https://images.unsplash.com/photo-1555636222-cae831e670b3?auto=format&fit=crop&w=800&q=80',
    historicalRates: {
      oldSaleDate: '2016-09-20',
      oldSalePrice: 5800000,
      oldPricePerSqFt: 293,
      priorAssessment2021: 8900000,
      historicalAppreciationPct: 93.1,
      suggestedMarketRatePerSqFt: 565,
      suggestedTargetOfferPrice: 10600000,
      suggestedTargetRatePerSqFt: 535,
      rateRecommendationReasoning: 'Old purchase rate $293/sqft in 2016. Prime SoCo retail strip foot traffic up 180%. Suggested off-market offer of $535/sqft provides a 5.4% buy discount with immediate 7.8% yield.'
    },
    sellerContact: {
      name: 'Victoria Bradley',
      entity: 'SoCo Plaza Syndicate LLC',
      phone: '+1 (512) 671-9034',
      email: 'vbradley@socoplaza.com',
      role: 'Founding Partner & Managing Member',
      motivation: 'Founding partner retiring to Colorado; seeking clean all-cash 21-day escrow without broker commissions.',
      commissionAgreedPct: 3.0
    },
    matchedBuyers: [
      {
        buyerId: 'buy-02',
        buyerName: 'Palisades Multifamily Partners',
        entityName: 'Palisades Equity Syndicate',
        contactName: 'Julian Vance, Acquisitions Director',
        contactPhone: '+1 (305) 910-4422',
        contactEmail: 'deals@palisadespartners.com',
        matchScore: 92,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 530000
      }
    ],
    ownerRecord: {
      ownerName: 'SoCo Plaza Syndicate LLC',
      holdingEntity: 'Bradley Family Trust',
      ownerType: 'Individual Owner-Occupied',
      ownershipDurationYears: 10,
      skipTracedContact: {
        contactName: 'Victoria Bradley',
        title: 'Managing Member',
        verifiedMobile: '+1 (512) 671-9034',
        verifiedEmail: 'vbradley@socoplaza.com',
        confidence: 98
      }
    },
    motivatingFactors: [
      'Retirement Liquidation',
      'High in-place cash yield (7.6% Cap)',
      '100% leased to boutique retail and cafe tenants',
      'Irreplaceable South Congress street frontage'
    ],
    comps: [
      { address: '1400 S Congress Ave, Austin', soldPrice: 13500000, distanceMiles: 0.2, soldDate: '2025-10-10' },
      { address: '1100 S 1st St, Austin', soldPrice: 9400000, distanceMiles: 0.6, soldDate: '2026-02-04' }
    ]
  },
  {
    id: 'prop-miami-02',
    address: '2200 Biscayne Blvd',
    city: 'Miami',
    state: 'FL',
    zipCode: '33137',
    searchArea: 'Miami Brickell & Arts District',
    lat: 25.7981,
    lng: -80.1903,
    propertyType: 'Multifamily (5+ Units)',
    units: 42,
    squareFeet: 36200,
    lotSizeAcres: 0.85,
    yearBuilt: 2014,
    zestimate: 14200000,
    listPrice: 14650000,
    pricePerSqFt: 392,
    capRate: 6.8,
    grossRentalYield: 8.9,
    estimatedNetOperatingIncome: 965600,
    status: 'Motivated Seller',
    estimatedEquityPct: 65,
    mortgageBalance: 4970000,
    taxAssessment: 12900000,
    annualPropertyTaxes: 245000,
    zoning: 'T6-8-O Urban Core',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    historicalRates: {
      oldSaleDate: '2015-03-11',
      oldSalePrice: 8200000,
      oldPricePerSqFt: 226,
      priorAssessment2021: 11100000,
      historicalAppreciationPct: 73.2,
      suggestedMarketRatePerSqFt: 392,
      suggestedTargetOfferPrice: 13500000,
      suggestedTargetRatePerSqFt: 373,
      rateRecommendationReasoning: 'Old acquisition rate $226/sqft in 2015. Miami Edgewater/Wynwood rents increased 48%. Suggested bridge target offer $373/sqft unlocks $700k immediate discount.'
    },
    sellerContact: {
      name: 'Carlos Morales',
      entity: 'Biscayne Capital Partners LLC (Florida)',
      phone: '+1 (305) 662-7719',
      email: 'cmorales@biscaynecap.com',
      role: 'Principal Sponsor',
      motivation: 'Subscribing into a new hospitality development fund; needs to liquidate multifamily holding within 30 days.',
      commissionAgreedPct: 2.5
    },
    matchedBuyers: [
      {
        buyerId: 'buy-02',
        buyerName: 'Palisades Multifamily Partners',
        entityName: 'Palisades Equity Syndicate',
        contactName: 'Julian Vance, Acquisitions Director',
        contactPhone: '+1 (305) 910-4422',
        contactEmail: 'deals@palisadespartners.com',
        matchScore: 97,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 607500
      },
      {
        buyerId: 'buy-04',
        buyerName: 'BlueStone Family Office',
        entityName: 'BlueStone Real Estate LLC',
        contactName: 'Eleanor Vance, Chief Investment Officer',
        contactPhone: '+1 (650) 441-8930',
        contactEmail: 'investments@bluestonefo.com',
        matchScore: 91,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 607500
      }
    ],
    ownerRecord: {
      ownerName: 'Biscayne Bay Residential Partners LLC',
      holdingEntity: 'Florida Sunshine Real Estate Trust',
      ownerType: 'Out-of-State Landlord',
      ownershipDurationYears: 11,
      skipTracedContact: {
        contactName: 'Carlos Morales',
        title: 'Principal Managing Partner',
        verifiedMobile: '+1 (305) 662-7719',
        verifiedEmail: 'cmorales@biscaynecap.com',
        confidence: 94
      }
    },
    motivatingFactors: [
      '11-Year Ownership Cycle',
      'Pending 1031 Exchange Deadline',
      'Below-Market Current Rents ($2,250 vs $2,800 market avg)',
      'Direct Principal Skip-Traced'
    ],
    comps: [
      { address: '1800 N Bayshore Dr, Miami', soldPrice: 15300000, distanceMiles: 0.6, soldDate: '2025-12-05' },
      { address: '2501 NE 2nd Ave, Miami', soldPrice: 13900000, distanceMiles: 0.5, soldDate: '2026-02-10' }
    ]
  },
  {
    id: 'prop-miami-03',
    address: '1101 Brickell Ave, Tower II',
    city: 'Miami',
    state: 'FL',
    zipCode: '33131',
    searchArea: 'Miami Brickell & Arts District',
    lat: 25.7628,
    lng: -80.1912,
    propertyType: 'Commercial Office',
    squareFeet: 62000,
    yearBuilt: 2012,
    zestimate: 27500000,
    listPrice: 28900000,
    pricePerSqFt: 443,
    capRate: 6.9,
    grossRentalYield: 9.1,
    estimatedNetOperatingIncome: 1897500,
    status: 'Off-Market Deal',
    estimatedEquityPct: 82,
    mortgageBalance: 4950000,
    taxAssessment: 24800000,
    annualPropertyTaxes: 490000,
    zoning: 'T6-48-O Financial Core',
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    historicalRates: {
      oldSaleDate: '2014-11-18',
      oldSalePrice: 15800000,
      oldPricePerSqFt: 255,
      priorAssessment2021: 22100000,
      historicalAppreciationPct: 74.1,
      suggestedMarketRatePerSqFt: 443,
      suggestedTargetOfferPrice: 26000000,
      suggestedTargetRatePerSqFt: 419,
      rateRecommendationReasoning: 'Old purchase rate $255/sqft. Brickell Class-A rents hit $98/sqft. Recommended target buy offer at $419/sqft gives buyer a 5.5% cap in-place with $1.5M immediate equity spread.'
    },
    sellerContact: {
      name: 'Eduardo Santoro',
      entity: 'Santoro Brickell Equities Inc',
      phone: '+1 (305) 782-9910',
      email: 'esantoro@santoroequities.com',
      role: 'Chief Executive Officer',
      motivation: 'Fund sunset liquidation; mandate to return capital to LP investors by Q3.',
      commissionAgreedPct: 2.5
    },
    matchedBuyers: [
      {
        buyerId: 'buy-01',
        buyerName: 'Clarion Ridge Capital',
        entityName: 'Clarion Ridge RE Fund IV',
        contactName: 'Katherine Reynolds, VP Acquisitions',
        contactPhone: '+1 (212) 880-9200',
        contactEmail: 'acquisitions@clarionridge.com',
        matchScore: 96,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 1170000
      }
    ],
    ownerRecord: {
      ownerName: 'Santoro Brickell Equities Inc',
      holdingEntity: 'Brickell Tower Real Estate Trust',
      ownerType: 'Absentee Corporate LLC',
      ownershipDurationYears: 12,
      skipTracedContact: {
        contactName: 'Eduardo Santoro',
        title: 'CEO & Trustee',
        verifiedMobile: '+1 (305) 782-9910',
        verifiedEmail: 'esantoro@santoroequities.com',
        confidence: 97
      }
    },
    motivatingFactors: [
      'Fund Sunset Mandate',
      'Class-A Trophy Brickell Financial District',
      'Institutional single-tenant anchor lease (Citibank regional)',
      '82% unencumbered equity'
    ],
    comps: [
      { address: '1221 Brickell Ave, Miami', soldPrice: 31000000, distanceMiles: 0.3, soldDate: '2025-08-19' },
      { address: '800 Brickell Ave, Miami', soldPrice: 26500000, distanceMiles: 0.4, soldDate: '2026-01-30' }
    ]
  },
  {
    id: 'prop-denver-03',
    address: '10400 E 40th Ave',
    city: 'Denver',
    state: 'CO',
    zipCode: '80239',
    searchArea: 'Denver RiNo & Airport Logistics',
    lat: 39.7715,
    lng: -104.8643,
    propertyType: 'Industrial Warehouse',
    squareFeet: 82000,
    lotSizeAcres: 4.2,
    yearBuilt: 2017,
    zestimate: 16800000,
    listPrice: 17200000,
    pricePerSqFt: 205,
    capRate: 7.9,
    grossRentalYield: 10.2,
    estimatedNetOperatingIncome: 1327200,
    status: 'Pre-Foreclosure / Distressed',
    estimatedEquityPct: 52,
    mortgageBalance: 8064000,
    taxAssessment: 15100000,
    annualPropertyTaxes: 215000,
    zoning: 'I-B Industrial General',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    historicalRates: {
      oldSaleDate: '2017-08-29',
      oldSalePrice: 10200000,
      oldPricePerSqFt: 124,
      priorAssessment2021: 13800000,
      historicalAppreciationPct: 64.7,
      suggestedMarketRatePerSqFt: 205,
      suggestedTargetOfferPrice: 15400000,
      suggestedTargetRatePerSqFt: 188,
      rateRecommendationReasoning: 'Original build/sale rate $124/sqft in 2017. Pre-foreclosure workout creates distressed window. Suggested cash offer $188/sqft solves default and captures $1.4M discount.'
    },
    sellerContact: {
      name: 'Sarah Jenkins',
      entity: 'Front Range Logistics LLC',
      phone: '+1 (303) 554-1928',
      email: 'sjenkins@frontrangelog.com',
      role: 'Chief Operating Officer & General Manager',
      motivation: 'Notice of default filed by regional lender; workout agreement expires in 22 days. Immediate cash buyout needed.',
      commissionAgreedPct: 3.0
    },
    matchedBuyers: [
      {
        buyerId: 'buy-01',
        buyerName: 'Clarion Ridge Capital',
        entityName: 'Clarion Ridge RE Fund IV',
        contactName: 'Katherine Reynolds, VP Acquisitions',
        contactPhone: '+1 (212) 880-9200',
        contactEmail: 'acquisitions@clarionridge.com',
        matchScore: 99,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 770000
      },
      {
        buyerId: 'buy-03',
        buyerName: 'Vanguard 1031 Exchange Trust',
        entityName: 'Vanguard Intermediary Holdings',
        contactName: 'David Chen, Managing Principal',
        contactPhone: '+1 (415) 762-1109',
        contactEmail: 'exchange@vanguardtrust.org',
        matchScore: 95,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 770000
      }
    ],
    ownerRecord: {
      ownerName: 'Front Range Logistics LLC',
      holdingEntity: 'High Plains Real Estate Group',
      ownerType: 'Absentee Corporate LLC',
      ownershipDurationYears: 5,
      skipTracedContact: {
        contactName: 'Sarah Jenkins',
        title: 'Chief Operating Officer',
        verifiedMobile: '+1 (303) 554-1928',
        verifiedEmail: 'sjenkins@frontrangelog.com',
        confidence: 91
      }
    },
    motivatingFactors: [
      'Notice of Default Recorded 18 Days Ago',
      'Single Tenant NNN Lease Renewal Pending',
      'Excellent 32ft Clear Height with 14 Dock Doors',
      'Motivated Lender Workout in Progress'
    ],
    comps: [
      { address: '11200 E 45th Ave, Denver', soldPrice: 18100000, distanceMiles: 1.1, soldDate: '2025-10-18' },
      { address: '9800 E 40th Ave, Denver', soldPrice: 15900000, distanceMiles: 0.7, soldDate: '2026-01-09' }
    ]
  },
  {
    id: 'prop-scottsdale-04',
    address: '7301 E Indian Bend Rd',
    city: 'Scottsdale',
    state: 'AZ',
    zipCode: '85250',
    searchArea: 'Scottsdale Waterfront & Old Town',
    lat: 33.5387,
    lng: -111.9234,
    propertyType: 'Retail & Mixed Use',
    units: 14,
    squareFeet: 27400,
    lotSizeAcres: 2.1,
    yearBuilt: 2011,
    zestimate: 9800000,
    pricePerSqFt: 357,
    capRate: 7.5,
    grossRentalYield: 9.7,
    estimatedNetOperatingIncome: 735000,
    status: 'Off-Market Deal',
    estimatedEquityPct: 88,
    mortgageBalance: 1176000,
    taxAssessment: 8900000,
    annualPropertyTaxes: 112000,
    zoning: 'C-2 Commercial',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    historicalRates: {
      oldSaleDate: '2011-04-10',
      oldSalePrice: 4200000,
      oldPricePerSqFt: 153,
      priorAssessment2021: 7600000,
      historicalAppreciationPct: 133.3,
      suggestedMarketRatePerSqFt: 357,
      suggestedTargetOfferPrice: 9100000,
      suggestedTargetRatePerSqFt: 332,
      rateRecommendationReasoning: 'Purchased at $153/sqft in 2011. Owner holds 88% pure equity. Recommended bridge offer $332/sqft provides a swift, commission-free exit for retiring founder.'
    },
    sellerContact: {
      name: 'Richard Vance Sr.',
      entity: 'Scottsdale Trust 2008 / Desert Horizon Partners',
      phone: '+1 (480) 629-8431',
      email: 'rvance@deserthorizon.net',
      role: 'Trustee & Lead Developer',
      motivation: 'Retiring trustee (age 74); estate planning transition to passive liquidity.',
      commissionAgreedPct: 2.5
    },
    matchedBuyers: [
      {
        buyerId: 'buy-03',
        buyerName: 'Vanguard 1031 Exchange Trust',
        entityName: 'Vanguard Intermediary Holdings',
        contactName: 'David Chen, Managing Principal',
        contactPhone: '+1 (415) 762-1109',
        contactEmail: 'exchange@vanguardtrust.org',
        matchScore: 98,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 409500
      },
      {
        buyerId: 'buy-02',
        buyerName: 'Palisades Multifamily Partners',
        entityName: 'Palisades Equity Syndicate',
        contactName: 'Julian Vance, Acquisitions Director',
        contactPhone: '+1 (305) 910-4422',
        contactEmail: 'deals@palisadespartners.com',
        matchScore: 93,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 409500
      }
    ],
    ownerRecord: {
      ownerName: 'Desert Horizon Partners',
      holdingEntity: 'Scottsdale Trust 2008',
      ownerType: 'Individual Owner-Occupied',
      ownershipDurationYears: 16,
      skipTracedContact: {
        contactName: 'Richard Vance Sr.',
        title: 'Trustee / Owner',
        verifiedMobile: '+1 (480) 629-8431',
        verifiedEmail: 'rvance@deserthorizon.net',
        confidence: 97
      }
    },
    motivatingFactors: [
      'Retiring Owner (16 Years Ownership)',
      'Ultra-Low Mortgage Balance (88% Equity)',
      '100% Occupied with Triple-Net (NNN) Leases',
      'Desirable Scottsdale Signalized Corner'
    ],
    comps: [
      { address: '7100 E Shea Blvd, Scottsdale', soldPrice: 10400000, distanceMiles: 1.8, soldDate: '2025-09-30' },
      { address: '8400 E McDowell Rd, Scottsdale', soldPrice: 8950000, distanceMiles: 2.4, soldDate: '2026-02-18' }
    ]
  },
  {
    id: 'prop-bayarea-05',
    address: '450 Townsend St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94107',
    searchArea: 'San Francisco SoMa Corridor',
    lat: 37.7735,
    lng: -122.3995,
    propertyType: 'Commercial Office',
    squareFeet: 34000,
    yearBuilt: 2004,
    zestimate: 15300000,
    listPrice: 16000000,
    pricePerSqFt: 450,
    capRate: 6.4,
    grossRentalYield: 8.5,
    estimatedNetOperatingIncome: 979200,
    status: 'Motivated Seller',
    estimatedEquityPct: 71,
    mortgageBalance: 4437000,
    taxAssessment: 14200000,
    annualPropertyTaxes: 182000,
    zoning: 'MUO (Mixed Use Office)',
    imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
    historicalRates: {
      oldSaleDate: '2016-12-08',
      oldSalePrice: 19500000,
      oldPricePerSqFt: 573,
      priorAssessment2021: 18200000,
      historicalAppreciationPct: -21.5,
      suggestedMarketRatePerSqFt: 450,
      suggestedTargetOfferPrice: 13900000,
      suggestedTargetRatePerSqFt: 408,
      rateRecommendationReasoning: 'Peak 2016 purchase at $573/sqft. Market re-baselined to $450/sqft. Suggested aggressive buy offer of $408/sqft ($13.9M) gives buyer major upside on conversion to AI lab or residential.'
    },
    sellerContact: {
      name: 'Jonathan Wu',
      entity: 'Townsend Real Estate LLC / SoMa Tech Holdings',
      phone: '+1 (415) 890-3411',
      email: 'jwu@somatechholdings.com',
      role: 'Managing Director & GP',
      motivation: 'Tech anchor tenant vacated; owner seeking quick off-market disposition before refinancing reset.',
      commissionAgreedPct: 2.5
    },
    matchedBuyers: [
      {
        buyerId: 'buy-04',
        buyerName: 'BlueStone Family Office',
        entityName: 'BlueStone Real Estate LLC',
        contactName: 'Eleanor Vance, Chief Investment Officer',
        contactPhone: '+1 (650) 441-8930',
        contactEmail: 'investments@bluestonefo.com',
        matchScore: 96,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 625500
      },
      {
        buyerId: 'buy-03',
        buyerName: 'Vanguard 1031 Exchange Trust',
        entityName: 'Vanguard Intermediary Holdings',
        contactName: 'David Chen, Managing Principal',
        contactPhone: '+1 (415) 762-1109',
        contactEmail: 'exchange@vanguardtrust.org',
        matchScore: 91,
        buyFeeAgreedPct: 2.0,
        estDualCommission: 625500
      }
    ],
    ownerRecord: {
      ownerName: 'SoMa Tech Realty Partners',
      holdingEntity: 'Townsend Real Estate LLC',
      ownerType: 'Absentee Corporate LLC',
      ownershipDurationYears: 8,
      skipTracedContact: {
        contactName: 'Jonathan Wu',
        title: 'Managing Director',
        verifiedMobile: '+1 (415) 890-3411',
        verifiedEmail: 'jwu@somatechholdings.com',
        confidence: 95
      }
    },
    motivatingFactors: [
      'Tech Tenant Sublease Restructuring',
      'Soma High Foot Traffic Corridor',
      'Opportunity for Office-to-Residential or Lab Conversion',
      'Seller Seeking Immediate 45-Day Close'
    ],
    comps: [
      { address: '500 3rd St, San Francisco', soldPrice: 17200000, distanceMiles: 0.5, soldDate: '2025-11-20' },
      { address: '360 Brannan St, San Francisco', soldPrice: 14800000, distanceMiles: 0.3, soldDate: '2026-01-15' }
    ]
  },
  {
    id: 'prop-dallas-06',
    address: '2600 McKinney Ave',
    city: 'Dallas',
    state: 'TX',
    zipCode: '75204',
    searchArea: 'Dallas Uptown & Arts District',
    lat: 32.7984,
    lng: -96.8021,
    propertyType: 'Single Family Residential',
    bedrooms: 6,
    bathrooms: 7,
    squareFeet: 8900,
    lotSizeAcres: 0.65,
    yearBuilt: 2021,
    zestimate: 5400000,
    listPrice: 5650000,
    pricePerSqFt: 606,
    capRate: 5.8,
    grossRentalYield: 7.9,
    estimatedNetOperatingIncome: 313200,
    status: 'Off-Market Deal',
    estimatedEquityPct: 91,
    mortgageBalance: 486000,
    taxAssessment: 5100000,
    annualPropertyTaxes: 86000,
    zoning: 'PD-193 Luxury Urban Residential',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    historicalRates: {
      oldSaleDate: '2021-06-15',
      oldSalePrice: 3850000,
      oldPricePerSqFt: 432,
      priorAssessment2021: 4100000,
      historicalAppreciationPct: 40.2,
      suggestedMarketRatePerSqFt: 606,
      suggestedTargetOfferPrice: 5150000,
      suggestedTargetRatePerSqFt: 578,
      rateRecommendationReasoning: 'Original acquisition rate $432/sqft. Luxury Dallas infill appreciated 40%. Suggested target offer of $578/sqft ($5.15M) yields immediate $250k buyer spread and allows instant cash closing.'
    },
    sellerContact: {
      name: 'Harrison Price',
      entity: 'McKinney Heritage Trust',
      phone: '+1 (214) 739-1184',
      email: 'hprice@mckinneytrust.com',
      role: 'Family Trustee & Owner',
      motivation: 'Relocating corporate headquarters to Zurich; seeking off-market private treaty sale to preserve privacy.',
      commissionAgreedPct: 2.5
    },
    matchedBuyers: [
      {
        buyerId: 'buy-04',
        buyerName: 'BlueStone Family Office',
        entityName: 'BlueStone Real Estate LLC',
        contactName: 'Eleanor Vance, Chief Investment Officer',
        contactPhone: '+1 (650) 441-8930',
        contactEmail: 'investments@bluestonefo.com',
        matchScore: 97,
        buyFeeAgreedPct: 2.5,
        estDualCommission: 257500
      }
    ],
    ownerRecord: {
      ownerName: 'Harrison Price & Price Family Trust',
      holdingEntity: 'McKinney Heritage Trust',
      ownerType: 'Individual Owner-Occupied',
      ownershipDurationYears: 5,
      skipTracedContact: {
        contactName: 'Harrison Price',
        title: 'Trustee / Owner',
        verifiedMobile: '+1 (214) 739-1184',
        verifiedEmail: 'hprice@mckinneytrust.com',
        confidence: 99
      }
    },
    motivatingFactors: [
      'High Net Worth Private Treaty (Off-Market)',
      'Relocating to Europe in 45 Days',
      'Ultra-Low Debt (91% Equity)',
      'Zero Public MLS Listing Footprint'
    ],
    comps: [
      { address: '2800 Maple Ave, Dallas', soldPrice: 5900000, distanceMiles: 0.4, soldDate: '2025-12-18' },
      { address: '2400 Cedar Springs Rd, Dallas', soldPrice: 4950000, distanceMiles: 0.5, soldDate: '2026-02-12' }
    ]
  }
];

export const INITIAL_BUYERS: BuyerProfile[] = [
  {
    id: 'buy-01',
    name: 'Clarion Ridge Capital',
    entityName: 'Clarion Ridge RE Fund IV',
    buyerType: 'Institutional Private Equity',
    verifiedFundsProof: '$45,000,000 Proof of Funds on file (JPMorgan Chase)',
    targetAssetClasses: ['Commercial Office', 'Industrial Warehouse'],
    targetMarkets: ['Austin, TX', 'Denver, CO', 'Phoenix, AZ'],
    minBudget: 10000000,
    maxBudget: 35000000,
    minCapRate: 7.0,
    closingTimelineDays: 21,
    contactEmail: 'acquisitions@clarionridge.com',
    contactPhone: '+1 (212) 880-9200',
    dealsClosedPast12Mo: 9,
    activeBuyBoxDescription: 'Seeking core-plus and value-add logistics & class-A office in sunbelt tech hubs. Cash buyer with expedited 14-day diligence capability.',
    matchCount: 3
  },
  {
    id: 'buy-02',
    name: 'Palisades Multifamily Partners',
    entityName: 'Palisades Equity Syndicate',
    buyerType: 'Value-Add Syndicator',
    verifiedFundsProof: '$22,500,000 Proof of Funds on file (Wells Fargo)',
    targetAssetClasses: ['Multifamily (5+ Units)', 'Retail & Mixed Use'],
    targetMarkets: ['Miami, FL', 'Scottsdale, AZ', 'Tampa, FL'],
    minBudget: 5000000,
    maxBudget: 25000000,
    minCapRate: 6.5,
    closingTimelineDays: 30,
    contactEmail: 'deals@palisadespartners.com',
    contactPhone: '+1 (305) 910-4422',
    dealsClosedPast12Mo: 6,
    activeBuyBoxDescription: 'Focusing on 20-100 unit multifamily assets with operational upside and below-market rents in Florida and Arizona.',
    matchCount: 2
  },
  {
    id: 'buy-03',
    name: 'Vanguard 1031 Exchange Trust',
    entityName: 'Vanguard Intermediary Holdings',
    buyerType: '1031 Exchange Buyer',
    verifiedFundsProof: '$14,200,000 In Qualified Escrow (Chicago Title)',
    targetAssetClasses: ['Industrial Warehouse', 'Retail & Mixed Use', 'Commercial Office'],
    targetMarkets: ['Austin, TX', 'Scottsdale, AZ', 'San Francisco, CA'],
    minBudget: 8000000,
    maxBudget: 18000000,
    minCapRate: 6.8,
    closingTimelineDays: 14,
    contactEmail: 'exchange@vanguardtrust.org',
    contactPhone: '+1 (415) 762-1109',
    dealsClosedPast12Mo: 4,
    activeBuyBoxDescription: 'Urgent 1031 identification deadline in 19 days. Must deploy $14M+ into cash-flowing NNN assets or single-tenant stabilized properties.',
    matchCount: 4
  },
  {
    id: 'buy-04',
    name: 'BlueStone Family Office',
    entityName: 'BlueStone Real Estate LLC',
    buyerType: 'Family Office',
    verifiedFundsProof: '$38,000,000 All-Cash Allocation',
    targetAssetClasses: ['Multifamily (5+ Units)', 'Commercial Office'],
    targetMarkets: ['San Francisco, CA', 'Miami, FL', 'Austin, TX'],
    minBudget: 12000000,
    maxBudget: 40000000,
    minCapRate: 6.2,
    closingTimelineDays: 25,
    contactEmail: 'investments@bluestonefo.com',
    contactPhone: '+1 (650) 441-8930',
    dealsClosedPast12Mo: 3,
    activeBuyBoxDescription: 'Generational buy-and-hold capital looking for high-quality architectural assets, prime urban infill, and long-term appreciation.',
    matchCount: 3
  }
];

export const INITIAL_SELLER_INQUIRIES: SellerInquiry[] = [
  {
    id: 'sell-01',
    propertyAddress: '1120 S Lamar Blvd',
    cityStateZip: 'Austin, TX 78704',
    sellerName: 'Robert Sterling',
    sellerEmail: 'robert@sterlingholdings.com',
    sellerPhone: '+1 (512) 419-8832',
    askingPrice: 8400000,
    estimatedZestimate: 8750000,
    timeline: 'Immediate (14-30 days cash)',
    reasonForSelling: 'Retiring from active management; moving capital to passive index syndications.',
    propertyType: 'Retail & Mixed Use',
    submittedAt: '2026-03-08T16:20:00Z',
    status: 'Matched to 4 Buyers'
  },
  {
    id: 'sell-02',
    propertyAddress: '880 Brickell Ave, 4th Floor',
    cityStateZip: 'Miami, FL 33131',
    sellerName: 'Carlos Morales',
    sellerEmail: 'cmorales@brickellenterprises.com',
    sellerPhone: '+1 (305) 662-7719',
    askingPrice: 12800000,
    estimatedZestimate: 13100000,
    timeline: '60-90 days',
    reasonForSelling: 'Consolidating corporate footprint; downsizing physical offices for remote operations.',
    propertyType: 'Commercial Office',
    submittedAt: '2026-03-09T09:45:00Z',
    status: 'Underwriting Completed'
  },
  {
    id: 'sell-03',
    propertyAddress: '3150 W Colfax Ave',
    cityStateZip: 'Denver, CO 80204',
    sellerName: 'Elena Rostova',
    sellerEmail: 'elena@rostovarealestate.com',
    sellerPhone: '+1 (303) 891-2341',
    askingPrice: 6200000,
    estimatedZestimate: 6450000,
    timeline: 'Immediate (14-30 days cash)',
    reasonForSelling: 'Partnership dissolution; seeking fast cash liquidation without listing contingencies.',
    propertyType: 'Multifamily (5+ Units)',
    submittedAt: '2026-03-10T14:15:00Z',
    status: 'Offer Sent'
  }
];

// Dual-Commission Bridge Deals Seed
export const INITIAL_BRIDGE_DEALS: BridgeDeal[] = [
  {
    id: 'bridge-deal-01',
    propertyId: 'prop-austin-01',
    propertyAddress: '401 Congress Ave, Suite 1800, Austin, TX',
    propertyType: 'Commercial Office',
    searchArea: 'Austin Downtown & South Congress',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    sellerName: 'Marcus Sterling',
    sellerEntity: 'Apex Austin Ventures LP (Delaware LLC)',
    sellerPhone: '+1 (512) 894-2201',
    sellerEmail: 'msterling@apexventures.com',
    sellerCommissionPct: 2.5,
    buyerId: 'buy-01',
    buyerName: 'Clarion Ridge Capital',
    buyerEntity: 'Clarion Ridge RE Fund IV',
    buyerContactName: 'Katherine Reynolds, VP Acquisitions',
    buyerPhone: '+1 (212) 880-9200',
    buyerEmail: 'acquisitions@clarionridge.com',
    buyerCommissionPct: 2.0,
    agreedPrice: 17200000,
    sellerCommissionFee: 430000,
    buyerCommissionFee: 344000,
    totalCommission: 774000,
    oldRatePerSqFt: 235,
    suggestedRatePerSqFt: 355,
    dealStatus: 'In Escrow',
    createdAt: '2026-03-05T11:00:00Z',
    targetCloseDate: '2026-03-29',
    escrowRef: 'ESC-TX-77401-CT'
  },
  {
    id: 'bridge-deal-02',
    propertyId: 'prop-miami-02',
    propertyAddress: '2200 Biscayne Blvd, Miami, FL',
    propertyType: 'Multifamily (5+ Units)',
    searchArea: 'Miami Brickell & Arts District',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    sellerName: 'Carlos Morales',
    sellerEntity: 'Biscayne Capital Partners LLC',
    sellerPhone: '+1 (305) 662-7719',
    sellerEmail: 'cmorales@biscaynecap.com',
    sellerCommissionPct: 2.5,
    buyerId: 'buy-02',
    buyerName: 'Palisades Multifamily Partners',
    buyerEntity: 'Palisades Equity Syndicate',
    buyerContactName: 'Julian Vance, Acquisitions Director',
    buyerPhone: '+1 (305) 910-4422',
    buyerEmail: 'deals@palisadespartners.com',
    buyerCommissionPct: 2.0,
    agreedPrice: 13500000,
    sellerCommissionFee: 337500,
    buyerCommissionFee: 270000,
    totalCommission: 607500,
    oldRatePerSqFt: 226,
    suggestedRatePerSqFt: 373,
    dealStatus: 'LOI / Underwriting',
    createdAt: '2026-03-08T14:30:00Z',
    targetCloseDate: '2026-04-12',
    escrowRef: 'ESC-FL-60752-FN'
  },
  {
    id: 'bridge-deal-03',
    propertyId: 'prop-scottsdale-04',
    propertyAddress: '7301 E Indian Bend Rd, Scottsdale, AZ',
    propertyType: 'Retail & Mixed Use',
    searchArea: 'Scottsdale Waterfront & Old Town',
    imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
    sellerName: 'Richard Vance Sr.',
    sellerEntity: 'Scottsdale Trust 2008 / Desert Horizon',
    sellerPhone: '+1 (480) 629-8431',
    sellerEmail: 'rvance@deserthorizon.net',
    sellerCommissionPct: 2.5,
    buyerId: 'buy-03',
    buyerName: 'Vanguard 1031 Exchange Trust',
    buyerEntity: 'Vanguard Intermediary Holdings',
    buyerContactName: 'David Chen, Managing Principal',
    buyerPhone: '+1 (415) 762-1109',
    buyerEmail: 'exchange@vanguardtrust.org',
    buyerCommissionPct: 2.0,
    agreedPrice: 9100000,
    sellerCommissionFee: 227500,
    buyerCommissionFee: 182000,
    totalCommission: 409500,
    oldRatePerSqFt: 153,
    suggestedRatePerSqFt: 332,
    dealStatus: 'Dual Agreements Out for Signature',
    createdAt: '2026-03-11T09:15:00Z',
    targetCloseDate: '2026-04-05',
    escrowRef: 'ESC-AZ-40953-FC'
  }
];

// Specialized Neural Agents Composing the Autonomous Deal Swarm
export const SWARM_AGENTS: SwarmAgent[] = [
  {
    id: 'agent-argus',
    name: 'Argus',
    codename: 'DEED-FORENSICS-SCOUT',
    role: 'Off-Market Asset Scout & Deed Forensics Agent',
    phase: 'scout',
    model: 'Gemini-2.5-Flash (Spatial & Multimodal)',
    avatarColor: 'emerald',
    specialty: 'Municipal Title Scraping, Historical $/sqft Deltas, Equity Modeling & Liquidation Triggers'
  },
  {
    id: 'agent-aria',
    name: 'Aria',
    codename: 'VOICE-SELLER-CLOSER',
    role: 'Delaware LLC Unmasking & AI Voice Call Agent',
    phase: 'seller_call',
    model: 'Gemini Live Multimodal Voice Engine',
    avatarColor: 'amber',
    specialty: 'Direct Cellular Skip-Tracing, Real-Time Voice Synthesis, Objection Handling & 2.5% Mandate Signing'
  },
  {
    id: 'agent-sterling',
    name: 'Sterling',
    codename: 'CAPITAL-MATCHMAKER',
    role: 'Institutional Capital & Buy-Box Matchmaker',
    phase: 'buyer_match',
    model: 'Gemini-2.5-Pro (Reasoning & Financial Structuring)',
    avatarColor: 'indigo',
    specialty: 'Institutional Buy-Box Ingestion, Personalized Deal Memos & 2.0% Finder\'s Fee Mandates'
  },
  {
    id: 'agent-solon',
    name: 'Solon',
    codename: 'CLEARING-ARBITER',
    role: 'Multi-Agent Clearing Price Arbiter & LOI Structurer',
    phase: 'negotiation',
    model: 'Gemini-2.5-Pro (Game Theory Equilibrium Engine)',
    avatarColor: 'cyan',
    specialty: 'Algorithmic Multi-Round Negotiation, Debt Yield Harmonization & Bilateral LOI Execution'
  },
  {
    id: 'agent-veritas',
    name: 'Veritas',
    codename: 'DILIGENCE-AUDITOR',
    role: 'Autonomous Due Diligence & Title Auditor',
    phase: 'due_diligence',
    model: 'Gemini-2.5-Flash (Document & OCR Inspector)',
    avatarColor: 'purple',
    specialty: 'Municipal Lien Sweeps, Delaware Good Standing, Phase I ESA & Tenant Estoppel Verification'
  },
  {
    id: 'agent-nexus',
    name: 'Nexus',
    codename: 'ESCROW-CLOSER',
    role: 'Escrow Wire Settlement & Dual Commission Closer',
    phase: 'closing',
    model: 'Gemini-2.5-Pro (Financial Settlement Engine)',
    avatarColor: 'emerald',
    specialty: 'ALTA / HUD-1 Settlement Statements, Fedwire Routing, 1031 Tax Deferral & Dual Fee Capture'
  }
];

export const INITIAL_SWARM_EXECUTIONS: SwarmExecution[] = [
  {
    id: 'swarm-exec-01',
    propertyId: 'prop-austin-01',
    propertyAddress: '401 Congress Ave, Suite 1800, Austin, TX',
    searchArea: 'Austin Downtown & South Congress',
    status: 'completed',
    currentPhase: 'closing',
    phaseProgress: 100,
    startedAt: '2026-03-05T08:30:00Z',
    completedAt: '2026-03-05T09:12:00Z',
    speedMode: 'turbo',
    logs: [
      {
        id: 'log-01',
        timestamp: '08:30:12',
        phase: 'scout',
        agentName: 'Argus',
        agentRole: 'Deed Forensics Scout',
        message: 'Scanned Travis County deed books. Identified off-market Class-A office asset at 401 Congress Ave. Original 2018 deed rate: $235/sqft ($11,400,000). Current market AVM: $382/sqft ($18,527,000). Detected 1031 liquidation trigger: Owner has active exchange clock with 42 days remaining.',
        type: 'scout'
      },
      {
        id: 'log-02',
        timestamp: '08:35:45',
        phase: 'seller_call',
        agentName: 'Aria',
        agentRole: 'Voice Seller Closer',
        message: 'Unmasked Delaware LLC shell "Apex Austin Ventures LP". Identified Managing GP Marcus Sterling with direct cell +1 (512) 894-2201. Placed autonomous AI voice call. Handled objection regarding broker listing delays. Marcus agreed to off-market direct institutional placement and digitally signed 2.5% representation agreement.',
        type: 'voice'
      },
      {
        id: 'log-03',
        timestamp: '08:42:10',
        phase: 'buyer_match',
        agentName: 'Sterling',
        agentRole: 'Capital Matchmaker',
        message: 'Filtered 14 qualified institutional buyers. Clarion Ridge Capital Fund IV scored 98% match ($25M buy-box, Austin MSA focus, 7.2% cap hurdle). Delivered AI Underwriting Memo. Clarion Ridge executed 2.0% buyer finder fee mandate.',
        type: 'match'
      },
      {
        id: 'log-04',
        timestamp: '08:51:22',
        phase: 'negotiation',
        agentName: 'Solon',
        agentRole: 'Clearing Price Arbiter',
        message: 'Ran 3-round multi-agent algorithmic arbitration. Reconciled seller reserve of $16.8M with buyer target debt yield. Discovered equilibrium clearing price at $17,200,000 ($355/sqft). Locked binding Bilateral LOI with 21-day escrow and $516,000 earnest deposit.',
        type: 'negotiate'
      },
      {
        id: 'log-05',
        timestamp: '09:02:05',
        phase: 'due_diligence',
        agentName: 'Veritas',
        agentRole: 'Diligence Auditor',
        message: 'Completed municipal title audit. Verified clean Delaware good standing. Scanned Phase I Environmental ESA (Clean, no recognized environmental conditions). Audited 100% of commercial tenant leases with signed estoppel certificates.',
        type: 'audit'
      },
      {
        id: 'log-06',
        timestamp: '09:12:00',
        phase: 'closing',
        agentName: 'Nexus',
        agentRole: 'Escrow Settlement Closer',
        message: 'Generated ALTA closing settlement statement. Fedwire instructions verified. Deducted $430,000 seller commission (2.5%) and $344,000 buyer finder fee (2.0%). Total dual platform revenue of $774,000 deposited to Acuity Escrow Vault. Net proceeds of $16,770,000 wired to Qualified Intermediary for 1031 tax deferral.',
        type: 'success'
      }
    ],
    deedForensics: {
      scannedRegistry: 'Travis County Real Property Registry (Deed Doc #2018-09142)',
      deedYear: '2018',
      originalPriceSqFt: 235,
      currentAvmSqFt: 382,
      targetOfferPrice: 17200000,
      targetPriceSqFt: 355,
      appreciationPct: 50.8,
      liquidationTrigger: '1031 Tax Exchange Replacement Deadline (38 Days Remaining)',
      equityBuildUpUsd: 11450000,
      inPlaceNetNoi: 1240000,
      capRateEstimated: 7.21
    },
    sellerEngagement: {
      sellerName: 'Marcus Sterling',
      unmaskedEntity: 'Apex Austin Ventures LP (Delaware LLC)',
      verifiedCell: '+1 (512) 894-2201',
      verifiedEmail: 'msterling@apexventures.com',
      callDurationSeconds: 248,
      callStatus: 'Completed - Mandate Secured',
      callTranscript: [
        { speaker: 'Agent Aria', text: 'Hello Marcus, this is Aria from Acuity Capital Intelligence. I am reaching out regarding your Class-A asset at 401 Congress Avenue.', time: '00:03', sentiment: 'neutral' },
        { speaker: 'Marcus Sterling', text: 'How did you get this private cell? I am not looking to list publicly on CoStar or LoopNet.', time: '00:14', sentiment: 'objection' },
        { speaker: 'Agent Aria', text: 'Completely understood, Marcus. We never do public listings. Our autonomous bridge engine matches vetted institutional buyers with off-market assets. We saw your 1031 timeline is active and we have an institutional buyer with $25M proof of funds ready to close in 21 days.', time: '00:28', sentiment: 'neutral' },
        { speaker: 'Marcus Sterling', text: 'That would actually solve my 1031 rollover timing. What is your fee structure and valuation expectation?', time: '00:52', sentiment: 'positive' },
        { speaker: 'Agent Aria', text: 'We model clearing at $17.2M ($355/sqft), capturing over $5.8M in equity since your 2018 deed. We charge an off-market representation fee of 2.5%, deducted strictly upon title close. We collect a matching finder fee from the buyer.', time: '01:15', sentiment: 'neutral' },
        { speaker: 'Marcus Sterling', text: 'That works for me. If you can close with Clarion Ridge in 21 days with no public marketing, send over the exclusive mandate for e-signature.', time: '01:45', sentiment: 'closed' }
      ],
      sellerCommissionAgreedPct: 2.5,
      representationAgreementRef: 'AGR-SELLER-ATX-77401',
      agreementSignedAt: '2026-03-05T08:38:22Z'
    },
    buyerMatchResult: {
      buyerId: 'buy-01',
      buyerName: 'Clarion Ridge Capital',
      entityName: 'Clarion Ridge RE Fund IV',
      buyerType: 'Institutional Private Equity',
      contactName: 'Katherine Reynolds, VP Acquisitions',
      contactPhone: '+1 (212) 880-9200',
      contactEmail: 'acquisitions@clarionridge.com',
      maxBudget: 25000000,
      fitScore: 98,
      memoDelivered: true,
      memoRef: 'MEMO-CLARION-401CONGRESS',
      buyerFinderFeeAgreedPct: 2.0
    },
    negotiationArbitration: {
      clearingPrice: 17200000,
      sellerDiscountPct: 7.2,
      buyerEquityBufferUsd: 1327000,
      roundsNegotiated: 3,
      optimalStructure: 'All-Cash Direct Title Escrow',
      loiSignedBilateral: true,
      loiRef: 'LOI-ATX-17200-BILATERAL',
      loiSignedAt: '2026-03-05T08:53:40Z',
      roundsSummary: [
        { round: 1, sellerBid: 17800000, buyerOffer: 16500000, note: 'Seller anchored at peak AVM; buyer countered based on 7.5% debt yield hurdle.' },
        { round: 2, sellerBid: 17450000, buyerOffer: 16900000, note: 'Agent Solon harmonized tenant vacancy rollover credit and 14-day inspection window.' },
        { round: 3, sellerBid: 17200000, buyerOffer: 17200000, note: 'Equilibrium clearing price locked. Both parties executed binding LOI.' }
      ]
    },
    dueDiligenceAudit: {
      titleSearchStatus: 'Clean Title Commitment Issued',
      delawareGoodStanding: true,
      taxLienSearch: 'No Municipal Liens Detected',
      environmentalPhase1: 'Clean Phase I Environmental ESA',
      estoppelCertificatesVerified: 8,
      totalTenantLeasesAudited: 8,
      auditPassed: true,
      auditRef: 'AUDIT-DILIGENCE-TX-9902'
    },
    closingSettlement: {
      grossSalePrice: 17200000,
      sellerCommissionTake: 430000,
      buyerFinderFeeTake: 344000,
      totalPlatformTake: 774000,
      netSellerProceeds: 16770000,
      earnestDepositHeld: 516000,
      escrowWireRef: 'WIRE-FED-77401-TEXAS-ESCROW',
      altaStatementRef: 'ALTA-STMT-2026-03-401CONGRESS',
      settlementCompletedAt: '2026-03-05T09:12:00Z',
      fundsDistributed: true,
      qualifiedIntermediary1031Routing: 'First American 1031 Exchange Intermediary Trust (Ref #1031-TX-9981)'
    }
  },
  {
    id: 'swarm-exec-02',
    propertyId: 'prop-miami-02',
    propertyAddress: '2200 Biscayne Blvd, Miami, FL',
    searchArea: 'Miami Brickell & Arts District',
    status: 'running',
    currentPhase: 'negotiation',
    phaseProgress: 65,
    startedAt: '2026-03-08T11:00:00Z',
    speedMode: 'realtime',
    logs: [
      {
        id: 'log-m-01',
        timestamp: '11:00:04',
        phase: 'scout',
        agentName: 'Argus',
        agentRole: 'Deed Forensics Scout',
        message: 'Scanned Miami-Dade County deeds. Identified off-market multifamily 42-unit complex at 2200 Biscayne Blvd. 2015 Deed: $226/sqft ($8.2M). Current AVM: $408/sqft ($14.8M). Liquidation catalyst: Principal retiring, partnership dissolution.',
        type: 'scout'
      },
      {
        id: 'log-m-02',
        timestamp: '11:06:18',
        phase: 'seller_call',
        agentName: 'Aria',
        agentRole: 'Voice Seller Closer',
        message: 'Unmasked Carlos Morales (Biscayne Capital Partners LLC). Placed autonomous voice call to +1 (305) 662-7719. Secured agreement for 2.5% representation upon title close.',
        type: 'voice'
      },
      {
        id: 'log-m-03',
        timestamp: '11:15:30',
        phase: 'buyer_match',
        agentName: 'Sterling',
        agentRole: 'Capital Matchmaker',
        message: 'Matched to Palisades Multifamily Partners (Fit score 96%). Delivered investment memo. Signed 2.0% finder fee mandate.',
        type: 'match'
      },
      {
        id: 'log-m-04',
        timestamp: '11:24:12',
        phase: 'negotiation',
        agentName: 'Solon',
        agentRole: 'Clearing Price Arbiter',
        message: 'Arbiter active. Negotiating round 2 between Carlos Morales ($13.8M reserve) and Palisades Equity ($13.2M opening offer). Harmonizing $13.5M equilibrium.',
        type: 'negotiate'
      }
    ],
    deedForensics: {
      scannedRegistry: 'Miami-Dade County Public Records (Official Records Bk 29811, Pg 1102)',
      deedYear: '2015',
      originalPriceSqFt: 226,
      currentAvmSqFt: 408,
      targetOfferPrice: 13500000,
      targetPriceSqFt: 373,
      appreciationPct: 64.6,
      liquidationTrigger: 'Managing Partner Retirement & Entity Dissolution',
      equityBuildUpUsd: 7920000,
      inPlaceNetNoi: 1040000,
      capRateEstimated: 7.7
    },
    sellerEngagement: {
      sellerName: 'Carlos Morales',
      unmaskedEntity: 'Biscayne Capital Partners LLC',
      verifiedCell: '+1 (305) 662-7719',
      verifiedEmail: 'cmorales@biscaynecap.com',
      callDurationSeconds: 194,
      callStatus: 'Completed - Mandate Secured',
      callTranscript: [
        { speaker: 'Agent Aria', text: 'Good morning Carlos. I am Aria with Acuity Capital Intelligence. I am contacting you regarding your 42-unit multifamily building at 2200 Biscayne.', time: '00:03', sentiment: 'neutral' },
        { speaker: 'Carlos Morales', text: 'Yes, we have been considering a quiet off-market sale this spring. What is your offer?', time: '00:15', sentiment: 'positive' },
        { speaker: 'Agent Aria', text: 'Our institutional capital network has Palisades Multifamily pre-approved for $20M with all-cash closing in 21 days. We estimate clearing at $13.5M ($373/sqft), locking over $5.3M in net gain since your 2015 purchase.', time: '00:32', sentiment: 'neutral' },
        { speaker: 'Carlos Morales', text: 'If they can close with zero financing contingencies at $13.5M, we accept your standard 2.5% representation agreement.', time: '01:02', sentiment: 'closed' }
      ],
      sellerCommissionAgreedPct: 2.5,
      representationAgreementRef: 'AGR-SELLER-MIA-60752',
      agreementSignedAt: '2026-03-08T11:08:44Z'
    },
    buyerMatchResult: {
      buyerId: 'buy-02',
      buyerName: 'Palisades Multifamily Partners',
      entityName: 'Palisades Equity Syndicate',
      buyerType: 'Value-Add Syndicator',
      contactName: 'Julian Vance, Acquisitions Director',
      contactPhone: '+1 (305) 910-4422',
      contactEmail: 'deals@palisadespartners.com',
      maxBudget: 18000000,
      fitScore: 96,
      memoDelivered: true,
      memoRef: 'MEMO-PALISADES-2200BISCAYNE',
      buyerFinderFeeAgreedPct: 2.0
    },
    negotiationArbitration: {
      clearingPrice: 13500000,
      sellerDiscountPct: 8.8,
      buyerEquityBufferUsd: 1300000,
      roundsNegotiated: 2,
      optimalStructure: 'Hybrid 1031 Exchange Equity Roll',
      loiSignedBilateral: false,
      loiRef: 'LOI-MIA-13500-PENDING',
      loiSignedAt: '',
      roundsSummary: [
        { round: 1, sellerBid: 14200000, buyerOffer: 13000000, note: 'Initial spread $1.2M. Buyer factoring HVAC cap-ex reserves.' },
        { round: 2, sellerBid: 13650000, buyerOffer: 13400000, note: 'Converging toward $13.5M equilibrium.' }
      ]
    },
    dueDiligenceAudit: {
      titleSearchStatus: 'Clean Title Commitment Issued',
      delawareGoodStanding: true,
      taxLienSearch: 'No Municipal Liens Detected',
      environmentalPhase1: 'Clean Phase I Environmental ESA',
      estoppelCertificatesVerified: 38,
      totalTenantLeasesAudited: 42,
      auditPassed: true,
      auditRef: 'AUDIT-MIA-DILIGENCE-8841'
    },
    closingSettlement: {
      grossSalePrice: 13500000,
      sellerCommissionTake: 337500,
      buyerFinderFeeTake: 270000,
      totalPlatformTake: 607500,
      netSellerProceeds: 13162500,
      earnestDepositHeld: 405000,
      escrowWireRef: 'WIRE-FL-60752-MIAMI-TITLE',
      altaStatementRef: 'ALTA-STMT-2200BISCAYNE',
      settlementCompletedAt: '',
      fundsDistributed: false,
      qualifiedIntermediary1031Routing: 'Chicago Title 1031 Intermediary Service (Ref #1031-FL-4401)'
    }
  }
];

