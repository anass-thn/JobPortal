import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Briefcase, 
  Building2, 
  MapPin, 
  DollarSign, 
  FileText, 
  CheckCircle2,
  X,
  Plus,
  Loader2,
  Calendar,
  Award,
  Users
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../componenets/layout/DashboardLayout';
import { jobAPI } from '../../utils/api';

const JobPostingForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const jobId = searchParams.get('edit');
    const isEditing = !!jobId;
    
    const [isLoading, setIsLoading] = useState(false);
    const [loadingJob, setLoadingJob] = useState(isEditing);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        location: '',
        type: 'full-time',
        category: '',
        experience: 'mid',
        salary: {
            min: '',
            max: '',
            currency: 'USD',
            period: 'yearly'
        },
        requirements: [''],
        skills: [''],
        benefits: [''],
        deadline: '',
        featured: false,
        status: 'active'
    });

    const [errors, setErrors] = useState({});

    // Fetch job data if editing
    useEffect(() => {
        const fetchJobData = async () => {
            if (!jobId) return;
            
            try {
                setLoadingJob(true);
                const response = await jobAPI.getJobById(jobId);
                if (response.success && response.job) {
                    const job = response.job;
                    
                    // Format deadline for date input (YYYY-MM-DD)
                    let deadlineFormatted = '';
                    if (job.deadline) {
                        const deadlineDate = new Date(job.deadline);
                        deadlineFormatted = deadlineDate.toISOString().split('T')[0];
                    }
                    
                    setFormData({
                        title: job.title || '',
                        description: job.description || '',
                        company: job.company || '',
                        location: job.location || '',
                        type: job.type || 'full-time',
                        category: job.category || '',
                        experience: job.experience || 'mid',
                        salary: {
                            min: job.salary?.min || '',
                            max: job.salary?.max || '',
                            currency: job.salary?.currency || 'USD',
                            period: job.salary?.period || 'yearly'
                        },
                        requirements: job.requirements && job.requirements.length > 0 
                            ? job.requirements 
                            : [''],
                        skills: job.skills && job.skills.length > 0 
                            ? job.skills 
                            : [''],
                        benefits: job.benefits && job.benefits.length > 0 
                            ? job.benefits 
                            : [''],
                        deadline: deadlineFormatted,
                        featured: job.featured || false,
                        status: job.status || 'active'
                    });
                } else {
                    toast.error('Failed to load job data');
                    navigate('/manage-jobs');
                }
            } catch (error) {
                console.error('Error fetching job:', error);
                toast.error('Failed to load job data');
                navigate('/manage-jobs');
            } finally {
                setLoadingJob(false);
            }
        };

        fetchJobData();
    }, [jobId, navigate]);

    const jobTypes = [
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'internship', label: 'Internship' },
        { value: 'remote', label: 'Remote' }
    ];

    const experienceLevels = [
        { value: 'entry', label: 'Entry Level' },
        { value: 'mid', label: 'Mid Level' },
        { value: 'senior', label: 'Senior Level' },
        { value: 'executive', label: 'Executive' }
    ];

    const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];
    const salaryPeriods = [
        { value: 'hourly', label: 'Per Hour' },
        { value: 'monthly', label: 'Per Month' },
        { value: 'yearly', label: 'Per Year' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name.startsWith('salary.')) {
            const salaryField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                salary: {
                    ...prev.salary,
                    [salaryField]: type === 'number' ? (value === '' ? '' : parseFloat(value)) : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleArrayChange = (field, index, value) => {
        setFormData(prev => {
            const newArray = [...prev[field]];
            newArray[index] = value;
            return { ...prev, [field]: newArray };
        });
    };

    const addArrayItem = (field) => {
        setFormData(prev => ({
            ...prev,
            [field]: [...prev[field], '']
        }));
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formData.title.trim()) {
            newErrors.title = 'Job title is required';
        } else if (formData.title.length > 100) {
            newErrors.title = 'Job title must be 100 characters or less';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Job description is required';
        } else if (formData.description.length > 5000) {
            newErrors.description = 'Description must be 5000 characters or less';
        }

        if (!formData.company.trim()) {
            newErrors.company = 'Company name is required';
        } else if (formData.company.length > 100) {
            newErrors.company = 'Company name must be 100 characters or less';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'Location is required';
        }

        if (!formData.category.trim()) {
            newErrors.category = 'Category is required';
        }

        // Validate salary if provided
        if (formData.salary.min || formData.salary.max) {
            if (formData.salary.min && formData.salary.max) {
                if (parseFloat(formData.salary.min) > parseFloat(formData.salary.max)) {
                    newErrors.salary = 'Minimum salary cannot be greater than maximum salary';
                }
            }
            if (formData.salary.min && parseFloat(formData.salary.min) < 0) {
                newErrors.salary = 'Salary cannot be negative';
            }
            if (formData.salary.max && parseFloat(formData.salary.max) < 0) {
                newErrors.salary = 'Salary cannot be negative';
            }
        }

        // Validate deadline if provided
        if (formData.deadline) {
            const deadlineDate = new Date(formData.deadline);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (deadlineDate < today) {
                newErrors.deadline = 'Deadline cannot be in the past';
            }
        }

        // Validate requirements, skills, benefits (remove empty strings)
        const filteredRequirements = formData.requirements.filter(r => r.trim());
        const filteredSkills = formData.skills.filter(s => s.trim());
        const filteredBenefits = formData.benefits.filter(b => b.trim());

        if (filteredRequirements.length === 0) {
            newErrors.requirements = 'At least one requirement is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fix the errors in the form');
            return;
        }

        try {
            setIsLoading(true);

            // Prepare data for submission
            const submitData = {
                title: formData.title.trim(),
                description: formData.description.trim(),
                company: formData.company.trim(),
                location: formData.location.trim(),
                type: formData.type,
                category: formData.category.trim(),
                experience: formData.experience,
                status: formData.status,
                featured: formData.featured
            };

            // Add salary if provided
            if (formData.salary.min || formData.salary.max) {
                submitData.salary = {
                    currency: formData.salary.currency,
                    period: formData.salary.period
                };
                if (formData.salary.min) submitData.salary.min = parseFloat(formData.salary.min);
                if (formData.salary.max) submitData.salary.max = parseFloat(formData.salary.max);
            }

            // Add arrays (filter empty strings)
            submitData.requirements = formData.requirements.filter(r => r.trim());
            submitData.skills = formData.skills.filter(s => s.trim());
            submitData.benefits = formData.benefits.filter(b => b.trim());

            // Add deadline if provided
            if (formData.deadline) {
                submitData.deadline = new Date(formData.deadline).toISOString();
            }

            let response;
            if (isEditing) {
                // Update existing job
                response = await jobAPI.updateJob(jobId, submitData);
                if (response.success) {
                    toast.success('Job updated successfully!');
                    navigate('/manage-jobs');
                } else {
                    toast.error(response.message || 'Failed to update job');
                }
            } else {
                // Create new job
                response = await jobAPI.createJob(submitData);
                if (response.success) {
                    toast.success('Job posted successfully!');
                    navigate('/manage-jobs');
                } else {
                    toast.error(response.message || 'Failed to post job');
                }
            }
        } catch (error) {
            console.error(`Error ${isEditing ? 'updating' : 'posting'} job:`, error);
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'post'} job. Please try again.`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout userType="employer">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#00A7F3]/10 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-[#00A7F3]" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isEditing ? 'Edit Job Posting' : 'Post a New Job'}
                                </h1>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {isEditing ? 'Update the details of your job posting' : 'Fill in the details to create your job posting'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    {loadingJob ? (
                        <div className="p-12">
                            <div className="flex flex-col items-center justify-center">
                                <Loader2 className="w-8 h-8 text-[#00A7F3] animate-spin mb-4" />
                                <p className="text-gray-600">Loading job data...</p>
                            </div>
                        </div>
                    ) : (
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-5">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#00A7F3]" />
                                Basic Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Job Title */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Job Title <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g., Senior Software Engineer"
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors ${
                                            errors.title ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        maxLength={100}
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">{formData.title.length}/100 characters</p>
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <Building2 className="w-4 h-4 inline mr-1" />
                                        Company Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Your company name"
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors ${
                                            errors.company ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        maxLength={100}
                                    />
                                    {errors.company && (
                                        <p className="mt-1 text-sm text-red-600">{errors.company}</p>
                                    )}
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <MapPin className="w-4 h-4 inline mr-1" />
                                        Location <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g., New York, NY or Remote"
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors ${
                                            errors.location ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>

                                {/* Job Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Job Type <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                                    >
                                        {jobTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        <Award className="w-4 h-4 inline mr-1" />
                                        Experience Level <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                                    >
                                        {experienceLevels.map(level => (
                                            <option key={level.value} value={level.value}>
                                                {level.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Category */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="e.g., Software Development, Marketing, Sales"
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors ${
                                            errors.category ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Job Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={6}
                                        placeholder="Describe the role, responsibilities, and what you're looking for..."
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors resize-none ${
                                            errors.description ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        maxLength={5000}
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-500">{formData.description.length}/5000 characters</p>
                                </div>
                            </div>
                        </div>

                        {/* Salary Information */}
                        <div className="space-y-5 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-[#00A7F3]" />
                                Salary Information (Optional)
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Min Salary
                                    </label>
                                    <input
                                        type="number"
                                        name="salary.min"
                                        value={formData.salary.min}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Max Salary
                                    </label>
                                    <input
                                        type="number"
                                        name="salary.max"
                                        value={formData.salary.max}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Currency
                                    </label>
                                    <select
                                        name="salary.currency"
                                        value={formData.salary.currency}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                                    >
                                        {currencies.map(currency => (
                                            <option key={currency} value={currency}>{currency}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Period
                                    </label>
                                    <select
                                        name="salary.period"
                                        value={formData.salary.period}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                                    >
                                        {salaryPeriods.map(period => (
                                            <option key={period.value} value={period.value}>
                                                {period.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            {errors.salary && (
                                <p className="text-sm text-red-600">{errors.salary}</p>
                            )}
                        </div>

                        {/* Requirements */}
                        <div className="space-y-4 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-[#00A7F3]" />
                                    Requirements <span className="text-red-500">*</span>
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('requirements')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#00A7F3] hover:bg-[#00A7F3]/10 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Requirement
                                </button>
                            </div>
                            {formData.requirements.map((requirement, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={requirement}
                                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                                        placeholder={`Requirement ${index + 1}`}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                                    />
                                    {formData.requirements.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('requirements', index)}
                                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            {errors.requirements && (
                                <p className="text-sm text-red-600">{errors.requirements}</p>
                            )}
                        </div>

                        {/* Skills */}
                        <div className="space-y-4 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Users className="w-5 h-5 text-[#00A7F3]" />
                                    Required Skills (Optional)
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('skills')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#00A7F3] hover:bg-[#00A7F3]/10 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Skill
                                </button>
                            </div>
                            {formData.skills.map((skill, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={skill}
                                        onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                                        placeholder={`Skill ${index + 1} (e.g., React, Node.js)`}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                                    />
                                    {formData.skills.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('skills', index)}
                                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Benefits */}
                        <div className="space-y-4 pt-6 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <Award className="w-5 h-5 text-[#00A7F3]" />
                                    Benefits (Optional)
                                </h2>
                                <button
                                    type="button"
                                    onClick={() => addArrayItem('benefits')}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#00A7F3] hover:bg-[#00A7F3]/10 rounded-lg transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Benefit
                                </button>
                            </div>
                            {formData.benefits.map((benefit, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={benefit}
                                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                                        placeholder={`Benefit ${index + 1} (e.g., Health Insurance, 401k)`}
                                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors"
                                    />
                                    {formData.benefits.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('benefits', index)}
                                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Additional Options */}
                        <div className="space-y-4 pt-6 border-t border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#00A7F3]" />
                                Additional Options
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Application Deadline (Optional)
                                    </label>
                                    <input
                                        type="date"
                                        name="deadline"
                                        value={formData.deadline}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split('T')[0]}
                                        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#00A7F3] focus:border-[#00A7F3] transition-colors ${
                                            errors.deadline ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                    />
                                    {errors.deadline && (
                                        <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleChange}
                                            className="w-4 h-4 text-[#00A7F3] border-gray-300 rounded focus:ring-[#00A7F3]"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Feature this job</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate('/manage-jobs')}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-[#00A7F3] text-white rounded-lg hover:bg-[#0090d6] transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {isEditing ? 'Updating Job...' : 'Posting Job...'}
                                    </>
                                ) : (
                                    <>
                                        <Briefcase className="w-5 h-5" />
                                        {isEditing ? 'Update Job' : 'Post Job'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default JobPostingForm;
