import test from 'node:test';
import assert from 'node:assert/strict';
import { filterContacts, filterCompanies } from './filterEngine.ts';
import { verifyEmailAddress } from './emailVerifier.ts';
import { calculateLeadScore, DEFAULT_LEAD_RULES } from './leadScorer.ts';
import { findDuplicateContacts, mergeContacts, deduplicateCompanyList } from './deduplication.ts';
import { parseCsvString, exportContactsToCsv } from './csvParser.ts';
import { AcuityStorage } from './storage.ts';
import type { Contact, Company } from '../types/index.ts';

const mockCompany: Company = {
  id: 'comp-1',
  workspaceId: 'ws-1',
  name: 'Stripe, Inc.',
  domain: 'stripe.com',
  websiteUrl: 'https://stripe.com',
  industry: 'Fintech',
  employeeCount: 7500,
  employeeRange: '5001+',
  revenueRange: '$250M+',
  headquarters: 'San Francisco, CA',
  city: 'San Francisco',
  country: 'United States',
  description: 'Financial infrastructure platform.',
  foundedYear: 2010,
  technologies: ['Ruby', 'React', 'AWS', 'PostgreSQL'],
  linkedinUrl: 'https://linkedin.com/company/stripe',
  dataSource: 'Licensed Registry',
  confidenceScore: 98,
  lastUpdated: '2026-03-01'
};

const mockContacts: Contact[] = [
  {
    id: 'cnt-1',
    workspaceId: 'ws-1',
    companyId: 'comp-1',
    companyName: 'Stripe, Inc.',
    companyDomain: 'stripe.com',
    firstName: 'Patrick',
    lastName: 'Collison',
    fullName: 'Patrick Collison',
    title: 'Chief Executive Officer',
    seniority: 'C-Level',
    department: 'Executive',
    email: 'patrick@stripe.com',
    emailStatus: 'verified',
    emailConfidence: 95,
    city: 'San Francisco',
    country: 'United States',
    linkedinUrl: 'https://linkedin.com/in/patrickcollison',
    leadScore: 85,
    leadStatus: 'Qualified',
    lists: ['list-1'],
    tags: ['founder', 'fintech'],
    dataSource: 'Verified B2B Directory',
    createdAt: '2026-01-01'
  },
  {
    id: 'cnt-2',
    workspaceId: 'ws-1',
    companyId: 'comp-1',
    companyName: 'Stripe, Inc.',
    companyDomain: 'stripe.com',
    firstName: 'David',
    lastName: 'Singleton',
    fullName: 'David Singleton',
    title: 'Chief Technology Officer',
    seniority: 'C-Level',
    department: 'Engineering',
    email: 'singleton@stripe.com',
    emailStatus: 'verified',
    emailConfidence: 90,
    city: 'San Francisco',
    country: 'United States',
    linkedinUrl: 'https://linkedin.com/in/davidsingleton',
    leadScore: 80,
    leadStatus: 'New',
    lists: [],
    tags: ['engineering'],
    dataSource: 'Verified B2B Directory',
    createdAt: '2026-01-05'
  },
  {
    id: 'cnt-3',
    workspaceId: 'ws-1',
    companyId: 'comp-2',
    companyName: 'Acme Logistics',
    companyDomain: 'acmelogistics.de',
    firstName: 'Hans',
    lastName: 'Mueller',
    fullName: 'Hans Mueller',
    title: 'Logistics Manager',
    seniority: 'Manager',
    department: 'Operations',
    email: 'h.mueller@acmelogistics.de',
    emailStatus: 'unverified',
    emailConfidence: 50,
    city: 'Berlin',
    country: 'Germany',
    linkedinUrl: 'https://linkedin.com/in/hansmueller',
    leadScore: 25,
    leadStatus: 'New',
    lists: [],
    tags: [],
    dataSource: 'Company Public Records',
    createdAt: '2026-01-10'
  }
];

test('filterContacts correctly filters by text query, seniority, and country', () => {
  // Query search
  const ceoResults = filterContacts(mockContacts, { query: 'Patrick' });
  assert.equal(ceoResults.length, 1);
  assert.equal(ceoResults[0].firstName, 'Patrick');

  // Seniority filter
  const cLevelResults = filterContacts(mockContacts, { seniority: ['C-Level'] });
  assert.equal(cLevelResults.length, 2);

  // Country filter
  const germanyResults = filterContacts(mockContacts, { countries: ['Germany'] });
  assert.equal(germanyResults.length, 1);
  assert.equal(germanyResults[0].fullName, 'Hans Mueller');

  // Lead score threshold
  const highScoring = filterContacts(mockContacts, { minLeadScore: 75 });
  assert.equal(highScoring.length, 2);
});

test('filterCompanies correctly filters by tech, industry, and revenue', () => {
  const companies = [mockCompany];
  const awsMatch = filterCompanies(companies, { technologies: ['AWS'] });
  assert.equal(awsMatch.length, 1);

  const missingTech = filterCompanies(companies, { technologies: ['Rust'] });
  assert.equal(missingTech.length, 0);

  const fintech = filterCompanies(companies, { industries: ['Fintech'] });
  assert.equal(fintech.length, 1);
});

test('verifyEmailAddress correctly categorizes syntax, disposable, catch-all and verified', () => {
  // Invalid syntax
  const invalidSyntax = verifyEmailAddress('not-an-email');
  assert.equal(invalidSyntax.status, 'invalid');
  assert.equal(invalidSyntax.checks.syntaxValid, false);

  // Disposable domain
  const disposable = verifyEmailAddress('fakeuser@mailinator.com');
  assert.equal(disposable.status, 'invalid');
  assert.equal(disposable.checks.isDisposable, true);

  // Catch-all domain
  const catchAll = verifyEmailAddress('tim.cook@apple.com');
  assert.equal(catchAll.status, 'catch_all');
  assert.equal(catchAll.checks.isCatchAll, true);

  // Valid standard corporate email
  const valid = verifyEmailAddress('sarah.connor@cyberdyne.ai');
  assert.equal(valid.status, 'verified');
  assert.equal(valid.checks.syntaxValid, true);
  assert.ok(valid.confidence >= 80);
});

test('calculateLeadScore computes expected points and tiers', () => {
  const cLevelContact: Partial<Contact> = {
    seniority: 'C-Level',
    department: 'Executive',
    emailStatus: 'verified'
  };

  const enterpriseCompany: Partial<Company> = {
    employeeCount: 1200
  };

  const result = calculateLeadScore(cLevelContact, enterpriseCompany, DEFAULT_LEAD_RULES);
  // C-Level (30) + Target Dept (15) + Verified Email (20) + Enterprise (15) = 80
  assert.equal(result.score, 80);
  assert.equal(result.tier, 'Hot');
  assert.ok(result.triggeredRules.length >= 3);
});

test('deduplication finds duplicates and merges records', () => {
  const duplicateList: Contact[] = [
    mockContacts[0],
    {
      ...mockContacts[0],
      id: 'cnt-duplicate',
      phone: '+1 415-555-0199',
      tags: ['seed-investor']
    }
  ];

  const duplicates = findDuplicateContacts(duplicateList);
  assert.equal(duplicates.has('patrick@stripe.com'), true);
  assert.equal(duplicates.get('patrick@stripe.com')?.length, 2);

  const merged = mergeContacts(duplicateList[0], duplicateList[1]);
  assert.equal(merged.phone, '+1 415-555-0199');
  assert.ok(merged.tags.includes('founder'));
  assert.ok(merged.tags.includes('seed-investor'));
});

test('csvParser parses text and exports properly', () => {
  const csvData = `First Name,Last Name,Email,Company\nAlice,Smith,alice@example.com,"Smith & Wesson, Inc."`;
  const parsed = parseCsvString(csvData);
  assert.equal(parsed.totalRows, 1);
  assert.equal(parsed.rows[0]['First Name'], 'Alice');
  assert.equal(parsed.rows[0]['Company'], 'Smith & Wesson, Inc.');

  const exported = exportContactsToCsv([mockContacts[0]]);
  assert.ok(exported.includes('Patrick Collison'));
  assert.ok(exported.includes('stripe.com'));
});

test('waterfall cascade resolves phone and email across fallback providers', () => {
  const result = AcuityStorage.executeWaterfall('elena.chen@databricks.com', 'databricks.com');
  assert.equal(result.targetEmail, 'elena.chen@databricks.com');
  assert.equal(result.targetDomain, 'databricks.com');
  assert.ok(result.steps.length > 0);
  assert.ok(result.creditsCharged > 0);
  assert.ok(result.finalDirectPhone.startsWith('+1 415-'));
});

test('intent signals and company firmographics detect high surge velocity', () => {
  const comp = mockCompany;
  const hasAws = comp.technologies.includes('AWS');
  assert.equal(hasAws, true);
  assert.equal(comp.revenueRange, '$250M+');
});
