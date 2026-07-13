import { z } from 'zod';

// ============================================
// Auth Validators
// ============================================
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  phone: z.string().optional(),
  role: z.enum([
    'SUPER_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'HOD', 'TEACHER',
    'STUDENT', 'PARENT', 'ACCOUNTANT', 'LIBRARIAN', 'PLACEMENT_OFFICER',
    'HOSTEL_WARDEN', 'TRANSPORT_MANAGER', 'RECEPTIONIST', 'EXAM_CONTROLLER',
  ]),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const verifyOtpSchema = z.object({
  email: z.string().email('Invalid email address'),
  otp: z.string().length(6, 'OTP must be 6 digits'),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

// ============================================
// College Validators
// ============================================
export const collegeSchema = z.object({
  name: z.string().min(3, 'College name must be at least 3 characters').max(200),
  code: z.string().min(2, 'Code must be at least 2 characters').max(20),
  address: z.string().min(5, 'Address is required').max(500),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  country: z.string().min(2).max(100).default('India'),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
  website: z.string().url().optional().or(z.literal('')),
  logo: z.string().optional(),
});

// ============================================
// Department Validators
// ============================================
export const departmentSchema = z.object({
  name: z.string().min(2, 'Department name is required').max(200),
  code: z.string().min(2).max(20),
  collegeId: z.string().uuid('Invalid college'),
  hodId: z.string().uuid().optional().nullable(),
  description: z.string().max(1000).optional(),
});

// ============================================
// Course Validators
// ============================================
export const courseSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().min(2).max(20),
  departmentId: z.string().uuid(),
  duration: z.number().int().min(1).max(6),
  totalSemesters: z.number().int().min(1).max(12),
  description: z.string().max(1000).optional(),
});

// ============================================
// Subject Validators
// ============================================
export const subjectSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().min(2).max(20),
  courseId: z.string().uuid(),
  semesterId: z.string().uuid(),
  credits: z.number().int().min(1).max(10),
  type: z.enum(['THEORY', 'PRACTICAL', 'ELECTIVE']),
  description: z.string().max(1000).optional(),
});

// ============================================
// Student Validators
// ============================================
export const studentSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  enrollmentNo: z.string().min(3).max(30),
  courseId: z.string().uuid(),
  branchId: z.string().uuid().optional().nullable(),
  sectionId: z.string().uuid().optional().nullable(),
  semesterId: z.string().uuid(),
  batchYear: z.number().int().min(2000).max(2100),
  admissionDate: z.string().or(z.date()),
  dateOfBirth: z.string().or(z.date()).optional(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
  address: z.string().max(500).optional(),
  parentId: z.string().uuid().optional().nullable(),
});

// ============================================
// Teacher Validators
// ============================================
export const teacherSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  phone: z.string().min(10).max(15).optional(),
  employeeId: z.string().min(3).max(30),
  departmentId: z.string().uuid(),
  designation: z.string().min(2).max(100),
  qualification: z.string().min(2).max(200),
  specialization: z.string().max(200).optional(),
  joiningDate: z.string().or(z.date()),
});

// ============================================
// Attendance Validators
// ============================================
export const attendanceSchema = z.object({
  subjectId: z.string().uuid(),
  date: z.string().or(z.date()),
  records: z.array(z.object({
    studentId: z.string().uuid(),
    status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  })),
});

// ============================================
// Fee Validators
// ============================================
export const feeSchema = z.object({
  name: z.string().min(2).max(200),
  courseId: z.string().uuid(),
  semesterId: z.string().uuid(),
  amount: z.number().positive(),
  dueDate: z.string().or(z.date()),
  type: z.enum(['TUITION', 'HOSTEL', 'TRANSPORT', 'LIBRARY', 'LAB', 'EXAM', 'OTHER']),
  description: z.string().max(1000).optional(),
});

export const paymentSchema = z.object({
  studentId: z.string().uuid(),
  feeId: z.string().uuid(),
  amount: z.number().positive(),
  method: z.enum(['CASH', 'CARD', 'UPI', 'NETBANKING', 'CHEQUE']),
  transactionId: z.string().optional(),
  remarks: z.string().max(500).optional(),
});

// ============================================
// Pagination Validator
// ============================================
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.string().optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  search: z.string().optional(),
});

// Export types from validators
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type CollegeInput = z.infer<typeof collegeSchema>;
export type DepartmentInput = z.infer<typeof departmentSchema>;
export type CourseInput = z.infer<typeof courseSchema>;
export type SubjectInput = z.infer<typeof subjectSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type TeacherInput = z.infer<typeof teacherSchema>;
export type AttendanceInput = z.infer<typeof attendanceSchema>;
export type FeeInput = z.infer<typeof feeSchema>;
export type PaymentInput = z.infer<typeof paymentSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
