import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Briefcase,
    Building2,
    MapPin,
    DollarSign,
    Calendar,
    Users,
    Eye,
    CheckCircle2,
    XCircle,
    Pause,
    Edit,
    ArrowLeft,
    Clock,
    Award,
    FileText,
    Loader2,
    AlertCircle,
    TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../componenets/layout/DashboardLayout';
import { jobAPI, applicationAPI } from '../../utils/api';

const ViewJob = () => {
    const navigate = useNavigate();
    const { jobId } = useParams();
    const [job, setJob] = useState(null);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [applicationsLoading, setApplicationsLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        fetchJobData();
    }, [jobId]);

    const fetchJobData = async () => {
        try {
            setLoading(true);
            const response = await jobAPI.getJobById(jobId);
            if (response.success && response.job) {
                setJob(response.job);
                // Fetch applications for this job
                fetchApplications(response.job._id);
            } else {
                toast.error('Job not found');
                navigate('/manage-jobs');
            }
        } catch (error) {
            console.error('Error fetching job:', error);
            toast.error('Failed to load job details');
            navigate('/manage-jobs');
        } finally {
            setLoading(false);
        }
    };

    const fetchApplications = async (jobId) => {
        try {
            setApplicationsLoading(true);
            const response = await applicationAPI.getJobApplications(jobId, { limit: 10 });
            if (response.success) {
                setApplications(response.items || []);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setApplicationsLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            setActionLoading(true);
            const response = await jobAPI.updateJob(jobId, { status: newStatus });
            if (response.success) {
                toast.success(`Job ${newStatus} successfully`);
                fetchJobData();
            } else {
                toast.error(response.message || 'Failed to update job status');
            }
        } catch (error) {
            console.error('Error updating job status:', error);
            toast.error('Failed to update job status');
        } finally {
            setActionLoading(false);
        }
    };

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

    const formatDate = (dateString) => {
        if (!dateString) return 'Not set';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatSalary = (salary) => {
        if (!salary || (!salary.min && !salary.max)) return 'Not specified';
        const currency = salary.currency || 'USD';
        const period = salary.period === 'hourly' ? '/hr' : salary.period === 'monthly' ? '/mo' : '/yr';
        if (salary.min && salary.max) {
            return `${currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}${period}`;
        }
        if (salary.min) {
            return `${currency} ${salary.min.toLocaleString()}+${period}`;
        }
        if (salary.max) {
            return `Up to ${currency} ${salary.max.toLocaleString()}${period}`;
        }
        return 'Not specified';
    };

    const getApplicantName = (applicant) => {
        if (!applicant) return 'Unknown';
        if (applicant.firstName || applicant.lastName) {
            return `${applicant.firstName || ''} ${applicant.lastName || ''}`.trim();
        }
        return applicant.email || 'Unknown';
    };

    if (loading) {
        return (
            <DashboardLayout userType="employer">
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-[#00A7F3] animate-spin mb-4" />
                    <p className="text-gray-600">Loading job details...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!job) {
        return null;
    }

    const statusBadge = getStatusBadge(job.status);
    const StatusIcon = statusBadge.icon;

    return (
        <DashboardLayout userType="employer">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header with Back Button */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/manage-jobs')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Back to Manage Jobs"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
                        <p className="text-sm text-gray-600 mt-1">View complete information about your job posting</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => navigate(`/post-job?edit=${job._id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#00A7F3] text-white rounded-lg hover:bg-[#0090d6] transition-colors font-medium"
                        >
                            <Edit className="w-4 h-4" />
                            Edit Job
                        </button>
                    </div>
                </div>

                {/* Job Overview Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                            <div className="flex-1">
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-14 h-14 bg-[#00A7F3]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Briefcase className="w-7 h-7 text-[#00A7F3]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm font-medium ${statusBadge.className}`}>
                                                <StatusIcon className={`w-4 h-4 ${statusBadge.iconColor}`} />
                                                <span>{statusBadge.label}</span>
                                            </div>
                                            {job.featured && (
                                                <span className="px-3 py-1 bg-[#00A7F3]/10 text-[#00A7F3] rounded-full text-sm font-medium">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1.5">
                                                <Building2 className="w-4 h-4" />
                                                {job.company}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <MapPin className="w-4 h-4" />
                                                {job.location}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <DollarSign className="w-4 h-4" />
                                                {formatSalary(job.salary)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Status Actions */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                {job.status === 'active' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange('paused')}
                                            className="px-4 py-2 border border-amber-300 text-amber-700 rounded-lg hover:bg-amber-50 transition-colors font-medium text-sm"
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Pause'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('closed')}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                                            disabled={actionLoading}
                                        >
                                            Close
                                        </button>
                                    </>
                                )}
                                {job.status === 'paused' && (
                                    <>
                                        <button
                                            onClick={() => handleStatusChange('active')}
                                            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                                            disabled={actionLoading}
                                        >
                                            {actionLoading ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Activate'
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('closed')}
                                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm"
                                            disabled={actionLoading}
                                        >
                                            Close
                                        </button>
                                    </>
                                )}
                                {job.status === 'closed' && (
                                    <button
                                        onClick={() => handleStatusChange('active')}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-sm"
                                        disabled={actionLoading}
                                    >
                                        {actionLoading ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            'Reopen'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Eye className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                                <p className="text-2xl font-bold text-gray-900">{job.views || 0}</p>
                                <p className="text-xs text-gray-600 mt-1">Total Views</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Users className="w-6 h-6 text-[#00A7F3] mx-auto mb-2" />
                                <p className="text-2xl font-bold text-[#00A7F3]">{job.applicationsCount || 0}</p>
                                <p className="text-xs text-gray-600 mt-1">Applications</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Calendar className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-gray-900">{formatDate(job.createdAt)}</p>
                                <p className="text-xs text-gray-600 mt-1">Posted Date</p>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <Clock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                                <p className="text-sm font-semibold text-gray-900">{formatDate(job.deadline)}</p>
                                <p className="text-xs text-gray-600 mt-1">Deadline</p>
                            </div>
                        </div>
                    </div>

                    {/* Job Information */}
                    <div className="p-6 space-y-6">
                        {/* Basic Info */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#00A7F3]" />
                                Job Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Job Type</p>
                                    <p className="text-gray-900 capitalize">{job.type?.replace('-', ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Experience Level</p>
                                    <p className="text-gray-900 capitalize">{job.experience}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Category</p>
                                    <p className="text-gray-900">{job.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Salary</p>
                                    <p className="text-gray-900">{formatSalary(job.salary)}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                            <div className="prose max-w-none">
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{job.description}</p>
                            </div>
                        </div>

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-[#00A7F3]" />
                                    Requirements
                                </h3>
                                <ul className="space-y-2">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-700">
                                            <span className="text-[#00A7F3] mt-1">•</span>
                                            <span>{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Skills */}
                        {job.skills && job.skills.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-[#00A7F3]" />
                                    Required Skills
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-[#00A7F3]/10 text-[#00A7F3] rounded-lg text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Benefits */}
                        {job.benefits && job.benefits.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-[#00A7F3]" />
                                    Benefits
                                </h3>
                                <ul className="space-y-2">
                                    {job.benefits.map((benefit, index) => (
                                        <li key={index} className="flex items-start gap-2 text-gray-700">
                                            <span className="text-emerald-600 mt-1">✓</span>
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Users className="w-5 h-5 text-[#00A7F3]" />
                            Recent Applications
                        </h3>
                        <button
                            onClick={() => navigate(`/applicants?job=${job._id}`)}
                            className="text-sm text-[#00A7F3] hover:text-[#0090d6] font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <div className="p-6">
                        {applicationsLoading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-[#00A7F3] animate-spin mb-3" />
                                <p className="text-sm text-gray-500">Loading applications...</p>
                            </div>
                        ) : applications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Users className="w-7 h-7 text-gray-400" />
                                </div>
                                <p className="text-gray-600 font-medium mb-1">No applications yet</p>
                                <p className="text-sm text-gray-500">Applications will appear here when candidates apply</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {applications.map((application) => (
                                    <div
                                        key={application._id}
                                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#00A7F3] hover:shadow-sm transition-all cursor-pointer"
                                        onClick={() => navigate(`/applicants?job=${job._id}`)}
                                    >
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#00A7F3] to-[#0090d6] rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-sm">
                                            {application.applicant?.firstName?.[0]?.toUpperCase() || 
                                             application.applicant?.email?.[0]?.toUpperCase() || 
                                             'A'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-gray-900 mb-0.5">
                                                {getApplicantName(application.applicant)}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                Applied {formatDate(application.createdAt)}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            application.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                                            application.status === 'reviewed' ? 'bg-blue-50 text-blue-700' :
                                            application.status === 'shortlisted' ? 'bg-emerald-50 text-emerald-700' :
                                            application.status === 'rejected' ? 'bg-red-50 text-red-700' :
                                            'bg-gray-50 text-gray-700'
                                        }`}>
                                            {application.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ViewJob;

