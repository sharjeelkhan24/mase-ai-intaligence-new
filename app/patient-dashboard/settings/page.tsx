'use client';

import { useState, useEffect, useRef } from 'react';
import {
  User,
  Shield,
  Bell,
  Save,
  Edit,
  X,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PatientNavbar from '@/app/components/patient-dashboard/PatientNavbar';

export default function PatientSettingsPage() {
  const [settingsActiveTab, setSettingsActiveTab] = useState('profile');
  const [patientData, setPatientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form data state for editing
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: '',
    medications: '',
    allergies: '',
    profile_image: ''
  });

  // Backup of original data for cancel functionality
  const [originalFormData, setOriginalFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: '',
    medications: '',
    allergies: '',
    profile_image: ''
  });

  // Fetch complete patient data from database
  const fetchPatientData = async (patientEmail: string) => {
    try {
      console.log('Fetching patient data for email:', patientEmail);
      
      // Get patient agency from localStorage
      const patientAgency = localStorage.getItem('patientAgency');
      if (!patientAgency) {
        throw new Error('No patient agency found in localStorage');
      }

      // Get the patients table name for this agency
      const { data: agencyData, error: agencyError } = await supabase
        .from('agency')
        .select('patients_table_name')
        .eq('agency_name', patientAgency)
        .single();

      if (agencyError || !agencyData?.patients_table_name) {
        console.error('Error fetching agency data or patients table name:', agencyError);
        throw new Error('Agency patients table not found');
      }

      console.log('Using patients table:', agencyData.patients_table_name);
      
      const { data, error } = await supabase
        .from(agencyData.patients_table_name)
        .select('*')
        .eq('email', patientEmail)
        .single();

      if (error) {
        console.error('Error fetching patient data:', error);
        throw error;
      }

      if (data) {
        console.log('Patient data fetched successfully:', data);
        console.log('Patient fields available:', Object.keys(data));
        setPatientData(data);
        // Update localStorage with complete data
        localStorage.setItem('patientData', JSON.stringify(data));
      } else {
        console.log('No patient data found for email:', patientEmail);
        throw new Error('Patient not found');
      }
    } catch (error) {
      console.error('Error in fetchPatientData:', error);
      alert('Error loading patient data. Please try signing in again.');
      window.location.href = '/patient-signin';
    } finally {
      setIsLoading(false);
    }
  };

  // Load patient data from localStorage and fetch complete data from database
  useEffect(() => {
    const storedPatientData = localStorage.getItem('patientData');
    if (storedPatientData) {
      try {
        const parsedData = JSON.parse(storedPatientData);
        console.log('Patient data loaded from localStorage:', parsedData);
        
        // If we have email, fetch complete data from database
        if (parsedData.email) {
          fetchPatientData(parsedData.email);
        } else {
          console.error('No email found in stored patient data');
          window.location.href = '/patient-signin';
        }
      } catch (error) {
        console.error('Error parsing patient data:', error);
        window.location.href = '/patient-signin';
      }
    } else {
      console.log('No patient data found, redirecting to signin');
      window.location.href = '/patient-signin';
    }
  }, []);

  // Load patient data into form when available
  useEffect(() => {
    if (patientData) {
      const patientFormData = {
        first_name: patientData.first_name || '',
        last_name: patientData.last_name || '',
        email: patientData.email || '',
        phone: patientData.phone || '',
        date_of_birth: patientData.date_of_birth || '',
        gender: patientData.gender || '',
        address: patientData.address || '',
        city: patientData.city || '',
        state: patientData.state || '',
        zip_code: patientData.zip_code || '',
        emergency_contact_name: patientData.emergency_contact_name || '',
        emergency_contact_phone: patientData.emergency_contact_phone || '',
        medical_conditions: patientData.medical_conditions || '',
        medications: patientData.medications || '',
        allergies: patientData.allergies || '',
        profile_image: patientData.profile_image || ''
      };
      
      setFormData(patientFormData);
      setOriginalFormData(patientFormData);
    }
  }, [patientData]);

  // Helper function for input styling
  const getInputClassName = (isTextArea = false) => {
    const baseClasses = `w-full px-3 py-2 border rounded-lg font-[family-name:var(--font-adlam-display)]`;
    const editModeClasses = isEditMode 
      ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900' 
      : 'border-gray-200 bg-gray-50 cursor-default text-gray-500';
    const disabledClasses = 'disabled:bg-gray-100 disabled:cursor-not-allowed';
    
    return `${baseClasses} ${editModeClasses} ${disabledClasses}`;
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setFormData(originalFormData);
    setIsEditMode(false);
  };

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('Please upload an image smaller than 10MB');
      return;
    }

    setIsUploadingImage(true);

    try {
      // Convert file to base64 data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData(prev => ({
          ...prev,
          profile_image: base64String
        }));
        setIsUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        setIsUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      setIsUploadingImage(false);
    }
  };

  // Handle upload button click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Clear profile image
  const handleClearImage = () => {
    setFormData(prev => ({
      ...prev,
      profile_image: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!patientData) return;
    
    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .from('patients')
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          medical_conditions: formData.medical_conditions,
          medications: formData.medications,
          allergies: formData.allergies,
          profile_image: formData.profile_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', patientData.id);

      if (error) {
        console.error('Error updating patient:', error);
        alert('Failed to save changes. Please try again.');
      } else {
        console.log('Patient profile updated successfully');
        alert('Profile updated successfully!');
        // Update the original data backup
        setOriginalFormData(formData);
        // Exit edit mode
        setIsEditMode(false);
        // Refresh patient data to reflect changes
        await fetchPatientData(patientData.email);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Settings tabs configuration
  const settingsTabs = [
    { id: 'profile', label: 'Patient Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
            Personal Information
          </h3>
          {isEditMode && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full font-[family-name:var(--font-adlam-display)]">
              Edit Mode
            </span>
          )}
        </div>
        
        {/* Profile Image Section */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Profile Image
          </label>
          <div className="flex items-center space-x-4">
            {/* Current Profile Image Preview */}
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
              {formData.profile_image ? (
                <img
                  src={formData.profile_image}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-lg font-semibold">
                  {formData.first_name && formData.last_name
                    ? formData.first_name[0].toUpperCase() + formData.last_name[0].toUpperCase()
                    : 'P'
                  }
                </span>
              )}
            </div>
            
            {/* Upload Controls */}
            <div className="flex-1">
              {isEditMode ? (
                <div className="space-y-4">
                  {/* File Upload Section */}
                  <div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={handleUploadClick}
                        disabled={isUploadingImage}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-[family-name:var(--font-adlam-display)]"
                      >
                        {isUploadingImage ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4" />
                            <span>Upload Image</span>
                          </>
                        )}
                      </button>
                      
                      {formData.profile_image && (
                        <button
                          type="button"
                          onClick={handleClearImage}
                          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-[family-name:var(--font-adlam-display)]"
                        >
                          <X className="w-4 h-4" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    
                    <p className="text-xs text-gray-500 mt-2 font-[family-name:var(--font-adlam-display)]">
                      Upload JPG, PNG, GIF, or WebP (max 10MB)
                    </p>
                  </div>

                  {/* OR Divider */}
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-xs text-gray-500 bg-white font-[family-name:var(--font-adlam-display)]">OR</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                  </div>

                  {/* URL Input Section */}
                  <div>
                    <input
                      type="url"
                      value={formData.profile_image.startsWith('data:') ? '' : formData.profile_image}
                      onChange={(e) => setFormData({...formData, profile_image: e.target.value})}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-[family-name:var(--font-adlam-display)]"
                    />
                    <p className="text-xs text-gray-500 mt-1 font-[family-name:var(--font-adlam-display)]">
                      Enter a direct link to your profile image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {formData.profile_image ? (
                    <div>
                      <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
                        Profile image set
                      </p>
                      {formData.profile_image.startsWith('data:') ? (
                        <p className="text-xs text-gray-400 font-[family-name:var(--font-adlam-display)]">
                          Uploaded from device
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 break-all font-[family-name:var(--font-adlam-display)]">
                          {formData.profile_image.length > 50 
                            ? `${formData.profile_image.substring(0, 50)}...` 
                            : formData.profile_image
                          }
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                      No profile image uploaded
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              First Name
            </label>
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) => setFormData({...formData, first_name: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Last Name
            </label>
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) => setFormData({...formData, last_name: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Date of Birth
            </label>
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Gender
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({...formData, gender: e.target.value})}
              disabled={!isEditMode}
              className={getInputClassName()}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Healthcare Agency
            </label>
            <input
              type="text"
              value={patientData?.agency_name || ''}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 font-[family-name:var(--font-adlam-display)]"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Street Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              State
            </label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              ZIP Code
            </label>
            <input
              type="text"
              value={formData.zip_code}
              onChange={(e) => setFormData({...formData, zip_code: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Emergency Contact Name
            </label>
            <input
              type="text"
              value={formData.emergency_contact_name}
              onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Emergency Contact Phone
            </label>
            <input
              type="tel"
              value={formData.emergency_contact_phone}
              onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              className={getInputClassName()}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Medical Information
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Medical Conditions
            </label>
            <textarea
              value={formData.medical_conditions}
              onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              rows={3}
              className={getInputClassName(true)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Current Medications
            </label>
            <textarea
              value={formData.medications}
              onChange={(e) => setFormData({...formData, medications: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              rows={3}
              className={getInputClassName(true)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Allergies
            </label>
            <textarea
              value={formData.allergies}
              onChange={(e) => setFormData({...formData, allergies: e.target.value})}
              disabled={!isEditMode}
              readOnly={!isEditMode}
              rows={3}
              className={getInputClassName(true)}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        {!isEditMode ? (
          <button
            onClick={handleEdit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Information</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 disabled:opacity-50 font-[family-name:var(--font-adlam-display)]"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 font-[family-name:var(--font-adlam-display)]"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Password Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Current Password
            </label>
            <input
              type="password"
              placeholder="Enter current password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              New Password
            </label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Confirm New Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
          <Save className="w-4 h-4" />
          <span>Update Password</span>
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Notification Preferences
        </h3>
        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via text message' },
            { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Get reminded about upcoming appointments' },
            { key: 'medicationAlerts', label: 'Medication Alerts', desc: 'Reminders for medication schedules' },
            { key: 'testResults', label: 'Test Results', desc: 'Notifications when test results are available' }
          ].map((notification) => (
            <div key={notification.key} className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  {notification.label}
                </h4>
                <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                  {notification.desc}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={true}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 font-[family-name:var(--font-adlam-display)]">
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Patient Navbar Component */}
      <PatientNavbar activeTab="settings" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Settings
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage your patient profile and preferences
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="flex">
            {/* Settings Navigation */}
            <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 mr-6">
              <nav className="p-4">
                <ul className="space-y-2">
                  {settingsTabs.map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <li key={tab.id}>
                        <button
                          onClick={() => setSettingsActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-[family-name:var(--font-adlam-display)] ${
                            settingsActiveTab === tab.id
                              ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-700'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>

            {/* Settings Content */}
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {settingsActiveTab === 'profile' && renderProfileSettings()}
              {settingsActiveTab === 'security' && renderSecuritySettings()}
              {settingsActiveTab === 'notifications' && renderNotificationSettings()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
