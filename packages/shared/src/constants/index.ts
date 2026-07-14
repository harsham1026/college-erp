// ============================================
// Application Constants
// ============================================

export const APP_NAME = 'CollegePES';
export const APP_VERSION = '1.0.0';

// ============================================
// Pagination
// ============================================
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// ============================================
// Role Labels
// ============================================
export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  PRINCIPAL: 'Principal',
  VICE_PRINCIPAL: 'Vice Principal',
  HOD: 'Head of Department',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
  PARENT: 'Parent',
  ACCOUNTANT: 'Accountant',
  LIBRARIAN: 'Librarian',
  PLACEMENT_OFFICER: 'Placement Officer',
  HOSTEL_WARDEN: 'Hostel Warden',
  TRANSPORT_MANAGER: 'Transport Manager',
  RECEPTIONIST: 'Receptionist',
  EXAM_CONTROLLER: 'Examination Controller',
};

// ============================================
// Permissions
// ============================================
export const PERMISSIONS = {
  // Users
  USER_CREATE: 'user:create',
  USER_READ: 'user:read',
  USER_UPDATE: 'user:update',
  USER_DELETE: 'user:delete',

  // Students
  STUDENT_CREATE: 'student:create',
  STUDENT_READ: 'student:read',
  STUDENT_UPDATE: 'student:update',
  STUDENT_DELETE: 'student:delete',

  // Teachers
  TEACHER_CREATE: 'teacher:create',
  TEACHER_READ: 'teacher:read',
  TEACHER_UPDATE: 'teacher:update',
  TEACHER_DELETE: 'teacher:delete',

  // Departments
  DEPARTMENT_CREATE: 'department:create',
  DEPARTMENT_READ: 'department:read',
  DEPARTMENT_UPDATE: 'department:update',
  DEPARTMENT_DELETE: 'department:delete',

  // Courses
  COURSE_CREATE: 'course:create',
  COURSE_READ: 'course:read',
  COURSE_UPDATE: 'course:update',
  COURSE_DELETE: 'course:delete',

  // Attendance
  ATTENDANCE_CREATE: 'attendance:create',
  ATTENDANCE_READ: 'attendance:read',
  ATTENDANCE_UPDATE: 'attendance:update',
  ATTENDANCE_DELETE: 'attendance:delete',

  // Fees
  FEE_CREATE: 'fee:create',
  FEE_READ: 'fee:read',
  FEE_UPDATE: 'fee:update',
  FEE_DELETE: 'fee:delete',

  // Exams
  EXAM_CREATE: 'exam:create',
  EXAM_READ: 'exam:read',
  EXAM_UPDATE: 'exam:update',
  EXAM_DELETE: 'exam:delete',

  // Library
  LIBRARY_CREATE: 'library:create',
  LIBRARY_READ: 'library:read',
  LIBRARY_UPDATE: 'library:update',
  LIBRARY_DELETE: 'library:delete',

  // Hostel
  HOSTEL_CREATE: 'hostel:create',
  HOSTEL_READ: 'hostel:read',
  HOSTEL_UPDATE: 'hostel:update',
  HOSTEL_DELETE: 'hostel:delete',

  // Transport
  TRANSPORT_CREATE: 'transport:create',
  TRANSPORT_READ: 'transport:read',
  TRANSPORT_UPDATE: 'transport:update',
  TRANSPORT_DELETE: 'transport:delete',

  // Placement
  PLACEMENT_CREATE: 'placement:create',
  PLACEMENT_READ: 'placement:read',
  PLACEMENT_UPDATE: 'placement:update',
  PLACEMENT_DELETE: 'placement:delete',

  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_UPDATE: 'settings:update',

  // Reports
  REPORT_VIEW: 'report:view',
  REPORT_EXPORT: 'report:export',

  // System
  AUDIT_READ: 'audit:read',
  BACKUP_CREATE: 'backup:create',
  BACKUP_RESTORE: 'backup:restore',
} as const;

// ============================================
// Grade Points
// ============================================
export const GRADE_POINTS: Record<string, number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'D': 4,
  'F': 0,
};

// ============================================
// Attendance Thresholds
// ============================================
export const ATTENDANCE_MIN_PERCENTAGE = 75;
export const ATTENDANCE_WARNING_PERCENTAGE = 80;

// ============================================
// File Upload Limits
// ============================================
export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/ogg'];
