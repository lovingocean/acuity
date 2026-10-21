import type { Contact, Company } from '../types/index';

export interface ParsedCsvResult {
  headers: string[];
  rows: Record<string, string>[];
  totalRows: number;
}

export function parseCsvString(csvText: string): ParsedCsvResult {
  const lines = csvText
    .split(/\r\n|\n|\r/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    return { headers: [], rows: [], totalRows: 0 };
  }

  // Parse header line respecting quotes
  const headers = parseCsvLine(lines[0]);
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvLine(lines[i]);
    if (values.length === 0) continue;
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = values[idx] || '';
    });
    rows.push(rowObj);
  }

  return {
    headers,
    rows,
    totalRows: rows.length
  };
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function exportContactsToCsv(contacts: Contact[]): string {
  const headers = [
    'Full Name',
    'First Name',
    'Last Name',
    'Job Title',
    'Seniority',
    'Department',
    'Company Name',
    'Company Domain',
    'Work Email',
    'Email Status',
    'Email Confidence',
    'Phone',
    'City',
    'Country',
    'LinkedIn URL',
    'Lead Score',
    'Lead Status',
    'Data Source'
  ];

  const rows = contacts.map(c => [
    escapeCsvValue(c.fullName),
    escapeCsvValue(c.firstName),
    escapeCsvValue(c.lastName),
    escapeCsvValue(c.title),
    escapeCsvValue(c.seniority),
    escapeCsvValue(c.department),
    escapeCsvValue(c.companyName),
    escapeCsvValue(c.companyDomain),
    escapeCsvValue(c.email),
    escapeCsvValue(c.emailStatus),
    c.emailConfidence.toString(),
    escapeCsvValue(c.phone || ''),
    escapeCsvValue(c.city),
    escapeCsvValue(c.country),
    escapeCsvValue(c.linkedinUrl),
    c.leadScore.toString(),
    escapeCsvValue(c.leadStatus),
    escapeCsvValue(c.dataSource)
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export function exportCompaniesToCsv(companies: Company[]): string {
  const headers = [
    'Company Name',
    'Domain',
    'Industry',
    'Employee Range',
    'Employee Count',
    'Revenue Range',
    'Headquarters',
    'City',
    'Country',
    'Founded Year',
    'Technologies',
    'Confidence Score',
    'Data Source'
  ];

  const rows = companies.map(c => [
    escapeCsvValue(c.name),
    escapeCsvValue(c.domain),
    escapeCsvValue(c.industry),
    escapeCsvValue(c.employeeRange),
    c.employeeCount.toString(),
    escapeCsvValue(c.revenueRange),
    escapeCsvValue(c.headquarters),
    escapeCsvValue(c.city),
    escapeCsvValue(c.country),
    c.foundedYear.toString(),
    escapeCsvValue(c.technologies.join('; ')),
    c.confidenceScore.toString(),
    escapeCsvValue(c.dataSource)
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

function escapeCsvValue(val: string): string {
  if (val.includes(',') || val.includes('"') || val.includes('\n')) {
    return `"${val.replace(/"/g, '""')}"`;
  }
  return val;
}
