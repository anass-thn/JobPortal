import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../componenets/layout/DashboardLayout';

const EmployerDashboard = () => {
    const navigate = useNavigate();

    return (
        <DashboardLayout userType="employer">
            <div className="space-y-6">
                {/* Welcome Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Welcome to Employer Dashboard
                    </h2>
                    <p className="text-gray-600">
                        Manage your job postings, applications, and company profile from here.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Jobs</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">💼</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Applications</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">📄</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Jobs</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                            </div>
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">✅</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Views</p>
                                <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <span className="text-2xl">👁️</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button 
                            onClick={() => navigate('/post-job')}
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00A7F3] hover:bg-[#00A7F3]/5 transition-all text-left"
                        >
                            <p className="font-semibold text-gray-900">Post a New Job</p>
                            <p className="text-sm text-gray-600 mt-1">Create a new job posting</p>
                        </button>
                        <button 
                            onClick={() => navigate('/applicants')}
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00A7F3] hover:bg-[#00A7F3]/5 transition-all text-left"
                        >
                            <p className="font-semibold text-gray-900">View Applications</p>
                            <p className="text-sm text-gray-600 mt-1">Review job applications</p>
                        </button>
                        <button 
                            onClick={() => navigate('/company-profile')}
                            className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00A7F3] hover:bg-[#00A7F3]/5 transition-all text-left"
                        >
                            <p className="font-semibold text-gray-900">Update Profile</p>
                            <p className="text-sm text-gray-600 mt-1">Edit company information</p>
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployerDashboard;
