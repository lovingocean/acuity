import type { Contact, Company } from '../types/index';

export function findDuplicateContacts(contacts: Contact[]): Map<string, Contact[]> {
  const emailMap = new Map<string, Contact[]>();
  
  for (const contact of contacts) {
    const key = contact.email.toLowerCase().trim();
    if (!key) continue;
    const existing = emailMap.get(key) || [];
    existing.push(contact);
    emailMap.set(key, existing);
  }

  const duplicatesOnly = new Map<string, Contact[]>();
  for (const [key, list] of emailMap.entries()) {
    if (list.length > 1) {
      duplicatesOnly.set(key, list);
    }
  }

  return duplicatesOnly;
}

export function mergeContacts(primary: Contact, duplicate: Contact): Contact {
  const mergedTags = Array.from(new Set([...(primary.tags || []), ...(duplicate.tags || [])]));
  const mergedLists = Array.from(new Set([...(primary.lists || []), ...(duplicate.lists || [])]));
  
  return {
    ...primary,
    phone: primary.phone || duplicate.phone,
    linkedinUrl: primary.linkedinUrl || duplicate.linkedinUrl,
    notes: primary.notes 
      ? (duplicate.notes ? `${primary.notes}\n[Merged Note]: ${duplicate.notes}` : primary.notes)
      : duplicate.notes,
    tags: mergedTags,
    lists: mergedLists,
    leadScore: Math.max(primary.leadScore, duplicate.leadScore),
  };
}

export function deduplicateCompanyList(companies: Company[]): Company[] {
  const domainMap = new Map<string, Company>();

  for (const comp of companies) {
    const domainKey = comp.domain.toLowerCase().trim();
    if (!domainMap.has(domainKey)) {
      domainMap.set(domainKey, comp);
    } else {
      // Merge technologies
      const existing = domainMap.get(domainKey)!;
      const combinedTech = Array.from(new Set([...existing.technologies, ...comp.technologies]));
      domainMap.set(domainKey, {
        ...existing,
        technologies: combinedTech,
        confidenceScore: Math.max(existing.confidenceScore, comp.confidenceScore)
      });
    }
  }

  return Array.from(domainMap.values());
}
