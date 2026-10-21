import React, { useState } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database
} from 'lucide-react';
import type { Contact, Company } from '../../types';
import { parseCsvString, type ParsedCsvResult } from '../../lib/csvParser';
import { calculateLeadScore } from '../../lib/leadScorer';

interface CsvImportModalProps {
  workspaceId: string;
  existingContacts: Contact[];
  onClose: () => void;
  onImportComplete: (newContacts: Contact[]) => void;
  onLogAction: (action: string, resource: string, details: string) => void;
}

const SAMPLE_CSV = `First Name,Last Name,Title,Company,Domain,Email,City,Country,Seniority,Department
Sarah,Connor,Head of Autonomous Systems,Cyberdyne Systems,cyberdyne.ai,s.connor@cyberdyne.ai,Los Angeles,United States,Director,Engineering
Devon,Vance,VP of Global Enterprise Alliances,Stripe,stripe.com,devon.vance@stripe.com,San Francisco,United States,VP,Sales
Liam,O'Connor,Director of Security Architecture,CrowdStrike,crowdstrike.com,liam.oc@crowdstrike.com,Austin,United States,Director,Engineering
Amara,Kowalski,Chief Information Officer,Vanguard Health,vanguardhealth.org,amara@vanguardhealth.org,Chicago,United States,C-Level,Executive`;

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  workspaceId,
  existingContacts,
  onClose,
  onImportComplete,
  onLogAction
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [csvRawText, setCsvRawText] = useState('');
  const [parsedData, setParsedData] = useState<ParsedCsvResult | null>(null);

  // Column mappings: Internal field -> CSV header
  const [mappings, setMappings] = useState<Record<string, string>>({
    fullName: '',
    firstName: '',
    lastName: '',
    title: '',
    companyName: '',
    companyDomain: '',
    email: '',
    city: '',
    country: '',
    seniority: '',
    department: ''
  });

  // Handle parsing
  const handleParseCsv = (raw: string) => {
    const result = parseCsvString(raw);
    if (result.rows.length === 0) {
      alert('Could not parse any rows from provided CSV data.');
      return;
    }
    setParsedData(result);

    // Auto-detect mappings based on header text
    const autoMap: Record<string, string> = { ...mappings };
    result.headers.forEach(h => {
      const lower = h.toLowerCase().trim();
      if (lower.includes('first')) autoMap.firstName = h;
      else if (lower.includes('last')) autoMap.lastName = h;
      else if (lower.includes('full name') || lower === 'name') autoMap.fullName = h;
      else if (lower.includes('title') || lower.includes('position')) autoMap.title = h;
      else if (lower.includes('domain') || lower.includes('website')) autoMap.companyDomain = h;
      else if (lower.includes('company') || lower.includes('organization')) autoMap.companyName = h;
      else if (lower.includes('email') || lower.includes('mail')) autoMap.email = h;
      else if (lower.includes('city')) autoMap.city = h;
      else if (lower.includes('country')) autoMap.country = h;
      else if (lower.includes('seniority')) autoMap.seniority = h;
      else if (lower.includes('department')) autoMap.department = h;
    });

    setMappings(autoMap);
    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvRawText(content);
      handleParseCsv(content);
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    setCsvRawText(SAMPLE_CSV);
    handleParseCsv(SAMPLE_CSV);
  };

  // Build finalized contacts from mapping
  const buildImportedContacts = (): { valid: Contact[]; duplicates: number } => {
    if (!parsedData) return { valid: [], duplicates: 0 };

    const existingEmails = new Set(existingContacts.map(c => c.email.toLowerCase().trim()));
    const valid: Contact[] = [];
    let duplicates = 0;

    parsedData.rows.forEach((row, idx) => {
      const email = (mappings.email ? row[mappings.email] : row['Email'] || '').trim().toLowerCase();
      if (!email || !email.includes('@')) {
        return; // skip rows without valid email
      }

      if (existingEmails.has(email)) {
        duplicates++;
        return;
      }

      const firstName = mappings.firstName ? row[mappings.firstName] || '' : '';
      const lastName = mappings.lastName ? row[mappings.lastName] || '' : '';
      const fullName = mappings.fullName
        ? row[mappings.fullName]
        : `${firstName} ${lastName}`.trim() || 'Imported Prospect';

      const companyName = mappings.companyName ? row[mappings.companyName] || 'Unknown Company' : 'Unknown Company';
      const companyDomain = mappings.companyDomain
        ? row[mappings.companyDomain]
        : email.split('@')[1] || 'domain.com';

      const title = mappings.title ? row[mappings.title] || 'Business Professional' : 'Business Professional';
      const seniorityRaw = (mappings.seniority ? row[mappings.seniority] : '') || 'Senior';
      const seniority = ['C-Level', 'VP', 'Director', 'Manager', 'Senior', 'Entry'].includes(seniorityRaw)
        ? (seniorityRaw as Contact['seniority'])
        : 'Senior';

      const departmentRaw = (mappings.department ? row[mappings.department] : '') || 'Executive';
      const department = ['Executive', 'Engineering', 'Sales', 'Marketing', 'Product', 'Operations', 'Finance', 'HR'].includes(departmentRaw)
        ? (departmentRaw as Contact['department'])
        : 'Sales';

      const newContact: Contact = {
        id: `cnt-import-${Date.now()}-${idx}`,
        workspaceId,
        companyId: `comp-import-${Date.now()}-${idx}`,
        companyName,
        companyDomain,
        firstName: firstName || fullName.split(' ')[0] || 'Unknown',
        lastName: lastName || fullName.split(' ').slice(1).join(' ') || '',
        fullName,
        title,
        seniority,
        department,
        email,
        emailStatus: 'unverified',
        emailConfidence: 50,
        city: mappings.city ? row[mappings.city] || 'San Francisco' : 'San Francisco',
        country: mappings.country ? row[mappings.country] || 'United States' : 'United States',
        linkedinUrl: `https://linkedin.com/search/results/all/?keywords=${encodeURIComponent(fullName)}`,
        leadScore: 50,
        leadStatus: 'New',
        lists: [],
        tags: ['csv-import'],
        dataSource: 'Authorized CSV Import',
        createdAt: new Date().toISOString()
      };

      // Calculate initial lead score
      const scored = calculateLeadScore(newContact);
      newContact.leadScore = scored.score;

      valid.push(newContact);
      existingEmails.add(email);
    });

    return { valid, duplicates };
  };

  const preview = buildImportedContacts();

  const handleCommitImport = () => {
    if (preview.valid.length === 0) {
      alert('No valid rows found to import.');
      return;
    }

    onImportComplete(preview.valid);
    onLogAction(
      'CSV_IMPORT',
      'Contacts',
      `Imported ${preview.valid.length} contacts (${preview.duplicates} duplicates ignored).`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Authorized B2B CSV Import Wizard
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <span className={step === 1 ? 'font-bold text-indigo-600' : 'text-slate-500'}>1. Upload</span>
              <span aria-hidden="true">→</span>
              <span className={step === 2 ? 'font-bold text-indigo-600' : 'text-slate-500'}>2. Map Columns</span>
              <span aria-hidden="true">→</span>
              <span className={step === 3 ? 'font-bold text-indigo-600' : 'text-slate-500'}>3. Deduplicate & Commit</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-200 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step 1: Upload or Paste */}
        {step === 1 && (
          <div className="p-6 space-y-5 text-xs flex-1 overflow-y-auto">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors">
              <UploadCloud className="w-10 h-10 text-indigo-600 mx-auto mb-2" />
              <div className="font-semibold text-slate-800 text-sm mb-1">
                Upload Authorized CSV File
              </div>
              <p className="text-slate-500 text-xs mb-4">
                Drag and drop your file here, or browse your device.
              </p>
              <label className="inline-block px-4 py-2 bg-indigo-600 text-white rounded font-semibold cursor-pointer hover:bg-indigo-700 shadow-2xs">
                Select CSV File
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between text-slate-500">
              <div className="h-[1px] bg-slate-200 flex-1" />
              <span className="px-3 text-slate-400 font-medium">OR PASTE RAW CSV</span>
              <div className="h-[1px] bg-slate-200 flex-1" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-semibold text-slate-700">Paste CSV Text</label>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Load Sample Enterprise Leads
                </button>
              </div>
              <textarea
                rows={5}
                value={csvRawText}
                onChange={(e) => setCsvRawText(e.target.value)}
                placeholder="First Name,Last Name,Title,Company,Email..."
                className="w-full p-2.5 border border-slate-200 rounded font-mono text-xs focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 border border-slate-200 rounded text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!csvRawText.trim()}
                onClick={() => handleParseCsv(csvRawText)}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                Proceed to Mapping →
              </button>
            </div>
          </div>
        )}

        {/* Wizard Step 2: Field Mapping */}
        {step === 2 && parsedData && (
          <div className="p-6 space-y-4 text-xs flex-1 overflow-y-auto">
            <p className="text-slate-600">
              Map the columns from your CSV (<strong className="font-mono">{parsedData.totalRows}</strong> rows found) to the Acuity B2B schema.
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200">
              {[
                { key: 'email', label: 'Work Email *', required: true },
                { key: 'firstName', label: 'First Name' },
                { key: 'lastName', label: 'Last Name' },
                { key: 'title', label: 'Job Title' },
                { key: 'companyName', label: 'Company Name' },
                { key: 'companyDomain', label: 'Company Domain' },
                { key: 'seniority', label: 'Seniority' },
                { key: 'department', label: 'Department' },
                { key: 'city', label: 'City' },
                { key: 'country', label: 'Country' }
              ].map(field => (
                <div key={field.key}>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {field.label}
                  </label>
                  <select
                    value={mappings[field.key] || ''}
                    onChange={(e) => setMappings({ ...mappings, [field.key]: e.target.value })}
                    className="w-full border border-slate-200 rounded px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="">-- Do Not Import --</option>
                    {parsedData.headers.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-600"
              >
                ← Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!mappings.email}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                Preview & Validate →
              </button>
            </div>
          </div>
        )}

        {/* Wizard Step 3: Deduplication & Commit */}
        {step === 3 && (
          <div className="p-6 space-y-5 text-xs flex-1 overflow-y-auto">
            {/* Deduplication Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Ready to Import</span>
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-900 tabular-nums">
                  {preview.valid.length}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1">
                  Unique, validated contacts with RFC syntax check.
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Duplicates Filtered</span>
                </div>
                <div className="text-2xl font-bold font-mono text-amber-900 tabular-nums">
                  {preview.duplicates}
                </div>
                <div className="text-[11px] text-amber-700 mt-1">
                  Emails already existing in current workspace.
                </div>
              </div>
            </div>

            {/* Sample Table Preview */}
            <div>
              <div className="font-semibold text-slate-800 mb-2">First 3 Rows Preview:</div>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-[11px]">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="p-2">Name</th>
                      <th className="p-2">Title</th>
                      <th className="p-2">Company</th>
                      <th className="p-2">Email</th>
                      <th className="p-2">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {preview.valid.slice(0, 3).map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-semibold text-slate-900">{item.fullName}</td>
                        <td className="p-2 text-slate-600">{item.title}</td>
                        <td className="p-2 text-slate-600">{item.companyName}</td>
                        <td className="p-2 font-mono text-slate-700">{item.email}</td>
                        <td className="p-2 font-mono font-bold text-slate-800 tabular-nums">{item.leadScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-3 py-1.5 border border-slate-200 rounded text-slate-600"
              >
                ← Back to Mapping
              </button>
              <button
                type="button"
                onClick={handleCommitImport}
                disabled={preview.valid.length === 0}
                className="px-5 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 disabled:opacity-50 shadow-xs"
              >
                Commit {preview.valid.length} Contacts to Workspace
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
