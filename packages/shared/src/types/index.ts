// ============================================
// User Roles
// ============================================
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PRINCIPAL = 'PRINCIPAL',
  VICE_PRINCIPAL = 'VICE_PRINCIPAL',
  HOD = 'HOD',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  ACCOUNTANT = 'ACCOUNTANT',
  LIBRARIAN = 'LIBRARIAN',
  PLACEMENT_OFFICER = 'PLACEMENT_OFFICER',
  HOSTEL_WARDEN = 'HOSTEL_WARDEN',
  TRANSPORT_MANAGER = 'TRANSPORT_MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  EXAM_CONTROLLER = 'EXAM_CONTROLLER',
}

// ============================================
// Common Types
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// ============================================
// Auth Types
// ============================================
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  role: UserRole;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserPayload {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  avatar?: string;
}

// ============================================
// Entity Types
// ============================================
export interface College {
  id: string;
  name: string;
  code: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  collegeId: string;
  hodId?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  departmentId: string;
  duration: number;
  totalSemesters: number;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  courseId: string;
  semesterId: string;
  credits: number;
  type: 'THEORY' | 'PRACTICAL' | 'ELECTIVE';
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  userId: string;
  enrollmentNo: string;
  courseId: string;
  branchId?: string;
  sectionId?: string;
  semesterId: string;
  batchYear: number;
  admissionDate: Date;
  isActive: boolean;
}

export interface Teacher {
  id: string;
  userId: string;
  employeeId: string;
  departmentId: string;
  designation: string;
  qualification: string;
  specialization?: string;
  joiningDate: Date;
  isActive: boolean;
}

// ============================================
// Attendance Types
// ============================================
export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  date: Date;
  status: AttendanceStatus;
  method: 'MANUAL' | 'QR' | 'FACE';
}

// ============================================
// Fee Types
// ============================================
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'REFUNDED';
export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'NETBANKING' | 'CHEQUE';

// ============================================
// Exam Types
// ============================================
export type ExamType = 'INTERNAL' | 'MIDTERM' | 'SEMESTER' | 'PRACTICAL' | 'VIVA';
export type GradeType = 'O' | 'A+' | 'A' | 'B+' | 'B' | 'C' | 'D' | 'F';

// ============================================
// Dashboard Stats
// ============================================
export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalDepartments: number;
  averageAttendance: number;
  feeCollection: number;
  pendingFees: number;
  placementsCount: number;
}
