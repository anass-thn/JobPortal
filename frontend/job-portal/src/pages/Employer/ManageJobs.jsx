import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Briefcase,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    Plus,
    CheckCircle2,
    XCircle,
    Pause,
    MapPin,
    Calendar,
    Users,
    DollarSign,
    Loader2,
    AlertCircle,
    MoreVertical,
    Power
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../componenets/layout/DashboardLayout';
import { jobAPI } from '../../utils/api';

const ManageJobs = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchJobs();
    }, [statusFilter]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const params = {
                myJobs: 'true',
                sort: '-createdAt'
            };
            if (statusFilter !== 'all') {
                params.status = statusFilter;
            }
            const response = await jobAPI.listJobs(params);
            if (response.success) {
                setJobs(response.items || []);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            toast.error('Failed to load jobs');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        try {
            setActionLoading(jobId);
            const response = await jobAPI.deleteJob(jobId);
            if (response.success) {
                toast.success('Job deleted successfully');
                setDeleteConfirm(null);
                fetchJobs();
            } else {
                toast.error(response.message || 'Failed to delete job');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            toast.error('Failed to delete job');
        } finally {
            setActionLoading(null);
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            setActionLoading(jobId);
            const response = await jobAPI.updateJob(jobId, { status: newStatus });
            if (response.success) {
                toast.success(`Job ${newStatus} successfully`);
                fetchJobs();
            } else {
                toast.error(response.message || 'Failed to update job status');
            }
        } catch (error) {
            console.error('Error updating job status:', error);
            toast.error('Failed to update job status');
        } finally {
            setActionLoading(null);
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
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
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

    const filteredJobs = jobs.filter(job => {
        const matchesSearch = searchQuery === '' || 
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    const stats = {
        total: jobs.length,
        active: jobs.filter(j => j.status === 'active').length,
        paused: jobs.filter(j => j.status === 'paused').length,
        closed: jobs.filter(j => j.status === 'closed').length
    };

    return (
        <DashboardLayout userType="employer">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Manage Jobs</h1>
                        <p className="text-sm text-gray-600 mt-1">View, edit, and manage your job postings</p>
                    </div>
                    <button
                        onClick={() => navigate('/post-job')}
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#00A7F3] text-white rounded-lg hover:bg-[#0090d6] transition-colors font-medium shadow-sm"
                    >
                        <Plus className="w-5 h-5" />
                        Post New Job
                    </button>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Jobs</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
                            </div>
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-blue-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active</p>
                                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.active}</p>
                            </div>
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Paused</p>
                                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.paused}</p>
                            </div>
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Pause className="w-5 h-5 text-amber-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Closed</p>
                                <p className="text-2xl font-bold text-gray-600 mt-1">{stats.closed}</p>
                            </div>
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <XCircle className="w-5 h-5 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search jobs by title, company, or location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                            />
                        </div>
                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="paused">Paused</option>
                                <option value="closed">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12">
                        <div className="flex flex-col items-center justify-center">
                            <Loader2 className="w-8 h-8 text-[#00A7F3] animate-spin mb-4" />
                            <p className="text-gray-600">Loading jobs...</p>
                        </div>
                    </div>
                ) : filteredJobs.length === 0 ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-12">
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Briefcase className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchQuery ? 'No jobs found' : 'No jobs posted yet'}
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                {searchQuery 
                                    ? 'Try adjusting your search or filters'
                                    : 'Get started by posting your first job'}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => navigate('/post-job')}
                                    className="px-6 py-2.5 bg-[#00A7F3] text-white rounded-lg hover:bg-[#0090d6] transition-colors font-medium"
                                >
                                    <Plus className="w-5 h-5 inline mr-2" />
                                    Post Your First Job
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.map((job) => {
                            const statusBadge = getStatusBadge(job.status);
                            const StatusIcon = statusBadge.icon;
                            const isLoading = actionLoading === job._id;
                            const isDeleting = deleteConfirm === job._id;

                            return (
                                <div
                                    key={job._id}
                                    className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                                >
                                    <div className="p-5">
                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                            {/* Job Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3 mb-3">
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                                                            {job.title}
                                                        </h3>
                                                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase className="w-4 h-4" />
                                                                {job.company}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="w-4 h-4" />
                                                                {job.location}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <DollarSign className="w-4 h-4" />
                                                                {formatSalary(job.salary)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-medium flex-shrink-0 ${statusBadge.className}`}>
                                                        <StatusIcon className={`w-3.5 h-3.5 ${statusBadge.iconColor}`} />
                                                        <span>{statusBadge.label}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-4">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        Posted {formatDate(job.createdAt)}
                                                    </span>
                                                    {job.deadline && (
                                                        <span className="flex items-center gap-1">
                                                            <AlertCircle className="w-3.5 h-3.5" />
                                                            Deadline: {formatDate(job.deadline)}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="w-3.5 h-3.5" />
                                                        {job.views || 0} views
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-3.5 h-3.5" />
                                                        {job.applicationsCount || 0} applications
                                                    </span>
                                                </div>

                                                <div className="flex flex-wrap gap-2">
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                                        {job.type}
                                                    </span>
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                                        {job.experience}
                                                    </span>
                                                    <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                                        {job.category}
                                                    </span>
                                                    {job.featured && (
                                                        <span className="px-2.5 py-1 bg-[#00A7F3]/10 text-[#00A7F3] rounded-md text-xs font-medium">
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            {!isDeleting ? (
                                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">
                                                    <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => navigate(`/employer/job/${job._id}`)}
                                                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                        title="View Job"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </button>
                                                        <button
                                                            onClick={() => navigate(`/post-job?edit=${job._id}`)}
                                                            className="p-2 text-[#00A7F3] hover:bg-[#00A7F3]/10 rounded-lg transition-colors"
                                                            title="Edit Job"
                                                            disabled={isLoading}
                                                        >
                                                            <Edit className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                    
                                                    {/* Status Actions */}
                                                    <div className="flex items-center gap-2">
                                                        {job.status === 'active' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusChange(job._id, 'paused')}
                                                                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                                                                    title="Pause Job"
                                                                    disabled={isLoading}
                                                                >
                                                                    {isLoading ? (
                                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                                    ) : (
                                                                        <Pause className="w-5 h-5" />
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(job._id, 'closed')}
                                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                                    title="Close Job"
                                                                    disabled={isLoading}
                                                                >
                                                                    {isLoading ? (
                                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                                    ) : (
                                                                        <XCircle className="w-5 h-5" />
                                                                    )}
                                                                </button>
                                                            </>
                                                        )}
                                                        {job.status === 'paused' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleStatusChange(job._id, 'active')}
                                                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                    title="Activate Job"
                                                                    disabled={isLoading}
                                                                >
                                                                    {isLoading ? (
                                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                                    ) : (
                                                                        <CheckCircle2 className="w-5 h-5" />
                                                                    )}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(job._id, 'closed')}
                                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                                    title="Close Job"
                                                                    disabled={isLoading}
                                                                >
                                                                    {isLoading ? (
                                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                                    ) : (
                                                                        <XCircle className="w-5 h-5" />
                                                                    )}
                                                                </button>
                                                            </>
                                                        )}
                                                        {job.status === 'closed' && (
                                                            <button
                                                                onClick={() => handleStatusChange(job._id, 'active')}
                                                                className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                                title="Reopen Job"
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? (
                                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                                ) : (
                                                                    <Power className="w-5 h-5" />
                                                                )}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => setDeleteConfirm(job._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete Job"
                                                            disabled={isLoading}
                                                        >
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 flex-shrink-0">
                                                    <p className="text-sm text-gray-600 mr-2">Delete this job?</p>
                                                    <button
                                                        onClick={() => handleDelete(job._id)}
                                                        className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                                        disabled={isLoading}
                                                    >
                                                        {isLoading ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            'Yes, Delete'
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                                                        disabled={isLoading}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
        </div>
        </DashboardLayout>
    );
};

export default ManageJobs;
