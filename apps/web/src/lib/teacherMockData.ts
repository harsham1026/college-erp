// Teacher Portal Mock Data & API Helpers

export interface TeacherStudentAttendance {
  id: string;
  usn: string;
  studentName: string;
  rollNo: string;
  section: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE';
  remarks?: string;
}

export interface TeacherHomeworkItem {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  course: string;
  branch: string;
  semester: string;
  section: string;
  assignedDate: string;
  dueDate: string;
  description: string;
  attachments: { name: string; size: string; url: string }[];
  totalSubmissions: number;
  totalStudents: number;
  gradedSubmissions: number;
  submissions: {
    studentId: string;
    studentName: string;
    usn: string;
    submittedAt: string;
    file: string;
    score?: number;
    maxScore: number;
    remarks?: string;
    status: 'SUBMITTED' | 'GRADED';
  }[];
}

export interface TeacherAssignmentItem {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  sections: string[];
  deadline: string;
  totalMarks: number;
  description: string;
  attachments: { name: string; size: string; url: string }[];
  submissions: {
    studentId: string;
    studentName: string;
    usn: string;
    section: string;
    submittedAt: string;
    fileName: string;
    score?: number;
    feedback?: string;
    status: 'SUBMITTED' | 'GRADED';
  }[];
}

export interface QuizQuestion {
  id: string;
  questionText: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string;
  marks: number;
}

export interface TeacherQuizItem {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  section: string;
  timeLimitMins: number;
  totalMarks: number;
  assignedDate: string;
  status: 'ACTIVE' | 'DRAFT' | 'COMPLETED';
  questions: QuizQuestion[];
  leaderboard: { rank: number; studentName: string; usn: string; score: number; totalMarks: number; completedTime: string }[];
}

export interface QuestionBankItem {
  id: string;
  subjectCode: string;
  subjectName: string;
  module: string; // e.g. 'Module 1', 'Module 2'
  questionText: string;
  type: 'MCQ' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  marks: number;
  createdDate: string;
}

export interface TeacherMaterialItem {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  category: 'Notes' | 'PDF' | 'PPT' | 'Video' | 'Link';
  module: string;
  uploadedDate: string;
  fileSize?: string;
  fileUrl: string;
  downloadCount: number;
  description: string;
}

export interface StudentProfileItem {
  id: string;
  usn: string;
  fullName: string;
  email: string;
  phone: string;
  course: string;
  branch: string;
  semester: string;
  section: string;
  attendancePercentage: number;
  cgpa: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  academicHistory: { semester: string; sgpa: number; status: string }[];
}

export interface StudentMarksEntry {
  studentId: string;
  usn: string;
  studentName: string;
  subjectCode: string;
  internalMarks: number; // out of 30
  labMarks: number; // out of 20
  assignmentMarks: number; // out of 20
  quizMarks: number; // out of 10
  totalMarks: number; // out of 80
  grade: string;
  status: 'DRAFT' | 'PUBLISHED' | 'LOCKED';
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  targetSection: string;
  createdDate: string;
  scheduledTime?: string;
  author: string;
  attachments: { name: string; url: string }[];
}

export interface LeaveApplicationItem {
  id: string;
  leaveType: 'Casual Leave' | 'Medical Leave' | 'Earned Leave' | 'Half Day';
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  substituteTeacher: string;
  appliedDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminRemarks?: string;
}

export interface CalendarEventItem {
  id: string;
  title: string;
  category: 'Class' | 'Exam' | 'Meeting' | 'Event' | 'Deadline' | 'Holiday' | 'Leave' | 'Personal Note';
  date: string;
  timeSlot: string;
  location?: string;
  description?: string;
}

export interface TeacherTaskItem {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate: string;
  category: 'Grading' | 'Preparation' | 'Administrative' | 'Meeting';
  completed: boolean;
  remarks?: string;
}

// Initial Seed Datasets
export const INITIAL_STUDENT_ATTENDANCE: TeacherStudentAttendance[] = [
  { id: 'sa-1', usn: '1PE23CS001', studentName: 'Aarav Sharma', rollNo: '01', section: 'CSE-A', status: 'PRESENT' },
  { id: 'sa-2', usn: '1PE23CS002', studentName: 'Ananya Rao', rollNo: '02', section: 'CSE-A', status: 'PRESENT' },
  { id: 'sa-3', usn: '1PE23CS003', studentName: 'Bhuvan Kumar', rollNo: '03', section: 'CSE-A', status: 'ABSENT', remarks: 'Medical leave informed' },
  { id: 'sa-4', usn: '1PE23CS004', studentName: 'Deepika Padukone', rollNo: '04', section: 'CSE-A', status: 'PRESENT' },
  { id: 'sa-5', usn: '1PE23CS005', studentName: 'Harsha M.', rollNo: '05', section: 'CSE-A', status: 'PRESENT' },
  { id: 'sa-6', usn: '1PE23CS006', studentName: 'Karthik N.', rollNo: '06', section: 'CSE-A', status: 'LATE', remarks: 'Arrived 15 mins late' },
  { id: 'sa-7', usn: '1PE23CS007', studentName: 'Megha Reddy', rollNo: '07', section: 'CSE-A', status: 'PRESENT' },
  { id: 'sa-8', usn: '1PE23CS008', studentName: 'Nikhil Gowda', rollNo: '08', section: 'CSE-A', status: 'PRESENT' },
];

export const INITIAL_TEACHER_HOMEWORK: TeacherHomeworkItem[] = [
  {
    id: 'thw-1',
    title: 'AVL Tree Rotation Implementation & Analysis',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    course: 'B.Tech',
    branch: 'CSE',
    semester: 'Semester 5',
    section: 'CSE-A',
    assignedDate: '2026-07-28',
    dueDate: '2026-08-07',
    description: 'Implement C++ binary balance rotations for AVL trees and provide space complexity analysis.',
    attachments: [{ name: 'AVL_Specification.pdf', size: '1.2 MB', url: '#' }],
    totalSubmissions: 28,
    totalStudents: 30,
    gradedSubmissions: 20,
    submissions: [
      { studentId: 'sa-5', studentName: 'Harsha M.', usn: '1PE23CS005', submittedAt: '2026-08-01 14:30', file: 'Harsha_AVL_Solution.cpp', score: 19, maxScore: 20, remarks: 'Very clean rotation logic.', status: 'GRADED' },
      { studentId: 'sa-1', studentName: 'Aarav Sharma', usn: '1PE23CS001', submittedAt: '2026-08-02 11:20', file: 'Aarav_AVL_Tree.cpp', maxScore: 20, status: 'SUBMITTED' },
    ],
  },
  {
    id: 'thw-2',
    title: 'Relational Algebra & Normalization Problem Set',
    subjectCode: 'CS302',
    subjectName: 'Database Management Systems',
    course: 'B.Tech',
    branch: 'CSE',
    semester: 'Semester 5',
    section: 'CSE-B',
    assignedDate: '2026-07-25',
    dueDate: '2026-08-05',
    description: 'Decompose schemas to 3NF and BCNF. Submit handwritten or typed PDF.',
    attachments: [{ name: 'DBMS_ProblemSet.pdf', size: '950 KB', url: '#' }],
    totalSubmissions: 32,
    totalStudents: 35,
    gradedSubmissions: 32,
    submissions: [],
  },
];

export const INITIAL_TEACHER_ASSIGNMENTS: TeacherAssignmentItem[] = [
  {
    id: 'tasg-1',
    title: 'Mini Project 1: Banking Hash System',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    sections: ['CSE-A', 'CSE-B'],
    deadline: '2026-08-15',
    totalMarks: 25,
    description: 'Construct a multi-threaded CLI bank transaction processor utilizing Hash maps.',
    attachments: [{ name: 'Project_Spec_Doc.pdf', size: '2.4 MB', url: '#' }],
    submissions: [
      { studentId: 'sa-5', studentName: 'Harsha M.', usn: '1PE23CS005', section: 'CSE-A', submittedAt: '2026-08-03 10:15', fileName: 'Banking_Project_Harsha.zip', score: 24, feedback: 'Excellent hash collision handling!', status: 'GRADED' },
      { studentId: 'sa-2', studentName: 'Ananya Rao', usn: '1PE23CS002', section: 'CSE-A', submittedAt: '2026-08-03 16:40', fileName: 'Banking_System_Ananya.zip', status: 'SUBMITTED' },
    ],
  },
];

export const INITIAL_TEACHER_QUIZZES: TeacherQuizItem[] = [
  {
    id: 'quiz-1',
    title: 'Quiz 1: Tree Traversal & Binary Search Trees',
    subjectCode: 'CS301',
    subjectName: 'Data Structures & Algorithms',
    section: 'CSE-A',
    timeLimitMins: 20,
    totalMarks: 10,
    assignedDate: '2026-07-30',
    status: 'ACTIVE',
    questions: [
      { id: 'q-1', questionText: 'What is the time complexity of searching in a balanced BST?', type: 'MCQ', options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'], correctAnswer: 'O(log N)', marks: 2 },
      { id: 'q-2', questionText: 'In-order traversal of a Binary Search Tree produces sorted sequence.', type: 'TRUE_FALSE', options: ['True', 'False'], correctAnswer: 'True', marks: 2 },
      { id: 'q-3', questionText: 'Define the balance factor formula of an AVL node.', type: 'SHORT_ANSWER', correctAnswer: 'Height(Left Subtree) - Height(Right Subtree)', marks: 6 },
    ],
    leaderboard: [
      { rank: 1, studentName: 'Harsha M.', usn: '1PE23CS005', score: 10, totalMarks: 10, completedTime: '12 mins' },
      { rank: 2, studentName: 'Ananya Rao', usn: '1PE23CS002', score: 9, totalMarks: 10, completedTime: '14 mins' },
      { rank: 3, studentName: 'Aarav Sharma', usn: '1PE23CS001', score: 8, totalMarks: 10, completedTime: '18 mins' },
    ],
  },
];

export const INITIAL_QUESTION_BANK: QuestionBankItem[] = [
  { id: 'qb-1', subjectCode: 'CS301', subjectName: 'Data Structures', module: 'Module 3', questionText: 'Explain Red-Black Tree properties and rotation steps.', type: 'SHORT_ANSWER', correctAnswer: 'Red/black color property, root is black, no consecutive red nodes.', difficulty: 'Hard', marks: 10, createdDate: '2026-07-20' },
  { id: 'qb-2', subjectCode: 'CS302', subjectName: 'DBMS', module: 'Module 2', questionText: 'Which normal form eliminates transitive functional dependency?', type: 'MCQ', options: ['1NF', '2NF', '3NF', 'BCNF'], correctAnswer: '3NF', difficulty: 'Medium', marks: 2, createdDate: '2026-07-22' },
  { id: 'qb-3', subjectCode: 'CS303', subjectName: 'Operating Systems', module: 'Module 4', questionText: 'Virtual memory allows execution of processes larger than physical RAM.', type: 'TRUE_FALSE', options: ['True', 'False'], correctAnswer: 'True', difficulty: 'Easy', marks: 1, createdDate: '2026-07-25' },
];

export const INITIAL_TEACHER_MATERIALS: TeacherMaterialItem[] = [
  { id: 'mat-1', title: 'Module 3 Lecture Slides - Trees & Graphs', subjectCode: 'CS301', subjectName: 'Data Structures', category: 'PPT', module: 'Module 3', uploadedDate: '2026-07-18', fileSize: '8.4 MB', fileUrl: '#', downloadCount: 48, description: 'Complete presentation slides on AVL trees, BST, and B-Trees.' },
  { id: 'mat-2', title: 'DBMS Relational Algebra Solved Examples', subjectCode: 'CS302', subjectName: 'DBMS', category: 'PDF', module: 'Module 2', uploadedDate: '2026-07-22', fileSize: '3.1 MB', fileUrl: '#', downloadCount: 52, description: 'Handwritten problem solutions for relational algebra queries.' },
  { id: 'mat-3', title: 'Process Synchronization Video Explanation', subjectCode: 'CS303', subjectName: 'Operating Systems', category: 'Video', module: 'Module 3', uploadedDate: '2026-07-26', fileUrl: 'https://www.youtube.com/embed/PpsEaqJV_A0', downloadCount: 35, description: 'Video walk-through of Peterson Solution and Semaphores.' },
];

export const INITIAL_STUDENT_PROFILES: StudentProfileItem[] = [
  {
    id: 'sp-1',
    usn: '1PE23CS005',
    fullName: 'Harsha M.',
    email: 'harsha.m@collegepes.edu.in',
    phone: '+91 98765 43210',
    course: 'B.Tech',
    branch: 'Computer Science',
    semester: 'Semester 5',
    section: 'CSE-A',
    attendancePercentage: 91.5,
    cgpa: 8.89,
    parentName: 'Manjunath M.',
    parentPhone: '+91 98765 99999',
    parentEmail: 'manjunath.m@gmail.com',
    academicHistory: [
      { semester: 'Sem 1', sgpa: 8.92, status: 'PASS' },
      { semester: 'Sem 2', sgpa: 8.65, status: 'PASS' },
      { semester: 'Sem 3', sgpa: 9.10, status: 'PASS' },
    ],
  },
  {
    id: 'sp-2',
    usn: '1PE23CS001',
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@collegepes.edu.in',
    phone: '+91 98765 11111',
    course: 'B.Tech',
    branch: 'Computer Science',
    semester: 'Semester 5',
    section: 'CSE-A',
    attendancePercentage: 84.0,
    cgpa: 8.20,
    parentName: 'Ramesh Sharma',
    parentPhone: '+91 98765 88888',
    parentEmail: 'ramesh.sharma@gmail.com',
    academicHistory: [
      { semester: 'Sem 1', sgpa: 8.10, status: 'PASS' },
      { semester: 'Sem 2', sgpa: 8.30, status: 'PASS' },
    ],
  },
];

export const INITIAL_STUDENT_MARKS: StudentMarksEntry[] = [
  { studentId: 'sp-1', usn: '1PE23CS005', studentName: 'Harsha M.', subjectCode: 'CS301', internalMarks: 28, labMarks: 19, assignmentMarks: 19, quizMarks: 9, totalMarks: 75, grade: 'S', status: 'PUBLISHED' },
  { studentId: 'sp-2', usn: '1PE23CS001', studentName: 'Aarav Sharma', subjectCode: 'CS301', internalMarks: 24, labMarks: 17, assignmentMarks: 18, quizMarks: 8, totalMarks: 67, grade: 'A', status: 'PUBLISHED' },
];

export const INITIAL_ANNOUNCEMENTS: AnnouncementItem[] = [
  { id: 'anc-1', title: 'Mid-Term Exam Schedule Update', content: 'The Mid-Term exam for CS301 Data Structures is rescheduled to August 18, 2026 in LHC-201.', targetSection: 'CSE-A', createdDate: '2026-08-01', author: 'Dr. Ramesh Kumar', attachments: [{ name: 'Revised_Exam_Schedule.pdf', url: '#' }] },
  { id: 'anc-2', title: 'Lab Record Submission Deadline', content: 'All students of CSE-B must submit their completed DBMS Lab records by Friday 4:00 PM.', targetSection: 'CSE-B', createdDate: '2026-08-02', author: 'Prof. Anitha Rao', attachments: [] },
];

export const INITIAL_LEAVE_APPLICATIONS: LeaveApplicationItem[] = [
  { id: 'lv-1', leaveType: 'Casual Leave', startDate: '2026-08-12', endDate: '2026-08-13', totalDays: 2, reason: 'Attending IEEE National Conference presentation in Bangalore.', substituteTeacher: 'Prof. Anitha Rao', appliedDate: '2026-08-01', status: 'APPROVED', adminRemarks: 'Approved by HOD' },
  { id: 'lv-2', leaveType: 'Medical Leave', startDate: '2026-08-20', endDate: '2026-08-20', totalDays: 1, reason: 'Scheduled health checkup.', substituteTeacher: 'Dr. Suresh V.', appliedDate: '2026-08-03', status: 'PENDING' },
];

export const INITIAL_CALENDAR_EVENTS: CalendarEventItem[] = [
  { id: 'cal-1', title: 'Data Structures Lecture (CSE-A)', category: 'Class', date: '2026-08-04', timeSlot: '09:00 AM - 10:00 AM', location: 'LHC-201' },
  { id: 'cal-2', title: 'Department Staff Meeting', category: 'Meeting', date: '2026-08-05', timeSlot: '03:00 PM - 04:30 PM', location: 'CS Boardroom' },
  { id: 'cal-3', title: 'VTU Mid-Term Exam Evaluation', category: 'Exam', date: '2026-08-18', timeSlot: '10:00 AM - 01:00 PM', location: 'Exam Hall 3' },
  { id: 'cal-4', title: 'Independence Day Holiday', category: 'Holiday', date: '2026-08-15', timeSlot: 'All Day' },
];

export const INITIAL_TEACHER_TASKS: TeacherTaskItem[] = [
  { id: 'tsk-1', title: 'Grade CSE-A Homework 2 (AVL Trees)', priority: 'HIGH', dueDate: '2026-08-06', category: 'Grading', completed: false, remarks: '20 of 28 graded so far' },
  { id: 'tsk-2', title: 'Prepare Question Paper for Mid-Term 1', priority: 'HIGH', dueDate: '2026-08-08', category: 'Preparation', completed: true },
  { id: 'tsk-3', title: 'Upload Module 4 Study Notes to Portal', priority: 'MEDIUM', dueDate: '2026-08-10', category: 'Administrative', completed: false },
];
