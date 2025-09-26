'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import {
  Upload,
  FileSpreadsheet,
  RefreshCw,
  BarChart3,
  Search,
  Table,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import QANurseNavbar from '@/app/components/qa-nurse-dashboard/QANurseNavbar';

export default function AxcessIntegrationPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tableData, setTableData] = useState<any[]>([]);
  const [tableHeaders, setTableHeaders] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('patient');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [groupBy, setGroupBy] = useState('patient');
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [inputMode, setInputMode] = useState<'excel' | 'form'>('excel');
  const [formData, setFormData] = useState({
    patientName: '',
    mrn: '',
    date: '',
    task: '',
    status: '',
    tags: '',
    assignedTo: ''
  });
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [editData, setEditData] = useState({
    patientName: '',
    mrn: '',
    date: '',
    task: '',
    status: '',
    tags: '',
    assignedTo: ''
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [taskPdfLinks, setTaskPdfLinks] = useState<{ [key: number]: string }>({});

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel' // .xls
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('Please upload only Excel files (.xlsx or .xls)');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Parse Excel file
      const parsedData = await parseExcelFile(file);
      
      // Update progress
      setUploadProgress(50);
      
      // Set table data (skip first row which contains headers) and add source indicator
      setTableHeaders(parsedData.headers);
      const excelData = parsedData.rows.slice(1).map((row: any[]) => [...row, 'Excel']);
      setTableData(excelData);
      
      setUploadProgress(100);
      setIsUploading(false);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error parsing Excel file:', error);
      alert('Error parsing Excel file. Please ensure the file is valid.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type.includes('spreadsheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      const mockEvent = {
        target: { files: [file] }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(mockEvent);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };


  const parseExcelFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          
          // Get the first worksheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Get headers (first row)
          const headers = jsonData[0] as string[];
          const rows = jsonData.slice(1) as any[][];
          
          // Create structured data
          const structuredData = {
            sheetName: firstSheetName,
            headers: headers,
            rows: rows,
            totalRows: rows.length,
            totalColumns: headers.length,
            rawData: jsonData
          };
          
          resolve(structuredData);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };




  // Sort data based on selected criteria
  const getSortedData = (data: any[]) => {
    return [...data].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'patient':
          aValue = a[1] || '';
          bValue = b[1] || '';
          break;
        case 'date':
          aValue = a[3] || '';
          bValue = b[3] || '';
          // Handle Excel serial dates for sorting
          if (/^\d+$/.test(String(aValue)) && parseInt(String(aValue)) > 25569) {
            aValue = new Date(1900, 0, 1).getTime() + (parseInt(String(aValue)) - 2) * 24 * 60 * 60 * 1000;
          } else {
            aValue = new Date(aValue).getTime();
          }
          if (/^\d+$/.test(String(bValue)) && parseInt(String(bValue)) > 25569) {
            bValue = new Date(1900, 0, 1).getTime() + (parseInt(String(bValue)) - 2) * 24 * 60 * 60 * 1000;
          } else {
            bValue = new Date(bValue).getTime();
          }
          break;
        case 'task':
          aValue = a[4] || '';
          bValue = b[4] || '';
          break;
        case 'clinician':
          aValue = a[7] || '';
          bValue = b[7] || '';
          break;
        default:
          aValue = a[1] || '';
          bValue = b[1] || '';
      }
      
      // Convert to strings for comparison
      aValue = String(aValue).toLowerCase();
      bValue = String(bValue).toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const filteredData = tableData.filter((row, index) => {
    // Filter out empty rows or rows with only dashes
    const hasValidData = row.some((cell: any) => 
      cell && cell.toString().trim() !== '' && cell.toString().trim() !== '-'
    );
    
    // Filter out summary rows (like "Total Number Of QA Schedule Tasks")
    const isSummaryRow = row.some((cell: any) => 
      cell && cell.toString().toLowerCase().includes('total number') ||
      cell && cell.toString().toLowerCase().includes('total of') ||
      cell && cell.toString().toLowerCase().includes('schedule tasks')
    );
    
    // Filter out rows that are all dashes
    const isAllDashes = row.every((cell: any) => 
      !cell || cell.toString().trim() === '' || cell.toString().trim() === '-'
    );
    
    if (!hasValidData || isSummaryRow || isAllDashes) {
      return false;
    }
    
    // Apply search filter if search term exists
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase().trim();
      return row.some((cell: any) => {
        if (!cell) return false;
        const cellValue = cell.toString().toLowerCase();
        
        // Handle date search - convert Excel serial dates for search
        if (/^\d+$/.test(cellValue) && parseInt(cellValue) > 25569) {
          // Excel serial date: days since 1900-01-01
          const excelEpoch = new Date(1900, 0, 1);
          const jsDate = new Date(excelEpoch.getTime() + (parseInt(cellValue) - 2) * 24 * 60 * 60 * 1000);
          
          if (!isNaN(jsDate.getTime())) {
            const formattedDate = jsDate.toLocaleDateString('en-US', {
              month: '2-digit',
              day: '2-digit',
              year: 'numeric'
            });
            return formattedDate.includes(searchLower);
          }
        }
        
        // Regular text search
        return cellValue.includes(searchLower);
      });
    }
    
    return true;
  });

  // Sort data
  const sortedData = getSortedData(filteredData);

  // Reset search term
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Handle form input changes
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleFormSubmit = () => {
    if (!formData.patientName || !formData.mrn || !formData.date || !formData.task) {
      alert('Please fill in all required fields (Patient Name, MRN, Date, Task)');
      return;
    }

    const newRow = [
      '', // Branch (empty for form data)
      formData.patientName,
      formData.mrn,
      formData.date,
      formData.task,
      formData.status || 'Pending',
      formData.tags,
      formData.assignedTo,
      'Form' // Source indicator
    ];

    setTableData(prev => [...prev, newRow]);
    
    // Clear form
    setFormData({
      patientName: '',
      mrn: '',
      date: '',
      task: '',
      status: '',
      tags: '',
      assignedTo: ''
    });

    alert('Record added successfully!');
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      patientName: '',
      mrn: '',
      date: '',
      task: '',
      status: '',
      tags: '',
      assignedTo: ''
    });
  };

  // Start editing a row
  const startEdit = (rowIndex: number, row: any[]) => {
    setEditingRow(rowIndex);
    setEditData({
      patientName: row[1] || '',
      mrn: row[2] || '',
      date: row[3] || '',
      task: row[4] || '',
      status: row[5] || '',
      tags: row[6] || '',
      assignedTo: row[7] || ''
    });
    setUploadedFile(null); // Reset uploaded file when starting edit
    setShowEditModal(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingRow(null);
    setShowEditModal(false);
    setUploadedFile(null);
    setEditData({
      patientName: '',
      mrn: '',
      date: '',
      task: '',
      status: '',
      tags: '',
      assignedTo: ''
    });
  };

  // Save edited row
  const saveEdit = () => {
    if (!editingRow) return;

    // Check if any field has been modified
    const originalRow = tableData[editingRow];
    const hasChanges = 
      editData.patientName !== (originalRow[1] || '') ||
      editData.mrn !== (originalRow[2] || '') ||
      editData.date !== (originalRow[3] || '') ||
      editData.task !== (originalRow[4] || '') ||
      editData.status !== (originalRow[5] || '') ||
      editData.tags !== (originalRow[6] || '') ||
      editData.assignedTo !== (originalRow[7] || '') ||
      uploadedFile !== null;

    if (!hasChanges) {
      alert('No changes detected. Please make some changes before saving.');
      return;
    }

    const updatedData = [...tableData];
    updatedData[editingRow] = [
      updatedData[editingRow][0], // Keep original branch
      editData.patientName || originalRow[1] || '', // Use original value if empty
      editData.mrn || originalRow[2] || '',
      editData.date || originalRow[3] || '',
      editData.task || originalRow[4] || '',
      editData.status || originalRow[5] || '',
      editData.tags || originalRow[6] || '',
      editData.assignedTo || originalRow[7] || '',
      updatedData[editingRow][8] // Keep original source
    ];

    // If there's an uploaded file, create a link and store it
    if (uploadedFile) {
      const pdfUrl = URL.createObjectURL(uploadedFile);
      setTaskPdfLinks(prev => ({
        ...prev,
        [editingRow]: pdfUrl
      }));
    }

    setTableData(updatedData);
    setEditingRow(null);
    setShowEditModal(false);
    setUploadedFile(null);
    setEditData({
      patientName: '',
      mrn: '',
      date: '',
      task: '',
      status: '',
      tags: '',
      assignedTo: ''
    });

    // Show success message
    alert('Record updated successfully!');
  };

  // Delete a row
  const deleteRow = (rowIndex: number) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      const updatedData = tableData.filter((_, index) => index !== rowIndex);
      setTableData(updatedData);
      
      // Clean up PDF link if it exists
      if (taskPdfLinks[rowIndex]) {
        URL.revokeObjectURL(taskPdfLinks[rowIndex]);
        setTaskPdfLinks(prev => {
          const newLinks = { ...prev };
          delete newLinks[rowIndex];
          return newLinks;
        });
      }
    }
  };

  // Handle edit form changes
  const handleEditChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle PDF file upload in modal
  const handleModalFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      alert('Please upload only PDF files');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploadedFile(file);
  };

  // Remove uploaded file
  const removeUploadedFile = () => {
    setUploadedFile(null);
  };


  // Format date for display
  const formatDateForDisplay = (dateValue: any) => {
    if (!dateValue || String(dateValue).trim() === '') return 'No Date';
    
    const dateString = String(dateValue);
    
    // Handle Excel serial date (like 45915)
    if (/^\d+$/.test(dateString) && parseInt(dateString) > 25569) {
      // Excel serial date: days since 1900-01-01
      // JavaScript Date uses 1970-01-01 as epoch, so we need to adjust
      const excelEpoch = new Date(1900, 0, 1);
      const jsDate = new Date(excelEpoch.getTime() + (parseInt(dateString) - 2) * 24 * 60 * 60 * 1000);
      
      if (!isNaN(jsDate.getTime())) {
        return jsDate.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    }
    
    // Try to parse as regular date
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric'
        });
      }
    } catch (e) {
      // If parsing fails, return original value
    }
    
    return dateString;
  };

  // Group data based on selected criteria
  const getGroupedData = (data: any[]) => {
    if (groupBy === 'none') {
      return { 'All Records': data };
    }

    const groups: { [key: string]: any[] } = {};
    
    data.forEach((row) => {
      let groupKey = '';
      let hasValidValue = false;
      
      switch (groupBy) {
        case 'patient':
          if (row[1] && String(row[1]).trim() !== '') {
            groupKey = String(row[1]).trim();
            hasValidValue = true;
          }
          break;
        case 'date':
          if (row[3] && String(row[3]).trim() !== '') {
            groupKey = formatDateForDisplay(row[3]);
            hasValidValue = true;
          }
          break;
        case 'task':
          if (row[4] && String(row[4]).trim() !== '') {
            groupKey = String(row[4]).trim();
            hasValidValue = true;
          }
          break;
        case 'clinician':
          if (row[7] && String(row[7]).trim() !== '') {
            groupKey = String(row[7]).trim();
            hasValidValue = true;
          }
          break;
        default:
          groupKey = 'All Records';
          hasValidValue = true;
      }
      
      // Only add to groups if there's a valid value
      if (hasValidValue) {
        if (!groups[groupKey]) {
          groups[groupKey] = [];
        }
        groups[groupKey].push(row);
      }
    });
    
    return groups;
  };

  // Toggle group expansion
  const toggleGroup = (groupKey: string) => {
    const newExpandedGroups = new Set(expandedGroups);
    if (newExpandedGroups.has(groupKey)) {
      newExpandedGroups.delete(groupKey);
    } else {
      newExpandedGroups.add(groupKey);
    }
    setExpandedGroups(newExpandedGroups);
  };

  // Get display data based on grouping
  const getDisplayData = () => {
    const groupedData = getGroupedData(sortedData);
    
    if (groupBy === 'none') {
      // No grouping - show all data
      return { 'All Records': sortedData };
    }
    
    // Grouping - show all groups and their data
    return groupedData;
  };


  // Auto-expand all groups when grouping is enabled
  useEffect(() => {
    if (groupBy !== 'none' && filteredData.length > 0) {
      const groupedData = getGroupedData(filteredData);
      const allGroupKeys = Object.keys(groupedData);
      setExpandedGroups(new Set(allGroupKeys));
    }
  }, [groupBy, filteredData.length]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* QA Nurse Navbar Component */}
      <QANurseNavbar activeTab="axcess-integration" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64 min-w-0">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QA Data Management</h1>
              <p className="text-gray-600 mt-1">Manage QA schedule tasks with Excel uploads, form input, and document attachments</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto min-w-0">
          <div className="space-y-6 max-w-full">

            {/* Input Mode Toggle */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-full overflow-hidden">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-blue-600" />
                  Data Input
                </h2>
                <div className="flex border border-gray-300 rounded-full bg-white">
                  <button
                    onClick={() => setInputMode('excel')}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-l-full ${
                      inputMode === 'excel'
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-700 hover:bg-gray-50'
                    }`}
                  >
                    Excel Upload
                  </button>
                  <button
                    onClick={() => setInputMode('form')}
                    className={`px-4 py-2 text-sm font-medium transition-colors rounded-r-full ${
                      inputMode === 'form'
                        ? 'bg-blue-600 text-white'
                        : 'text-blue-700 hover:bg-gray-50'
                    }`}
                  >
                    Form Input
                  </button>
                </div>
              </div>
              
              {inputMode === 'excel' ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileSpreadsheet className="w-8 h-8 text-blue-600" />
                    </div>
                    
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {isUploading ? 'Uploading...' : 'Drop Excel files here or click to browse'}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Supports .xlsx and .xls files up to 10MB
                      </p>
                    </div>

                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Patient Name
                      </label>
                      <input
                        type="text"
                        value={formData.patientName}
                        onChange={(e) => handleFormChange('patientName', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter patient name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        MRN
                      </label>
                      <input
                        type="text"
                        value={formData.mrn}
                        onChange={(e) => handleFormChange('mrn', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter MRN"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => handleFormChange('date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task
                      </label>
                      <input
                        type="text"
                        value={formData.task}
                        onChange={(e) => handleFormChange('task', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter task description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select 
                        value={formData.status}
                        onChange={(e) => handleFormChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                      >
                        <option value="">Select status</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="missed">Missed</option>
                        <option value="review">Review</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tags
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => handleFormChange('tags', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter tags (comma separated)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned To
                      </label>
                      <input
                        type="text"
                        value={formData.assignedTo}
                        onChange={(e) => handleFormChange('assignedTo', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                        placeholder="Enter clinician name"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button 
                      onClick={clearForm}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={handleFormSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Record
                    </button>
                  </div>
                </div>
              )}
            </div>


            {/* QA Schedule Tasks Table */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-full overflow-hidden">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Table className="w-5 h-5 mr-2 text-blue-600" />
                    QA Schedule Tasks
                  </h2>
                  {searchTerm && (
                    <p className="text-sm text-gray-600 mt-1">
                      Showing {sortedData.length} result{sortedData.length !== 1 ? 's' : ''} for "{searchTerm}"
                    </p>
                  )}
                </div>
                
                {tableData.length > 0 && (
                  <div className="flex items-center space-x-4 flex-wrap gap-4">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search patients, dates, tasks, clinicians..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 text-black"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L6 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                    
                    
                    {/* Sort/Group Controls */}
                    <div className="flex items-center space-x-3 flex-wrap gap-2">
                      <span className="text-sm font-medium text-gray-700">Organize by:</span>
                      <div className="flex border border-gray-300 rounded-full bg-white">
                        {[
                          { key: 'patient', label: 'Patient' },
                          { key: 'date', label: 'Date' },
                          { key: 'task', label: 'Task' },
                          { key: 'clinician', label: 'Clinician' }
                        ].map((option, index, array) => {
                          const isSelected = groupBy === option.key || sortBy === option.key;
                          const isFirst = index === 0;
                          const isLast = index === array.length - 1;

                          return (
                            <button
                              key={option.key}
                              onClick={() => {
                                // Toggle between sort and group
                                if (groupBy === option.key) {
                                  // Currently grouping, switch to sorting
                                  setGroupBy('none');
                                  setSortBy(option.key);
                                  setSortOrder('asc');
                                } else if (sortBy === option.key) {
                                  // Currently sorting, toggle sort order
                                  setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                } else {
                                  // Switch to grouping
                                  setGroupBy(option.key);
                                  setSortBy(option.key);
                                  setSortOrder('asc');
                                  // Auto-expand all groups when switching to grouping
                                  setExpandedGroups(new Set());
                                }
                              }}
                              className={`px-4 py-2 text-sm font-medium transition-colors relative flex items-center justify-center whitespace-nowrap ${
                                isSelected
                                  ? 'bg-blue-600 text-white'
                                  : 'text-blue-700 hover:bg-gray-50'
                              } ${
                                isFirst ? 'rounded-l-full' : ''
                              } ${
                                isLast ? 'rounded-r-full' : ''
                              }`}
                            >
                              {option.label}
                              {sortBy === option.key && groupBy === 'none' && (
                                <span className="ml-1">
                                  {sortOrder === 'asc' ? '↑' : '↓'}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {tableData.length > 0 ? (
                <div className="rounded-lg border border-gray-200 shadow-sm max-w-full overflow-hidden">
                  <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
                    <table className="w-full divide-y divide-gray-200 min-w-max">
                    <thead className="bg-gradient-to-r from-purple-600 to-purple-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                          Patient Name
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                          MRN
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                          Date
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                          Task
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                          Tags
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                          Assigned To
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                          Actions
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                          Source
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(getDisplayData()).map(([groupKey, groupData]) => (
                        <React.Fragment key={groupKey}>
                          {/* Group Header */}
                          {groupBy !== 'none' && (
                            <tr className="bg-gray-50 border-b-2 border-gray-200">
                              <td colSpan={9} className="px-6 py-3">
                                <button
                                  onClick={() => toggleGroup(groupKey)}
                                  className="flex items-center space-x-2 text-left w-full hover:bg-gray-100 rounded-lg p-2 transition-colors"
                                >
                                  {expandedGroups.has(groupKey) ? (
                                    <ChevronDown className="w-4 h-4 text-gray-600" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4 text-gray-600" />
                                  )}
                                  <span className="font-semibold text-gray-900">
                                    {groupKey}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    ({groupData.length} {groupData.length === 1 ? 'record' : 'records'})
                                  </span>
                                </button>
                              </td>
                            </tr>
                          )}
                          
                          {/* Group Data */}
                          {expandedGroups.has(groupKey) && groupData.map((row, rowIndex) => {
                            const actualRowIndex = tableData.findIndex(r => r === row);
                            
                            return (
                              <tr key={`${groupKey}-${rowIndex}`} className="hover:bg-gray-50 transition-colors duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {row[1] !== undefined && row[1] !== null ? (
                                    <span className="font-medium text-blue-600">
                                      {String(row[1])}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {row[2] !== undefined && row[2] !== null ? String(row[2]) : (
                                    <span className="text-gray-400 italic">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {row[3] !== undefined && row[3] !== null ? (
                                    <span className="font-mono">
                                      {formatDateForDisplay(row[3])}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {row[4] !== undefined && row[4] !== null ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {taskPdfLinks[actualRowIndex] ? (
                                        <a
                                          href={taskPdfLinks[actualRowIndex]}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center space-x-1 hover:text-blue-900 transition-colors cursor-pointer"
                                          title="Click to view PDF"
                                        >
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                          </svg>
                                          <span>{String(row[4])}</span>
                                        </a>
                                      ) : (
                                        String(row[4])
                                      )}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  {row[5] !== undefined && row[5] !== null ? (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      String(row[5]).toLowerCase().includes('completed') || String(row[5]).toLowerCase().includes('submitted') 
                                        ? 'bg-green-100 text-green-800'
                                        : String(row[5]).toLowerCase().includes('pending') || String(row[5]).toLowerCase().includes('review')
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : String(row[5]).toLowerCase().includes('missed') || String(row[5]).toLowerCase().includes('error')
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {String(row[5])}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                  {row[6] !== undefined && row[6] !== null ? String(row[6]) : (
                                    <span className="text-gray-400 italic">-</span>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-8 w-8">
                                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                        <span className="text-xs font-medium text-purple-600">
                                          {row[7] ? String(row[7]).charAt(0).toUpperCase() : '?'}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="ml-3">
                                      <div className="text-sm font-medium text-gray-900">
                                        {row[7] !== undefined && row[7] !== null ? String(row[7]) : (
                                          <span className="text-gray-400 italic">-</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <div className="flex items-center space-x-2">
                                    <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => startEdit(actualRowIndex, row)}
                                      className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                      title="Edit"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                    </button>
                                    <button
                                      onClick={() => deleteRow(actualRowIndex)}
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                      title="Delete"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    row[8] === 'Excel'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-blue-100 text-blue-800'
                                  }`}>
                                    {row[8] === 'Excel' ? (
                                      <>
                                        <FileSpreadsheet className="w-3 h-3 mr-1" />
                                        Excel
                                      </>
                                    ) : (
                                      <>
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Form
                                      </>
                                    )}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  {searchTerm ? (
                    <>
                      <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No results found for "{searchTerm}"</p>
                      <p className="text-sm text-gray-400 mt-2">Try adjusting your search terms</p>
                    </>
                  ) : (
                    <>
                      <Table className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Upload an Excel file to see QA Schedule Tasks data here</p>
                    </>
                  )}
                </div>
              )}

            </div>

            {/* Data Statistics */}
            {tableData.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-full">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Rows</p>
                      <p className="text-3xl font-bold text-gray-900">{tableData.length.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Table className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Columns</p>
                      <p className="text-3xl font-bold text-gray-900">{tableHeaders.length}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Filtered Rows</p>
                      <p className="text-3xl font-bold text-gray-900">{filteredData.length.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Search className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Edit Record</h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    value={editData.patientName}
                    onChange={(e) => handleEditChange('patientName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    MRN
                  </label>
                  <input
                    type="text"
                    value={editData.mrn}
                    onChange={(e) => handleEditChange('mrn', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter MRN"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={editData.date}
                    onChange={(e) => handleEditChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task
                  </label>
                  <input
                    type="text"
                    value={editData.task}
                    onChange={(e) => handleEditChange('task', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter task description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={editData.status}
                    onChange={(e) => handleEditChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                  >
                    <option value="">Select status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="missed">Missed</option>
                    <option value="review">Review</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={editData.tags}
                    onChange={(e) => handleEditChange('tags', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter tags (comma separated)"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    value={editData.assignedTo}
                    onChange={(e) => handleEditChange('assignedTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-black"
                    placeholder="Enter clinician name"
                  />
                </div>
                
                {/* PDF Upload Section */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload PDF Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleModalFileUpload}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="cursor-pointer flex flex-col items-center space-y-2"
                    >
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <span className="text-sm text-gray-600">
                        {uploadedFile ? uploadedFile.name : 'Click to upload PDF or drag and drop'}
                      </span>
                      <span className="text-xs text-gray-500">PDF files only, max 5MB</span>
                    </label>
                  </div>
                  
                  {uploadedFile && (
                    <div className="mt-3 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-green-800 font-medium">{uploadedFile.name}</span>
                        <span className="text-xs text-green-600">
                          ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        onClick={removeUploadedFile}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Remove file"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
