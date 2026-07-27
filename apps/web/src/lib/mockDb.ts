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
  { id: '1', employeeId: 'TCH001', user: { firstName: 'Priya', lastName: 'Sharma', email: 'priya@erp.com' } },
  { id: '2', employeeId: 'TCH002', user: { firstName: 'Arun', lastName: 'Patel', email: 'arun@erp.com' } },
  { id: '3', employeeId: 'TCH003', user: { firstName: 'Sneha', lastName: 'Reddy', email: 'sneha@erp.com' } },
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
