import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Users,
    Search,
    Filter,
    Briefcase,
    Calendar,
    Mail,
    FileText,
    Download,
    CheckCircle2,
    XCircle,
    Clock,
    Star,
    User,
    MapPin,
    Loader2,
    Eye,
    ChevronDown,
    ChevronUp,
    X
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../componenets/layout/DashboardLayout';
import { applicationAPI, jobAPI } from '../../utils/api';

const ApplicationViewer = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const jobFilter = searchParams.get('job');
    
    const [applications, setApplications] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [expandedApplication, setExpandedApplication] = useState(null);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState('all');
    const [jobFilterState, setJobFilterState] = useState(jobFilter || 'all');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 10;

    useEffect(() => {
        fetchJobs();
    }, []);

    useEffect(() => {
        fetchApplications();
    }, [statusFilter, jobFilterState, currentPage]);

    const fetchJobs = async () => {
        try {
            const response = await jobAPI.listJobs({ myJobs: 'true', limit: 100 });
            if (response.success) {
                setJobs(response.items || []);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const params = {
                page: currentPage,
                limit: pageSize
            };
            
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            
            const response = await applicationAPI.getEmployerApplications(params);
            
            if (response.success) {
                let filteredApplications = response.items || [];
                
                // Filter by job if selected
                if (jobFilterState !== 'all') {
                    filteredApplications = filteredApplications.filter(
                        app => {
                            const appJobId = app.job?._id || app.job;
                            return appJobId === jobFilterState || appJobId?.toString() === jobFilterState;
                        }
                    );
                }
                
                // Filter by search query
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase();
                    filteredApplications = filteredApplications.filter(app => {
                        const applicantName = `${app.applicant?.firstName || ''} ${app.applicant?.lastName || ''}`.toLowerCase();
                        const jobTitle = app.job?.title?.toLowerCase() || '';
                        const company = app.job?.company?.toLowerCase() || '';
                        const email = app.applicant?.email?.toLowerCase() || '';
                        return applicantName.includes(query) || 
                               jobTitle.includes(query) || 
                               company.includes(query) ||
                               email.includes(query);
                    });
                }
                
                setApplications(filteredApplications);
                // Calculate pagination based on filtered results
                const filteredTotal = filteredApplications.length;
                const calculatedPages = Math.ceil(filteredTotal / pageSize);
                setTotalPages(calculatedPages || 1);
                setTotal(filteredTotal);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            setActionLoading(applicationId);
            const response = await applicationAPI.updateApplicationStatus(applicationId, { status: newStatus });
            if (response.success) {
                toast.success(`Application status updated to ${newStatus}`);
                fetchApplications();
            } else {
                toast.error(response.message || 'Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            toast.error('Failed to update application status');
        } finally {
            setActionLoading(null);
        }
    };

    const getStatusBadge = (status) => {
        const configs = {
            pending: {
                label: 'Pending',
                className: 'bg-yellow-50 text-yellow-700 border-yellow-200',
                icon: Clock,
                iconColor: 'text-yellow-600'
            },
            reviewed: {
                label: 'Reviewed',
                className: 'bg-blue-50 text-blue-700 border-blue-200',
                icon: Eye,
                iconColor: 'text-blue-600'
            },
            shortlisted: {
                label: 'Shortlisted',
                className: 'bg-purple-50 text-purple-700 border-purple-200',
                icon: Star,
                iconColor: 'text-purple-600'
            },
            rejected: {
                label: 'Rejected',
                className: 'bg-red-50 text-red-700 border-red-200',
                icon: XCircle,
                iconColor: 'text-red-600'
            },
            hired: {
                label: 'Hired',
                className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                icon: CheckCircle2,
                iconColor: 'text-emerald-600'
            }
        };
        return configs[status] || configs.pending;
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getApplicantName = (applicant) => {
        if (!applicant) return 'Unknown';
        if (applicant.firstName || applicant.lastName) {
            return `${applicant.firstName || ''} ${applicant.lastName || ''}`.trim();
        }
        return applicant.email || 'Unknown';
    };

    const getApplicantInitials = (applicant) => {
        if (!applicant) return 'U';
        if (applicant.firstName && applicant.lastName) {
            return `${applicant.firstName[0]}${applicant.lastName[0]}`.toUpperCase();
        }
        return (applicant.firstName?.[0] || applicant.email?.[0] || 'U').toUpperCase();
    };

    const handleJobFilterChange = (jobId) => {
        setJobFilterState(jobId);
        setCurrentPage(1);
        if (jobId === 'all') {
            setSearchParams({});
        } else {
            setSearchParams({ job: jobId });
        }
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchApplications();
    };

    return (
        <DashboardLayout userType="employer">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
                        <p className="text-sm text-gray-600 mt-1">Manage and review all job applications</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Total Applications</p>
                        <p className="text-2xl font-bold text-[#00A7F3]">{total}</p>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by applicant name, email, or job title..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                            />
                        </div>
                        
                        {/* Job Filter */}
                        <div className="flex items-center gap-2">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <select
                                value={jobFilterState}
                                onChange={(e) => handleJobFilterChange(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors min-w-[200px]"
                            >
                                <option value="all">All Jobs</option>
                                {jobs.map((job) => (
                                    <option key={job._id} value={job._id}>
                                        {job.title} - {job.company}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="reviewed">Reviewed</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="rejected">Rejected</option>
                                <option value="hired">Hired</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Applications List */}
                {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-[#00A7F3] animate-spin mb-4" />
                            <p className="text-gray-600">Loading applications...</p>
                        </div>
                    </div>
                ) : applications.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchQuery || statusFilter !== 'all' || jobFilterState !== 'all' 
                                    ? 'No applications found' 
                                    : 'No applications yet'}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {searchQuery || statusFilter !== 'all' || jobFilterState !== 'all'
                                    ? 'Try adjusting your search or filters'
                                    : 'Applications will appear here when candidates apply to your jobs'}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((application) => {
                            const statusBadge = getStatusBadge(application.status);
                            const StatusIcon = statusBadge.icon;
                            const isExpanded = expandedApplication === application._id;
                            const isLoading = actionLoading === application._id;

                            return (
                                <div
                                    key={application._id}
                                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all"
                                >
                                    {/* Application Header */}
                                    <div className="p-5">
                                        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                            {/* Applicant Info */}
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <div className="w-14 h-14 bg-gradient-to-br from-[#00A7F3] to-[#0090d6] rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0 shadow-sm">
                                                    {getApplicantInitials(application.applicant)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            {getApplicantName(application.applicant)}
                                                        </h3>
                                                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium ${statusBadge.className}`}>
                                                            <StatusIcon className={`w-3.5 h-3.5 ${statusBadge.iconColor}`} />
                                                            <span>{statusBadge.label}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1.5">
                                                                <Briefcase className="w-4 h-4" />
                                                                {application.job?.title || 'N/A'}
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Mail className="w-4 h-4" />
                                                                {application.applicant?.email || 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5" />
                                                                Applied {formatDate(application.createdAt)}
                                                            </span>
                                                            {application.reviewedAt && (
                                                                <span className="flex items-center gap-1.5">
                                                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                                                    Reviewed {formatDate(application.reviewedAt)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <button
                                                    onClick={() => setExpandedApplication(isExpanded ? null : application._id)}
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
                                                >
                                                    {isExpanded ? (
                                                        <>
                                                            <ChevronUp className="w-4 h-4" />
                                                            Hide Details
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Eye className="w-4 h-4" />
                                                            View Details
                                                        </>
                                                    )}
                                                </button>
                                                
                                                {/* Status Change Dropdown */}
                                                <div className="relative">
                                                    <select
                                                        value={application.status}
                                                        onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                                        disabled={isLoading}
                                                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors text-sm font-medium appearance-none bg-white pr-8 disabled:opacity-50"
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="reviewed">Reviewed</option>
                                                        <option value="shortlisted">Shortlisted</option>
                                                        <option value="rejected">Rejected</option>
                                                        <option value="hired">Hired</option>
                                                    </select>
                                                    {isLoading && (
                                                        <Loader2 className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-[#00A7F3]" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-200 bg-gray-50 p-5 space-y-4">
                                            {/* Cover Letter */}
                                            {application.coverLetter && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-[#00A7F3]" />
                                                        Cover Letter
                                                    </h4>
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                                                            {application.coverLetter}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Resume and Documents */}
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                                    <Download className="w-4 h-4 text-[#00A7F3]" />
                                                    Documents
                                                </h4>
                                                <div className="space-y-2">
                                                    {application.resumeUrl && (
                                                        <a
                                                            href={application.resumeUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#00A7F3] hover:bg-[#00A7F3]/5 transition-colors text-sm font-medium text-gray-700"
                                                        >
                                                            <FileText className="w-4 h-4" />
                                                            View Resume
                                                            <Download className="w-4 h-4 ml-auto" />
                                                        </a>
                                                    )}
                                                    {application.additionalDocuments && application.additionalDocuments.length > 0 && (
                                                        <div className="space-y-2">
                                                            {application.additionalDocuments.map((doc, index) => (
                                                                <a
                                                                    key={index}
                                                                    href={doc.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-[#00A7F3] hover:bg-[#00A7F3]/5 transition-colors text-sm font-medium text-gray-700"
                                                                >
                                                                    <FileText className="w-4 h-4" />
                                                                    {doc.name || `Document ${index + 1}`}
                                                                    <Download className="w-4 h-4 ml-auto" />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Notes */}
                                            {application.notes && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <p className="text-sm text-gray-700">{application.notes}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Pagination */}
                {!loading && applications.length > 0 && totalPages > 1 && (
                    <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <p className="text-sm text-gray-600">
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, total)} of {total} applications
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2 text-sm text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
        </div>
        </DashboardLayout>
    );
};

export default ApplicationViewer;
