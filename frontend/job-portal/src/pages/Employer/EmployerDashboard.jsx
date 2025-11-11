import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  FileText, 
  Building2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Pause,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';
import DashboardLayout from '../../componenets/layout/DashboardLayout';
import { jobAPI, applicationAPI } from '../../utils/api';

const EmployerDashboard = () => {
    const navigate = useNavigate();
    const [recentJobs, setRecentJobs] = useState([]);
    const [recentApplications, setRecentApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [jobsResponse, applicationsResponse] = await Promise.all([
                    jobAPI.listJobs({ 
                        myJobs: 'true', 
                        limit: 5,
                        sort: '-createdAt'
                    }),
                    applicationAPI.getEmployerApplications({ 
                        limit: 5 
                    })
                ]);

                if (jobsResponse.success) {
                    setRecentJobs(jobsResponse.items || []);
                }
                if (applicationsResponse.success) {
                    setRecentApplications(applicationsResponse.items || []);
                }
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusBadge = (status) => {
        const configs = {
            active: {
                label: 'Active',
                className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: CheckCircle2,
                iconColor: 'text-emerald-600'
            },
            closed: {
                label: 'Closed',
                className: 'bg-gray-50 text-gray-700 border-gray-200',
                icon: XCircle,
                iconColor: 'text-gray-600'
            },
            paused: {
                label: 'Paused',
                className: 'bg-amber-50 text-amber-700 border-amber-200',
                icon: Pause,
                iconColor: 'text-amber-600'
            }
        };
        return configs[status] || configs.closed;
    };

    const getApplicantName = (applicant) => {
        if (!applicant) return 'Unknown';
        if (applicant.firstName || applicant.lastName) {
            return `${applicant.firstName || ''} ${applicant.lastName || ''}`.trim();
        }
        return applicant.email || 'Unknown';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <DashboardLayout userType="employer">
            <div className="space-y-4 lg:space-y-6">
                {/* Two Main Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                    {/* Recent Job Posts Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3.5 border-b border-gray-200 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 bg-[#00A7F3]/10 rounded-lg flex items-center justify-center">
                                        <Briefcase className="w-4 h-4 text-[#00A7F3]" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900">Recent Job Posts</h3>
                                </div>
                                <button
                                    onClick={() => navigate('/manage-jobs')}
                                    className="flex items-center gap-1.5 text-sm font-medium text-[#00A7F3] hover:text-[#0090d6] transition-colors px-2.5 py-1.5 rounded-md hover:bg-[#00A7F3]/10"
                                >
                                    View All
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Loader2 className="w-6 h-6 text-[#00A7F3] animate-spin mb-3" />
                                    <p className="text-sm text-gray-500">Loading jobs...</p>
                                </div>
                            ) : recentJobs.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Briefcase className="w-7 h-7 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 font-medium mb-1">No job posts yet</p>
                                    <p className="text-sm text-gray-500 mb-4">Get started by posting your first job</p>
                                    <button
                                        onClick={() => navigate('/post-job')}
                                        className="px-4 py-2 bg-[#00A7F3] text-white rounded-lg hover:bg-[#0090d6] transition-colors text-sm font-medium shadow-sm"
                                    >
                                        Post your first job
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {recentJobs.map((job) => {
                                        const statusBadge = getStatusBadge(job.status);
                                        const StatusIcon = statusBadge.icon;
                                        return (
                                            <div
                                                key={job._id}
                                                className="group flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:border-[#00A7F3] hover:shadow-sm transition-all cursor-pointer bg-white"
                                                onClick={() => navigate('/manage-jobs')}
                                            >
                                                <div className="flex-1 min-w-0 pr-3">
                                                    <h4 className="font-semibold text-sm text-gray-900 truncate mb-1 group-hover:text-[#00A7F3] transition-colors">
                                                        {job.title}
                                                    </h4>
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-600 mb-1">
                                                        <span className="truncate">{job.company}</span>
                                                        {job.location && (
                                                            <>
                                                                <span className="text-gray-400">•</span>
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="w-3 h-3" />
                                                                    <span className="truncate">{job.location}</span>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                    {job.createdAt && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                            <Calendar className="w-3 h-3" />
                                                            <span>{formatDate(job.createdAt)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium flex-shrink-0 ${statusBadge.className}`}>
                                                    <StatusIcon className={`w-3 h-3 ${statusBadge.iconColor}`} />
                                                    <span className="hidden sm:inline">{statusBadge.label}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Applications Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3.5 border-b border-gray-200 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-9 h-9 bg-[#00A7F3]/10 rounded-lg flex items-center justify-center">
                                        <Users className="w-4 h-4 text-[#00A7F3]" />
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900">Recent Applications</h3>
                                </div>
                                <button
                                    onClick={() => navigate('/applicants')}
                                    className="flex items-center gap-1.5 text-sm font-medium text-[#00A7F3] hover:text-[#0090d6] transition-colors px-2.5 py-1.5 rounded-md hover:bg-[#00A7F3]/10"
                                >
                                    View All
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                        
                        <div className="p-4">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <Loader2 className="w-6 h-6 text-[#00A7F3] animate-spin mb-3" />
                                    <p className="text-sm text-gray-500">Loading applications...</p>
                                </div>
                            ) : recentApplications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Users className="w-7 h-7 text-gray-400" />
                                    </div>
                                    <p className="text-gray-600 font-medium mb-1">No applications yet</p>
                                    <p className="text-sm text-gray-500">Applications will appear here when candidates apply</p>
                                </div>
                            ) : (
                                <div className="space-y-2.5">
                                    {recentApplications.map((application) => (
                                        <div
                                            key={application._id}
                                            className="group flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-[#00A7F3] hover:shadow-sm transition-all cursor-pointer bg-white"
                                            onClick={() => navigate('/applicants')}
                                        >
                                            <div className="w-10 h-10 bg-gradient-to-br from-[#00A7F3] to-[#0090d6] rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0 shadow-sm">
                                                {application.applicant?.firstName?.[0]?.toUpperCase() || 
                                                 application.applicant?.email?.[0]?.toUpperCase() || 
                                                 'A'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-900 truncate mb-0.5 group-hover:text-[#00A7F3] transition-colors">
                                                    {getApplicantName(application.applicant)}
                                                </h4>
                                                {application.job && (
                                                    <p className="text-xs text-gray-600 truncate mb-1">
                                                        {application.job.title}
                                                    </p>
                                                )}
                                                {application.createdAt && (
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Calendar className="w-3 h-3" />
                                                        <span>{formatDate(application.createdAt)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-4 py-3.5 border-b border-gray-200 bg-gray-50/50">
                        <h3 className="text-base font-semibold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            <button 
                                onClick={() => navigate('/post-job')}
                                className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00A7F3] hover:bg-[#00A7F3]/5 transition-all text-left"
                            >
                                <div className="w-10 h-10 bg-[#00A7F3]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#00A7F3]/20 transition-colors">
                                    <FileText className="w-5 h-5 text-[#00A7F3]" />
                                </div>
                                <p className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-[#00A7F3] transition-colors">Post a New Job</p>
                                <p className="text-xs text-gray-600">Create a new job posting</p>
                            </button>
                            <button 
                                onClick={() => navigate('/applicants')}
                                className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00A7F3] hover:bg-[#00A7F3]/5 transition-all text-left"
                            >
                                <div className="w-10 h-10 bg-[#00A7F3]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#00A7F3]/20 transition-colors">
                                    <Users className="w-5 h-5 text-[#00A7F3]" />
                                </div>
                                <p className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-[#00A7F3] transition-colors">View Applications</p>
                                <p className="text-xs text-gray-600">Review job applications</p>
                            </button>
                            <button 
                                onClick={() => navigate('/company-profile')}
                                className="group p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#00A7F3] hover:bg-[#00A7F3]/5 transition-all text-left sm:col-span-2 lg:col-span-1"
                            >
                                <div className="w-10 h-10 bg-[#00A7F3]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#00A7F3]/20 transition-colors">
                                    <Building2 className="w-5 h-5 text-[#00A7F3]" />
                                </div>
                                <p className="font-semibold text-sm text-gray-900 mb-1 group-hover:text-[#00A7F3] transition-colors">Update Profile</p>
                                <p className="text-xs text-gray-600">Edit company information</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EmployerDashboard;
