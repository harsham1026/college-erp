'use client';

import React, { useState } from 'react';
import {
  FileText, Download, Printer, User, BookOpen, Code, Briefcase,
  Award, Globe, Sparkles, Check, RefreshCw, LayoutTemplate
} from 'lucide-react';

interface ResumeData {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  summary: string;
  education: { degree: string; college: string; year: string; gpa: string }[];
  skills: { category: string; list: string }[];
  projects: { title: string; tech: string; description: string; link: string }[];
  internships: { role: string; company: string; duration: string; details: string }[];
  certifications: string[];
  achievements: string[];
  languages: string[];
}

export default function StudentResumePage() {
  const [template, setTemplate] = useState<'MODERN' | 'EXECUTIVE' | 'MINIMAL'>('MODERN');

  const [resume, setResume] = useState<ResumeData>({
    fullName: 'Harsha M.',
    email: 'harsha.m@collegepes.edu.in',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka',
    github: 'github.com/harsha-m',
    linkedin: 'linkedin.com/in/harsha-m',
    summary: 'Proactive 3rd Year Computer Science Undergraduate with expertise in Data Structures, Algorithms, Distributed Systems, and Full Stack Web Engineering. Proven hackathon winner with strong problem-solving mindset.',
    education: [
      { degree: 'B.Tech in Computer Science & Engineering', college: 'CollegePES Institute of Technology', year: '2023 - 2027', gpa: '8.89 CGPA' },
      { degree: 'Pre-University College (PCMC)', college: 'National PU College', year: '2021 - 2023', gpa: '95.4%' },
    ],
    skills: [
      { category: 'Languages', list: 'C++, Java, TypeScript, Python, SQL, HTML/CSS' },
      { category: 'Frameworks & Tools', list: 'React, Next.js, Node.js, Express, Docker, Git, Tailwind CSS' },
      { category: 'Core CS', list: 'Data Structures, Operating Systems, DBMS, Computer Networks' },
    ],
    projects: [
      {
        title: 'CollegePES ERP Student & Administration Portal',
        tech: 'Next.js 16, TypeScript, React Query, Recharts, Tailwind CSS',
        description: 'Architected comprehensive university management platform servicing 5,000+ active students with live attendance tracking, fee payment processing, and placement modules.',
        link: 'github.com/collegepes/erp',
      },
      {
        title: 'Smart Agri-IoT Crop Monitoring System',
        tech: 'Python, Raspberry Pi, OpenCV, MQTT, AWS',
        description: 'First prize winner at HackVTU 2026. Real-time soil moisture and automated pest recognition using convolutional neural networks.',
        link: 'github.com/harsha-m/agri-iot',
      },
    ],
    internships: [
      {
        role: 'Software Engineering Intern',
        company: 'TechCorp Solutions',
        duration: 'Jan 2026 - Apr 2026',
        details: 'Optimized API response latency by 35% by implementing Redis caching layer across microservices.',
      },
    ],
    certifications: [
      'AWS Certified Cloud Practitioner (Amazon Web Services)',
      'NPTEL Elite + Gold Certification - Data Structures in Java (IIT Kharagpur)',
    ],
    achievements: [
      '1st Place Winner - HackVTU National 24h Hackathon 2026',
      'Top 1% Rank Nationwide in NPTEL Data Structures Examination',
    ],
    languages: ['English', 'Kannada', 'Hindi'],
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" /> Career Toolkit
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">Resume Builder & Export</h1>
          <p className="text-slate-300 text-sm mt-1">Generate professional ATS-friendly resumes pre-filled with your academic profile</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all"
          >
            <Printer className="w-4 h-4" /> Download Resume PDF
          </button>
        </div>
      </div>

      {/* Template Switcher */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-[#334155] flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <LayoutTemplate className="w-4 h-4 text-indigo-600" /> Choose Resume Layout Template:
        </span>
        <div className="flex items-center gap-2">
          {[
            { key: 'MODERN', label: 'Modern Professional' },
            { key: 'EXECUTIVE', label: 'Executive Clean' },
            { key: 'MINIMAL', label: 'Minimal Tech' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTemplate(t.key as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                template === t.key
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Resume Canvas Preview */}
      <div className="rounded-3xl bg-white text-slate-900 p-8 sm:p-12 shadow-2xl border border-slate-200 max-w-4xl mx-auto space-y-6 print:shadow-none print:border-none print:p-0">
        {/* Header Section */}
        <div className="border-b-2 border-slate-900 pb-6 text-center space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight uppercase text-slate-900">{resume.fullName}</h1>
          <p className="text-xs font-medium text-slate-600 flex flex-wrap items-center justify-center gap-3">
            <span>{resume.email}</span> •
            <span>{resume.phone}</span> •
            <span>{resume.location}</span> •
            <span className="font-semibold">{resume.github}</span> •
            <span className="font-semibold">{resume.linkedin}</span>
          </p>
        </div>

        {/* Profile Summary */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-indigo-900 pb-1 mb-2">
            Professional Summary
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">{resume.summary}</p>
        </div>

        {/* Education */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-indigo-900 pb-1 mb-3">
            Education
          </h2>
          <div className="space-y-2">
            {resume.education.map((edu, idx) => (
              <div key={idx} className="flex justify-between items-start text-xs">
                <div>
                  <h3 className="font-bold text-slate-900">{edu.degree}</h3>
                  <p className="text-slate-600">{edu.college}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-indigo-900">{edu.gpa}</span>
                  <p className="text-slate-500">{edu.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skills */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-indigo-900 pb-1 mb-2">
            Technical Skills
          </h2>
          <div className="space-y-1 text-xs">
            {resume.skills.map((s, idx) => (
              <p key={idx} className="text-slate-800">
                <strong className="text-slate-900">{s.category}:</strong> {s.list}
              </p>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-indigo-900 pb-1 mb-3">
            Projects
          </h2>
          <div className="space-y-3">
            {resume.projects.map((proj, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{proj.title}</span>
                  <span className="text-indigo-800 font-mono">{proj.link}</span>
                </div>
                <p className="text-[11px] font-semibold text-indigo-950">Tech Stack: {proj.tech}</p>
                <p className="text-slate-700 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Experience / Internships */}
        <div>
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-indigo-900 pb-1 mb-3">
            Internship Experience
          </h2>
          <div className="space-y-2">
            {resume.internships.map((exp, idx) => (
              <div key={idx} className="text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.role} - {exp.company}</span>
                  <span className="text-slate-500">{exp.duration}</span>
                </div>
                <p className="text-slate-700">{exp.details}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications & Achievements */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-indigo-900 pb-1 mb-2">
              Certifications
            </h2>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
              {resume.certifications.map((c, idx) => <li key={idx}>{c}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-widest text-indigo-900 border-b border-indigo-900 pb-1 mb-2">
              Honors & Achievements
            </h2>
            <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
              {resume.achievements.map((a, idx) => <li key={idx}>{a}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
