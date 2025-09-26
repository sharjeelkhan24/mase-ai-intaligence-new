'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Settings, User, Shield, Bell, CreditCard, Database, Mail, Phone, MapPin, Save, Eye, EyeOff, Edit, X, Upload, Image as ImageIcon, Award } from 'lucide-react';
import StaffNurseNavbar from '@/app/components/staff-nurse-dashboard/StaffNurseNavbar';
import { useStaffAuth } from '@/lib/contexts/StaffAuthContext';

export default function StaffNurseSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { staff, isLoading: staffLoading, refreshStaffData } = useStaffAuth();

  // Form states
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    position: '',
    hireDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    licenseNumber: '',
    licenseExpiry: '',
    certifications: [] as string[],
    profileImage: ''
  });

  // Backup of original data for cancel functionality
  const [originalProfileData, setOriginalProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    position: '',
    hireDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    emergencyContact: '',
    emergencyPhone: '',
    licenseNumber: '',
    licenseExpiry: '',
    certifications: [] as string[],
    profileImage: ''
  });

  // Load staff data into form when available
  useEffect(() => {
    if (staff && !staffLoading) {
      const staffFormData = {
        firstName: staff.first_name || '',
        lastName: staff.last_name || '',
        email: staff.email || '',
        phone: staff.phone || '',
        employeeId: staff.id || '',
        department: staff.department || '',
        position: staff.role || '',
        hireDate: staff.hire_date || '',
        address: staff.address || '',
        city: staff.city || '',
        state: staff.state || '',
        zipCode: staff.zip_code || '',
        emergencyContact: staff.emergency_contact_name || '',
        emergencyPhone: staff.emergency_contact_phone || '',
        licenseNumber: staff.license_number || '',
        licenseExpiry: staff.license_expiry || '',
        certifications: staff.certifications ? staff.certifications.split(',').map((cert: string) => cert.trim()).filter((cert: string) => cert) : [],
        profileImage: staff.profile_image || ''
      };
      
      setProfileData(staffFormData);
      setOriginalProfileData(staffFormData);
    }
  }, [staff, staffLoading]);

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true,
    loginNotifications: true
  });

  const [notificationData, setNotificationData] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    weeklyReports: true,
    systemAlerts: true,
    staffUpdates: true,
    scheduleChanges: true,
    patientUpdates: true,
    trainingReminders: true
  });

  const [billingData, setBillingData] = useState({
    companyName: '',
    billingEmail: '',
    paymentMethod: 'credit-card',
    autoRenew: true,
    invoiceFormat: 'detailed'
  });

  const tabs = [
    { id: 'profile', label: 'Staff Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'system', label: 'System', icon: Database }
  ];

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setProfileData(originalProfileData);
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
        setProfileData(prev => ({
          ...prev,
          profileImage: base64String
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
    setProfileData(prev => ({
      ...prev,
      profileImage: ''
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Helper function for input styling
  const getInputClassName = (isTextArea = false) => {
    const baseClasses = `w-full px-3 py-2 border rounded-lg font-[family-name:var(--font-adlam-display)]`;
    const editModeClasses = isEditMode 
      ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-gray-900' 
      : 'border-gray-200 bg-gray-50 cursor-default text-gray-500';
    const disabledClasses = 'disabled:bg-gray-100 disabled:cursor-not-allowed';
    
    return `${baseClasses} ${editModeClasses} ${disabledClasses}`;
  };

  const handleSave = async (section: string) => {
    if (!staff) return;
    
    setIsLoading(true);
    
    try {
      if (section === 'profile') {
        // Update staff data in database
        const { supabase } = await import('@/lib/supabase/client');
        
        const { error } = await supabase
          .from('staff')
          .update({
            first_name: profileData.firstName,
            last_name: profileData.lastName,
            email: profileData.email,
            phone: profileData.phone,
            department: profileData.department,
            role: profileData.position,
            hire_date: profileData.hireDate,
            address: profileData.address,
            city: profileData.city,
            state: profileData.state,
            zip_code: profileData.zipCode,
            emergency_contact_name: profileData.emergencyContact,
            emergency_contact_phone: profileData.emergencyPhone,
            license_number: profileData.licenseNumber,
            license_expiry: profileData.licenseExpiry,
            certifications: profileData.certifications.join(', '),
            profile_image: profileData.profileImage,
            updated_at: new Date().toISOString()
          })
          .eq('id', staff.id);

        if (error) {
          console.error('Error updating staff:', error);
          alert('Failed to save changes. Please try again.');
        } else {
          console.log('Profile updated successfully');
          alert('Profile updated successfully!');
          // Update the original data backup
          setOriginalProfileData(profileData);
          // Exit edit mode
          setIsEditMode(false);
          // Refresh staff data to reflect changes
          await refreshStaffData();
        }
      } else {
        // For other sections, just log for now
        console.log(`Saving ${section} settings...`);
        alert(`${section} settings saved successfully!`);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred while saving. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProfileSettings = () => (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
            Staff Information
          </h3>
          {isEditMode && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full font-[family-name:var(--font-adlam-display)]">
              Edit Mode
            </span>
          )}
        </div>

        {/* Profile Image Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
            Profile Image
          </label>
          <div className="flex items-center space-x-3">
            {/* Current Profile Image Preview */}
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden border-2 border-gray-200 flex-shrink-0">
              {profileData.profileImage ? (
                <img
                  src={profileData.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-lg font-semibold">
                  {profileData.firstName 
                    ? profileData.firstName[0] + profileData.lastName[0]
                    : 'ER'
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
                      
                      {profileData.profileImage && (
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
                      value={profileData.profileImage.startsWith('data:') ? '' : profileData.profileImage}
                      onChange={(e) => setProfileData({...profileData, profileImage: e.target.value})}
                      placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                      className={getInputClassName()}
                    />
                    <p className="text-xs text-gray-500 mt-1 font-[family-name:var(--font-adlam-display)]">
                      Enter a direct link to your profile image
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {profileData.profileImage ? (
                    <div>
                      <p className="text-sm text-gray-600 font-[family-name:var(--font-adlam-display)]">
                        Profile image set
                      </p>
                      {profileData.profileImage.startsWith('data:') ? (
                        <p className="text-xs text-gray-400 font-[family-name:var(--font-adlam-display)]">
                          Uploaded from device
                        </p>
                      ) : (
                        <p className="text-xs text-gray-400 break-all font-[family-name:var(--font-adlam-display)]">
                          {profileData.profileImage.length > 50 
                            ? `${profileData.profileImage.substring(0, 50)}...` 
                            : profileData.profileImage
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              First Name
            </label>
            <input
              type="text"
              value={profileData.firstName}
              onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter first name"}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              Last Name
            </label>
            <input
              type="text"
              value={profileData.lastName}
              onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter last name"}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              Email Address
            </label>
            <input
              type="email"
              value={profileData.email}
              onChange={(e) => setProfileData({...profileData, email: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter email address"}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              Phone Number
            </label>
            <input
              type="tel"
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter phone number"}
              className={getInputClassName()}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 font-[family-name:var(--font-adlam-display)]">
          Professional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              Employee ID
            </label>
            <input
              type="text"
              value={profileData.employeeId}
              className="w-full px-3 py-2 border border-gray-200 bg-gray-50 text-gray-600 rounded-lg font-[family-name:var(--font-adlam-display)] text-sm"
              readOnly
              placeholder={staffLoading ? "Loading..." : "Employee ID"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              Department
            </label>
            <input
              type="text"
              value={profileData.department}
              onChange={(e) => setProfileData({...profileData, department: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter department"}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              Position
            </label>
            <input
              type="text"
              value={profileData.position}
              onChange={(e) => setProfileData({...profileData, position: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter position"}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              License Number
            </label>
            <input
              type="text"
              value={profileData.licenseNumber}
              onChange={(e) => setProfileData({...profileData, licenseNumber: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter license number"}
              className={getInputClassName()}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 font-[family-name:var(--font-adlam-display)]">
          Address Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              Street Address
            </label>
            <input
              type="text"
              value={profileData.address}
              onChange={(e) => setProfileData({...profileData, address: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter street address"}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              City
            </label>
            <input
              type="text"
              value={profileData.city}
              onChange={(e) => setProfileData({...profileData, city: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter city"}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              State
            </label>
            <select
              value={profileData.state}
              onChange={(e) => setProfileData({...profileData, state: e.target.value})}
              disabled={staffLoading || !isEditMode}
              className={getInputClassName()}
            >
              <option value="">Select State</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="TX">Texas</option>
              <option value="FL">Florida</option>
              <option value="IL">Illinois</option>
              <option value="PA">Pennsylvania</option>
              <option value="OH">Ohio</option>
              <option value="GA">Georgia</option>
              <option value="NC">North Carolina</option>
              <option value="MI">Michigan</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              ZIP Code
            </label>
            <input
              type="text"
              value={profileData.zipCode}
              onChange={(e) => setProfileData({...profileData, zipCode: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter ZIP code"}
              className={getInputClassName()}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 font-[family-name:var(--font-adlam-display)]">
          Emergency Contact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              Contact Name
            </label>
            <input
              type="text"
              value={profileData.emergencyContact}
              onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter emergency contact name"}
              className={getInputClassName()}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 font-[family-name:var(--font-adlam-display)]">
              Contact Phone
            </label>
            <input
              type="tel"
              value={profileData.emergencyPhone}
              onChange={(e) => setProfileData({...profileData, emergencyPhone: e.target.value})}
              disabled={staffLoading || !isEditMode}
              readOnly={!isEditMode}
              placeholder={staffLoading ? "Loading..." : "Enter emergency contact phone"}
              className={getInputClassName()}
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 font-[family-name:var(--font-adlam-display)]">
          Certifications
        </h3>
        <div className="flex flex-wrap gap-2">
          {profileData.certifications.map((cert, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full flex items-center space-x-1 font-[family-name:var(--font-adlam-display)]"
            >
              <Award className="w-3 h-3" />
              <span>{cert}</span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        {!isEditMode ? (
          <button
            onClick={handleEdit}
            disabled={staffLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 font-[family-name:var(--font-adlam-display)] text-sm"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Information</span>
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              disabled={isLoading}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2 disabled:opacity-50 font-[family-name:var(--font-adlam-display)] text-sm"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            <button
              onClick={() => handleSave('profile')}
              disabled={isLoading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 font-[family-name:var(--font-adlam-display)] text-sm"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 font-[family-name:var(--font-adlam-display)]">
          Password Settings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={securityData.currentPassword}
                onChange={(e) => setSecurityData({...securityData, currentPassword: e.target.value})}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={securityData.newPassword}
              onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
              Confirm New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={securityData.confirmPassword}
              onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-[family-name:var(--font-adlam-display)]"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Security Preferences
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                Add an extra layer of security to your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityData.twoFactorEnabled}
                onChange={(e) => setSecurityData({...securityData, twoFactorEnabled: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Login Notifications
              </h4>
              <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                Get notified when someone logs into your account
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securityData.loginNotifications}
                onChange={(e) => setSecurityData({...securityData, loginNotifications: e.target.checked})}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('security')}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 font-[family-name:var(--font-adlam-display)]"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3 font-[family-name:var(--font-adlam-display)]">
          Notification Preferences
        </h3>
        <div className="space-y-3">
          {[
            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via text message' },
            { key: 'pushNotifications', label: 'Push Notifications', desc: 'Receive browser push notifications' },
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Get weekly summary reports' },
            { key: 'systemAlerts', label: 'System Alerts', desc: 'Important system maintenance and updates' },
            { key: 'staffUpdates', label: 'Staff Updates', desc: 'Notifications about staff changes and updates' },
            { key: 'scheduleChanges', label: 'Schedule Changes', desc: 'Get notified about schedule changes' },
            { key: 'patientUpdates', label: 'Patient Updates', desc: 'Get notified about patient status changes' },
            { key: 'trainingReminders', label: 'Training Reminders', desc: 'Get reminded about upcoming training sessions' }
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
                  checked={notificationData[notification.key as keyof typeof notificationData]}
                  onChange={(e) => setNotificationData({
                    ...notificationData,
                    [notification.key]: e.target.checked
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => handleSave('notifications')}
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50 font-[family-name:var(--font-adlam-display)]"
        >
          <Save className="w-4 h-4" />
          <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
          </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile': return renderProfileSettings();
      case 'security': return renderSecuritySettings();
      case 'notifications': return renderNotificationSettings();
      case 'billing': return (
        <div className="text-center py-12">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-[family-name:var(--font-adlam-display)]">Billing settings coming soon</p>
        </div>
      );
      case 'system': return (
        <div className="text-center py-12">
          <Database className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 font-[family-name:var(--font-adlam-display)]">System settings coming soon</p>
    </div>
  );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Staff Nurse Navbar Component */}
      <StaffNurseNavbar activeTab="settings" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Settings
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Manage your staff profile and preferences
              </p>
            </div>
            <Settings className="w-6 h-6 text-gray-400" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="flex gap-6">
            {/* Settings Navigation */}
            <div className="w-64 bg-white rounded-lg shadow-sm border border-gray-200 flex-shrink-0">
              <nav className="p-4">
                <ul className="space-y-2">
                  {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                      <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 font-[family-name:var(--font-adlam-display)] ${
                        activeTab === tab.id
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
            <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-y-auto">
              <div className="p-6">
                {renderContent()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
