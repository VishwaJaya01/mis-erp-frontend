/**
 * Export Utilities
 * Provides functions to export data to CSV and Excel formats
 */

/**
 * Convert array of objects to CSV format
 */
export function convertToCSV<T extends Record<string, any>>(
  data: T[],
  headers?: { key: keyof T; label: string }[]
): string {
  if (data.length === 0) return '';

  // Use provided headers or infer from first object
  const cols = headers || Object.keys(data[0]).map(key => ({ key, label: key }));
  
  // Create header row
  const headerRow = cols.map(h => `"${h.label}"`).join(',');
  
  // Create data rows
  const dataRows = data.map(row => {
    return cols.map(col => {
      const value = row[col.key];
      // Handle null/undefined
      if (value == null) return '""';
      // Escape quotes and wrap in quotes
      const stringValue = String(value).replace(/"/g, '""');
      return `"${stringValue}"`;
    }).join(',');
  });
  
  return [headerRow, ...dataRows].join('\n');
}

/**
 * Download data as CSV file
 */
export function downloadCSV(
  data: any[],
  filename: string,
  headers?: { key: string; label: string }[]
): void {
  try {
    const csv = convertToCSV(data, headers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading CSV:', error);
    throw new Error('Failed to download CSV file');
  }
}

/**
 * Download data as Excel file (using CSV with Excel-friendly format)
 * For true Excel format (.xlsx), consider using a library like 'xlsx'
 */
export function downloadExcel(
  data: any[],
  filename: string,
  headers?: { key: string; label: string }[]
): void {
  try {
    const csv = convertToCSV(data, headers);
    // Add BOM for Excel UTF-8 recognition
    const bom = '\ufeff';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading Excel:', error);
    throw new Error('Failed to download Excel file');
  }
}

/**
 * Export filtered/searched data with custom headers
 */
export function exportTableData<T extends Record<string, any>>(
  data: T[],
  filename: string,
  format: 'csv' | 'excel',
  columnConfig: { key: keyof T; label: string }[]
): void {
  if (data.length === 0) {
    throw new Error('No data to export');
  }

  // Map data to only include specified columns
  const exportData = data.map(row => {
    const exportRow: Record<string, any> = {};
    columnConfig.forEach(col => {
      exportRow[col.key as string] = row[col.key];
    });
    return exportRow;
  });

  // Convert columnConfig to the expected format
  const headers = columnConfig.map(col => ({
    key: col.key as string,
    label: col.label
  }));

  if (format === 'csv') {
    downloadCSV(exportData, filename, headers);
  } else {
    downloadExcel(exportData, filename, headers);
  }
}
