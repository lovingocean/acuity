import type { Contact, Company, LeadScoreRule } from '../types/index';

export const DEFAULT_LEAD_RULES: LeadScoreRule[] = [
  { id: 'rule-1', name: 'C-Level Seniority', field: 'seniority', operator: 'equals', value: 'C-Level', points: 30, isActive: true },
  { id: 'rule-2', name: 'VP Seniority', field: 'seniority', operator: 'equals', value: 'VP', points: 20, isActive: true },
  { id: 'rule-3', name: 'Director Seniority', field: 'seniority', operator: 'equals', value: 'Director', points: 15, isActive: true },
  { id: 'rule-4', name: 'Target Department (Engineering/Sales/Exec)', field: 'department', operator: 'contains', value: 'Executive|Engineering|Sales', points: 15, isActive: true },
  { id: 'rule-5', name: 'Verified Business Email', field: 'emailStatus', operator: 'equals', value: 'verified', points: 20, isActive: true },
  { id: 'rule-6', name: 'Enterprise Headcount (>500)', field: 'employeeCount', operator: 'greater_than', value: 500, points: 15, isActive: true },
];

export function calculateLeadScore(
  contact: Partial<Contact>,
  company?: Partial<Company>,
  rules: LeadScoreRule[] = DEFAULT_LEAD_RULES
): { score: number; tier: 'Hot' | 'Warm' | 'Cold'; triggeredRules: string[] } {
  let totalScore = 0;
  const triggeredRules: string[] = [];

  for (const rule of rules) {
    if (!rule.isActive) continue;

    let matched = false;

    if (rule.field === 'seniority' && contact.seniority) {
      if (rule.operator === 'equals' && contact.seniority === rule.value) {
        matched = true;
      }
    } else if (rule.field === 'department' && contact.department) {
      if (rule.operator === 'contains') {
        const allowed = String(rule.value).split('|');
        if (allowed.includes(contact.department)) {
          matched = true;
        }
      } else if (rule.operator === 'equals' && contact.department === rule.value) {
        matched = true;
      }
    } else if (rule.field === 'emailStatus' && contact.emailStatus) {
      if (rule.operator === 'equals' && contact.emailStatus === rule.value) {
        matched = true;
      }
    } else if (rule.field === 'employeeCount' && company && typeof company.employeeCount === 'number') {
      if (rule.operator === 'greater_than' && company.employeeCount > Number(rule.value)) {
        matched = true;
      }
    }

    if (matched) {
      totalScore += rule.points;
      triggeredRules.push(rule.name);
    }
  }

  // Base clamp between 0 and 100
  const score = Math.max(0, Math.min(100, totalScore));

  let tier: 'Hot' | 'Warm' | 'Cold' = 'Cold';
  if (score >= 70) {
    tier = 'Hot';
  } else if (score >= 40) {
    tier = 'Warm';
  }

  return { score, tier, triggeredRules };
}
