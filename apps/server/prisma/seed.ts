import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ============================================
  // Create Super Admin
  // ============================================
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@collegeerp.com' },
    update: {},
    create: {
      firstName: 'Super',
      lastName: 'Admin',
      email: 'admin@collegeerp.com',
      password: adminPassword,
      role: UserRole.SUPER_ADMIN,
      isEmailVerified: true,
      phone: '9999999999',
    },
  });
  console.log('✅ Super Admin created:', admin.email);

  // ============================================
  // Create College
  // ============================================
  const college = await prisma.college.upsert({
    where: { code: 'MIT' },
    update: {},
    create: {
      name: 'Modern Institute of Technology',
      code: 'MIT',
      address: '123 Education Lane, Tech Park',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      phone: '080-12345678',
      email: 'info@mit.edu.in',
      website: 'https://mit.edu.in',
    },
  });
  console.log('✅ College created:', college.name);

  // ============================================
  // Create Departments
  // ============================================
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { code: 'CSE' },
      update: {},
      create: { name: 'Computer Science & Engineering', code: 'CSE', collegeId: college.id, description: 'Department of Computer Science and Engineering' },
    }),
    prisma.department.upsert({
      where: { code: 'ECE' },
      update: {},
      create: { name: 'Electronics & Communication', code: 'ECE', collegeId: college.id, description: 'Department of Electronics and Communication Engineering' },
    }),
    prisma.department.upsert({
      where: { code: 'ME' },
      update: {},
      create: { name: 'Mechanical Engineering', code: 'ME', collegeId: college.id, description: 'Department of Mechanical Engineering' },
    }),
    prisma.department.upsert({
      where: { code: 'MBA' },
      update: {},
      create: { name: 'Business Administration', code: 'MBA', collegeId: college.id, description: 'Department of Business Administration' },
    }),
  ]);
  console.log(`✅ ${departments.length} Departments created`);

  // ============================================
  // Create Courses
  // ============================================
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { code: 'BTECH-CSE' },
      update: {},
      create: { name: 'B.Tech Computer Science', code: 'BTECH-CSE', departmentId: departments[0].id, duration: 4, totalSemesters: 8 },
    }),
    prisma.course.upsert({
      where: { code: 'BTECH-ECE' },
      update: {},
      create: { name: 'B.Tech Electronics', code: 'BTECH-ECE', departmentId: departments[1].id, duration: 4, totalSemesters: 8 },
    }),
    prisma.course.upsert({
      where: { code: 'BTECH-ME' },
      update: {},
      create: { name: 'B.Tech Mechanical', code: 'BTECH-ME', departmentId: departments[2].id, duration: 4, totalSemesters: 8 },
    }),
    prisma.course.upsert({
      where: { code: 'MBA-GEN' },
      update: {},
      create: { name: 'MBA General', code: 'MBA-GEN', departmentId: departments[3].id, duration: 2, totalSemesters: 4 },
    }),
  ]);
  console.log(`✅ ${courses.length} Courses created`);

  // ============================================
  // Create Semesters
  // ============================================
  for (const course of courses) {
    for (let i = 1; i <= course.totalSemesters; i++) {
      await prisma.semester.upsert({
        where: { courseId_number: { courseId: course.id, number: i } },
        update: {},
        create: {
          name: `Semester ${i}`,
          number: i,
          courseId: course.id,
        },
      });
    }
  }
  console.log('✅ Semesters created');

  // ============================================
  // Create Branches
  // ============================================
  const branches = await Promise.all([
    prisma.branch.upsert({
      where: { code: 'CSE-AI' },
      update: {},
      create: { name: 'AI & Machine Learning', code: 'CSE-AI', courseId: courses[0].id },
    }),
    prisma.branch.upsert({
      where: { code: 'CSE-DS' },
      update: {},
      create: { name: 'Data Science', code: 'CSE-DS', courseId: courses[0].id },
    }),
    prisma.branch.upsert({
      where: { code: 'CSE-CY' },
      update: {},
      create: { name: 'Cyber Security', code: 'CSE-CY', courseId: courses[0].id },
    }),
  ]);
  console.log(`✅ ${branches.length} Branches created`);

  // ============================================
  // Create Sections
  // ============================================
  for (const branch of branches) {
    for (const sectionName of ['A', 'B', 'C']) {
      await prisma.section.create({
        data: { name: sectionName, branchId: branch.id, capacity: 60 },
      }).catch(() => {}); // Ignore duplicates
    }
  }
  console.log('✅ Sections created');

  // ============================================
  // Create Principal
  // ============================================
  const principalPwd = await bcrypt.hash('Principal@123', 12);
  await prisma.user.upsert({
    where: { email: 'principal@collegeerp.com' },
    update: {},
    create: {
      firstName: 'Rajesh',
      lastName: 'Kumar',
      email: 'principal@collegeerp.com',
      password: principalPwd,
      role: UserRole.PRINCIPAL,
      isEmailVerified: true,
    },
  });
  console.log('✅ Principal created');

  // ============================================
  // Create Teachers
  // ============================================
  const teacherPassword = await bcrypt.hash('Teacher@123', 12);
  const teacherData = [
    { first: 'Priya', last: 'Sharma', email: 'priya.sharma@collegeerp.com', empId: 'TCH001', deptIdx: 0, designation: 'Associate Professor', qual: 'Ph.D. Computer Science', spec: 'Artificial Intelligence' },
    { first: 'Arun', last: 'Patel', email: 'arun.patel@collegeerp.com', empId: 'TCH002', deptIdx: 0, designation: 'Assistant Professor', qual: 'M.Tech Computer Science', spec: 'Data Structures' },
    { first: 'Sneha', last: 'Reddy', email: 'sneha.reddy@collegeerp.com', empId: 'TCH003', deptIdx: 1, designation: 'Professor', qual: 'Ph.D. Electronics', spec: 'VLSI Design' },
    { first: 'Vikram', last: 'Singh', email: 'vikram.singh@collegeerp.com', empId: 'TCH004', deptIdx: 2, designation: 'Associate Professor', qual: 'Ph.D. Mechanical', spec: 'Thermodynamics' },
    { first: 'Anita', last: 'Desai', email: 'anita.desai@collegeerp.com', empId: 'TCH005', deptIdx: 3, designation: 'Assistant Professor', qual: 'MBA, Ph.D.', spec: 'Marketing' },
  ];

  for (const t of teacherData) {
    const user = await prisma.user.upsert({
      where: { email: t.email },
      update: {},
      create: {
        firstName: t.first,
        lastName: t.last,
        email: t.email,
        password: teacherPassword,
        role: UserRole.TEACHER,
        isEmailVerified: true,
      },
    });
    await prisma.teacher.upsert({
      where: { employeeId: t.empId },
      update: {},
      create: {
        userId: user.id,
        employeeId: t.empId,
        departmentId: departments[t.deptIdx].id,
        designation: t.designation,
        qualification: t.qual,
        specialization: t.spec,
        joiningDate: new Date('2020-07-01'),
      },
    });
  }
  console.log(`✅ ${teacherData.length} Teachers created`);

  // ============================================
  // Create Students
  // ============================================
  const studentPassword = await bcrypt.hash('Student@123', 12);
  const semester1 = await prisma.semester.findFirst({ where: { courseId: courses[0].id, number: 3 } });
  const sections = await prisma.section.findMany({ where: { branchId: branches[0].id } });

  const studentNames = [
    { first: 'Rahul', last: 'Verma' }, { first: 'Meera', last: 'Nair' },
    { first: 'Arjun', last: 'Menon' }, { first: 'Divya', last: 'Gupta' },
    { first: 'Karan', last: 'Malhotra' }, { first: 'Pooja', last: 'Iyer' },
    { first: 'Rohit', last: 'Joshi' }, { first: 'Kavita', last: 'Rao' },
    { first: 'Amit', last: 'Sinha' }, { first: 'Neha', last: 'Chauhan' },
  ];

  for (let i = 0; i < studentNames.length; i++) {
    const s = studentNames[i];
    const email = `${s.first.toLowerCase()}.${s.last.toLowerCase()}@student.collegeerp.com`;
    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        firstName: s.first,
        lastName: s.last,
        email,
        password: studentPassword,
        role: UserRole.STUDENT,
        isEmailVerified: true,
        gender: i % 2 === 0 ? 'MALE' : 'FEMALE',
      },
    });
    await prisma.student.upsert({
      where: { enrollmentNo: `MIT2024${String(i + 1).padStart(3, '0')}` },
      update: {},
      create: {
        userId: user.id,
        enrollmentNo: `MIT2024${String(i + 1).padStart(3, '0')}`,
        courseId: courses[0].id,
        branchId: branches[0].id,
        sectionId: sections[i % sections.length]?.id,
        semesterId: semester1!.id,
        batchYear: 2024,
        admissionDate: new Date('2024-08-01'),
      },
    });
  }
  console.log(`✅ ${studentNames.length} Students created`);

  // ============================================
  // Create Subjects
  // ============================================
  const subjects = [
    { name: 'Data Structures & Algorithms', code: 'CS301', credits: 4, type: 'THEORY' as const },
    { name: 'Database Management Systems', code: 'CS302', credits: 4, type: 'THEORY' as const },
    { name: 'Operating Systems', code: 'CS303', credits: 3, type: 'THEORY' as const },
    { name: 'Computer Networks', code: 'CS304', credits: 3, type: 'THEORY' as const },
    { name: 'DSA Lab', code: 'CS351', credits: 2, type: 'PRACTICAL' as const },
    { name: 'DBMS Lab', code: 'CS352', credits: 2, type: 'PRACTICAL' as const },
  ];

  for (const subj of subjects) {
    await prisma.subject.upsert({
      where: { code: subj.code },
      update: {},
      create: {
        name: subj.name,
        code: subj.code,
        courseId: courses[0].id,
        semesterId: semester1!.id,
        credits: subj.credits,
        type: subj.type,
      },
    });
  }
  console.log(`✅ ${subjects.length} Subjects created`);

  // ============================================
  // Create Accountant, Librarian, etc.
  // ============================================
  const otherRoles = [
    { first: 'Suresh', last: 'Menon', email: 'accountant@collegeerp.com', role: UserRole.ACCOUNTANT },
    { first: 'Lakshmi', last: 'Pillai', email: 'librarian@collegeerp.com', role: UserRole.LIBRARIAN },
    { first: 'Rajan', last: 'Thomas', email: 'placement@collegeerp.com', role: UserRole.PLACEMENT_OFFICER },
    { first: 'Deepa', last: 'Nair', email: 'hostel@collegeerp.com', role: UserRole.HOSTEL_WARDEN },
    { first: 'Mohan', last: 'Das', email: 'transport@collegeerp.com', role: UserRole.TRANSPORT_MANAGER },
    { first: 'Geetha', last: 'Krishnan', email: 'receptionist@collegeerp.com', role: UserRole.RECEPTIONIST },
    { first: 'Ramesh', last: 'Babu', email: 'examcontroller@collegeerp.com', role: UserRole.EXAM_CONTROLLER },
  ];

  const otherPassword = await bcrypt.hash('Staff@123', 12);
  for (const r of otherRoles) {
    await prisma.user.upsert({
      where: { email: r.email },
      update: {},
      create: {
        firstName: r.first,
        lastName: r.last,
        email: r.email,
        password: otherPassword,
        role: r.role,
        isEmailVerified: true,
      },
    });
  }
  console.log(`✅ ${otherRoles.length} Staff members created`);

  // ============================================
  // Create Sample Books
  // ============================================
  const books = [
    { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', category: 'Computer Science', totalCopies: 10, availableCopies: 8 },
    { title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', category: 'Computer Science', totalCopies: 8, availableCopies: 6 },
    { title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-1119800361', category: 'Computer Science', totalCopies: 12, availableCopies: 10 },
    { title: 'Computer Networking', author: 'James Kurose', isbn: '978-0133594140', category: 'Computer Science', totalCopies: 6, availableCopies: 5 },
    { title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', category: 'Software Engineering', totalCopies: 5, availableCopies: 3 },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: {},
      create: book,
    });
  }
  console.log(`✅ ${books.length} Books created`);

  console.log('\n🎉 Seeding complete!');
  console.log('\n📋 Login Credentials:');
  console.log('─'.repeat(50));
  console.log('Super Admin:  admin@collegeerp.com / Admin@123');
  console.log('Principal:    principal@collegeerp.com / Principal@123');
  console.log('Teacher:      priya.sharma@collegeerp.com / Teacher@123');
  console.log('Student:      rahul.verma@student.collegeerp.com / Student@123');
  console.log('Accountant:   accountant@collegeerp.com / Staff@123');
  console.log('Librarian:    librarian@collegeerp.com / Staff@123');
  console.log('─'.repeat(50));
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
