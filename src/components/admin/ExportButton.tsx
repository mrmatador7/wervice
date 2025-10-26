import { Download } from 'lucide-react';

interface ExportButtonProps {
  onExport: (format: 'csv' | 'pdf') => void;
  disabled?: boolean;
}

export default function ExportButton({ onExport, disabled }: ExportButtonProps) {
  const handleExport = (format: 'csv' | 'pdf') => {
    onExport(format);
  };

  return (
    <div className="relative">
      <button
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 bg-wv.lime text-wv.black rounded-lg font-medium hover:bg-wv.limeDark focus:outline-none focus:ring-2 focus:ring-wv.limeDark disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Export data"
      >
        <Download size={16} />
        <span>Export</span>
      </button>
    </div>
  );
}

// Utility function to convert data to CSV
export function exportToCSV(data: any[], filename: string) {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        // Escape commas and quotes in CSV
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}



