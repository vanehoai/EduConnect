import {
  AcademicStatus,
  ClassSectionStatus,
  DifficultyLevel,
  ExamStatus,
  Gender,
  InvoiceStatus,
  LecturerStatus,
  NotificationType,
  PaymentProvider,
  PaymentStatus,
  PrismaClient,
  QuestionType,
  RecordStatus,
  SemesterStatus,
  SemesterTerm,
  TuitionItemType,
  UserStatus,
  type ClassSection,
  type Course,
  type Invoice,
  type Lecturer,
  type Question,
  type Student,
} from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

const roles = [
  ['ADMIN', 'Quản trị viên'],
  ['TRAINING_STAFF', 'Phòng đào tạo'],
  ['FINANCE_STAFF', 'Phòng tài chính'],
  ['LECTURER', 'Giảng viên'],
  ['STUDENT', 'Sinh viên'],
] as const;

const permissions = [
  ['user.read', 'Xem tài khoản', 'user'],
  ['user.create', 'Tạo tài khoản', 'user'],
  ['user.update', 'Cập nhật tài khoản', 'user'],
  ['user.delete', 'Xóa tài khoản', 'user'],
  ['role.read', 'Xem vai trò và quyền', 'role'],
  ['role.manage', 'Quản lý vai trò và quyền', 'role'],
  ['department.read', 'Xem khoa', 'department'],
  ['department.create', 'Tạo khoa', 'department'],
  ['department.update', 'Cập nhật và khôi phục khoa', 'department'],
  ['department.delete', 'Xóa mềm khoa', 'department'],
  ['student.read', 'Xem sinh viên', 'student'],
  ['student.manage', 'Quản lý sinh viên', 'student'],
  ['student.create', 'Tạo sinh viên', 'student'],
  ['student.update', 'Cập nhật sinh viên', 'student'],
  ['student.delete', 'Xóa mềm sinh viên', 'student'],
  ['student.import', 'Import sinh viên', 'student'],
  ['student.export', 'Export sinh viên', 'student'],
  ['lecturer.read', 'Xem giảng viên', 'lecturer'],
  ['lecturer.manage', 'Quản lý giảng viên', 'lecturer'],
  ['lecturer.create', 'Tạo giảng viên', 'lecturer'],
  ['lecturer.update', 'Cập nhật giảng viên', 'lecturer'],
  ['lecturer.delete', 'Xóa mềm giảng viên', 'lecturer'],
  ['academic-year.read', 'Xem năm học', 'academic-year'],
  ['academic-year.manage', 'Quản lý năm học', 'academic-year'],
  ['semester.read', 'Xem học kỳ', 'semester'],
  ['semester.manage', 'Quản lý học kỳ', 'semester'],
  ['course.read', 'Xem môn học và lớp học phần', 'course'],
  ['course.manage', 'Quản lý môn học và lớp học phần', 'course'],
  ['course.create', 'Tạo môn học', 'course'],
  ['course.update', 'Cập nhật môn học', 'course'],
  ['course.delete', 'Xóa mềm môn học', 'course'],
  ['course-prerequisite.manage', 'Quản lý môn tiên quyết', 'course'],
  ['exam.read', 'Xem kỳ thi', 'exam'],
  ['exam.manage', 'Quản lý kỳ thi', 'exam'],
  ['grade.read', 'Xem điểm', 'grade'],
  ['grade.manage', 'Quản lý điểm', 'grade'],
  ['invoice.read', 'Xem hóa đơn học phí', 'invoice'],
  ['invoice.manage', 'Quản lý hóa đơn học phí', 'invoice'],
  ['payment.read', 'Xem giao dịch thanh toán', 'payment'],
  ['payment.manage', 'Quản lý giao dịch thanh toán', 'payment'],
  ['audit.read', 'Xem nhật ký kiểm toán', 'audit'],
  ['enrollment.read', 'Xem đăng ký học', 'enrollment'],
  ['enrollment.create', 'Thực hiện đăng ký học', 'enrollment'],
  ['enrollment.cancel', 'Hủy đăng ký học', 'enrollment'],
  ['enrollment.manage', 'Quản lý đăng ký học', 'enrollment'],
  ['attendance.read', 'Xem điểm danh', 'attendance'],
  ['attendance.manage', 'Quản lý điểm danh', 'attendance'],
  ['grade.publish', 'Công bố điểm', 'grade'],
  ['grade.adjust', 'Điều chỉnh điểm sau công bố', 'grade'],
  ['question.read', 'Xem câu hỏi', 'question'],
  ['question.create', 'Tạo câu hỏi', 'question'],
  ['question.update', 'Cập nhật câu hỏi', 'question'],
  ['question.delete', 'Xóa câu hỏi', 'question'],
  ['question.import', 'Import câu hỏi', 'question'],
  ['exam.create', 'Tạo kỳ thi', 'exam'],
  ['exam.update', 'Cập nhật kỳ thi', 'exam'],
  ['exam.delete', 'Xóa kỳ thi', 'exam'],
  ['exam.assign', 'Phân công kỳ thi', 'exam'],
  ['exam.publish', 'Công bố kỳ thi', 'exam'],
  ['attempt.read', 'Xem lượt thi', 'attempt'],
  ['attempt.start', 'Bắt đầu làm bài', 'attempt'],
  ['attempt.submit', 'Nộp bài thi', 'attempt'],
  ['result.read', 'Xem kết quả thi', 'result'],
  ['result.manage', 'Quản lý kết quả thi', 'result'],
  ['result.publish', 'Công bố kết quả thi', 'result'],
] as const;

const permissionMap: Record<string, string[]> = {
  ADMIN: permissions.map(([code]) => code),
  TRAINING_STAFF: [
    'user.read',
    'department.read',
    'department.create',
    'department.update',
    'department.delete',
    'student.read',
    'student.manage',
    'student.create',
    'student.update',
    'student.delete',
    'student.import',
    'student.export',
    'lecturer.read',
    'lecturer.manage',
    'lecturer.create',
    'lecturer.update',
    'lecturer.delete',
    'academic-year.read',
    'academic-year.manage',
    'semester.read',
    'semester.manage',
    'course.read',
    'course.manage',
    'course.create',
    'course.update',
    'course.delete',
    'course-prerequisite.manage',
    'class-section.read',
    'class-section.create',
    'class-section.update',
    'class-section.delete',
    'schedule.read',
    'schedule.manage',
    'exam.read',
    'grade.read',
    'grade.manage',
    'grade.publish',
    'grade.adjust',
    'enrollment.read',
    'enrollment.create',
    'enrollment.cancel',
    'enrollment.manage',
    'attendance.read',
    'exam.read',
    'exam.create',
    'exam.update',
    'exam.delete',
    'exam.assign',
    'exam.publish',
    'question.read',
    'question.create',
    'question.update',
    'question.delete',
    'question.import',
    'attempt.read',
    'result.read',
    'result.manage',
    'result.publish',
  ],
  FINANCE_STAFF: [
    'student.read',
    'invoice.read',
    'invoice.manage',
    'payment.read',
    'payment.manage',
  ],
  LECTURER: [
    'student.read',
    'lecturer.read',
    'academic-year.read',
    'semester.read',
    'course.read',
    'exam.read',
    'exam.manage',
    'grade.read',
    'grade.manage',
    'grade.publish',
    'attendance.read',
    'attendance.manage',
    'question.read',
    'question.create',
    'question.update',
    'question.delete',
    'question.import',
    'exam.create',
    'exam.update',
    'exam.delete',
    'exam.assign',
    'exam.publish',
    'attempt.read',
    'result.read',
    'result.manage',
    'result.publish',
  ],
  STUDENT: [
    'student.read',
    'academic-year.read',
    'semester.read',
    'course.read',
    'exam.read',
    'grade.read',
    'attendance.read',
    'invoice.read',
    'payment.read',
    'attempt.start',
    'attempt.submit',
    'attempt.read',
    'result.read',
  ],
};

async function seedAccessControl(): Promise<Map<string, string>> {
  const savedRoles = await Promise.all(
    roles.map(([code, name]) =>
      prisma.role.upsert({
        where: { code },
        update: { name, isSystem: true },
        create: { code, name, isSystem: true },
      }),
    ),
  );
  const savedPermissions = await Promise.all(
    permissions.map(([code, name, module]) =>
      prisma.permission.upsert({
        where: { code },
        update: { name, module },
        create: { code, name, module },
      }),
    ),
  );

  for (const role of savedRoles) {
    const desiredCodes = permissionMap[role.code] ?? [];
    const desiredPermissions = savedPermissions.filter((permission) =>
      desiredCodes.includes(permission.code),
    );
    await prisma.rolePermission.deleteMany({
      where: {
        roleId: role.id,
        permissionId: { notIn: desiredPermissions.map((permission) => permission.id) },
      },
    });
    for (const permission of desiredPermissions) {
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }
  return new Map(savedRoles.map((role) => [role.code, role.id]));
}

async function upsertUser(
  email: string,
  fullName: string,
  roleCode: string,
  roleIds: Map<string, string>,
  passwordHash: string,
) {
  const user = await prisma.user.upsert({
    where: { email },
    update: { fullName, status: UserStatus.ACTIVE },
    create: { email, fullName, passwordHash, status: UserStatus.ACTIVE },
  });
  const roleId = roleIds.get(roleCode);
  if (!roleId) throw new Error(`Không tìm thấy vai trò ${roleCode}`);
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: user.id, roleId } },
    update: {},
    create: { userId: user.id, roleId },
  });
  return user;
}

async function main(): Promise<void> {
  const passwordHash = await hash('Password@123', 12);
  const roleIds = await seedAccessControl();
  await Promise.all([
    upsertUser('admin@school.local', 'Quản trị hệ thống', 'ADMIN', roleIds, passwordHash),
    upsertUser(
      'training@school.local',
      'Nhân viên phòng đào tạo',
      'TRAINING_STAFF',
      roleIds,
      passwordHash,
    ),
    upsertUser(
      'finance@school.local',
      'Nhân viên phòng tài chính',
      'FINANCE_STAFF',
      roleIds,
      passwordHash,
    ),
  ]);

  await prisma.academicYear.updateMany({
    where: { isCurrent: true, code: { not: '2025-2026' } },
    data: { isCurrent: false },
  });
  const academicYear = await prisma.academicYear.upsert({
    where: { code: '2025-2026' },
    update: { isCurrent: true },
    create: {
      code: '2025-2026',
      name: 'Năm học 2025 - 2026',
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-08-31'),
      isCurrent: true,
    },
  });
  const semesterData = [
    {
      code: '2025-2026-HK1',
      name: 'Học kỳ 1 - Năm học 2025-2026',
      term: SemesterTerm.FIRST,
      startDate: new Date('2025-09-01'),
      endDate: new Date('2026-01-15'),
      registrationStartDate: new Date('2025-08-01'),
      registrationEndDate: new Date('2025-08-20T23:59:59Z'),
      status: SemesterStatus.COMPLETED,
    },
    {
      code: '2025-2026-HK2',
      name: 'Học kỳ 2 - Năm học 2025-2026',
      term: SemesterTerm.SECOND,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-07-31'),
      registrationStartDate: new Date('2026-01-10'),
      registrationEndDate: new Date('2026-01-25T23:59:59Z'),
      status: SemesterStatus.IN_PROGRESS,
    },
  ];
  const semesters = await Promise.all(
    semesterData.map((semester) =>
      prisma.semester.upsert({
        where: { code: semester.code },
        update: { status: semester.status },
        create: { ...semester, academicYearId: academicYear.id, maxCredits: 24 },
      }),
    ),
  );

  const departmentData = [
    ['CNTT', 'Khoa Công nghệ thông tin', 'Đào tạo công nghệ và kỹ thuật phần mềm'],
    ['QTKD', 'Khoa Quản trị kinh doanh', 'Đào tạo quản trị và kinh doanh số'],
    ['NN', 'Khoa Ngoại ngữ', 'Đào tạo ngôn ngữ và giao tiếp quốc tế'],
  ] as const;
  const departments = await Promise.all(
    departmentData.map(([code, name, description]) =>
      prisma.department.upsert({
        where: { code },
        update: { name, description },
        create: { code, name, description, status: RecordStatus.ACTIVE },
      }),
    ),
  );

  const lecturerNames = [
    'Nguyễn Minh Anh',
    'Trần Hoàng Long',
    'Lê Thu Hà',
    'Phạm Quốc Bảo',
    'Võ Ngọc Linh',
  ];
  const lecturers: Lecturer[] = [];
  for (let index = 0; index < 5; index += 1) {
    const number = index + 1;
    const email = index === 0 ? 'lecturer@school.local' : `lecturer${number}@school.local`;
    const fullName = lecturerNames[index]!;
    const user = await upsertUser(email, fullName, 'LECTURER', roleIds, passwordHash);
    const department = departments[index % departments.length]!;
    lecturers.push(
      await prisma.lecturer.upsert({
        where: { lecturerCode: `GV${String(number).padStart(3, '0')}` },
        update: { fullName, departmentId: department.id },
        create: {
          lecturerCode: `GV${String(number).padStart(3, '0')}`,
          userId: user.id,
          departmentId: department.id,
          fullName,
          email,
          phone: `09010000${String(number).padStart(2, '0')}`,
          dateOfBirth: new Date(`198${index}-05-15`),
          gender: index % 2 === 0 ? Gender.FEMALE : Gender.MALE,
          academicRank: index < 2 ? 'Tiến sĩ' : 'Thạc sĩ',
          specialization: [
            'Kỹ thuật phần mềm',
            'Hệ thống thông tin',
            'Marketing số',
            'Quản trị học',
            'Ngôn ngữ Anh',
          ][index],
          status: LecturerStatus.ACTIVE,
        },
      }),
    );
  }
  for (let index = 0; index < departments.length; index += 1) {
    await prisma.department.update({
      where: { id: departments[index]!.id },
      data: { headLecturerId: lecturers[index]!.id },
    });
  }

  const students: Student[] = [];
  for (let index = 0; index < 20; index += 1) {
    const number = index + 1;
    const email = index === 0 ? 'student@school.local' : `student${number}@school.local`;
    const fullName = `Sinh viên Mẫu ${String(number).padStart(2, '0')}`;
    const user = await upsertUser(email, fullName, 'STUDENT', roleIds, passwordHash);
    const department = departments[index % departments.length]!;
    students.push(
      await prisma.student.upsert({
        where: { studentCode: `SV2025${String(number).padStart(3, '0')}` },
        update: { fullName, departmentId: department.id },
        create: {
          studentCode: `SV2025${String(number).padStart(3, '0')}`,
          userId: user.id,
          departmentId: department.id,
          admissionAcademicYearId: academicYear.id,
          fullName,
          email,
          phone: `09120000${String(number).padStart(2, '0')}`,
          dateOfBirth: new Date(`200${index % 5}-0${(index % 8) + 1}-15`),
          gender: index % 2 === 0 ? Gender.MALE : Gender.FEMALE,
          address: 'Thành phố Hồ Chí Minh',
          cohortClass: `${department.code}2025A`,
          cohort: 'K2025',
          enrollmentDate: new Date('2025-09-01'),
          academicStatus: AcademicStatus.STUDYING,
        },
      }),
    );
  }

  const courseData = [
    ['CS101', 'Nhập môn lập trình', 3, 0],
    ['CS102', 'Cấu trúc dữ liệu và giải thuật', 4, 0],
    ['CS201', 'Cơ sở dữ liệu', 3, 0],
    ['CS202', 'Kỹ thuật phần mềm', 3, 0],
    ['CS203', 'Mạng máy tính', 3, 0],
    ['BA101', 'Nguyên lý quản trị', 3, 1],
    ['BA102', 'Kinh tế vi mô', 3, 1],
    ['BA201', 'Marketing căn bản', 3, 1],
    ['EN101', 'Tiếng Anh học thuật 1', 3, 2],
    ['EN102', 'Tiếng Anh học thuật 2', 3, 2],
  ] as const;
  const courses: Course[] = [];
  for (const [courseCode, name, credits, departmentIndex] of courseData) {
    courses.push(
      await prisma.course.upsert({
        where: { courseCode },
        update: { name, credits, departmentId: departments[departmentIndex]!.id },
        create: {
          courseCode,
          name,
          credits,
          theoryPeriods: credits * 10,
          practicePeriods: credits >= 4 ? 20 : 10,
          tuitionFeePerCredit: '650000',
          departmentId: departments[departmentIndex]!.id,
          status: RecordStatus.ACTIVE,
        },
      }),
    );
  }
  await Promise.all([
    prisma.prerequisite.upsert({
      where: {
        courseId_prerequisiteCourseId: {
          courseId: courses[1]!.id,
          prerequisiteCourseId: courses[0]!.id,
        },
      },
      update: {},
      create: {
        courseId: courses[1]!.id,
        prerequisiteCourseId: courses[0]!.id,
        minimumGrade: '5.00',
      },
    }),
    prisma.prerequisite.upsert({
      where: {
        courseId_prerequisiteCourseId: {
          courseId: courses[9]!.id,
          prerequisiteCourseId: courses[8]!.id,
        },
      },
      update: {},
      create: {
        courseId: courses[9]!.id,
        prerequisiteCourseId: courses[8]!.id,
        minimumGrade: '5.00',
      },
    }),
  ]);

  const classSections: ClassSection[] = [];
  for (let index = 0; index < 8; index += 1) {
    const course = courses[index]!;
    const lecturer = lecturers[index % lecturers.length]!;
    const sectionCode = `${course.courseCode}-20252-${String(index + 1).padStart(2, '0')}`;
    const classSection = await prisma.classSection.upsert({
      where: { sectionCode },
      update: { lecturerId: lecturer.id, status: ClassSectionStatus.IN_PROGRESS },
      create: {
        sectionCode,
        courseId: course.id,
        semesterId: semesters[1]!.id,
        lecturerId: lecturer.id,
        room: `A${index + 1}.0${(index % 4) + 1}`,
        maxCapacity: 40,
        status: ClassSectionStatus.IN_PROGRESS,
      },
    });
    classSections.push(classSection);
    const startHour = 7 + (index % 3) * 2;
    const startTime = new Date(`1970-01-01T${String(startHour).padStart(2, '0')}:00:00Z`);
    await prisma.schedule.upsert({
      where: {
        classSectionId_dayOfWeek_startTime: {
          classSectionId: classSection.id,
          dayOfWeek: (index % 6) + 2,
          startTime,
        },
      },
      update: { room: classSection.room },
      create: {
        classSectionId: classSection.id,
        dayOfWeek: (index % 6) + 2,
        startTime,
        endTime: new Date(`1970-01-01T${String(startHour + 2).padStart(2, '0')}:00:00Z`),
        room: classSection.room,
      },
    });
  }

  for (let studentIndex = 0; studentIndex < students.length; studentIndex += 1) {
    for (let offset = 0; offset < 3; offset += 1) {
      const student = students[studentIndex]!;
      const classSection = classSections[(studentIndex + offset) % classSections.length]!;
      await prisma.enrollment.upsert({
        where: {
          studentId_classSectionId: { studentId: student.id, classSectionId: classSection.id },
        },
        update: {},
        create: { studentId: student.id, classSectionId: classSection.id },
      });
    }
  }
  for (const classSection of classSections) {
    const enrolledCount = await prisma.enrollment.count({
      where: { classSectionId: classSection.id, status: 'ENROLLED' },
    });
    await prisma.classSection.update({ where: { id: classSection.id }, data: { enrolledCount } });
  }

  const difficultyLevels = [DifficultyLevel.EASY, DifficultyLevel.MEDIUM, DifficultyLevel.HARD];
  const questions: Question[] = [];
  for (let index = 0; index < 30; index += 1) {
    const course = courses[index % courses.length]!;
    const creator = lecturers[index % lecturers.length]!;
    const question = await prisma.question.upsert({
      where: { questionCode: `Q${String(index + 1).padStart(3, '0')}` },
      update: { courseId: course.id, createdByUserId: creator.userId },
      create: {
        questionCode: `Q${String(index + 1).padStart(3, '0')}`,
        courseId: course.id,
        content: `Câu hỏi mẫu ${index + 1} của môn ${course.name}: phương án nào sau đây đúng?`,
        chapter: `Chương ${(index % 5) + 1}`,
        difficulty: difficultyLevels[index % difficultyLevels.length]!,
        type: QuestionType.SINGLE_CHOICE,
        explanation: 'Phương án A là đáp án đúng trong dữ liệu phát triển.',
        createdByUserId: creator.userId,
        status: RecordStatus.ACTIVE,
      },
    });
    questions.push(question);
    for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
      await prisma.questionOption.upsert({
        where: { questionId_displayOrder: { questionId: question.id, displayOrder: optionIndex } },
        update: {
          content: `Phương án ${String.fromCharCode(65 + optionIndex)}`,
          isCorrect: optionIndex === 0,
        },
        create: {
          questionId: question.id,
          content: `Phương án ${String.fromCharCode(65 + optionIndex)}`,
          isCorrect: optionIndex === 0,
          displayOrder: optionIndex,
        },
      });
    }
  }

  for (let index = 0; index < 2; index += 1) {
    const classSection = classSections[index]!;
    const exam = await prisma.exam.upsert({
      where: { examCode: `EXAM-20252-${index + 1}` },
      update: { name: `Kiểm tra mẫu ${index + 1}` },
      create: {
        examCode: `EXAM-20252-${index + 1}`,
        name: `Kiểm tra mẫu ${index + 1}`,
        courseId: classSection.courseId,
        classSectionId: classSection.id,
        createdByUserId: lecturers[index]!.userId,
        startsAt: new Date(`2026-07-${20 + index}T01:00:00Z`),
        endsAt: new Date(`2026-07-${20 + index}T04:00:00Z`),
        durationMinutes: 60,
        maxAttempts: 1,
        passScore: '5.00',
        questionCount: 10,
        shuffleQuestions: true,
        shuffleOptions: true,
        showResult: true,
        status: ExamStatus.SCHEDULED,
      },
    });
    for (let questionIndex = 0; questionIndex < 10; questionIndex += 1) {
      const question = questions[index * 10 + questionIndex]!;
      await prisma.examQuestion.upsert({
        where: { examId_questionId: { examId: exam.id, questionId: question.id } },
        update: { displayOrder: questionIndex + 1 },
        create: {
          examId: exam.id,
          questionId: question.id,
          points: '1.00',
          displayOrder: questionIndex + 1,
        },
      });
    }
    for (const student of students.slice(0, 10)) {
      await prisma.examAssignment.upsert({
        where: { examId_studentId: { examId: exam.id, studentId: student.id } },
        update: {},
        create: { examId: exam.id, studentId: student.id },
      });
    }
  }

  let tuitionPolicy = await prisma.tuitionPolicy.findFirst({
    where: { semesterId: semesters[1]!.id, name: 'Chính sách học phí chuẩn 2025-2026' },
  });
  tuitionPolicy ??= await prisma.tuitionPolicy.create({
    data: {
      semesterId: semesters[1]!.id,
      name: 'Chính sách học phí chuẩn 2025-2026',
      description: 'Tính theo tín chỉ đăng ký trong học kỳ',
      creditFee: '650000',
      effectiveFrom: new Date('2026-01-01'),
      isActive: true,
    },
  });
  let serviceFee = await prisma.tuitionItem.findFirst({
    where: { tuitionPolicyId: tuitionPolicy.id, name: 'Phí dịch vụ sinh viên' },
  });
  serviceFee ??= await prisma.tuitionItem.create({
    data: {
      tuitionPolicyId: tuitionPolicy.id,
      name: 'Phí dịch vụ sinh viên',
      type: TuitionItemType.ADDITIONAL_FEE,
      amount: '300000',
    },
  });

  const invoices: Invoice[] = [];
  for (let index = 0; index < 5; index += 1) {
    const invoice = await prisma.invoice.upsert({
      where: { invoiceCode: `INV-20252-${String(index + 1).padStart(4, '0')}` },
      update: {},
      create: {
        invoiceCode: `INV-20252-${String(index + 1).padStart(4, '0')}`,
        studentId: students[index]!.id,
        semesterId: semesters[1]!.id,
        subtotal: '7800000',
        totalAmount: '8100000',
        balanceAmount: '8100000',
        dueDate: new Date('2026-07-31'),
        status: InvoiceStatus.UNPAID,
      },
    });
    invoices.push(invoice);
    if ((await prisma.invoiceItem.count({ where: { invoiceId: invoice.id } })) === 0) {
      await prisma.invoiceItem.createMany({
        data: [
          {
            invoiceId: invoice.id,
            description: 'Học phí 12 tín chỉ',
            quantity: 12,
            unitAmount: '650000',
            totalAmount: '7800000',
          },
          {
            invoiceId: invoice.id,
            tuitionItemId: serviceFee.id,
            description: serviceFee.name,
            quantity: 1,
            unitAmount: '300000',
            totalAmount: '300000',
          },
        ],
      });
    }
  }

  const successfulPayment = await prisma.paymentTransaction.upsert({
    where: { idempotencyKey: 'seed-payment-success-001' },
    update: {},
    create: {
      transactionCode: 'PAY-SEED-0001',
      invoiceId: invoices[0]!.id,
      studentId: students[0]!.id,
      provider: PaymentProvider.MOCK,
      externalTransactionId: 'MOCK-SUCCESS-0001',
      idempotencyKey: 'seed-payment-success-001',
      amount: '2000000',
      status: PaymentStatus.SUCCEEDED,
      completedAt: new Date('2026-07-10T03:00:00Z'),
    },
  });
  await prisma.invoice.update({
    where: { id: invoices[0]!.id },
    data: { paidAmount: '2000000', balanceAmount: '6100000', status: InvoiceStatus.PARTIALLY_PAID },
  });
  await prisma.receipt.upsert({
    where: { paymentTransactionId: successfulPayment.id },
    update: {},
    create: {
      receiptNumber: 'RCPT-SEED-0001',
      invoiceId: invoices[0]!.id,
      paymentTransactionId: successfulPayment.id,
      amount: '2000000',
    },
  });
  await prisma.paymentWebhook.upsert({
    where: { provider_eventId: { provider: PaymentProvider.MOCK, eventId: 'SEED-EVENT-0001' } },
    update: {},
    create: {
      paymentTransactionId: successfulPayment.id,
      provider: PaymentProvider.MOCK,
      eventId: 'SEED-EVENT-0001',
      signature: 'development-seed-signature',
      payload: { status: 'success', transactionCode: successfulPayment.transactionCode },
      status: 'PROCESSED',
      processedAt: new Date('2026-07-10T03:00:01Z'),
    },
  });
  await prisma.paymentTransaction.upsert({
    where: { idempotencyKey: 'seed-payment-failed-001' },
    update: {},
    create: {
      transactionCode: 'PAY-SEED-0002',
      invoiceId: invoices[1]!.id,
      studentId: students[1]!.id,
      provider: PaymentProvider.MOCK,
      externalTransactionId: 'MOCK-FAILED-0001',
      idempotencyKey: 'seed-payment-failed-001',
      amount: '1000000',
      status: PaymentStatus.FAILED,
      failureReason: 'Giao dịch mô phỏng thất bại',
      completedAt: new Date('2026-07-11T03:00:00Z'),
    },
  });
  await prisma.paymentTransaction.upsert({
    where: { idempotencyKey: 'seed-payment-pending-001' },
    update: {},
    create: {
      transactionCode: 'PAY-SEED-0003',
      invoiceId: invoices[2]!.id,
      studentId: students[2]!.id,
      provider: PaymentProvider.MOCK,
      idempotencyKey: 'seed-payment-pending-001',
      amount: '1500000',
      status: PaymentStatus.PENDING,
    },
  });

  if (
    !(await prisma.notification.findFirst({
      where: { userId: students[0]!.userId, type: NotificationType.PAYMENT_SUCCESS },
    }))
  ) {
    await prisma.notification.create({
      data: {
        userId: students[0]!.userId,
        type: NotificationType.PAYMENT_SUCCESS,
        title: 'Thanh toán thành công',
        content: 'Nhà trường đã ghi nhận khoản thanh toán 2.000.000 VND.',
      },
    });
  }

  console.info(
    'Seed hoàn tất: 3 khoa, 5 giảng viên, 20 sinh viên, 10 môn học, 2 học kỳ, 8 lớp học phần, 30 câu hỏi, 2 kỳ thi và 5 hóa đơn.',
  );
  console.info(
    'Tài khoản phát triển dùng mật khẩu Password@123. Không sử dụng mật khẩu này ở production.',
  );
}

main()
  .catch((error: unknown) => {
    console.error('Không thể seed dữ liệu:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
