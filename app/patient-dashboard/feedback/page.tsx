'use client';

import { useState, useEffect } from 'react';
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Filter,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PatientNavbar from '@/app/components/patient-dashboard/PatientNavbar';

export default function PatientFeedbackPage() {
  const [patientData, setPatientData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('give-feedback');
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'general',
    rating: 0,
    title: '',
    message: '',
    anonymous: false
  });

  // Fetch complete patient data from database
  const fetchPatientData = async (patientEmail: string) => {
    try {
      console.log('Fetching patient data for email:', patientEmail);
      
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('email', patientEmail)
        .single();

      if (error) {
        console.error('Error fetching patient data:', error);
        throw error;
      }

      if (data) {
        console.log('Patient data fetched successfully:', data);
        setPatientData(data);
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

  // Mock feedback data
  const feedbackHistory = [
    {
      id: 1,
      type: 'appointment',
      title: 'Great experience with Dr. Smith',
      rating: 5,
      message: 'Dr. Smith was very thorough and took the time to explain everything clearly. The appointment was on time and the staff was friendly.',
      date: '2024-07-15',
      status: 'submitted',
      response: 'Thank you for your positive feedback! We\'re glad to hear about your positive experience with Dr. Smith.'
    },
    {
      id: 2,
      type: 'general',
      title: 'Website navigation could be improved',
      rating: 3,
      message: 'The patient portal is generally good, but I found it difficult to navigate to my health records. Consider adding a search function.',
      date: '2024-07-10',
      status: 'submitted',
      response: 'Thank you for your feedback. We\'re working on improving the navigation and will add a search function in the next update.'
    },
    {
      id: 3,
      type: 'care',
      title: 'Excellent care coordination',
      rating: 5,
      message: 'The care coordination between different specialists has been seamless. Nurse Emily keeps me informed about all my appointments.',
      date: '2024-07-05',
      status: 'submitted',
      response: 'We appreciate your feedback about our care coordination. We\'ll share this with Nurse Emily and the care team.'
    }
  ];

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically submit the feedback to your backend
    console.log('Feedback submitted:', feedbackForm);
    alert('Thank you for your feedback! We appreciate your input.');
    setFeedbackForm({
      type: 'general',
      rating: 0,
      title: '',
      message: '',
      anonymous: false
    });
  };


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Patient Navbar Component */}
      <PatientNavbar activeTab="feedback" />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Feedback & Reviews
              </h1>
              <p className="text-gray-600 font-[family-name:var(--font-adlam-display)]">
                Share your experience and help us improve our services
              </p>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('give-feedback')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm font-[family-name:var(--font-adlam-display)] ${
                    activeTab === 'give-feedback'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Give Feedback
                </button>
                <button
                  onClick={() => setActiveTab('feedback-history')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm font-[family-name:var(--font-adlam-display)] ${
                    activeTab === 'feedback-history'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Feedback History
                </button>
              </nav>
            </div>
          </div>

          {/* Give Feedback Tab */}
          {activeTab === 'give-feedback' && (
            <div className="max-w-2xl">
              <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Feedback Type
                  </label>
                  <select
                    value={feedbackForm.type}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                  >
                    <option value="general">General Feedback</option>
                    <option value="appointment">Appointment Experience</option>
                    <option value="care">Care Quality</option>
                    <option value="staff">Staff Service</option>
                    <option value="facility">Facility & Environment</option>
                    <option value="website">Website/Portal</option>
                  </select>
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Overall Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                        className="p-1"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= feedbackForm.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1 font-[family-name:var(--font-adlam-display)]">
                    {feedbackForm.rating === 0 && 'Click to rate'}
                    {feedbackForm.rating === 1 && 'Poor'}
                    {feedbackForm.rating === 2 && 'Fair'}
                    {feedbackForm.rating === 3 && 'Good'}
                    {feedbackForm.rating === 4 && 'Very Good'}
                    {feedbackForm.rating === 5 && 'Excellent'}
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Title
                  </label>
                  <input
                    type="text"
                    value={feedbackForm.title}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, title: e.target.value })}
                    placeholder="Brief summary of your feedback"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-[family-name:var(--font-adlam-display)]"
                    required
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 font-[family-name:var(--font-adlam-display)]">
                    Detailed Feedback
                  </label>
                  <textarea
                    value={feedbackForm.message}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                    placeholder="Please provide detailed feedback about your experience..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-[family-name:var(--font-adlam-display)]"
                    required
                  />
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={feedbackForm.anonymous}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, anonymous: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700 font-[family-name:var(--font-adlam-display)]">
                    Submit feedback anonymously
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-[family-name:var(--font-adlam-display)]"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Feedback</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Feedback History Tab */}
          {activeTab === 'feedback-history' && (
            <div className="space-y-6">
              {feedbackHistory.map((feedback) => (
                <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          feedback.type === 'appointment' ? 'bg-blue-100 text-blue-800' :
                          feedback.type === 'care' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {feedback.type === 'appointment' ? 'Appointment' :
                           feedback.type === 'care' ? 'Care Quality' : 'General'}
                        </div>
                        <div className="flex items-center space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= feedback.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span className="font-[family-name:var(--font-adlam-display)]">
                            {new Date(feedback.date).toLocaleDateString('en-US', { 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                        {feedback.title}
                      </h3>
                      
                      <p className="text-gray-700 mb-4 font-[family-name:var(--font-adlam-display)]">
                        {feedback.message}
                      </p>
                    </div>
                    
                    <div className="ml-4 flex items-center space-x-1">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-sm text-green-600 font-[family-name:var(--font-adlam-display)]">
                        Submitted
                      </span>
                    </div>
                  </div>
                  
                  {/* Response */}
                  {feedback.response && (
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2 font-[family-name:var(--font-adlam-display)]">
                        Response from Care Team:
                      </h4>
                      <p className="text-gray-700 bg-blue-50 p-3 rounded-lg font-[family-name:var(--font-adlam-display)]">
                        {feedback.response}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
