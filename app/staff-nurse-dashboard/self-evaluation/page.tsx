'use client';

import React, { useState } from 'react';
import {
  Star,
  Target,
  TrendingUp,
  Award,
  CheckCircle,
  Clock,
  FileText,
  Calendar,
  BarChart3,
  Bell,
  Search
} from 'lucide-react';
import StaffNurseNavbar from '@/app/components/staff-nurse-dashboard/StaffNurseNavbar';

export default function StaffNurseSelfEvaluationPage() {
  const [activeTab, setActiveTab] = useState('overview');

  // Sample evaluation data
  const evaluationData = {
    overallScore: 4.2,
    completedEvaluations: 8,
    totalEvaluations: 12,
    lastEvaluation: '2024-01-15',
    nextEvaluation: '2024-04-15',
    goals: [
      {
        id: 1,
        title: 'Improve patient communication',
        description: 'Enhance communication skills with patients and families',
        targetDate: '2024-03-01',
        progress: 75,
        status: 'in-progress'
      },
      {
        id: 2,
        title: 'Complete advanced certification',
        description: 'Obtain Critical Care Nursing certification',
        targetDate: '2024-06-01',
        progress: 45,
        status: 'in-progress'
      },
      {
        id: 3,
        title: 'Reduce medication errors',
        description: 'Achieve zero medication errors for 3 consecutive months',
        targetDate: '2024-02-28',
        progress: 100,
        status: 'completed'
      }
    ],
    competencies: [
      { name: 'Clinical Skills', score: 4.5, maxScore: 5 },
      { name: 'Patient Care', score: 4.3, maxScore: 5 },
      { name: 'Communication', score: 4.0, maxScore: 5 },
      { name: 'Teamwork', score: 4.4, maxScore: 5 },
      { name: 'Documentation', score: 4.1, maxScore: 5 },
      { name: 'Safety Protocols', score: 4.6, maxScore: 5 }
    ],
    recentEvaluations: [
      {
        date: '2024-01-15',
        type: 'Quarterly Review',
        score: 4.2,
        evaluator: 'Dr. Sarah Mitchell',
        status: 'completed'
      },
      {
        date: '2023-10-15',
        type: 'Performance Review',
        score: 4.0,
        evaluator: 'Lisa Anderson',
        status: 'completed'
      },
      {
        date: '2023-07-15',
        type: 'Quarterly Review',
        score: 3.8,
        evaluator: 'Dr. Sarah Mitchell',
        status: 'completed'
      }
    ]
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-yellow-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Overall Performance Score
        </h3>
        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold text-blue-600">
            {evaluationData.overallScore}
          </div>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(evaluationData.overallScore / 5) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1">Out of 5.0</p>
          </div>
        </div>
      </div>

      {/* Evaluation Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{evaluationData.completedEvaluations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Evaluations</p>
              <p className="text-2xl font-bold text-gray-900">{evaluationData.totalEvaluations}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Next Evaluation</p>
              <p className="text-sm font-bold text-gray-900">
                {new Date(evaluationData.nextEvaluation).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Competencies */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Core Competencies
        </h3>
        <div className="space-y-4">
          {evaluationData.competencies.map((competency, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-900">{competency.name}</span>
                  <span className={`text-sm font-bold ${getScoreColor(competency.score, competency.maxScore)}`}>
                    {competency.score}/{competency.maxScore}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getScoreColor(competency.score, competency.maxScore).replace('text-', 'bg-')}`}
                    style={{ width: `${(competency.score / competency.maxScore) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Professional Development Goals
        </h3>
        <div className="space-y-4">
          {evaluationData.goals.map((goal) => (
            <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-base font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                  {goal.title}
                </h4>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  goal.status === 'completed' ? 'bg-green-100 text-green-800' :
                  goal.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {goal.status.replace('-', ' ')}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{goal.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Progress</span>
                    <span className="text-sm font-medium text-gray-900">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Target: {new Date(goal.targetDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 font-[family-name:var(--font-adlam-display)]">
          Evaluation History
        </h3>
        <div className="space-y-4">
          {evaluationData.recentEvaluations.map((evaluation, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-medium text-gray-900 font-[family-name:var(--font-adlam-display)]">
                    {evaluation.type}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {new Date(evaluation.date).toLocaleDateString()} • Evaluated by {evaluation.evaluator}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600">{evaluation.score}</div>
                  <div className="text-sm text-gray-600">out of 5.0</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Staff Nurse Navbar Component */}
      <StaffNurseNavbar activeTab="self-evaluation" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-[family-name:var(--font-adlam-display)]">
                Self-Evaluation
              </h1>
              <p className="text-gray-600 mt-1 font-[family-name:var(--font-adlam-display)]">
                Track your professional development and goals
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
              </button>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search evaluations..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Tabs */}
            <div className="mb-6">
              <nav className="flex space-x-8">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'goals', label: 'Goals', icon: Target },
                  { id: 'history', label: 'History', icon: FileText }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'goals' && renderGoals()}
            {activeTab === 'history' && renderHistory()}
          </div>
        </main>
      </div>
    </div>
  );
}
