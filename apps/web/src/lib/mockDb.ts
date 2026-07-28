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

// --- LIBRARY MOCK DATA ---
export const DEFAULT_BOOK_CATEGORIES = [
  { id: '1', name: 'Computer Science & IT', code: 'CS', bookCount: 1420, description: 'Algorithms, Software Engineering, AI & ML' },
  { id: '2', name: 'Electronics & Communication', code: 'EC', bookCount: 980, description: 'Circuits, VLSI, Signal Processing' },
  { id: '3', name: 'Mechanical Engineering', code: 'ME', bookCount: 850, description: 'Thermodynamics, Robotics, CAD' },
  { id: '4', name: 'Business & Management', code: 'MGMT', bookCount: 650, description: 'Finance, Marketing, Organizational Behavior' },
  { id: '5', name: 'Mathematics & Science', code: 'SCI', bookCount: 1100, description: 'Calculus, Physics, Statistics' },
];

export const DEFAULT_BOOKS = [
  { id: '1', title: 'Introduction to Algorithms (CLRS)', isbn: '978-0262033848', author: 'Thomas H. Cormen', publisher: 'MIT Press', categoryId: '1', categoryName: 'Computer Science & IT', totalCopies: 25, availableCopies: 18, rackLocation: 'Rack A-4', status: 'Available' },
  { id: '2', title: 'Clean Code: A Handbook of Agile Development', isbn: '978-0132350884', author: 'Robert C. Martin', publisher: 'Prentice Hall', categoryId: '1', categoryName: 'Computer Science & IT', totalCopies: 15, availableCopies: 5, rackLocation: 'Rack A-2', status: 'Available' },
  { id: '3', title: 'Microelectronic Circuits', isbn: '978-0199333777', author: 'Adel S. Sedra', publisher: 'Oxford University Press', categoryId: '2', categoryName: 'Electronics & Communication', totalCopies: 20, availableCopies: 12, rackLocation: 'Rack B-1', status: 'Available' },
  { id: '4', title: 'Principles of Marketing', isbn: '978-0134492513', author: 'Philip Kotler', publisher: 'Pearson', categoryId: '4', categoryName: 'Business & Management', totalCopies: 12, availableCopies: 8, rackLocation: 'Rack D-3', status: 'Available' },
  { id: '5', title: 'Higher Engineering Mathematics', isbn: '978-8174091955', author: 'B. S. Grewal', publisher: 'Khanna Publishers', categoryId: '5', categoryName: 'Mathematics & Science', totalCopies: 30, availableCopies: 22, rackLocation: 'Rack C-5', status: 'Available' },
];

export const DEFAULT_BOOK_ISSUES = [
  { id: '1', bookId: '1', bookTitle: 'Introduction to Algorithms (CLRS)', borrowerName: 'Rahul Verma', borrowerId: 'MIT2024001', borrowerRole: 'Student', issueDate: '2026-07-15', dueDate: '2026-07-29', returnDate: null, status: 'ISSUED', fineAmount: 0 },
  { id: '2', bookId: '2', bookTitle: 'Clean Code: A Handbook of Agile Development', borrowerName: 'Meera Nair', borrowerId: 'MIT2024002', borrowerRole: 'Student', issueDate: '2026-07-01', dueDate: '2026-07-15', returnDate: null, status: 'OVERDUE', fineAmount: 130 },
  { id: '3', bookId: '3', bookTitle: 'Microelectronic Circuits', borrowerName: 'Priya Sharma', borrowerId: 'TCH001', borrowerRole: 'Teacher', issueDate: '2026-06-10', dueDate: '2026-07-10', returnDate: '2026-07-08', status: 'RETURNED', fineAmount: 0 },
];

export const DEFAULT_LIBRARY_FINES = [
  { id: '1', issueId: '2', borrowerName: 'Meera Nair', borrowerId: 'MIT2024002', bookTitle: 'Clean Code', dueDate: '2026-07-15', daysOverdue: 13, amount: 130, status: 'UNPAID' },
  { id: '2', issueId: '9', borrowerName: 'Karan Malhotra', borrowerId: 'MIT2024005', bookTitle: 'Data Structures in C', dueDate: '2026-06-20', daysOverdue: 5, amount: 50, status: 'PAID' },
];

// --- HOSTEL MOCK DATA ---
export const DEFAULT_HOSTELS = [
  { id: '1', name: 'Aryabhata Boys Hostel (Block A)', code: 'BH-A', type: 'Boys', totalCapacity: 300, occupied: 245, wardenName: 'Dr. Suresh Kumar', contactPhone: '9876500111', status: 'Active' },
  { id: '2', name: 'Kalpana Chawla Girls Hostel (Block B)', code: 'GH-B', type: 'Girls', totalCapacity: 250, occupied: 210, wardenName: 'Prof. Anita Deshmukh', contactPhone: '9876500222', status: 'Active' },
  { id: '3', name: 'Visvesvaraya PG Hostel', code: 'PG-C', type: 'Co-Ed', totalCapacity: 150, occupied: 120, wardenName: 'Dr. Ramesh Rao', contactPhone: '9876500333', status: 'Active' },
];

export const DEFAULT_HOSTEL_ROOMS = [
  { id: '1', roomNo: 'A-101', hostelId: '1', hostelName: 'Aryabhata Boys Hostel', roomType: 'Double Occupancy', totalBeds: 2, occupiedBeds: 2, feePerSemester: 35000, status: 'Full' },
  { id: '2', roomNo: 'A-102', hostelId: '1', hostelName: 'Aryabhata Boys Hostel', roomType: 'Single Occupancy', totalBeds: 1, occupiedBeds: 0, feePerSemester: 50000, status: 'Available' },
  { id: '3', roomNo: 'B-201', hostelId: '2', hostelName: 'Kalpana Chawla Girls Hostel', roomType: 'Triple Occupancy', totalBeds: 3, occupiedBeds: 2, feePerSemester: 30000, status: 'Available' },
  { id: '4', roomNo: 'B-202', hostelId: '2', hostelName: 'Kalpana Chawla Girls Hostel', roomType: 'Double Occupancy', totalBeds: 2, occupiedBeds: 1, feePerSemester: 35000, status: 'Available' },
];

export const DEFAULT_HOSTEL_ALLOCATIONS = [
  { id: '1', studentId: '1', studentName: 'Rahul Verma', enrollmentNo: 'MIT2024001', hostelId: '1', hostelName: 'Aryabhata Boys Hostel', roomNo: 'A-101', bedNo: 'Bed-1', allocatedDate: '2026-07-15', status: 'Active' },
  { id: '2', studentId: '2', studentName: 'Meera Nair', enrollmentNo: 'MIT2024002', hostelId: '2', hostelName: 'Kalpana Chawla Girls Hostel', roomNo: 'B-201', bedNo: 'Bed-2', allocatedDate: '2026-07-16', status: 'Active' },
];

export const DEFAULT_HOSTEL_COMPLAINTS = [
  { id: '1', studentName: 'Rahul Verma', roomNo: 'A-101', hostelName: 'Aryabhata Boys Hostel', category: 'Plumbing', title: 'Water leakage in bathroom', priority: 'HIGH', date: '2026-07-26', status: 'Pending' },
  { id: '2', studentName: 'Meera Nair', roomNo: 'B-201', hostelName: 'Kalpana Chawla Girls Hostel', category: 'Electrical', title: 'Study lamp socket short circuit', priority: 'MEDIUM', date: '2026-07-24', status: 'In-Progress' },
  { id: '3', studentName: 'Arjun Menon', roomNo: 'A-103', hostelName: 'Aryabhata Boys Hostel', category: 'Carpentry', title: 'Study table drawer stuck', priority: 'LOW', date: '2026-07-20', status: 'Resolved' },
];

export const DEFAULT_MESS_DETAILS = [
  { id: '1', hostelName: 'Aryabhata Boys Hostel', day: 'Monday', breakfast: 'Idli Vada & Sambhar, Tea/Coffee', lunch: 'Rice, Dal Tadka, Paneer Butter Masala, Chapati, Curd', dinner: 'Veg Biryani, Raita, Gulab Jamun', timing: '07:30 AM - 09:30 PM' },
  { id: '2', hostelName: 'Kalpana Chawla Girls Hostel', day: 'Monday', breakfast: 'Puri Bhaji, Fruits, Milk', lunch: 'Rice, Rajma Masala, Chapati, Salad, Curd', dinner: 'Roti, Dal Makhani, Mixed Veg, Ice Cream', timing: '07:30 AM - 09:30 PM' },
];

// --- TRANSPORT MOCK DATA ---
export const DEFAULT_VEHICLES = [
  { id: '1', busNo: 'BUS-01', vehicleNo: 'KA-01-EQ-1234', capacity: 50, driverName: 'Mahesh Gowda', driverPhone: '9845012345', routeName: 'Route 1 - Electronic City to Campus', fitnessValidTill: '2027-03-31', status: 'Active' },
  { id: '2', busNo: 'BUS-02', vehicleNo: 'KA-01-EQ-5678', capacity: 50, driverName: 'Ramesh Reddy', driverPhone: '9845067890', routeName: 'Route 2 - Whitefield Express', fitnessValidTill: '2027-05-15', status: 'Active' },
  { id: '3', busNo: 'BUS-03', vehicleNo: 'KA-01-EQ-9012', capacity: 40, driverName: 'Sunil Kumar', driverPhone: '9845090123', routeName: 'Route 3 - Hebbal Corridor', fitnessValidTill: '2026-11-30', status: 'In Service' },
];

export const DEFAULT_DRIVERS = [
  { id: '1', name: 'Mahesh Gowda', licenseNo: 'KA01201500987', phone: '9845012345', experience: '12 Years', busAssigned: 'BUS-01', status: 'Active' },
  { id: '2', name: 'Ramesh Reddy', licenseNo: 'KA01201800432', phone: '9845067890', experience: '8 Years', busAssigned: 'BUS-02', status: 'Active' },
  { id: '3', name: 'Sunil Kumar', licenseNo: 'KA01201200111', phone: '9845090123', experience: '15 Years', busAssigned: 'BUS-03', status: 'Active' },
];

export const DEFAULT_ROUTES = [
  { id: '1', name: 'Route 1 - Electronic City', startPoint: 'Silk Board', endPoint: 'Campus', totalStops: 8, farePerTerm: 12000, distanceKm: 24, status: 'Active' },
  { id: '2', name: 'Route 2 - Whitefield', startPoint: 'ITPL Main Gate', endPoint: 'Campus', totalStops: 10, farePerTerm: 14000, distanceKm: 28, status: 'Active' },
  { id: '3', name: 'Route 3 - Hebbal Corridor', startPoint: 'Hebbal Flyover', endPoint: 'Campus', totalStops: 6, farePerTerm: 10000, distanceKm: 18, status: 'Active' },
];

export const DEFAULT_TRANSPORT_ALLOCATIONS = [
  { id: '1', userName: 'Rahul Verma', userRole: 'Student', identifier: 'MIT2024001', routeName: 'Route 1 - Electronic City', pickupStop: 'BTM Layout 2nd Stage', busNo: 'BUS-01', passStatus: 'Active', validTill: '2027-05-31' },
  { id: '2', userName: 'Priya Sharma', userRole: 'Teacher', identifier: 'TCH001', routeName: 'Route 2 - Whitefield', pickupStop: 'Marathahalli Bridge', busNo: 'BUS-02', passStatus: 'Active', validTill: '2027-05-31' },
];

export const DEFAULT_MAINTENANCE = [
  { id: '1', busNo: 'BUS-01', serviceType: 'Oil Change & Brake Check', cost: 14500, serviceDate: '2026-07-10', vendor: 'Authorized Volvo Service Center', status: 'Completed' },
  { id: '2', busNo: 'BUS-03', serviceType: 'AC Filter Replacement & Tuning', cost: 8200, serviceDate: '2026-07-22', vendor: 'Sri Sai Motors', status: 'Completed' },
];

export const DEFAULT_FUEL_LOGS = [
  { id: '1', busNo: 'BUS-01', liters: 120, totalCost: 10800, date: '2026-07-25', odometerReading: 48520, driverName: 'Mahesh Gowda' },
  { id: '2', busNo: 'BUS-02', liters: 110, totalCost: 9900, date: '2026-07-26', odometerReading: 39110, driverName: 'Ramesh Reddy' },
];

// --- PLACEMENT MOCK DATA ---
export const DEFAULT_COMPANIES = [
  { id: '1', name: 'Google', industry: 'Software / Tech', location: 'Bangalore / Hyderabad', hrContact: 'recruit@google.com', website: 'https://careers.google.com', tier: 'Tier 1 Dream', status: 'Active' },
  { id: '2', name: 'Microsoft', industry: 'Software / Cloud', location: 'Bangalore', hrContact: 'campus@microsoft.com', website: 'https://careers.microsoft.com', tier: 'Tier 1 Dream', status: 'Active' },
  { id: '3', name: 'Amazon', industry: 'E-Commerce / Cloud', location: 'Bangalore / Chennai', hrContact: 'university@amazon.com', website: 'https://amazon.jobs', tier: 'Tier 1 Dream', status: 'Active' },
  { id: '4', name: 'TCS Digital', industry: 'IT Services', location: 'Pan India', hrContact: 'campus@tcs.com', website: 'https://tcs.com', tier: 'Mass Recruiter', status: 'Active' },
  { id: '5', name: 'Texas Instruments', industry: 'Semiconductor / ECE', location: 'Bangalore', hrContact: 'careers@ti.com', website: 'https://ti.com', tier: 'Tier 1 Core', status: 'Active' },
];

export const DEFAULT_PLACEMENT_DRIVES = [
  { id: '1', companyName: 'Google', title: 'Software Development Engineer 2027', ctcLpa: 32.5, minCgpa: 8.5, driveDate: '2026-09-15', venue: 'Auditorium Block A', status: 'Upcoming', totalApplicants: 140 },
  { id: '2', companyName: 'Microsoft', title: 'Software Engineer & PM Trainee', ctcLpa: 28.0, minCgpa: 8.0, driveDate: '2026-08-20', venue: 'Virtual Drive (Teams)', status: 'Ongoing', totalApplicants: 185 },
  { id: '3', companyName: 'TCS Digital', title: 'System Engineer & Developer', ctcLpa: 7.5, minCgpa: 6.5, driveDate: '2026-07-10', venue: 'Main Lab Complex', status: 'Completed', totalApplicants: 420 },
];

export const DEFAULT_JOB_ROLES = [
  { id: '1', companyName: 'Google', roleTitle: 'Software Engineer (SDE-1)', ctcLpa: 32.5, eligibleBranches: 'CSE, IT, ECE', description: 'Core distributed systems and cloud infrastructure engineering.' },
  { id: '2', companyName: 'Microsoft', roleTitle: 'Cloud Engineer Trainee', ctcLpa: 28.0, eligibleBranches: 'CSE, IT', description: 'Azure cloud solutions architect and backend developer.' },
  { id: '3', companyName: 'Texas Instruments', roleTitle: 'VLSI Design Engineer', ctcLpa: 22.0, eligibleBranches: 'ECE', description: 'Silicon chip logic design & verification.' },
];

export const DEFAULT_PLACEMENT_APPLICATIONS = [
  { id: '1', studentName: 'Rahul Verma', enrollmentNo: 'MIT2024001', companyName: 'Google', roleTitle: 'Software Engineer (SDE-1)', appliedDate: '2026-07-20', status: 'Shortlisted', ctc: '32.5 LPA' },
  { id: '2', studentName: 'Meera Nair', enrollmentNo: 'MIT2024002', companyName: 'Microsoft', roleTitle: 'Cloud Engineer Trainee', appliedDate: '2026-07-18', status: 'Interview Scheduled', ctc: '28.0 LPA' },
  { id: '3', studentName: 'Arjun Menon', enrollmentNo: 'MIT2024003', companyName: 'TCS Digital', roleTitle: 'System Engineer', appliedDate: '2026-07-05', status: 'Selected', ctc: '7.5 LPA' },
];

export const DEFAULT_INTERVIEWS = [
  { id: '1', studentName: 'Meera Nair', companyName: 'Microsoft', round: 'Technical Round 2', date: '2026-08-02', time: '11:00 AM', mode: 'Online (Teams)', interviewer: 'Senior SDE Microsoft' },
  { id: '2', studentName: 'Rahul Verma', companyName: 'Google', round: 'Coding Screening', date: '2026-08-10', time: '02:00 PM', mode: 'HackerRank', interviewer: 'Google Staff Engineer' },
];

export const DEFAULT_OFFERS = [
  { id: '1', studentName: 'Arjun Menon', enrollmentNo: 'MIT2024003', branch: 'CSE', companyName: 'TCS Digital', ctcLpa: 7.5, offerDate: '2026-07-15', joiningDate: '2027-07-01', status: 'Accepted' },
  { id: '2', studentName: 'Divya Gupta', enrollmentNo: 'MIT2024004', branch: 'IT', companyName: 'Accenture Innovation', ctcLpa: 8.5, offerDate: '2026-07-22', joiningDate: '2027-07-15', status: 'Pending Acceptance' },
];

// --- EVENTS & CLUBS MOCK DATA ---
export const DEFAULT_EVENTS = [
  { id: '1', title: 'TechSparks 2026 Annual Hackathon', category: 'Technical', organizer: 'Coding Club & CSE Dept', venue: 'Main Auditorium & Labs', startDate: '2026-08-25', endDate: '2026-08-26', budget: 150000, status: 'Upcoming', registrationsCount: 240 },
  { id: '2', title: 'NIRVANA 2026 Inter-College Cultural Fest', category: 'Cultural', organizer: 'Student Council', venue: 'Open Air Theatre', startDate: '2026-09-10', endDate: '2026-09-12', budget: 500000, status: 'Upcoming', registrationsCount: 680 },
  { id: '3', title: 'AI & Quantum Computing National Seminar', category: 'Academic', organizer: 'Department of CS', venue: 'Seminar Hall 2', startDate: '2026-07-15', endDate: '2026-07-15', budget: 45000, status: 'Completed', registrationsCount: 180 },
];

export const DEFAULT_CLUBS = [
  { id: '1', name: 'Google Developer Student Club (GDSC)', code: 'GDSC', leadStudent: 'Rahul Verma', facultyAdvisor: 'Dr. Priya Sharma', category: 'Technical', memberCount: 180, status: 'Active' },
  { id: '2', name: 'Robotics & Automation Guild', code: 'RAG', leadStudent: 'Karan Malhotra', facultyAdvisor: 'Dr. Sneha Reddy', category: 'Technical', memberCount: 120, status: 'Active' },
  { id: '3', name: 'Symphony Music & Arts Society', code: 'SMAS', leadStudent: 'Meera Nair', facultyAdvisor: 'Prof. Ananya Roy', category: 'Cultural', memberCount: 150, status: 'Active' },
];

export const DEFAULT_EVENT_REGISTRATIONS = [
  { id: '1', eventTitle: 'TechSparks 2026 Hackathon', studentName: 'Rahul Verma', USN: 'MIT2024001', department: 'CSE', registrationDate: '2026-07-20', paymentStatus: 'Free', attendanceStatus: 'Registered' },
  { id: '2', eventTitle: 'TechSparks 2026 Hackathon', studentName: 'Meera Nair', USN: 'MIT2024002', department: 'CSE', registrationDate: '2026-07-21', paymentStatus: 'Free', attendanceStatus: 'Registered' },
];

export const DEFAULT_ANNOUNCEMENTS = [
  { id: '1', title: 'Submissions Open for TechSparks 2026 Hackathon', category: 'Events', targetAudience: 'All Students', date: '2026-07-26', author: 'Dean Student Affairs', status: 'Published' },
  { id: '2', title: 'Library Operating Hours Extended for Mid-Terms', category: 'Academic', targetAudience: 'All Students & Faculty', date: '2026-07-24', author: 'Chief Librarian', status: 'Published' },
];

// --- USERS & ROLES MOCK DATA ---
export const DEFAULT_USERS = [
  { id: '1', firstName: 'System', lastName: 'Administrator', email: 'admin@college.edu', role: 'SUPER_ADMIN', phone: '9876500001', department: 'Administration', status: 'Active', lastLogin: '2026-07-28 20:45' },
  { id: '2', firstName: 'Dr. Rajesh', lastName: 'Rao', email: 'principal@college.edu', role: 'PRINCIPAL', phone: '9876500002', department: 'Executive', status: 'Active', lastLogin: '2026-07-28 18:30' },
  { id: '3', firstName: 'Priya', lastName: 'Sharma', email: 'priya@erp.com', role: 'TEACHER', phone: '9876543291', department: 'Computer Science', status: 'Active', lastLogin: '2026-07-28 15:10' },
  { id: '4', firstName: 'Rahul', lastName: 'Verma', email: 'rahul@student.erp.com', role: 'STUDENT', phone: '9876543210', department: 'Computer Science', status: 'Active', lastLogin: '2026-07-28 21:02' },
  { id: '5', firstName: 'Kishore', lastName: 'Verma', email: 'kishore@parents.com', role: 'PARENT', phone: '9876543211', department: 'N/A', status: 'Active', lastLogin: '2026-07-27 19:15' },
];

export const DEFAULT_ROLES = [
  { id: '1', name: 'Super Administrator', code: 'SUPER_ADMIN', description: 'Full system control and configuration privileges across all colleges', userCount: 2, isSystem: true },
  { id: '2', name: 'Principal / Management', code: 'PRINCIPAL', description: 'Executive level monitoring, analytics approval, and academic oversight', userCount: 3, isSystem: true },
  { id: '3', name: 'Faculty / Teacher', code: 'TEACHER', description: 'Attendance, marks entry, assignment management, subject materials', userCount: 45, isSystem: true },
  { id: '4', name: 'Student', code: 'STUDENT', description: 'Student dashboard, view results, pay fees, placement, library access', userCount: 1200, isSystem: true },
  { id: '5', name: 'Librarian', code: 'LIBRARIAN', description: 'Manage books catalog, issues, returns, and library fine collections', userCount: 4, isSystem: false },
  { id: '6', name: 'Hostel Warden', code: 'HOSTEL_WARDEN', description: 'Room allocations, complaints resolution, mess menu management', userCount: 6, isSystem: false },
  { id: '7', name: 'Transport Manager', code: 'TRANSPORT_MANAGER', description: 'Fleet maintenance, routes management, bus pass allocations', userCount: 3, isSystem: false },
];

// --- AUDIT LOGS MOCK DATA ---
export const DEFAULT_AUDIT_LOGS = [
  { id: '1', user: 'System Administrator (admin@college.edu)', module: 'Users', action: 'CREATE_USER', target: 'Rahul Verma (STUDENT)', ipAddress: '192.168.1.105', device: 'Chrome / Windows 11', status: 'SUCCESS', timestamp: '2026-07-28 21:05:12' },
  { id: '2', user: 'Dr. Rajesh Rao (principal@college.edu)', module: 'Analytics', action: 'EXPORT_REPORT', target: 'Admission_Trends_2026.pdf', ipAddress: '192.168.1.112', device: 'Safari / macOS', status: 'SUCCESS', timestamp: '2026-07-28 18:32:05' },
  { id: '3', user: 'Priya Sharma (priya@erp.com)', module: 'Academics', action: 'UPDATE_MARKS', target: 'Data Structures Mid-Term', ipAddress: '192.168.1.140', device: 'Edge / Windows 11', status: 'SUCCESS', timestamp: '2026-07-28 15:15:40' },
  { id: '4', user: 'Rahul Verma (rahul@student.erp.com)', module: 'Finance', action: 'FEE_PAYMENT', target: 'Tuition Fee 2026 (TXN123456)', ipAddress: '106.51.72.44', device: 'Mobile Safari / iOS', status: 'SUCCESS', timestamp: '2026-07-27 14:20:00' },
  { id: '5', user: 'Unknown User', module: 'Auth', action: 'FAILED_LOGIN', target: 'admin@college.edu', ipAddress: '185.220.101.5', device: 'Python Requests Script', status: 'FAILED', timestamp: '2026-07-27 03:12:44' },
];

// --- SYSTEM SETTINGS MOCK DATA ---
export const DEFAULT_SYSTEM_SETTINGS = [
  { id: '1', category: 'College Profile', key: 'collegeName', value: 'Modern Institute of Technology & Engineering', label: 'College Title' },
  { id: '2', category: 'College Profile', key: 'collegeCode', value: 'MIT-ENG-2026', label: 'Institutional Code' },
  { id: '3', category: 'Academic Year', key: 'currentAcademicYear', value: '2026-2027', label: 'Active Session' },
  { id: '4', category: 'Academic Year', key: 'minAttendancePercentage', value: '75', label: 'Minimum Attendance Requirement (%)' },
  { id: '5', category: 'Authentication', key: 'enableTwoFactor', value: 'true', label: 'Require 2FA for Admins' },
  { id: '6', category: 'Authentication', key: 'sessionTimeoutMinutes', value: '60', label: 'Session Expiry (Minutes)' },
  { id: '7', category: 'Notifications', key: 'emailNotifications', value: 'true', label: 'Enable System Email Alerts' },
  { id: '8', category: 'Notifications', key: 'smsGatewayActive', value: 'true', label: 'Enable SMS Gateway Dispatch' },
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
