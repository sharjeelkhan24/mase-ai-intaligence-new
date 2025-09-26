'use client';

import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Search,
  Filter,
  Star,
  Reply,
  Forward,
  Plus,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useStaffData } from '@/lib/hooks/useStaffData';
import { supabase } from '@/lib/supabase/client';
import StaffNurseNavbar from '@/app/components/staff-nurse-dashboard/StaffNurseNavbar';

export default function StaffNurseMessagesPage() {
  const { staffData, isLoading } = useStaffData();
  const [messages, setMessages] = useState<any[]>([]);
  const [inboxMessages, setInboxMessages] = useState<any[]>([]);
  const [sentMessages, setSentMessages] = useState<any[]>([]);
  const [draftMessages, setDraftMessages] = useState<any[]>([]);
  const [agencyData, setAgencyData] = useState<any>(null);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const [showNewMessageModal, setShowNewMessageModal] = useState(false);
  const [newMessageForm, setNewMessageForm] = useState({
    recipient: '',
    recipientType: 'staff', // 'staff' or 'patient'
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [availableRecipients, setAvailableRecipients] = useState<any[]>([]);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [senderNames, setSenderNames] = useState<{[key: string]: string}>({});
  const [recipientNames, setRecipientNames] = useState<{[key: string]: string}>({});

  // Load sender and recipient names
  const loadNames = async (messages: any[]) => {
    if (!agencyData) return;

    const allIds = new Set<string>();

    // Collect all unique IDs from both senders and recipients
    messages.forEach(message => {
      if (message.sender_id) allIds.add(message.sender_id);
      if (message.recipient_id) allIds.add(message.recipient_id);
    });

    const names: {[key: string]: string} = {};

    try {
      // Load staff names for all IDs
      if (agencyData.staff_table_name && allIds.size > 0) {
        const { data: staffData } = await supabase
          .from(agencyData.staff_table_name)
          .select('id, first_name, last_name')
          .in('id', Array.from(allIds));

        if (staffData) {
          staffData.forEach(staff => {
            names[staff.id] = `${staff.first_name} ${staff.last_name}`;
          });
        }
      }

      // Load patient names for all IDs
      if (agencyData.patients_table_name && allIds.size > 0) {
        const { data: patientsData } = await supabase
          .from(agencyData.patients_table_name)
          .select('id, first_name, last_name')
          .in('id', Array.from(allIds));

        if (patientsData) {
          patientsData.forEach(patient => {
            names[patient.id] = `${patient.first_name} ${patient.last_name}`;
          });
        }
      }

      setSenderNames(prev => ({ ...prev, ...names }));
      setRecipientNames(prev => ({ ...prev, ...names }));
    } catch (error) {
      console.error('Error loading names:', error);
    }
  };

  // Load messages from database
  const loadMessages = async () => {
    if (!staffData?.agency_name || !agencyData) {
      console.log('No agency data available for loading messages');
      return;
    }

    setIsLoadingMessages(true);
    try {
      console.log('=== DEBUG: Loading all messages ===');
      console.log('Staff data:', staffData);
      console.log('Agency data:', agencyData);

      let allMessages: any[] = [];

      // Load inbox messages
      if (agencyData.inbox_table_name) {
        const { data: inboxData, error: inboxError } = await supabase
          .from(agencyData.inbox_table_name)
          .select('*')
          .eq('recipient_id', staffData.id)
          .eq('recipient_type', 'staff')
          .order('created_at', { ascending: false });

        if (!inboxError) {
          setInboxMessages(inboxData || []);
          allMessages = [...allMessages, ...(inboxData || [])];
          console.log('Inbox messages loaded:', inboxData);
        } else {
          console.error('Error loading inbox messages:', inboxError);
        }
      }

      // Load sent messages
      if (agencyData.sent_table_name) {
        const { data: sentData, error: sentError } = await supabase
          .from(agencyData.sent_table_name)
          .select('*')
          .eq('sender_id', staffData.id)
          .eq('sender_type', 'staff')
          .order('sent_at', { ascending: false });

        if (!sentError) {
          setSentMessages(sentData || []);
          allMessages = [...allMessages, ...(sentData || [])];
          console.log('Sent messages loaded:', sentData);
        } else {
          console.error('Error loading sent messages:', sentError);
        }
      }

      // Load draft messages
      if (agencyData.drafts_table_name) {
        const { data: draftData, error: draftError } = await supabase
          .from(agencyData.drafts_table_name)
          .select('*')
          .eq('sender_id', staffData.id)
          .eq('sender_type', 'staff')
          .order('last_saved_at', { ascending: false });

        if (!draftError) {
          setDraftMessages(draftData || []);
          allMessages = [...allMessages, ...(draftData || [])];
          console.log('Draft messages loaded:', draftData);
        } else {
          console.error('Error loading draft messages:', draftError);
        }
      }

      // Set the current tab's messages for display
      if (activeTab === 'inbox') {
        setMessages(inboxMessages);
      } else if (activeTab === 'sent') {
        setMessages(sentMessages);
      } else if (activeTab === 'drafts') {
        setMessages(draftMessages);
      }

      // Load names for all messages using the fresh data
      await loadNames(allMessages);

    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Fetch agency data
  const fetchAgencyData = async (agencyName: string) => {
    try {
      const { data, error } = await supabase
        .from('agency')
        .select('*')
        .eq('agency_name', agencyName)
        .single();

      if (error) {
        console.error('Error fetching agency data:', error);
        return;
      }

      setAgencyData(data);
      console.log('Agency data loaded:', data);
    } catch (error) {
      console.error('Error fetching agency data:', error);
    }
  };

  // Mark sent message as read (when sender views their own sent message)
  const markSentMessageAsRead = async (messageId: string) => {
    if (!agencyData?.sent_table_name) {
      console.error('No sent table name available');
      return;
    }

    try {
      const { error } = await supabase
        .from(agencyData.sent_table_name)
        .update({ 
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) {
        console.error('Error marking sent message as read:', error);
        return;
      }

      // Update local state
      setSentMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { 
            ...msg, 
            read_at: new Date().toISOString()
          } : msg
        )
      );

      // Update current messages if it's in the sent tab
      if (activeTab === 'sent') {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { 
              ...msg, 
              read_at: new Date().toISOString()
            } : msg
          )
        );
      }

      console.log('Sent message marked as read:', messageId);
    } catch (error) {
      console.error('Error marking sent message as read:', error);
    }
  };

  // Mark message as read
  const markMessageAsRead = async (messageId: string) => {
    if (!agencyData?.inbox_table_name) {
      console.error('No inbox table name available');
      return;
    }

    try {
      const { error } = await supabase
        .from(agencyData.inbox_table_name)
        .update({ 
          status: 'read',
          read_at: new Date().toISOString()
        })
        .eq('id', messageId);

      if (error) {
        console.error('Error marking message as read:', error);
        return;
      }

      // Update local state
      setInboxMessages(prev => 
        prev.map(msg => 
          msg.id === messageId ? { 
            ...msg, 
            status: 'read',
            read_at: new Date().toISOString()
          } : msg
        )
      );

      // Update current messages if it's in the inbox
      if (activeTab === 'inbox') {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId ? { 
              ...msg, 
              status: 'read',
              read_at: new Date().toISOString()
            } : msg
          )
        );
      }

      // Find the inbox message to get its details
      const inboxMessage = inboxMessages.find(msg => msg.id === messageId);
      
      // Update sent messages state to reflect the read status
      if (inboxMessage) {
        setSentMessages(prev => 
          prev.map(msg => 
            msg.sender_id === inboxMessage.sender_id &&
            msg.sender_type === inboxMessage.sender_type &&
            msg.recipient_id === inboxMessage.recipient_id &&
            msg.recipient_type === inboxMessage.recipient_type &&
            msg.subject === inboxMessage.subject &&
            msg.message_content === inboxMessage.message_content
              ? { ...msg, read_at: new Date().toISOString() }
              : msg
          )
        );
      }

      console.log('Message marked as read:', messageId);
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  // Handle tab switching
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    
    // Update messages display based on selected tab
    if (tabId === 'inbox') {
      setMessages(inboxMessages);
    } else if (tabId === 'sent') {
      setMessages(sentMessages);
    } else if (tabId === 'drafts') {
      setMessages(draftMessages);
    }
  };

  // Calculate notification counts for each tab
  const getNotificationCounts = () => {
    const inboxUnreadCount = inboxMessages.filter(m => m.status === 'unread').length;
    const sentUnreadCount = sentMessages.filter(m => !m.read_at).length; // Count unread sent messages
    const draftCount = draftMessages.length; // Count all draft messages

    console.log('=== DEBUG: Notification Counts ===');
    console.log('Inbox messages:', inboxMessages);
    console.log('Sent messages:', sentMessages);
    console.log('Draft messages:', draftMessages);
    console.log('Inbox unread count:', inboxUnreadCount);
    console.log('Sent unread count:', sentUnreadCount);
    console.log('Draft count:', draftCount);

    return {
      inbox: inboxUnreadCount,
      sent: sentUnreadCount,
      drafts: draftCount
    };
  };

  const notificationCounts = getNotificationCounts();

  // Load agency data when staff data is available
  useEffect(() => {
    if (staffData?.agency_name) {
      fetchAgencyData(staffData.agency_name);
    }
  }, [staffData]);

  // Load messages when agency data is available
  useEffect(() => {
    if (staffData && agencyData) {
      loadMessages();
    }
  }, [staffData, agencyData, activeTab]);

  // Load available recipients from database
  const loadAvailableRecipients = async (recipientType: string) => {
    setIsLoadingRecipients(true);
    try {
      if (!staffData?.agency_name) {
        console.error('No agency name found for staff');
        return;
      }

      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      let recipients = [];

      if (recipientType === 'staff') {
        // Find the agency to get staff table name
        const { data: agency, error: agencyError } = await supabase
          .from('agency')
          .select('staff_table_name')
          .eq('agency_name', staffData.agency_name)
          .single();

        if (agencyError || !agency?.staff_table_name) {
          console.error('Error finding agency staff table:', agencyError);
          return;
        }

        // Load staff from the agency's staff table (excluding current user)
        const { data: staffList, error: staffError } = await supabase
          .from(agency.staff_table_name)
          .select('id, first_name, last_name, role, department, email')
          .neq('id', staffData.id) // Exclude current user
          .order('first_name');

        if (staffError) {
          console.error('Error loading staff:', staffError);
          return;
        }

        recipients = staffList || [];
        console.log('Loaded staff recipients:', recipients);
      } else {
        // Find the agency to get patients table name
        const { data: agency, error: agencyError } = await supabase
          .from('agency')
          .select('patients_table_name')
          .eq('agency_name', staffData.agency_name)
          .single();

        if (agencyError || !agency?.patients_table_name) {
          console.error('Error finding agency patients table:', agencyError);
          return;
        }

        // Load patients from the agency's patients table
        const { data: patientsData, error: patientsError } = await supabase
          .from(agency.patients_table_name)
          .select('id, first_name, last_name, medical_record_number, email')
          .order('first_name');

        if (patientsError) {
          console.error('Error loading patients:', patientsError);
          return;
        }

        recipients = patientsData || [];
        console.log('Loaded patient recipients:', recipients);
      }
      
      setAvailableRecipients(recipients);
    } catch (error) {
      console.error('Error loading recipients:', error);
    } finally {
      setIsLoadingRecipients(false);
    }
  };

  // Handle opening new message modal
  const handleNewMessage = () => {
    setShowNewMessageModal(true);
    loadAvailableRecipients(newMessageForm.recipientType);
  };

  // Handle form changes
  const handleFormChange = (field: string, value: string) => {
    setNewMessageForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    // If recipient type changes, reload recipients
    if (field === 'recipientType') {
      loadAvailableRecipients(value);
    }
  };

  // Handle sending message
  const handleSendMessage = async () => {
    if (!newMessageForm.recipient || !newMessageForm.subject || !newMessageForm.message) {
      alert('Please fill in all required fields');
      return;
    }

    if (!staffData || !agencyData) {
      alert('Staff or agency data not available');
      return;
    }

    try {
      console.log('=== DEBUG: Sending message ===');
      console.log('Message form:', newMessageForm);
      console.log('Staff data:', staffData);
      console.log('Agency data:', agencyData);
      
      // Get recipient info
      const recipient = availableRecipients.find(r => r.id === newMessageForm.recipient);
      console.log('Available recipients:', availableRecipients);
      console.log('Looking for recipient ID:', newMessageForm.recipient);
      console.log('Found recipient:', recipient);
      
      if (!recipient) {
        console.error('Recipient not found in availableRecipients array');
        console.log('Available recipient IDs:', availableRecipients.map(r => r.id));
        alert('Recipient not found. Please try selecting the recipient again.');
        return;
      }

      console.log('Recipient found:', recipient);
      console.log('Recipient ID:', recipient.id);
      console.log('Recipient type:', newMessageForm.recipientType);
      console.log('Staff ID (sender):', staffData.id);

      // Insert into sent table
      const sentData = {
        agency_name: staffData.agency_name,
        sender_id: staffData.id,
        sender_type: 'staff',
        recipient_id: recipient.id,
        recipient_type: newMessageForm.recipientType,
        subject: newMessageForm.subject,
        message_content: newMessageForm.message,
        priority: newMessageForm.priority,
        status: 'sent',
        sent_at: new Date().toISOString(),
        delivered_at: new Date().toISOString() // Set delivered_at when message is sent
      };

      console.log('Inserting into sent table:', agencyData.sent_table_name);
      console.log('Sent data:', sentData);

      const { error: sentError } = await supabase
        .from(agencyData.sent_table_name)
        .insert(sentData);

      if (sentError) {
        console.error('Error saving to sent table:', sentError);
        throw sentError;
      }

      console.log('Successfully saved to sent table');

      // Insert into recipient's inbox table
      const inboxData = {
        agency_name: staffData.agency_name,
        recipient_id: recipient.id,
        recipient_type: newMessageForm.recipientType,
        sender_id: staffData.id,
        sender_type: 'staff',
        subject: newMessageForm.subject,
        message_content: newMessageForm.message,
        priority: newMessageForm.priority,
        status: 'unread'
      };

      console.log('Inserting into inbox table:', agencyData.inbox_table_name);
      console.log('Inbox data:', inboxData);
      console.log('Recipient ID in inbox data:', inboxData.recipient_id);
      console.log('Sender ID in inbox data:', inboxData.sender_id);
      console.log('Recipient type:', inboxData.recipient_type);
      console.log('Sender type:', inboxData.sender_type);

      const { data: inboxResult, error: inboxError } = await supabase
        .from(agencyData.inbox_table_name)
        .insert(inboxData)
        .select();

      if (inboxError) {
        console.error('Error saving to inbox table:', inboxError);
        throw inboxError;
      }

      console.log('Successfully saved to inbox table');
      console.log('Inbox insertion result:', inboxResult);
      console.log('=== DEBUG: Message sent successfully ===');

      alert('Message sent successfully!');
      setShowNewMessageModal(false);
      setNewMessageForm({
        recipient: '',
        recipientType: 'staff',
        subject: '',
        message: '',
        priority: 'medium'
      });
      
      // Switch to sent tab to show the new message
      setActiveTab('sent');
      
      // Reload messages to show the new sent message
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'patient-care':
        return 'text-blue-600 bg-blue-100';
      case 'schedule':
        return 'text-purple-600 bg-purple-100';
      case 'training':
        return 'text-orange-600 bg-orange-100';
      case 'quality':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const unreadCount = inboxMessages.filter(m => m.status === 'unread').length;

  const renderInbox = () => {
    if (messages.length === 0) {
      return (
        <div className="p-8 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">No messages</h3>
          <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">You don't have any messages yet.</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => {
              setSelectedMessage(message);
              // Mark as read if it's unread (for inbox messages)
              if (activeTab === 'inbox' && message.status !== 'read') {
                markMessageAsRead(message.id);
              }
              // Mark as read if it's unread (for sent messages)
              if (activeTab === 'sent' && !message.read_at) {
                markSentMessageAsRead(message.id);
              }
            }}
          className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
            activeTab === 'inbox' 
              ? (message.status === 'read' ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200 border-l-4 border-l-blue-500')
              : 'bg-white border-gray-200'
          } ${selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {message.sender_type === 'staff' ? 'S' : 'P'}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <h4 className={`text-sm font-medium truncate ${
                      activeTab === 'inbox' && message.status !== 'read' ? 'text-gray-900' : 'text-gray-700'
                    } font-[family-name:var(--font-adlam-display)]`}>
                      {activeTab === 'inbox' 
                        ? (senderNames[message.sender_id] || (message.sender_type === 'staff' ? 'Staff' : 'Patient'))
                        : (recipientNames[message.recipient_id] || (message.recipient_type === 'staff' ? 'Staff' : 'Patient'))
                      }
                    </h4>
                    <span className="text-xs text-gray-500">
                      {activeTab === 'inbox' ? message.sender_type : message.recipient_type}
                    </span>
                    {activeTab === 'inbox' && message.status !== 'read' && (
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-600 font-medium">UNREAD</span>
                      </div>
                    )}
                    {activeTab === 'sent' && (
                      <div className="flex items-center space-x-1">
                        {message.read_at ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                            <span className="text-xs text-green-600 font-medium">READ</span>
                          </div>
                        ) : message.delivered_at ? (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                            <span className="text-xs text-yellow-600 font-medium">DELIVERED</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                            <span className="text-xs text-gray-500 font-medium">SENT</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(message.priority)}`}>
                      {message.priority.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {activeTab === 'inbox' 
                        ? new Date(message.created_at).toLocaleDateString()
                        : new Date(message.sent_at).toLocaleDateString()
                      }
                    </span>
                  </div>
                </div>
                <h5 className={`text-sm truncate ${
                  activeTab === 'inbox' && message.status !== 'read' ? 'text-gray-900 font-medium' : 'text-gray-600'
                } font-[family-name:var(--font-adlam-display)]`}>
                  {message.subject}
                </h5>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 font-[family-name:var(--font-adlam-display)]">
                  {message.message_content?.substring(0, 100)}...
                </p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(message.created_at || message.sent_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderMessageDetail = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
      {/* Message Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {selectedMessage?.avatar}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                {selectedMessage?.sender}
              </h2>
              <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                {selectedMessage?.senderRole}
              </p>
              <p className="text-sm text-gray-500 font-[family-name:var(--font-adlam-display)]">
                {selectedMessage?.timestamp}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(selectedMessage?.priority || 'low')}`}>
              {selectedMessage?.priority?.toUpperCase()}
            </span>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Reply className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Forward className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
            {selectedMessage?.subject}
          </h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed font-[family-name:var(--font-adlam-display)]">
              {selectedMessage?.preview}
            </p>
            <p className="text-gray-700 leading-relaxed mt-4 font-[family-name:var(--font-adlam-display)]">
              Please review this information carefully and let me know if you have any questions or need clarification on any points.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4 font-[family-name:var(--font-adlam-display)]">
              Best regards,<br />
              {selectedMessage?.sender}
            </p>
          </div>
        </div>
      </div>

      {/* Reply Section */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex items-start space-x-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">
              {staffData ? `${staffData.first_name?.charAt(0) || ''}${staffData.last_name?.charAt(0) || ''}` : 'SN'}
            </span>
          </div>
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your reply..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-[family-name:var(--font-adlam-display)]"
              rows={3}
            />
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Smile className="w-5 h-5" />
                </button>
              </div>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Staff Nurse Navbar Component */}
      <StaffNurseNavbar activeTab="messages" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Messages
              </h1>
              <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
                Communicate with your healthcare team
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleNewMessage}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]"
              >
                <Plus className="w-4 h-4" />
                <span>New Message</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex">
          {/* Messages List */}
          <div className="w-1/3 border-r border-gray-200 bg-white">
            {/* Tabs */}
            <div className="p-4 border-b border-gray-200">
              <nav className="flex space-x-4">
                {[
                  { id: 'inbox', label: 'Inbox', count: notificationCounts.inbox },
                  { id: 'sent', label: 'Sent', count: notificationCounts.sent },
                  { id: 'drafts', label: 'Drafts', count: notificationCounts.drafts }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-3 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } font-[family-name:var(--font-adlam-display)]`}
                  >
                    <span>{tab.label}</span>
                    {tab.count > 0 && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search and Filters */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center space-x-2 mb-3">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                />
              </div>
              <button className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-[family-name:var(--font-adlam-display)]">
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
            </div>

            {/* Messages List */}
            <div className="overflow-y-auto">
              {isLoadingMessages ? (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    <div className="text-gray-500 font-[family-name:var(--font-adlam-display)]">Loading messages...</div>
                  </div>
                </div>
              ) : (
                <>
                  {activeTab === 'inbox' && renderInbox()}
                  {activeTab === 'sent' && renderInbox()}
                  {activeTab === 'drafts' && (
                    <div className="p-8 text-center">
                      <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">No drafts</h3>
                      <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">Your draft messages will appear here.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="flex-1 flex flex-col">
            {selectedMessage ? (
              renderMessageDetail()
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 font-[family-name:var(--font-adlam-display)]">
                    Select a message to view its content
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* New Message Modal */}
      {showNewMessageModal && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  New Message
                </h2>
                <button
                  onClick={() => setShowNewMessageModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Recipient Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Message Type
                </label>
                <select
                  value={newMessageForm.recipientType}
                  onChange={(e) => handleFormChange('recipientType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                >
                  <option value="staff">Staff Member</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              {/* Recipient Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  To <span className="text-red-500">*</span>
                </label>
                  {isLoadingRecipients ? (
                    <div className="text-center py-4">
                      <div className="inline-flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                        <div className="text-gray-500 font-[family-name:var(--font-adlam-display)]">Loading recipients...</div>
                      </div>
                    </div>
                  ) : (
                  <select
                    value={newMessageForm.recipient}
                    onChange={(e) => handleFormChange('recipient', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                  >
                    <option value="">Select a {newMessageForm.recipientType}...</option>
                    {availableRecipients.map((recipient) => (
                      <option key={recipient.id} value={recipient.id}>
                        {recipient.first_name} {recipient.last_name}
                        {recipient.role && ` - ${recipient.role}`}
                        {recipient.department && ` (${recipient.department})`}
                        {recipient.medical_record_number && ` - MRN: ${recipient.medical_record_number}`}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newMessageForm.subject}
                  onChange={(e) => handleFormChange('subject', e.target.value)}
                  placeholder="Enter message subject..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Priority
                </label>
                <select
                  value={newMessageForm.priority}
                  onChange={(e) => handleFormChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Message Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={newMessageForm.message}
                  onChange={(e) => handleFormChange('message', e.target.value)}
                  placeholder="Type your message..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-[family-name:var(--font-adlam-display)]"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowNewMessageModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-[family-name:var(--font-adlam-display)]"
              >
                Cancel
              </button>
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}