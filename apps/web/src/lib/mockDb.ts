'use client';

// Default Mock Data definitions
export const DEFAULT_COLLEGES = [
  { id: '1', name: 'Modern Institute of Technology', code: 'MIT', address: '123 Tech Park', city: 'Bangalore', state: 'Karnataka', country: 'India', phone: '080-12345678', email: 'info@mit.edu.in', website: 'https://mit.edu.in', principal: 'Dr. Amit Verma', isActive: true },
  { id: '2', name: 'National Engineering College', code: 'NEC', address: '456 College Road', city: 'Chennai', state: 'Tamil Nadu', country: 'India', phone: '044-98765432', email: 'info@nec.edu.in', website: 'https://nec.edu.in', principal: 'Dr. R. K. Swamy', isActive: true },
  { id: '3', name: 'Global Business School', code: 'GBS', address: '789 Business Hub', city: 'Mumbai', state: 'Maharashtra', country: 'India', phone: '022-55667788', email: 'info@gbs.edu.in', website: 'https://gbs.edu.in', principal: 'Dr. Neha Kapoor', isActive: true },
];

export const DEFAULT_DEPARTMENTS = [
  { id: '1', name: 'Computer Science & Engineering', code: 'CSE', collegeId: '1', hodId: '1', description: 'Department of CS & Engineering', isActive: true },
  { id: '2', name: 'Electronics & Communication', code: 'ECE', collegeId: '1', hodId: '3', description: 'Department of ECE', isActive: true },
  { id: '3', name: 'Mechanical Engineering', code: 'ME', collegeId: '2', hodId: '2', description: 'Department of ME', isActive: true },
  { id: '4', name: 'Business Administration', code: 'MBA', collegeId: '3', hodId: null, description: 'Department of MBA', isActive: true },
];

export const DEFAULT_COURSES = [
  { id: '1', name: 'Bachelor of Technology', code: 'BTECH', duration: 4, totalSemesters: 8, departmentId: '1', description: 'B.Tech Program', isActive: true },
  { id: '2', name: 'Master of Technology', code: 'MTECH', duration: 2, totalSemesters: 4, departmentId: '1', description: 'M.Tech Program', isActive: true },
  { id: '3', name: 'Bachelor of Business Administration', code: 'BBA', duration: 3, totalSemesters: 6, departmentId: '4', description: 'BBA Program', isActive: true },
];

export const DEFAULT_BRANCHES = [
  { id: '1', name: 'Computer Science & Engineering', code: 'CSE-B', courseId: '1', description: 'CSE Branch', isActive: true },
  { id: '2', name: 'Information Technology', code: 'IT-B', courseId: '1', description: 'IT Branch', isActive: true },
  { id: '3', name: 'VLSI Design', code: 'VLSI-B', courseId: '2', description: 'VLSI Branch', isActive: true },
];

export const DEFAULT_SEMESTERS = [
  { id: '1', name: 'Year 1 - Semester 1', number: 1, courseId: '1', startDate: '2026-08-01', endDate: '2026-12-15', isActive: true },
  { id: '2', name: 'Year 1 - Semester 2', number: 2, courseId: '1', startDate: '2027-01-05', endDate: '2027-05-20', isActive: true },
  { id: '3', name: 'Year 2 - Semester 3', number: 3, courseId: '1', startDate: '2027-08-01', endDate: '2027-12-15', isActive: true },
];

export const DEFAULT_SECTIONS = [
  { id: '1', name: 'Section A', branchId: '1', capacity: 60, isActive: true },
  { id: '2', name: 'Section B', branchId: '1', capacity: 60, isActive: true },
  { id: '3', name: 'Section A', branchId: '2', capacity: 50, isActive: true },
];

export const DEFAULT_SUBJECTS: {
  id: string;
  name: string;
  code: string;
  credits: number;
  courseId: string;
  semesterId: string;
  type: 'THEORY' | 'PRACTICAL' | 'ELECTIVE';
  description: string;
  isActive: boolean;
}[] = [
  { id: '1', name: 'Data Structures', code: 'CS101', credits: 4, courseId: '1', semesterId: '1', type: 'THEORY', description: 'Core Data Structures', isActive: true },
  { id: '2', name: 'Data Structures Lab', code: 'CS101L', credits: 2, courseId: '1', semesterId: '1', type: 'PRACTICAL', description: 'Data Structures Lab', isActive: true },
  { id: '3', name: 'Mathematics I', code: 'MA101', credits: 4, courseId: '1', semesterId: '1', type: 'THEORY', description: 'Engineering Mathematics', isActive: true },
];

export const DEFAULT_TIMETABLES = [
  { id: '1', dayOfWeek: 0, startTime: '09:00', endTime: '10:00', subjectId: '1', teacherId: '1', room: 'Room 301', sectionId: '1', isActive: true },
  { id: '2', dayOfWeek: 0, startTime: '10:00', endTime: '11:00', subjectId: '3', teacherId: '2', room: 'Room 301', sectionId: '1', isActive: true },
  { id: '3', dayOfWeek: 1, startTime: '11:15', endTime: '13:15', subjectId: '2', teacherId: '1', room: 'Lab 1', sectionId: '1', isActive: true },
];

export const DEFAULT_TEACHERS = [
  { id: '1', employeeId: 'TCH001', user: { firstName: 'Priya', lastName: 'Sharma', email: 'priya@erp.com', phone: '9876543291' }, departmentId: '1', designation: 'Associate Professor', qualification: 'Ph.D. CS', experience: '8 Years', isActive: true },
  { id: '2', employeeId: 'TCH002', user: { firstName: 'Arun', lastName: 'Patel', email: 'arun@erp.com', phone: '9876543292' }, departmentId: '1', designation: 'Assistant Professor', qualification: 'M.Tech CS', experience: '5 Years', isActive: true },
  { id: '3', employeeId: 'TCH003', user: { firstName: 'Sneha', lastName: 'Reddy', email: 'sneha@erp.com', phone: '9876543293' }, departmentId: '2', designation: 'Professor', qualification: 'Ph.D. Electronics', experience: '12 Years', isActive: true },
];

export const DEFAULT_STUDENTS = [
  { id: '1', enrollmentNo: 'MIT2024001', user: { firstName: 'Rahul', lastName: 'Verma', email: 'rahul@student.erp.com', phone: '9876543210' }, courseId: '1', semesterId: '1', branchId: '1', sectionId: '1', batchYear: 2024, isActive: true },
  { id: '2', enrollmentNo: 'MIT2024002', user: { firstName: 'Meera', lastName: 'Nair', email: 'meera@student.erp.com', phone: '9876543211' }, courseId: '1', semesterId: '1', branchId: '1', sectionId: '1', batchYear: 2024, isActive: true },
  { id: '3', enrollmentNo: 'MIT2024003', user: { firstName: 'Arjun', lastName: 'Menon', email: 'arjun@student.erp.com', phone: '9876543212' }, courseId: '1', semesterId: '1', branchId: '1', sectionId: '2', batchYear: 2024, isActive: true },
  { id: '4', enrollmentNo: 'MIT2024004', user: { firstName: 'Divya', lastName: 'Gupta', email: 'divya@student.erp.com', phone: '9876543213' }, courseId: '1', semesterId: '2', branchId: '2', sectionId: '3', batchYear: 2023, isActive: true },
  { id: '5', enrollmentNo: 'MIT2024005', user: { firstName: 'Karan', lastName: 'Malhotra', email: 'karan@student.erp.com', phone: '9876543214' }, courseId: '3', semesterId: '1', branchId: '3', sectionId: '1', batchYear: 2024, isActive: true },
];

export const DEFAULT_PARENTS = [
  { id: '1', parentName: 'Kishore Verma', relation: 'Father', studentId: '1', phone: '9876543211', email: 'kishore@parents.com', address: '45 Sector B, Bangalore', occupation: 'Software Engineer', isActive: true },
  { id: '2', parentName: 'Suman Nair', relation: 'Mother', studentId: '2', phone: '9876543212', email: 'suman@parents.com', address: '12 Green Glen Layout, Bangalore', occupation: 'Doctor', isActive: true },
];

export const DEFAULT_ATTENDANCES: {
  id: string;
  studentId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT';
  subjectId: string;
  sectionId: string;
}[] = [
  { id: '1', studentId: '1', date: '2026-07-27', status: 'PRESENT', subjectId: '1', sectionId: '1' },
  { id: '2', studentId: '2', date: '2026-07-27', status: 'PRESENT', subjectId: '1', sectionId: '1' },
  { id: '3', studentId: '3', date: '2026-07-27', status: 'ABSENT', subjectId: '1', sectionId: '1' },
];

export const DEFAULT_EXAMS = [
  { id: '1', name: 'Internal Assessment I', subjectId: '1', invigilatorId: '1', date: '2026-08-10', time: '10:00 AM - 12:00 PM', room: 'Room 301', isPublished: true },
  { id: '2', name: 'Final Semester Practical', subjectId: '2', invigilatorId: '2', date: '2026-08-12', time: '09:00 AM - 01:00 PM', room: 'Lab 1', isPublished: false },
];

export const DEFAULT_RESULTS = [
  { id: '1', studentId: '1', examId: '1', subjectId: '1', marksObtained: 85, totalMarks: 100, sgpa: 8.5, cgpa: 8.5 },
  { id: '2', studentId: '2', examId: '1', subjectId: '1', marksObtained: 92, totalMarks: 100, sgpa: 9.2, cgpa: 9.0 },
  { id: '3', studentId: '3', examId: '1', subjectId: '1', marksObtained: 72, totalMarks: 100, sgpa: 7.2, cgpa: 7.4 },
];

export const DEFAULT_FEE_STRUCTURES = [
  { id: '1', name: 'Tuition Fee 2026', courseId: '1', semesterNumber: 1, amount: 75000, description: 'Annual Tuition fee' },
  { id: '2', name: 'Hostel Fee 2026', courseId: '1', semesterNumber: 1, amount: 35000, description: 'Room rent and dining charge' },
];

export const DEFAULT_FEE_COLLECTIONS = [
  { id: '1', studentId: '1', feeStructureId: '1', amountPaid: 75000, balance: 0, paymentMethod: 'UPI', date: '2026-07-20', transactionId: 'TXN123456' },
  { id: '2', studentId: '2', feeStructureId: '1', amountPaid: 50000, balance: 25000, paymentMethod: 'CARD', date: '2026-07-21', transactionId: 'TXN987654' },
];

export const DEFAULT_SCHOLARSHIPS = [
  { id: '1', name: 'Merit Scholarship', amount: 25000, description: 'Awarded to students with CGPA >= 9.0' },
  { id: '2', name: 'Financial Need Support', amount: 15000, description: 'Awarded to students with family income < 3LPA' },
];

export const DEFAULT_SCHOLARSHIP_APPLICATIONS: {
  id: string;
  studentId: string;
  scholarshipId: string;
  applyDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentStatus: 'PENDING' | 'DISBURSED';
}[] = [
  { id: '1', studentId: '2', scholarshipId: '1', applyDate: '2026-07-25', status: 'PENDING', paymentStatus: 'PENDING' },
  { id: '2', studentId: '1', scholarshipId: '2', applyDate: '2026-07-22', status: 'APPROVED', paymentStatus: 'DISBURSED' },
];

// Helper to check if window/localStorage is available
const isClient = typeof window !== 'undefined';

export function getStorageData<T>(key: string, defaults: T[]): T[] {
  if (!isClient) return defaults;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaults;
  }
}

export function saveStorageData<T>(key: string, data: T[]) {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(data));
}

// Perform CRUD Operations locally with filters, search, pagination, and sorting
export function getMockCollection<T extends { id: string }>(
  key: string,
  defaults: T[],
  options: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filter?: (item: T) => boolean;
    searchFields?: (keyof T)[];
  } = {}
) {
  let list = getStorageData<T>(key, defaults);

  // Apply custom filtering first
  if (options.filter) {
    list = list.filter(options.filter);
  }

  // Apply Search
  if (options.search && options.searchFields) {
    const searchLower = options.search.toLowerCase();
    list = list.filter((item) =>
      options.searchFields!.some((field) => {
        const val = item[field];
        if (typeof val === 'string') return val.toLowerCase().includes(searchLower);
        return false;
      })
    );
  }

  // Apply Sorting
  const sortBy = options.sortBy || 'createdAt';
  const sortOrder = options.sortOrder || 'desc';
  list.sort((a: any, b: any) => {
    let valA = a[sortBy];
    let valB = b[sortBy];

    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
    if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const total = list.length;

  // Apply Pagination
  const page = options.page || 1;
  const limit = options.limit || 10;
  const startIndex = (page - 1) * limit;
  const paginatedList = list.slice(startIndex, startIndex + limit);

  return {
    data: paginatedList,
    pagination: {
      total,
      page,
      limit,
    },
  };
}

export function saveMockItem<T extends { id: string }>(
  key: string,
  defaults: T[],
  item: Partial<T> & { id?: string }
): T {
  const list = getStorageData<T>(key, defaults);
  if (item.id) {
    // Edit
    const index = list.findIndex((x) => x.id === item.id);
    const updated = { ...list[index], ...item } as T;
    list[index] = updated;
    saveStorageData(key, list);
    return updated;
  } else {
    // Create
    const newItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString().split('T')[0],
      isActive: (item as any).isActive !== undefined ? (item as any).isActive : true,
    } as unknown as T;
    list.unshift(newItem);
    saveStorageData(key, list);
    return newItem;
  }
}

export function deleteMockItem<T extends { id: string }>(
  key: string,
  defaults: T[],
  id: string
) {
  let list = getStorageData<T>(key, defaults);
  list = list.filter((x) => x.id !== id);
  saveStorageData(key, list);
}
