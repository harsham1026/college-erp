// Student Portal Mock Data & API Helpers

export interface AttendanceRecord {
  id: string;
  subjectCode: string;
  subjectName: string;
  facultyName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  lastUpdated: string;
  recentLogs: { date: string; status: 'PRESENT' | 'ABSENT' | 'OD' | 'HOLIDAY'; topic: string }[];
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  assignedDate: string;
  dueDate: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
  description: string;
  attachments: { name: string; size: string; url: string }[];
  submission?: { submittedAt: string; file: string; notes: string; grade?: string; feedback?: string };
}

export interface AssignmentItem {
  id: string;
  title: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  dueDate: string;
  totalMarks: number;
  obtainedMarks?: number;
  status: 'PENDING' | 'SUBMITTED' | 'EVALUATED' | 'LATE';
  description: string;
  instructions: string[];
  submission?: { submittedAt: string; fileName: string; fileUrl: string; feedback?: string };
}

export interface StudyMaterial {
  id: string;
  materialName: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  uploadedDate: string;
  fileType: 'PDF' | 'PPT' | 'NOTES' | 'VIDEO';
  fileSize?: string;
  downloadUrl: string;
  videoUrl?: string;
  description: string;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  room: string;
  type: 'Lecture' | 'Lab' | 'Tutorial';
}

export interface SubjectMarks {
  id: string;
  subjectCode: string;
  subjectName: string;
  credits: number;
  assignmentMarks: number; // out of 20
  labMarks: number; // out of 20
  quizMarks: number; // out of 10
  midTermMarks: number; // out of 50
  totalMarks: number; // out of 100
  percentage: number;
  grade: string;
  status: 'PASS' | 'FAIL';
}

export interface SemesterResult {
  semester: number;
  sgpa: number;
  cgpa: number;
  totalCredits: number;
  earnedCredits: number;
  status: 'PASS' | 'PROMOTED';
  subjects: {
    code: string;
    name: string;
    credits: number;
    internal: number;
    external: number;
    total: number;
    grade: string;
    gradePoints: number;
    status: 'PASS' | 'FAIL';
  }[];
}

export interface FeeItem {
  id: string;
  title: string;
  category: 'Tuition' | 'Hostel' | 'Exam' | 'Library' | 'Bus' | 'Misc';
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING';
}

export interface PaymentTransaction {
  id: string;
  feeTitle: string;
  amount: number;
  date: string;
  paymentMode: 'UPI' | 'Card' | 'NetBanking' | 'Challan';
  transactionRef: string;
  receiptNumber: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}

export interface PlacementDrive {
  id: string;
  companyName: string;
  logo: string;
  jobRole: string;
  packageLpa: number;
  driveDate: string;
  location: string;
  minCgpa: number;
  eligibleBranches: string[];
  description: string;
  requirements: string[];
  rounds: string[];
  applicationDeadline: string;
  status: 'NOT_APPLIED' | 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED';
  appliedDate?: string;
  interviewDate?: string;
  interviewVenue?: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  category: 'Certificates' | 'Hackathons' | 'Sports' | 'Technical Events' | 'NPTEL' | 'Internships' | 'Awards' | 'Competitions';
  issuer: string;
  date: string;
  description: string;
  certificateUrl?: string;
  badgeColor?: string;
  verified: boolean;
}

// Initial Seed Data
export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att-1',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    facultyName: 'Dr. Ramesh Kumar',
    totalClasses: 45,
    attendedClasses: 41,
    percentage: 91.1,
    lastUpdated: '2026-08-01',
    recentLogs: [
      { date: '2026-08-01', status: 'PRESENT', topic: 'Binary Search Trees & AVL Trees' },
      { date: '2026-07-30', status: 'PRESENT', topic: 'Graph Traversal (BFS & DFS)' },
      { date: '2026-07-28', status: 'ABSENT', topic: 'Dijkstra Shortest Path Algorithm' },
      { date: '2026-07-25', status: 'PRESENT', topic: 'Priority Queues and Heaps' },
      { date: '2026-07-23', status: 'PRESENT', topic: 'Hashing and Collision Resolution' },
    ],
  },
  {
    id: 'att-2',
    subjectCode: 'CS302',
    subjectName: 'Database Management Systems',
    facultyName: 'Prof. Anitha Rao',
    totalClasses: 40,
    attendedClasses: 35,
    percentage: 87.5,
    lastUpdated: '2026-08-02',
    recentLogs: [
      { date: '2026-08-02', status: 'PRESENT', topic: 'Transaction Processing & ACID Properties' },
      { date: '2026-07-31', status: 'PRESENT', topic: 'Relational Algebra & Tuple Calculus' },
      { date: '2026-07-29', status: 'PRESENT', topic: 'SQL Joins and Subqueries' },
      { date: '2026-07-27', status: 'ABSENT', topic: 'BCNF and 4NF Normalization' },
      { date: '2026-07-24', status: 'PRESENT', topic: 'Indexing & B+ Trees' },
    ],
  },
  {
    id: 'att-3',
    subjectCode: 'CS303',
    subjectName: 'Operating Systems',
    facultyName: 'Dr. Suresh V.',
    totalClasses: 42,
    attendedClasses: 36,
    percentage: 85.7,
    lastUpdated: '2026-08-01',
    recentLogs: [
      { date: '2026-08-01', status: 'PRESENT', topic: 'CPU Scheduling Algorithms' },
      { date: '2026-07-30', status: 'PRESENT', topic: 'Deadlock Detection & Avoidance' },
      { date: '2026-07-26', status: 'PRESENT', topic: 'Process Synchronization & Semaphores' },
      { date: '2026-07-22', status: 'PRESENT', topic: 'Virtual Memory & Page Replacement' },
    ],
  },
  {
    id: 'att-4',
    subjectCode: 'CS304',
    subjectName: 'Computer Networks',
    facultyName: 'Prof. Meenakshi S.',
    totalClasses: 38,
    attendedClasses: 30,
    percentage: 78.9,
    lastUpdated: '2026-08-03',
    recentLogs: [
      { date: '2026-08-03', status: 'PRESENT', topic: 'TCP/IP Model & Congestion Control' },
      { date: '2026-07-31', status: 'ABSENT', topic: 'Routing Algorithms (OSPF, BGP)' },
      { date: '2026-07-28', status: 'PRESENT', topic: 'Subnetting & CIDR Addressing' },
      { date: '2026-07-25', status: 'ABSENT', topic: 'Data Link Layer & Error Control' },
    ],
  },
  {
    id: 'att-5',
    subjectCode: 'CS305L',
    subjectName: 'DSA Laboratory',
    facultyName: 'Dr. Ramesh Kumar',
    totalClasses: 14,
    attendedClasses: 14,
    percentage: 100.0,
    lastUpdated: '2026-07-31',
    recentLogs: [
      { date: '2026-07-31', status: 'PRESENT', topic: 'Implementation of Graph Traversal' },
      { date: '2026-07-24', status: 'PRESENT', topic: 'Implementation of Heap Tree' },
      { date: '2026-07-17', status: 'PRESENT', topic: 'Implementation of BST Operations' },
    ],
  },
  {
    id: 'att-6',
    subjectCode: 'CS306L',
    subjectName: 'DBMS Laboratory',
    facultyName: 'Prof. Anitha Rao',
    totalClasses: 12,
    attendedClasses: 11,
    percentage: 91.6,
    lastUpdated: '2026-07-29',
    recentLogs: [
      { date: '2026-07-29', status: 'PRESENT', topic: 'Complex SQL Triggers & Procedures' },
      { date: '2026-07-22', status: 'PRESENT', topic: 'PL/SQL Cursor Programming' },
    ],
  },
];

export const INITIAL_HOMEWORK: HomeworkItem[] = [
  {
    id: 'hw-1',
    title: 'AVL Tree & Red-Black Tree Implementation',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    faculty: 'Dr. Ramesh Kumar',
    assignedDate: '2026-07-28',
    dueDate: '2026-08-07',
    status: 'PENDING',
    description: 'Implement insertion and rotation operations for an AVL Tree in C++ or Java. Write unit test cases for double rotations.',
    attachments: [
      { name: 'AVL_Tree_Spec.pdf', size: '1.2 MB', url: '#' },
      { name: 'Sample_TestCases.zip', size: '450 KB', url: '#' },
    ],
  },
  {
    id: 'hw-2',
    title: 'Normalization & ER Diagram Problem Set',
    subject: 'Database Management Systems',
    subjectCode: 'CS302',
    faculty: 'Prof. Anitha Rao',
    assignedDate: '2026-07-25',
    dueDate: '2026-08-04',
    status: 'SUBMITTED',
    description: 'Solve problem set 3 on converting unnormalized schema to 3NF and BCNF. Submit handwritten or typed PDF solution.',
    attachments: [{ name: 'ProblemSet_3_DB.pdf', size: '890 KB', url: '#' }],
    submission: {
      submittedAt: '2026-08-01 14:30',
      file: 'Harsha_DB_Homework3.pdf',
      notes: 'Completed all 5 schema normalization questions with functional dependencies explained.',
    },
  },
  {
    id: 'hw-3',
    title: 'Process Scheduling Simulator Worksheet',
    subject: 'Operating Systems',
    subjectCode: 'CS303',
    faculty: 'Dr. Suresh V.',
    assignedDate: '2026-07-20',
    dueDate: '2026-07-29',
    status: 'GRADED',
    description: 'Calculate average waiting time and turnaround time for FCFS, SJF, Priority, and Round Robin scheduling algorithms.',
    attachments: [{ name: 'OS_Worksheet_2.pdf', size: '620 KB', url: '#' }],
    submission: {
      submittedAt: '2026-07-28 18:10',
      file: 'Harsha_OS_Worksheet2.pdf',
      notes: 'Gantt charts included for all scenarios.',
      grade: '19/20',
      feedback: 'Excellent work! Gantt chart for Round Robin quantum = 4 is very neat.',
    },
  },
  {
    id: 'hw-4',
    title: 'Subnet Masking & IP Routing Exercises',
    subject: 'Computer Networks',
    subjectCode: 'CS304',
    faculty: 'Prof. Meenakshi S.',
    assignedDate: '2026-08-01',
    dueDate: '2026-08-10',
    status: 'PENDING',
    description: 'Divide a Class C network into 8 subnets and write down network ID, broadcast address, and usable IP range for each.',
    attachments: [{ name: 'CN_Subnetting_Assignment.pdf', size: '1.5 MB', url: '#' }],
  },
];

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 'asg-1',
    title: 'Mini Project 1: Bank Account Management System',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    faculty: 'Dr. Ramesh Kumar',
    dueDate: '2026-08-15',
    totalMarks: 25,
    status: 'PENDING',
    description: 'Build a CLI-based account management system utilizing Hash Maps for fast customer lookups and Binary Search Trees for transaction indexing.',
    instructions: [
      'Submit zip file containing source code and a short 2-page report.',
      'Code must compile with GCC or JDK 17 without warnings.',
      'Include clear console menu interface.',
    ],
  },
  {
    id: 'asg-2',
    title: 'E-Commerce Database Schema & SQL Trigger Suite',
    subject: 'Database Management Systems',
    subjectCode: 'CS302',
    faculty: 'Prof. Anitha Rao',
    dueDate: '2026-08-05',
    totalMarks: 20,
    obtainedMarks: 19,
    status: 'EVALUATED',
    description: 'Design complete schema for an online marketplace including inventory tracking triggers and audit log triggers.',
    instructions: ['Include DDL scripts, sample data insertion scripts, and 5 query tests.'],
    submission: {
      submittedAt: '2026-08-03 10:15',
      fileName: 'Ecommerce_DB_Project.zip',
      fileUrl: '#',
      feedback: 'Great database design. Good use of BEFORE UPDATE trigger for stock management.',
    },
  },
  {
    id: 'asg-3',
    title: 'Multi-threaded Producer Consumer Simulation',
    subject: 'Operating Systems',
    subjectCode: 'CS303',
    faculty: 'Dr. Suresh V.',
    dueDate: '2026-08-20',
    totalMarks: 30,
    status: 'PENDING',
    description: 'Implement classic Producer-Consumer problem using POSIX threads and semaphores to prevent race conditions.',
    instructions: [
      'Use C/C++ pthread library.',
      'Demonstrate deadlock-free execution under high load.',
    ],
  },
];

export const INITIAL_MATERIALS: StudyMaterial[] = [
  {
    id: 'mat-1',
    materialName: 'Complete Module 3: Trees & Graphs Lecture Notes',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    faculty: 'Dr. Ramesh Kumar',
    uploadedDate: '2026-07-20',
    fileType: 'PDF',
    fileSize: '4.8 MB',
    downloadUrl: '#',
    description: 'Detailed handwritten and formatted notes covering Binary Trees, BST, AVL Trees, Red-Black Trees, and B-Trees.',
  },
  {
    id: 'mat-2',
    materialName: 'DBMS Module 4 Slides - Relational Algebra & Normalization',
    subject: 'Database Management Systems',
    subjectCode: 'CS302',
    faculty: 'Prof. Anitha Rao',
    uploadedDate: '2026-07-22',
    fileType: 'PPT',
    fileSize: '12.4 MB',
    downloadUrl: '#',
    description: 'Presentation slides with visual examples for 1NF, 2NF, 3NF, BCNF, and 4NF decompositions.',
  },
  {
    id: 'mat-3',
    materialName: 'OS Process Synchronization & Deadlocks Revision Guide',
    subject: 'Operating Systems',
    subjectCode: 'CS303',
    faculty: 'Dr. Suresh V.',
    uploadedDate: '2026-07-27',
    fileType: 'NOTES',
    fileSize: '2.1 MB',
    downloadUrl: '#',
    description: 'Quick exam review notes covering Peterson Solution, Semaphores, Monitors, and Bankers Algorithm.',
  },
  {
    id: 'mat-4',
    materialName: 'Computer Networks TCP/IP Architecture Video Tutorial',
    subject: 'Computer Networks',
    subjectCode: 'CS304',
    faculty: 'Prof. Meenakshi S.',
    uploadedDate: '2026-07-29',
    fileType: 'VIDEO',
    downloadUrl: '#',
    videoUrl: 'https://www.youtube.com/embed/PpsEaqJV_A0',
    description: 'Video explanation on 3-way handshake, TCP windowing, congestion avoidance, and packet header structures.',
  },
  {
    id: 'mat-5',
    materialName: 'VTU Model Question Papers with Solutions (2022-2025)',
    subject: 'Data Structures & Algorithms',
    subjectCode: 'CS301',
    faculty: 'Dr. Ramesh Kumar',
    uploadedDate: '2026-07-15',
    fileType: 'PDF',
    fileSize: '18.2 MB',
    downloadUrl: '#',
    description: 'Solved previous year VTU semester end exam question papers for quick practice.',
  },
];

export const INITIAL_TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: 'tt-1', day: 'Monday', timeSlot: '09:00 AM - 10:00 AM', subject: 'Data Structures & Algorithms', subjectCode: 'CS301', faculty: 'Dr. Ramesh Kumar', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-2', day: 'Monday', timeSlot: '10:00 AM - 11:00 AM', subject: 'Database Management Systems', subjectCode: 'CS302', faculty: 'Prof. Anitha Rao', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-3', day: 'Monday', timeSlot: '11:15 AM - 12:15 PM', subject: 'Operating Systems', subjectCode: 'CS303', faculty: 'Dr. Suresh V.', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-4', day: 'Monday', timeSlot: '01:15 PM - 03:15 PM', subject: 'DSA Laboratory', subjectCode: 'CS305L', faculty: 'Dr. Ramesh Kumar', room: 'CS-Lab 3', type: 'Lab' },

  // Tuesday
  { id: 'tt-5', day: 'Tuesday', timeSlot: '09:00 AM - 10:00 AM', subject: 'Computer Networks', subjectCode: 'CS304', faculty: 'Prof. Meenakshi S.', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-6', day: 'Tuesday', timeSlot: '10:00 AM - 11:00 AM', subject: 'Discrete Mathematical Structures', subjectCode: 'MA301', faculty: 'Dr. K. N. Murthy', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-7', day: 'Tuesday', timeSlot: '11:15 AM - 12:15 PM', subject: 'Data Structures & Algorithms', subjectCode: 'CS301', faculty: 'Dr. Ramesh Kumar', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-8', day: 'Tuesday', timeSlot: '01:15 PM - 03:15 PM', subject: 'DBMS Laboratory', subjectCode: 'CS306L', faculty: 'Prof. Anitha Rao', room: 'CS-Lab 1', type: 'Lab' },

  // Wednesday
  { id: 'tt-9', day: 'Wednesday', timeSlot: '09:00 AM - 10:00 AM', subject: 'Operating Systems', subjectCode: 'CS303', faculty: 'Dr. Suresh V.', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-10', day: 'Wednesday', timeSlot: '10:00 AM - 11:00 AM', subject: 'Database Management Systems', subjectCode: 'CS302', faculty: 'Prof. Anitha Rao', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-11', day: 'Wednesday', timeSlot: '11:15 AM - 12:15 PM', subject: 'Computer Networks', subjectCode: 'CS304', faculty: 'Prof. Meenakshi S.', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-12', day: 'Wednesday', timeSlot: '02:00 PM - 04:00 PM', subject: 'AI & Soft Skills Workshop', subjectCode: 'SK301', faculty: 'External Mentor', room: 'Auditorium', type: 'Tutorial' },

  // Thursday
  { id: 'tt-13', day: 'Thursday', timeSlot: '09:00 AM - 10:00 AM', subject: 'Discrete Mathematical Structures', subjectCode: 'MA301', faculty: 'Dr. K. N. Murthy', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-14', day: 'Thursday', timeSlot: '10:00 AM - 11:00 AM', subject: 'Data Structures & Algorithms', subjectCode: 'CS301', faculty: 'Dr. Ramesh Kumar', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-15', day: 'Thursday', timeSlot: '11:15 AM - 12:15 PM', subject: 'Universal Human Values', subjectCode: 'HV301', faculty: 'Dr. Gayatri Devi', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-16', day: 'Thursday', timeSlot: '01:15 PM - 03:15 PM', subject: 'Operating Systems Lab', subjectCode: 'CS307L', faculty: 'Dr. Suresh V.', room: 'CS-Lab 2', type: 'Lab' },

  // Friday
  { id: 'tt-17', day: 'Friday', timeSlot: '09:00 AM - 10:00 AM', subject: 'Database Management Systems', subjectCode: 'CS302', faculty: 'Prof. Anitha Rao', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-18', day: 'Friday', timeSlot: '10:00 AM - 11:00 AM', subject: 'Computer Networks', subjectCode: 'CS304', faculty: 'Prof. Meenakshi S.', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-19', day: 'Friday', timeSlot: '11:15 AM - 12:15 PM', subject: 'Operating Systems', subjectCode: 'CS303', faculty: 'Dr. Suresh V.', room: 'LHC-201', type: 'Lecture' },
  { id: 'tt-20', day: 'Friday', timeSlot: '02:00 PM - 04:00 PM', subject: 'Competitive Programming Seminar', subjectCode: 'CP301', faculty: 'Dr. Ramesh Kumar', room: 'LHC-201', type: 'Tutorial' },

  // Saturday
  { id: 'tt-21', day: 'Saturday', timeSlot: '09:00 AM - 10:30 AM', subject: 'Aptitude & Reasoning', subjectCode: 'APT301', faculty: 'Placement Cell', room: 'LHC-201', type: 'Tutorial' },
  { id: 'tt-22', day: 'Saturday', timeSlot: '10:45 AM - 12:15 PM', subject: 'Technical Project Mentorship', subjectCode: 'PRJ301', faculty: 'Department Mentors', room: 'CS-Lab 1', type: 'Lab' },
];

export const INITIAL_MARKS: SubjectMarks[] = [
  { id: 'm-1', subjectCode: 'CS301', subjectName: 'Data Structures & Algorithms', credits: 4, assignmentMarks: 19, labMarks: 19, quizMarks: 9, midTermMarks: 45, totalMarks: 92, percentage: 92.0, grade: 'S', status: 'PASS' },
  { id: 'm-2', subjectCode: 'CS302', subjectName: 'Database Management Systems', credits: 4, assignmentMarks: 18, labMarks: 18, quizMarks: 8, midTermMarks: 42, totalMarks: 86, percentage: 86.0, grade: 'A', status: 'PASS' },
  { id: 'm-3', subjectCode: 'CS303', subjectName: 'Operating Systems', credits: 4, assignmentMarks: 17, labMarks: 18, quizMarks: 9, midTermMarks: 44, totalMarks: 88, percentage: 88.0, grade: 'A', status: 'PASS' },
  { id: 'm-4', subjectCode: 'CS304', subjectName: 'Computer Networks', credits: 3, assignmentMarks: 16, labMarks: 16, quizMarks: 7, midTermMarks: 39, totalMarks: 78, percentage: 78.0, grade: 'B', status: 'PASS' },
  { id: 'm-5', subjectCode: 'MA301', subjectName: 'Discrete Mathematical Structures', credits: 3, assignmentMarks: 18, labMarks: 20, quizMarks: 10, midTermMarks: 47, totalMarks: 95, percentage: 95.0, grade: 'S', status: 'PASS' },
  { id: 'm-6', subjectCode: 'CS305L', subjectName: 'DSA Laboratory', credits: 1.5, assignmentMarks: 20, labMarks: 20, quizMarks: 10, midTermMarks: 48, totalMarks: 98, percentage: 98.0, grade: 'S', status: 'PASS' },
];

export const INITIAL_RESULTS: SemesterResult[] = [
  {
    semester: 1,
    sgpa: 8.92,
    cgpa: 8.92,
    totalCredits: 20,
    earnedCredits: 20,
    status: 'PASS',
    subjects: [
      { code: 'MA101', name: 'Engineering Mathematics - I', credits: 4, internal: 46, external: 48, total: 94, grade: 'S', gradePoints: 10, status: 'PASS' },
      { code: 'PH101', name: 'Engineering Physics', credits: 4, internal: 44, external: 42, total: 86, grade: 'A', gradePoints: 9, status: 'PASS' },
      { code: 'EE101', name: 'Basic Electrical Engineering', credits: 3, internal: 41, external: 43, total: 84, grade: 'A', gradePoints: 9, status: 'PASS' },
      { code: 'CV101', name: 'Elements of Civil Engineering', credits: 3, internal: 40, external: 39, total: 79, grade: 'B', gradePoints: 8, status: 'PASS' },
      { code: 'PH105L', name: 'Physics Laboratory', credits: 1.5, internal: 48, external: 48, total: 96, grade: 'S', gradePoints: 10, status: 'PASS' },
      { code: 'CS101L', name: 'C Programming Lab', credits: 1.5, internal: 49, external: 47, total: 96, grade: 'S', gradePoints: 10, status: 'PASS' },
    ],
  },
  {
    semester: 2,
    sgpa: 8.65,
    cgpa: 8.78,
    totalCredits: 20,
    earnedCredits: 20,
    status: 'PASS',
    subjects: [
      { code: 'MA201', name: 'Engineering Mathematics - II', credits: 4, internal: 43, external: 45, total: 88, grade: 'A', gradePoints: 9, status: 'PASS' },
      { code: 'CH201', name: 'Engineering Chemistry', credits: 4, internal: 42, external: 40, total: 82, grade: 'A', gradePoints: 9, status: 'PASS' },
      { code: 'ME201', name: 'Elements of Mechanical Eng.', credits: 3, internal: 38, external: 37, total: 75, grade: 'B', gradePoints: 8, status: 'PASS' },
      { code: 'EC201', name: 'Basic Electronics Engineering', credits: 3, internal: 45, external: 44, total: 89, grade: 'A', gradePoints: 9, status: 'PASS' },
      { code: 'CH205L', name: 'Chemistry Laboratory', credits: 1.5, internal: 47, external: 46, total: 93, grade: 'S', gradePoints: 10, status: 'PASS' },
      { code: 'CA201L', name: 'Computer Aided Engineering Drawing', credits: 1.5, internal: 46, external: 45, total: 91, grade: 'S', gradePoints: 10, status: 'PASS' },
    ],
  },
  {
    semester: 3,
    sgpa: 9.10,
    cgpa: 8.89,
    totalCredits: 21,
    earnedCredits: 21,
    status: 'PASS',
    subjects: [
      { code: 'CS301', name: 'Data Structures & Algorithms', credits: 4, internal: 47, external: 45, total: 92, grade: 'S', gradePoints: 10, status: 'PASS' },
      { code: 'CS302', name: 'Database Management Systems', credits: 4, internal: 43, external: 43, total: 86, grade: 'A', gradePoints: 9, status: 'PASS' },
      { code: 'CS303', name: 'Operating Systems', credits: 4, internal: 44, external: 44, total: 88, grade: 'A', gradePoints: 9, status: 'PASS' },
      { code: 'CS304', name: 'Computer Networks', credits: 3, internal: 39, external: 39, total: 78, grade: 'B', gradePoints: 8, status: 'PASS' },
      { code: 'MA301', name: 'Discrete Mathematics', credits: 3, internal: 48, external: 47, total: 95, grade: 'S', gradePoints: 10, status: 'PASS' },
      { code: 'CS305L', name: 'DSA Laboratory', credits: 1.5, internal: 49, external: 49, total: 98, grade: 'S', gradePoints: 10, status: 'PASS' },
      { code: 'CS306L', name: 'DBMS Laboratory', credits: 1.5, internal: 47, external: 46, total: 93, grade: 'S', gradePoints: 10, status: 'PASS' },
    ],
  },
];

export const INITIAL_FEES: FeeItem[] = [
  { id: 'fee-1', title: 'Tuition Fee - Semester 5', category: 'Tuition', totalAmount: 75000, paidAmount: 75000, pendingAmount: 0, dueDate: '2026-07-15', status: 'PAID' },
  { id: 'fee-2', title: 'College Development & Infra Fee', category: 'Tuition', totalAmount: 15000, paidAmount: 15000, pendingAmount: 0, dueDate: '2026-07-15', status: 'PAID' },
  { id: 'fee-3', title: 'Exam Fee - VTU End Sem', category: 'Exam', totalAmount: 3200, paidAmount: 3200, pendingAmount: 0, dueDate: '2026-08-01', status: 'PAID' },
  { id: 'fee-4', title: 'Hostel & Mess Charges (H2)', category: 'Hostel', totalAmount: 42000, paidAmount: 20000, pendingAmount: 22000, dueDate: '2026-08-25', status: 'PARTIAL' },
  { id: 'fee-5', title: 'Campus Bus Transport (Route 4)', category: 'Bus', totalAmount: 12000, paidAmount: 0, pendingAmount: 12000, dueDate: '2026-09-10', status: 'PENDING' },
];

export const INITIAL_TRANSACTIONS: PaymentTransaction[] = [
  { id: 'txn-101', feeTitle: 'Tuition Fee - Semester 5', amount: 75000, date: '2026-07-10 11:24', paymentMode: 'NetBanking', transactionRef: 'TXN984920412', receiptNumber: 'RCP-2026-00412', status: 'SUCCESS' },
  { id: 'txn-102', feeTitle: 'College Development Fee', amount: 15000, date: '2026-07-10 11:28', paymentMode: 'UPI', transactionRef: 'UPI2026981244', receiptNumber: 'RCP-2026-00413', status: 'SUCCESS' },
  { id: 'txn-103', feeTitle: 'Exam Fee - VTU End Sem', amount: 3200, date: '2026-07-28 16:45', paymentMode: 'Card', transactionRef: 'TXN448102941', receiptNumber: 'RCP-2026-00891', status: 'SUCCESS' },
  { id: 'txn-104', feeTitle: 'Hostel & Mess Charges (Partial)', amount: 20000, date: '2026-08-01 09:15', paymentMode: 'UPI', transactionRef: 'UPI2026881920', receiptNumber: 'RCP-2026-01044', status: 'SUCCESS' },
];

export const INITIAL_PLACEMENTS: PlacementDrive[] = [
  {
    id: 'drive-1',
    companyName: 'Google Cloud India',
    logo: 'https://images.unsplash.com/photo-1573804633927-bf77132966a2?w=100&auto=format&fit=crop&q=60',
    jobRole: 'Software Engineer - University Graduate',
    packageLpa: 24.5,
    driveDate: '2026-08-28',
    location: 'Bangalore / Remote',
    minCgpa: 8.0,
    eligibleBranches: ['CSE', 'ISE', 'ECE'],
    description: 'Develop scalable backend services and cloud infrastructure tools using Go, Java, and Distributed Systems concepts.',
    requirements: ['Strong Data Structures & Algorithms', 'Understanding of OS & System Design Basics', 'Experience with Git & Linux'],
    rounds: ['Online Coding Challenge (2 hrs)', 'Technical Round 1 (DS/Algo)', 'Technical Round 2 (Systems)', 'HR / Culture Fit'],
    applicationDeadline: '2026-08-20',
    status: 'APPLIED',
    appliedDate: '2026-08-01',
  },
  {
    id: 'drive-2',
    companyName: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1642132652075-2b60de685c2d?w=100&auto=format&fit=crop&q=60',
    jobRole: 'Software Development Engineer (SDE-1)',
    packageLpa: 22.0,
    driveDate: '2026-09-05',
    location: 'Hyderabad / Bangalore',
    minCgpa: 7.5,
    eligibleBranches: ['CSE', 'ISE', 'ECE', 'EEE'],
    description: 'Work on Azure Cloud core services, Office 365, and AI integration pipelines.',
    requirements: ['C++ / C# / Java proficiency', 'Problem solving aptitude', 'Good teamwork skills'],
    rounds: ['Online Assessment', 'Technical Round 1', 'Technical Round 2', 'AA Round'],
    applicationDeadline: '2026-08-25',
    status: 'SHORTLISTED',
    appliedDate: '2026-07-28',
    interviewDate: '2026-09-05 10:00 AM',
    interviewVenue: 'Placement Hall A - Block 3',
  },
  {
    id: 'drive-3',
    companyName: 'Amazon Development Centre',
    logo: 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=100&auto=format&fit=crop&q=60',
    jobRole: 'Support Engineer / AWS Associate',
    packageLpa: 16.5,
    driveDate: '2026-09-12',
    location: 'Bangalore',
    minCgpa: 7.0,
    eligibleBranches: ['CSE', 'ISE', 'ECE', 'EEE', 'ME'],
    description: 'Assist AWS enterprise customers in building high availability cloud architectures and troubleshooting network stacks.',
    requirements: ['AWS Practitioner knowledge', 'Networking basics (TCP/IP, DNS)', 'Linux shell scripting'],
    rounds: ['Online Aptitude & Code Test', 'Technical Interview', 'Behavioral Interview'],
    applicationDeadline: '2026-09-01',
    status: 'NOT_APPLIED',
  },
  {
    id: 'drive-4',
    companyName: 'Atlassian India',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    jobRole: 'Frontend Software Engineer',
    packageLpa: 28.0,
    driveDate: '2026-09-20',
    location: 'Bengaluru',
    minCgpa: 8.5,
    eligibleBranches: ['CSE', 'ISE'],
    description: 'Craft beautiful, high performance user interfaces for Jira, Confluence, and Trello using React and TypeScript.',
    requirements: ['Deep React / JS knowledge', 'CSS Architecture & Web Vitals optimization', 'State Management'],
    rounds: ['Screening Test', 'Crafting UI Challenge', 'Architecture & System Design', 'Values Fit'],
    applicationDeadline: '2026-09-10',
    status: 'NOT_APPLIED',
  },
];

export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  {
    id: 'ach-1',
    title: '1st Winner - HackVTU National 24h Hackathon',
    category: 'Hackathons',
    issuer: 'VTU Belagavi & Institution of Engineers',
    date: '2026-06-15',
    description: 'Developed an AI-powered smart agriculture IoT monitoring system with real-time pest detection and automated irrigation.',
    badgeColor: 'from-amber-500 to-yellow-600',
    verified: true,
  },
  {
    id: 'ach-2',
    title: 'NPTEL Elite + Gold Certification - Data Structures in Java',
    category: 'NPTEL',
    issuer: 'IIT Kharagpur / NPTEL',
    date: '2026-05-10',
    description: 'Scored 94% overall in 12-week national online course ranking among top 1% candidates nationwide.',
    badgeColor: 'from-blue-500 to-indigo-600',
    verified: true,
  },
  {
    id: 'ach-3',
    title: 'AWS Certified Cloud Practitioner',
    category: 'Certificates',
    issuer: 'Amazon Web Services',
    date: '2026-04-20',
    description: 'Demonstrated overall understanding of AWS Cloud platform, architectural principles, security practices, and compliance.',
    badgeColor: 'from-orange-500 to-amber-600',
    verified: true,
  },
  {
    id: 'ach-4',
    title: 'Software Development Intern',
    category: 'Internships',
    issuer: 'TechCorp Solutions Pvt Ltd',
    date: '2026-01-15',
    description: 'Built RESTful microservices in Node.js and TypeScript serving 50k daily active users with 99.9% uptime.',
    badgeColor: 'from-emerald-500 to-teal-600',
    verified: true,
  },
  {
    id: 'ach-5',
    title: 'Best Technical Paper Award - IEEE Student Conference',
    category: 'Awards',
    issuer: 'IEEE Bangalore Section',
    date: '2025-11-28',
    description: 'Published research paper titled "Optimizing Distributed Graph Processing for Real-time Social Analytics".',
    badgeColor: 'from-violet-500 to-purple-600',
    verified: true,
  },
];
