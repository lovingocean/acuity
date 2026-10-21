import type { Contact, Company, FilterState } from '../types/index';

export function filterContacts(contacts: Contact[], filters: FilterState): Contact[] {
  return contacts.filter(contact => {
    // 1. Text Query (name, title, company, email, city)
    if (filters.query && filters.query.trim() !== '') {
      const q = filters.query.toLowerCase().trim();
      const match =
        contact.fullName.toLowerCase().includes(q) ||
        contact.title.toLowerCase().includes(q) ||
        contact.companyName.toLowerCase().includes(q) ||
        contact.companyDomain.toLowerCase().includes(q) ||
        contact.email.toLowerCase().includes(q) ||
        contact.city.toLowerCase().includes(q) ||
        contact.country.toLowerCase().includes(q);
      if (!match) return false;
    }

    // 2. Seniority filter (OR within list)
    if (filters.seniority && filters.seniority.length > 0) {
      if (!filters.seniority.includes(contact.seniority)) {
        return false;
      }
    }

    // 3. Department filter (OR within list)
    if (filters.departments && filters.departments.length > 0) {
      if (!filters.departments.includes(contact.department)) {
        return false;
      }
    }

    // 4. Email Status filter
    if (filters.emailStatuses && filters.emailStatuses.length > 0) {
      if (!filters.emailStatuses.includes(contact.emailStatus)) {
        return false;
      }
    }

    // 5. Country filter
    if (filters.countries && filters.countries.length > 0) {
      if (!filters.countries.includes(contact.country)) {
        return false;
      }
    }

    // 6. Lead Score threshold
    if (typeof filters.minLeadScore === 'number' && filters.minLeadScore > 0) {
      if (contact.leadScore < filters.minLeadScore) {
        return false;
      }
    }

    return true;
  });
}

export function filterCompanies(companies: Company[], filters: FilterState): Company[] {
  return companies.filter(company => {
    // 1. Text Query (name, domain, industry, city, tech)
    if (filters.query && filters.query.trim() !== '') {
      const q = filters.query.toLowerCase().trim();
      const match =
        company.name.toLowerCase().includes(q) ||
        company.domain.toLowerCase().includes(q) ||
        company.industry.toLowerCase().includes(q) ||
        company.city.toLowerCase().includes(q) ||
        company.country.toLowerCase().includes(q) ||
        company.technologies.some(tech => tech.toLowerCase().includes(q));
      if (!match) return false;
    }

    // 2. Industry filter
    if (filters.industries && filters.industries.length > 0) {
      if (!filters.industries.includes(company.industry)) {
        return false;
      }
    }

    // 3. Employee Range filter
    if (filters.employeeRanges && filters.employeeRanges.length > 0) {
      if (!filters.employeeRanges.includes(company.employeeRange)) {
        return false;
      }
    }

    // 4. Country filter
    if (filters.countries && filters.countries.length > 0) {
      if (!filters.countries.includes(company.country)) {
        return false;
      }
    }

    // 5. Technologies filter
    if (filters.technologies && filters.technologies.length > 0) {
      const hasTech = filters.technologies.some(t =>
        company.technologies.some(ct => ct.toLowerCase() === t.toLowerCase())
      );
      if (!hasTech) return false;
    }

    // 6. Revenue Range filter
    if (filters.revenueRanges && filters.revenueRanges.length > 0) {
      if (!filters.revenueRanges.includes(company.revenueRange)) {
        return false;
      }
    }

    return true;
  });
}
