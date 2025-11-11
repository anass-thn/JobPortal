const mongoose = require('mongoose');
require('dotenv').config();
const connectDB = require('../config/database');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// Fake applicant data
const fakeApplicants = [
  {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@example.com',
    password: 'Password123',
    userType: 'jobseeker',
    location: 'New York, NY',
    phone: '+1-555-0101',
    bio: 'Experienced software developer with 5+ years in full-stack development. Passionate about creating scalable web applications.',
    skills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
    resumeUrl: 'https://example.com/resumes/sarah-johnson.pdf'
  },
  {
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@example.com',
    password: 'Password123',
    userType: 'jobseeker',
    location: 'San Francisco, CA',
    phone: '+1-555-0102',
    bio: 'Frontend developer specializing in React and Vue.js. Love building beautiful and intuitive user interfaces.',
    skills: ['React', 'Vue.js', 'JavaScript', 'CSS', 'UI/UX Design'],
    resumeUrl: 'https://example.com/resumes/michael-chen.pdf'
  },
  {
    firstName: 'Emily',
    lastName: 'Rodriguez',
    email: 'emily.rodriguez@example.com',
    password: 'Password123',
    userType: 'jobseeker',
    location: 'Austin, TX',
    phone: '+1-555-0103',
    bio: 'Backend engineer with expertise in microservices architecture and cloud infrastructure.',
    skills: ['Python', 'Django', 'PostgreSQL', 'Docker', 'Kubernetes'],
    resumeUrl: 'https://example.com/resumes/emily-rodriguez.pdf'
  },
  {
    firstName: 'David',
    lastName: 'Kim',
    email: 'david.kim@example.com',
    password: 'Password123',
    userType: 'jobseeker',
    location: 'Seattle, WA',
    phone: '+1-555-0104',
    bio: 'Full-stack developer with a passion for clean code and best practices. Experienced in agile development.',
    skills: ['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB'],
    resumeUrl: 'https://example.com/resumes/david-kim.pdf'
  },
  {
    firstName: 'Jessica',
    lastName: 'Williams',
    email: 'jessica.williams@example.com',
    password: 'Password123',
    userType: 'jobseeker',
    location: 'Boston, MA',
    phone: '+1-555-0105',
    bio: 'UI/UX Designer turned developer. Love creating beautiful and functional web experiences.',
    skills: ['React', 'Figma', 'CSS', 'JavaScript', 'Design Systems'],
    resumeUrl: 'https://example.com/resumes/jessica-williams.pdf'
  },
  {
    firstName: 'James',
    lastName: 'Brown',
    email: 'james.brown@example.com',
    password: 'Password123',
    userType: 'jobseeker',
    location: 'Chicago, IL',
    phone: '+1-555-0106',
    bio: 'Senior software engineer with expertise in enterprise applications and system architecture.',
    skills: ['Java', 'Spring Boot', 'MySQL', 'Redis', 'Microservices'],
    resumeUrl: 'https://example.com/resumes/james-brown.pdf'
  },
  {
    firstName: 'Amanda',
    lastName: 'Taylor',
    email: 'amanda.taylor@example.com',
    password: 'Password123',
    userType: 'jobseeker',
    location: 'Denver, CO',
    phone: '+1-555-0107',
    bio: 'DevOps engineer passionate about automation and infrastructure as code.',
    skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform', 'CI/CD'],
    resumeUrl: 'https://example.com/resumes/amanda-taylor.pdf'
  },
  {
    firstName: 'Robert',
    lastName: 'Martinez',
    email: 'robert.martinez@example.com',
    password: 'Password123',
    userType: 'jobseeker',
    location: 'Los Angeles, CA',
    phone: '+1-555-0108',
    bio: 'Mobile app developer with experience in React Native and native iOS development.',
    skills: ['React Native', 'iOS', 'Swift', 'JavaScript', 'REST APIs'],
    resumeUrl: 'https://example.com/resumes/robert-martinez.pdf'
  }
];

// Cover letters
const coverLetters = [
  `Dear Hiring Manager,

I am writing to express my strong interest in this position. With my extensive experience in software development and passion for creating innovative solutions, I believe I would be a valuable addition to your team.

I am particularly drawn to this opportunity because of the company's commitment to innovation and excellence. I am excited about the possibility of contributing to your team's success.

Thank you for considering my application. I look forward to the opportunity to discuss how my skills and experience align with your needs.

Best regards,`,

  `Hello,

I am thrilled to apply for this position. My background in full-stack development and my enthusiasm for learning new technologies make me an ideal candidate.

I have been following your company's work and am impressed by the quality of your products. I would love to be part of a team that values innovation and collaboration.

I am available for an interview at your convenience and would welcome the opportunity to discuss my qualifications further.

Sincerely,`,

  `Dear Team,

I am excited to submit my application for this role. With my proven track record in software development and my ability to work effectively in team environments, I am confident I can make a positive impact.

What excites me most about this position is the opportunity to work on challenging projects and contribute to meaningful solutions. I am eager to bring my skills and passion to your organization.

Thank you for your time and consideration.

Warm regards,`,

  `Hi there,

I am writing to apply for this position. My experience in developing scalable applications and my commitment to writing clean, maintainable code align well with your requirements.

I am particularly interested in this role because it offers the opportunity to work with cutting-edge technologies and collaborate with a talented team.

I would appreciate the opportunity to discuss how my background, skills, and enthusiasm can contribute to your team's success.

Best,`
];

// Statuses with weights (more pending, fewer hired)
const statuses = ['pending', 'pending', 'pending', 'reviewed', 'reviewed', 'shortlisted', 'rejected', 'hired'];

const getRandomStatus = () => {
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getRandomCoverLetter = () => {
  return coverLetters[Math.floor(Math.random() * coverLetters.length)];
};

const seedApplicants = async () => {
  try {
    await connectDB();
    console.log('Starting to seed applicants...\n');

    // Get all jobs (we'll create applications for these)
    const jobs = await Job.find({ status: { $in: ['active', 'paused'] } });
    
    if (jobs.length === 0) {
      console.log('⚠️  No jobs found. Please create some jobs first before seeding applicants.');
      process.exit(0);
    }

    console.log(`Found ${jobs.length} jobs to create applications for...`);

    // Create or get applicants
    const applicants = [];
    for (const applicantData of fakeApplicants) {
      let applicant = await User.findOne({ email: applicantData.email });
      if (!applicant) {
        applicant = await User.create(applicantData);
        console.log(`✅ Created applicant: ${applicant.firstName} ${applicant.lastName}`);
      } else {
        console.log(`ℹ️  Applicant already exists: ${applicant.firstName} ${applicant.lastName}`);
      }
      applicants.push(applicant);
    }

    // Create applications
    let applicationsCreated = 0;
    let applicationsSkipped = 0;

    for (const job of jobs) {
      // Each job gets 2-5 random applicants
      const numApplications = Math.floor(Math.random() * 4) + 2;
      const selectedApplicants = applicants
        .sort(() => 0.5 - Math.random())
        .slice(0, numApplications);

      for (const applicant of selectedApplicants) {
        // Check if application already exists
        const existingApp = await Application.findOne({
          job: job._id,
          applicant: applicant._id
        });

        if (existingApp) {
          applicationsSkipped++;
          continue;
        }

        const status = getRandomStatus();
        const appliedDate = new Date();
        appliedDate.setDate(appliedDate.getDate() - Math.floor(Math.random() * 30)); // Random date in last 30 days

        const applicationData = {
          job: job._id,
          applicant: applicant._id,
          employer: job.employer,
          status: status,
          coverLetter: getRandomCoverLetter(),
          resumeUrl: applicant.resumeUrl || 'https://example.com/resume.pdf',
          appliedAt: appliedDate,
          reviewedAt: status !== 'pending' ? new Date(appliedDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null
        };

        await Application.create(applicationData);
        applicationsCreated++;
      }
    }

    console.log('\n✅ Seeding completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Applicants: ${applicants.length}`);
    console.log(`   - Applications created: ${applicationsCreated}`);
    console.log(`   - Applications skipped (already exist): ${applicationsSkipped}`);
    console.log(`   - Jobs: ${jobs.length}`);

    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding applicants:', error);
    process.exit(1);
  }
};

// Run the seeder
if (require.main === module) {
  seedApplicants();
}

module.exports = seedApplicants;

