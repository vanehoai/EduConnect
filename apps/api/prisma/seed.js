'use strict';
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === 'function' ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g['throw'] = verb(1)),
      (g['return'] = verb(2)),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                    ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
var client_1 = require('@prisma/client');
var bcryptjs_1 = require('bcryptjs');
var prisma = new client_1.PrismaClient();
var roles = [
  ['ADMIN', 'Quản trị viên'],
  ['TRAINING_STAFF', 'Phòng đào tạo'],
  ['FINANCE_STAFF', 'Phòng tài chính'],
  ['LECTURER', 'Giảng viên'],
  ['STUDENT', 'Sinh viên'],
];
var permissions = [
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
  ['fee.read', 'Xem khoản thu', 'finance'],
  ['fee.manage', 'Quản lý khoản thu', 'finance'],
  ['tuition-rate.read', 'Xem đơn giá học phí', 'finance'],
  ['tuition-rate.manage', 'Quản lý đơn giá học phí', 'finance'],
  ['invoice.create', 'Tạo hóa đơn', 'finance'],
  ['invoice.update', 'Cập nhật hóa đơn', 'finance'],
  ['invoice.cancel', 'Hủy hóa đơn', 'finance'],
  ['invoice.issue', 'Phát hành hóa đơn', 'finance'],
  ['payment.create', 'Tạo thanh toán', 'finance'],
  ['payment.verify', 'Xác nhận thanh toán', 'finance'],
  ['payment.cancel', 'Hủy thanh toán', 'finance'],
  ['receipt.read', 'Xem biên lai', 'finance'],
  ['receipt.issue', 'Phát hành biên lai', 'finance'],
  ['scholarship.read', 'Xem học bổng', 'finance'],
  ['scholarship.manage', 'Quản lý học bổng', 'finance'],
  ['adjustment.read', 'Xem điều chỉnh tài chính', 'finance'],
  ['adjustment.manage', 'Quản lý điều chỉnh tài chính', 'finance'],
  ['finance-report.read', 'Xem báo cáo tài chính', 'finance'],
  ['dashboard.admin.read', 'Xem dashboard admin', 'dashboard'],
  ['dashboard.training.read', 'Xem dashboard phòng đào tạo', 'dashboard'],
  ['dashboard.finance.read', 'Xem dashboard phòng tài chính', 'dashboard'],
  ['dashboard.lecturer.read', 'Xem dashboard giảng viên', 'dashboard'],
  ['dashboard.student.read', 'Xem dashboard sinh viên', 'dashboard'],
  ['analytics.academic.read', 'Xem thống kê học vụ', 'analytics'],
  ['analytics.attendance.read', 'Xem thống kê điểm danh', 'analytics'],
  ['analytics.examination.read', 'Xem thống kê thi cử', 'analytics'],
  ['analytics.finance.read', 'Xem thống kê tài chính', 'analytics'],
  ['academic-risk.read', 'Xem cảnh báo học vụ', 'academic-risk'],
  ['academic-risk.manage', 'Quản lý cảnh báo học vụ', 'academic-risk'],
  ['academic-risk.resolve', 'Giải quyết cảnh báo học vụ', 'academic-risk'],
  ['report.export', 'Xuất báo cáo', 'report'],
  // Phase 7
  ['announcement.read', 'Xem thông báo', 'announcement'],
  ['announcement.create', 'Tạo thông báo', 'announcement'],
  ['announcement.update', 'Cập nhật thông báo', 'announcement'],
  ['announcement.publish', 'Phát hành thông báo', 'announcement'],
  ['announcement.cancel', 'Hủy thông báo', 'announcement'],
  ['announcement.manage-audience', 'Quản lý đối tượng thông báo', 'announcement'],
  ['notification.read', 'Xem thông báo in-app', 'notification'],
  ['notification.manage', 'Quản lý thông báo in-app', 'notification'],
  ['notification-preference.manage', 'Quản lý cài đặt thông báo', 'notification'],
  ['service-request.read', 'Xem yêu cầu dịch vụ', 'service-request'],
  ['service-request.create', 'Tạo yêu cầu dịch vụ', 'service-request'],
  ['service-request.assign', 'Phân công yêu cầu', 'service-request'],
  ['service-request.update', 'Cập nhật yêu cầu', 'service-request'],
  ['service-request.resolve', 'Giải quyết yêu cầu', 'service-request'],
  ['service-request.cancel', 'Hủy yêu cầu', 'service-request'],
  ['service-request.comment', 'Bình luận yêu cầu', 'service-request'],
  ['service-request.internal-comment', 'Bình luận nội bộ', 'service-request'],
  ['service-request.report', 'Báo cáo yêu cầu', 'service-request'],
  ['service-request.export', 'Xuất dữ liệu yêu cầu', 'service-request'],
];
var permissionMap = {
  ADMIN: permissions.map(function (_a) {
    var code = _a[0];
    return code;
  }),
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
    'result.publish',
    'dashboard.training.read',
    'analytics.academic.read',
    'analytics.attendance.read',
    'analytics.examination.read',
    'academic-risk.read',
    'academic-risk.manage',
    'academic-risk.resolve',
    'report.export',
    'announcement.read',
    'announcement.create',
    'announcement.update',
    'announcement.publish',
    'announcement.cancel',
    'announcement.manage-audience',
    'notification.read',
    'notification.manage',
    'notification-preference.manage',
    'service-request.read',
    'service-request.assign',
    'service-request.update',
    'service-request.resolve',
    'service-request.cancel',
    'service-request.comment',
    'service-request.internal-comment',
    'service-request.report',
    'service-request.export',
  ],
  FINANCE_STAFF: [
    'student.read',
    'invoice.read',
    'invoice.manage',
    'invoice.create',
    'invoice.update',
    'invoice.cancel',
    'invoice.issue',
    'payment.read',
    'payment.manage',
    'payment.create',
    'payment.verify',
    'payment.cancel',
    'fee.read',
    'fee.manage',
    'tuition-rate.read',
    'tuition-rate.manage',
    'receipt.read',
    'receipt.issue',
    'scholarship.read',
    'scholarship.manage',
    'adjustment.read',
    'adjustment.manage',
    'finance-report.read',
    'dashboard.finance.read',
    'analytics.finance.read',
    'report.export',
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
    'dashboard.lecturer.read',
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
    'dashboard.student.read',
    'announcement.read',
    'notification.read',
    'notification-preference.manage',
    'service-request.read',
    'service-request.create',
    'service-request.cancel',
    'service-request.comment',
  ],
};
function seedAccessControl() {
  return __awaiter(this, void 0, void 0, function () {
    var savedRoles, savedPermissions, _loop_1, _i, savedRoles_1, role;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            Promise.all(
              roles.map(function (_a) {
                var code = _a[0],
                  name = _a[1];
                return prisma.role.upsert({
                  where: { code: code },
                  update: { name: name, isSystem: true },
                  create: { code: code, name: name, isSystem: true },
                });
              }),
            ),
          ];
        case 1:
          savedRoles = _b.sent();
          return [
            4 /*yield*/,
            Promise.all(
              permissions.map(function (_a) {
                var code = _a[0],
                  name = _a[1],
                  module = _a[2];
                return prisma.permission.upsert({
                  where: { code: code },
                  update: { name: name, module: module },
                  create: { code: code, name: name, module: module },
                });
              }),
            ),
          ];
        case 2:
          savedPermissions = _b.sent();
          _loop_1 = function (role) {
            var desiredCodes, desiredPermissions, _c, desiredPermissions_1, permission;
            return __generator(this, function (_d) {
              switch (_d.label) {
                case 0:
                  desiredCodes =
                    (_a = permissionMap[role.code]) !== null && _a !== void 0 ? _a : [];
                  desiredPermissions = savedPermissions.filter(function (permission) {
                    return desiredCodes.includes(permission.code);
                  });
                  return [
                    4 /*yield*/,
                    prisma.rolePermission.deleteMany({
                      where: {
                        roleId: role.id,
                        permissionId: {
                          notIn: desiredPermissions.map(function (permission) {
                            return permission.id;
                          }),
                        },
                      },
                    }),
                  ];
                case 1:
                  _d.sent();
                  ((_c = 0), (desiredPermissions_1 = desiredPermissions));
                  _d.label = 2;
                case 2:
                  if (!(_c < desiredPermissions_1.length)) return [3 /*break*/, 5];
                  permission = desiredPermissions_1[_c];
                  return [
                    4 /*yield*/,
                    prisma.rolePermission.upsert({
                      where: {
                        roleId_permissionId: { roleId: role.id, permissionId: permission.id },
                      },
                      update: {},
                      create: { roleId: role.id, permissionId: permission.id },
                    }),
                  ];
                case 3:
                  _d.sent();
                  _d.label = 4;
                case 4:
                  _c++;
                  return [3 /*break*/, 2];
                case 5:
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (savedRoles_1 = savedRoles));
          _b.label = 3;
        case 3:
          if (!(_i < savedRoles_1.length)) return [3 /*break*/, 6];
          role = savedRoles_1[_i];
          return [5 /*yield**/, _loop_1(role)];
        case 4:
          _b.sent();
          _b.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 3];
        case 6:
          return [
            2 /*return*/,
            new Map(
              savedRoles.map(function (role) {
                return [role.code, role.id];
              }),
            ),
          ];
      }
    });
  });
}
function upsertUser(email, fullName, roleCode, roleIds, passwordHash) {
  return __awaiter(this, void 0, void 0, function () {
    var user, roleId;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            prisma.user.upsert({
              where: { email: email },
              update: { fullName: fullName, status: client_1.UserStatus.ACTIVE },
              create: {
                email: email,
                fullName: fullName,
                passwordHash: passwordHash,
                status: client_1.UserStatus.ACTIVE,
              },
            }),
          ];
        case 1:
          user = _a.sent();
          roleId = roleIds.get(roleCode);
          if (!roleId)
            throw new Error('Kh\u00F4ng t\u00ECm th\u1EA5y vai tr\u00F2 '.concat(roleCode));
          return [
            4 /*yield*/,
            prisma.userRole.upsert({
              where: { userId_roleId: { userId: user.id, roleId: roleId } },
              update: {},
              create: { userId: user.id, roleId: roleId },
            }),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/, user];
      }
    });
  });
}
function main() {
  return __awaiter(this, void 0, void 0, function () {
    var passwordHash,
      roleIds,
      academicYear,
      semesterData,
      semesters,
      departmentData,
      departments,
      lecturerNames,
      lecturers,
      index,
      number,
      email,
      fullName,
      user,
      department,
      _a,
      _b,
      index,
      students,
      index,
      number,
      email,
      fullName,
      user,
      department,
      _c,
      _d,
      courseData,
      courses,
      _i,
      courseData_1,
      _e,
      courseCode,
      name_1,
      credits,
      departmentIndex,
      _f,
      _g,
      classSections,
      index,
      course,
      lecturer,
      sectionCode,
      classSection,
      startHour,
      startTime,
      studentIndex,
      offset,
      student,
      classSection,
      _h,
      classSections_1,
      classSection,
      enrolledCount,
      difficultyLevels,
      questions,
      index,
      course,
      creator,
      question,
      optionIndex,
      index,
      classSection,
      exam,
      questionIndex,
      question,
      _j,
      _k,
      student,
      tuitionPolicy,
      _l,
      serviceFee,
      _m,
      tuitionFeeType,
      regFeeType,
      examFeeType,
      tuitionRate,
      invoices,
      index,
      invoice,
      successfulPayment,
      academicRiskRules,
      _o,
      academicRiskRules_1,
      rule;
    return __generator(this, function (_p) {
      switch (_p.label) {
        case 0:
          return [4 /*yield*/, (0, bcryptjs_1.hash)('Password@123', 12)];
        case 1:
          passwordHash = _p.sent();
          return [4 /*yield*/, seedAccessControl()];
        case 2:
          roleIds = _p.sent();
          return [
            4 /*yield*/,
            Promise.all([
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
            ]),
          ];
        case 3:
          _p.sent();
          return [
            4 /*yield*/,
            prisma.academicYear.updateMany({
              where: { isCurrent: true, code: { not: '2025-2026' } },
              data: { isCurrent: false },
            }),
          ];
        case 4:
          _p.sent();
          return [
            4 /*yield*/,
            prisma.academicYear.upsert({
              where: { code: '2025-2026' },
              update: { isCurrent: true },
              create: {
                code: '2025-2026',
                name: 'Năm học 2025 - 2026',
                startDate: new Date('2025-09-01'),
                endDate: new Date('2026-08-31'),
                isCurrent: true,
              },
            }),
          ];
        case 5:
          academicYear = _p.sent();
          semesterData = [
            {
              code: '2025-2026-HK1',
              name: 'Học kỳ 1 - Năm học 2025-2026',
              term: client_1.SemesterTerm.FIRST,
              startDate: new Date('2025-09-01'),
              endDate: new Date('2026-01-15'),
              registrationStartDate: new Date('2025-08-01'),
              registrationEndDate: new Date('2025-08-20T23:59:59Z'),
              status: client_1.SemesterStatus.COMPLETED,
            },
            {
              code: '2025-2026-HK2',
              name: 'Học kỳ 2 - Năm học 2025-2026',
              term: client_1.SemesterTerm.SECOND,
              startDate: new Date('2026-02-01'),
              endDate: new Date('2026-07-31'),
              registrationStartDate: new Date('2026-01-10'),
              registrationEndDate: new Date('2026-01-25T23:59:59Z'),
              status: client_1.SemesterStatus.IN_PROGRESS,
            },
          ];
          return [
            4 /*yield*/,
            Promise.all(
              semesterData.map(function (semester) {
                return prisma.semester.upsert({
                  where: { code: semester.code },
                  update: { status: semester.status },
                  create: __assign(__assign({}, semester), {
                    academicYearId: academicYear.id,
                    maxCredits: 24,
                  }),
                });
              }),
            ),
          ];
        case 6:
          semesters = _p.sent();
          departmentData = [
            ['CNTT', 'Khoa Công nghệ thông tin', 'Đào tạo công nghệ và kỹ thuật phần mềm'],
            ['QTKD', 'Khoa Quản trị kinh doanh', 'Đào tạo quản trị và kinh doanh số'],
            ['NN', 'Khoa Ngoại ngữ', 'Đào tạo ngôn ngữ và giao tiếp quốc tế'],
          ];
          return [
            4 /*yield*/,
            Promise.all(
              departmentData.map(function (_a) {
                var code = _a[0],
                  name = _a[1],
                  description = _a[2];
                return prisma.department.upsert({
                  where: { code: code },
                  update: { name: name, description: description },
                  create: {
                    code: code,
                    name: name,
                    description: description,
                    status: client_1.RecordStatus.ACTIVE,
                  },
                });
              }),
            ),
          ];
        case 7:
          departments = _p.sent();
          lecturerNames = [
            'Nguyễn Minh Anh',
            'Trần Hoàng Long',
            'Lê Thu Hà',
            'Phạm Quốc Bảo',
            'Võ Ngọc Linh',
          ];
          lecturers = [];
          index = 0;
          _p.label = 8;
        case 8:
          if (!(index < 5)) return [3 /*break*/, 12];
          number = index + 1;
          email =
            index === 0 ? 'lecturer@school.local' : 'lecturer'.concat(number, '@school.local');
          fullName = lecturerNames[index];
          return [4 /*yield*/, upsertUser(email, fullName, 'LECTURER', roleIds, passwordHash)];
        case 9:
          user = _p.sent();
          department = departments[index % departments.length];
          _b = (_a = lecturers).push;
          return [
            4 /*yield*/,
            prisma.lecturer.upsert({
              where: { lecturerCode: 'GV'.concat(String(number).padStart(3, '0')) },
              update: { fullName: fullName, departmentId: department.id },
              create: {
                lecturerCode: 'GV'.concat(String(number).padStart(3, '0')),
                userId: user.id,
                departmentId: department.id,
                fullName: fullName,
                email: email,
                phone: '09010000'.concat(String(number).padStart(2, '0')),
                dateOfBirth: new Date('198'.concat(index, '-05-15')),
                gender: index % 2 === 0 ? client_1.Gender.FEMALE : client_1.Gender.MALE,
                academicRank: index < 2 ? 'Tiến sĩ' : 'Thạc sĩ',
                specialization: [
                  'Kỹ thuật phần mềm',
                  'Hệ thống thông tin',
                  'Marketing số',
                  'Quản trị học',
                  'Ngôn ngữ Anh',
                ][index],
                status: client_1.LecturerStatus.ACTIVE,
              },
            }),
          ];
        case 10:
          _b.apply(_a, [_p.sent()]);
          _p.label = 11;
        case 11:
          index += 1;
          return [3 /*break*/, 8];
        case 12:
          index = 0;
          _p.label = 13;
        case 13:
          if (!(index < departments.length)) return [3 /*break*/, 16];
          return [
            4 /*yield*/,
            prisma.department.update({
              where: { id: departments[index].id },
              data: { headLecturerId: lecturers[index].id },
            }),
          ];
        case 14:
          _p.sent();
          _p.label = 15;
        case 15:
          index += 1;
          return [3 /*break*/, 13];
        case 16:
          students = [];
          index = 0;
          _p.label = 17;
        case 17:
          if (!(index < 20)) return [3 /*break*/, 21];
          number = index + 1;
          email = index === 0 ? 'student@school.local' : 'student'.concat(number, '@school.local');
          fullName = 'Sinh vi\u00EAn M\u1EABu '.concat(String(number).padStart(2, '0'));
          return [4 /*yield*/, upsertUser(email, fullName, 'STUDENT', roleIds, passwordHash)];
        case 18:
          user = _p.sent();
          department = departments[index % departments.length];
          _d = (_c = students).push;
          return [
            4 /*yield*/,
            prisma.student.upsert({
              where: { studentCode: 'SV2025'.concat(String(number).padStart(3, '0')) },
              update: { fullName: fullName, departmentId: department.id },
              create: {
                studentCode: 'SV2025'.concat(String(number).padStart(3, '0')),
                userId: user.id,
                departmentId: department.id,
                admissionAcademicYearId: academicYear.id,
                fullName: fullName,
                email: email,
                phone: '09120000'.concat(String(number).padStart(2, '0')),
                dateOfBirth: new Date('200'.concat(index % 5, '-0').concat((index % 8) + 1, '-15')),
                gender: index % 2 === 0 ? client_1.Gender.MALE : client_1.Gender.FEMALE,
                address: 'Thành phố Hồ Chí Minh',
                cohortClass: ''.concat(department.code, '2025A'),
                cohort: 'K2025',
                enrollmentDate: new Date('2025-09-01'),
                academicStatus: client_1.AcademicStatus.STUDYING,
              },
            }),
          ];
        case 19:
          _d.apply(_c, [_p.sent()]);
          _p.label = 20;
        case 20:
          index += 1;
          return [3 /*break*/, 17];
        case 21:
          courseData = [
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
          ];
          courses = [];
          ((_i = 0), (courseData_1 = courseData));
          _p.label = 22;
        case 22:
          if (!(_i < courseData_1.length)) return [3 /*break*/, 25];
          ((_e = courseData_1[_i]),
            (courseCode = _e[0]),
            (name_1 = _e[1]),
            (credits = _e[2]),
            (departmentIndex = _e[3]));
          _g = (_f = courses).push;
          return [
            4 /*yield*/,
            prisma.course.upsert({
              where: { courseCode: courseCode },
              update: {
                name: name_1,
                credits: credits,
                departmentId: departments[departmentIndex].id,
              },
              create: {
                courseCode: courseCode,
                name: name_1,
                credits: credits,
                theoryPeriods: credits * 10,
                practicePeriods: credits >= 4 ? 20 : 10,
                tuitionFeePerCredit: '650000',
                departmentId: departments[departmentIndex].id,
                status: client_1.RecordStatus.ACTIVE,
              },
            }),
          ];
        case 23:
          _g.apply(_f, [_p.sent()]);
          _p.label = 24;
        case 24:
          _i++;
          return [3 /*break*/, 22];
        case 25:
          return [
            4 /*yield*/,
            Promise.all([
              prisma.prerequisite.upsert({
                where: {
                  courseId_prerequisiteCourseId: {
                    courseId: courses[1].id,
                    prerequisiteCourseId: courses[0].id,
                  },
                },
                update: {},
                create: {
                  courseId: courses[1].id,
                  prerequisiteCourseId: courses[0].id,
                  minimumGrade: '5.00',
                },
              }),
              prisma.prerequisite.upsert({
                where: {
                  courseId_prerequisiteCourseId: {
                    courseId: courses[9].id,
                    prerequisiteCourseId: courses[8].id,
                  },
                },
                update: {},
                create: {
                  courseId: courses[9].id,
                  prerequisiteCourseId: courses[8].id,
                  minimumGrade: '5.00',
                },
              }),
            ]),
          ];
        case 26:
          _p.sent();
          classSections = [];
          index = 0;
          _p.label = 27;
        case 27:
          if (!(index < 8)) return [3 /*break*/, 31];
          course = courses[index];
          lecturer = lecturers[index % lecturers.length];
          sectionCode = ''
            .concat(course.courseCode, '-20252-')
            .concat(String(index + 1).padStart(2, '0'));
          return [
            4 /*yield*/,
            prisma.classSection.upsert({
              where: { sectionCode: sectionCode },
              update: { lecturerId: lecturer.id, status: client_1.ClassSectionStatus.IN_PROGRESS },
              create: {
                sectionCode: sectionCode,
                courseId: course.id,
                semesterId: semesters[1].id,
                lecturerId: lecturer.id,
                room: 'A'.concat(index + 1, '.0').concat((index % 4) + 1),
                maxCapacity: 40,
                status: client_1.ClassSectionStatus.IN_PROGRESS,
              },
            }),
          ];
        case 28:
          classSection = _p.sent();
          classSections.push(classSection);
          startHour = 7 + (index % 3) * 2;
          startTime = new Date('1970-01-01T'.concat(String(startHour).padStart(2, '0'), ':00:00Z'));
          return [
            4 /*yield*/,
            prisma.schedule.upsert({
              where: {
                classSectionId_dayOfWeek_startTime: {
                  classSectionId: classSection.id,
                  dayOfWeek: (index % 6) + 2,
                  startTime: startTime,
                },
              },
              update: { room: classSection.room },
              create: {
                classSectionId: classSection.id,
                dayOfWeek: (index % 6) + 2,
                startTime: startTime,
                endTime: new Date(
                  '1970-01-01T'.concat(String(startHour + 2).padStart(2, '0'), ':00:00Z'),
                ),
                room: classSection.room,
              },
            }),
          ];
        case 29:
          _p.sent();
          _p.label = 30;
        case 30:
          index += 1;
          return [3 /*break*/, 27];
        case 31:
          studentIndex = 0;
          _p.label = 32;
        case 32:
          if (!(studentIndex < students.length)) return [3 /*break*/, 37];
          offset = 0;
          _p.label = 33;
        case 33:
          if (!(offset < 3)) return [3 /*break*/, 36];
          student = students[studentIndex];
          classSection = classSections[(studentIndex + offset) % classSections.length];
          return [
            4 /*yield*/,
            prisma.enrollment.upsert({
              where: {
                studentId_classSectionId: {
                  studentId: student.id,
                  classSectionId: classSection.id,
                },
              },
              update: {},
              create: { studentId: student.id, classSectionId: classSection.id },
            }),
          ];
        case 34:
          _p.sent();
          _p.label = 35;
        case 35:
          offset += 1;
          return [3 /*break*/, 33];
        case 36:
          studentIndex += 1;
          return [3 /*break*/, 32];
        case 37:
          ((_h = 0), (classSections_1 = classSections));
          _p.label = 38;
        case 38:
          if (!(_h < classSections_1.length)) return [3 /*break*/, 42];
          classSection = classSections_1[_h];
          return [
            4 /*yield*/,
            prisma.enrollment.count({
              where: { classSectionId: classSection.id, status: 'ENROLLED' },
            }),
          ];
        case 39:
          enrolledCount = _p.sent();
          return [
            4 /*yield*/,
            prisma.classSection.update({
              where: { id: classSection.id },
              data: { enrolledCount: enrolledCount },
            }),
          ];
        case 40:
          _p.sent();
          _p.label = 41;
        case 41:
          _h++;
          return [3 /*break*/, 38];
        case 42:
          difficultyLevels = [
            client_1.DifficultyLevel.EASY,
            client_1.DifficultyLevel.MEDIUM,
            client_1.DifficultyLevel.HARD,
          ];
          questions = [];
          index = 0;
          _p.label = 43;
        case 43:
          if (!(index < 30)) return [3 /*break*/, 49];
          course = courses[index % courses.length];
          creator = lecturers[index % lecturers.length];
          return [
            4 /*yield*/,
            prisma.question.upsert({
              where: { questionCode: 'Q'.concat(String(index + 1).padStart(3, '0')) },
              update: { courseId: course.id, createdByUserId: creator.userId },
              create: {
                questionCode: 'Q'.concat(String(index + 1).padStart(3, '0')),
                courseId: course.id,
                content: 'C\u00E2u h\u1ECFi m\u1EABu '
                  .concat(index + 1, ' c\u1EE7a m\u00F4n ')
                  .concat(
                    course.name,
                    ': ph\u01B0\u01A1ng \u00E1n n\u00E0o sau \u0111\u00E2y \u0111\u00FAng?',
                  ),
                chapter: 'Ch\u01B0\u01A1ng '.concat((index % 5) + 1),
                difficulty: difficultyLevels[index % difficultyLevels.length],
                type: client_1.QuestionType.SINGLE_CHOICE,
                explanation: 'Phương án A là đáp án đúng trong dữ liệu phát triển.',
                createdByUserId: creator.userId,
                status: client_1.RecordStatus.ACTIVE,
              },
            }),
          ];
        case 44:
          question = _p.sent();
          questions.push(question);
          optionIndex = 0;
          _p.label = 45;
        case 45:
          if (!(optionIndex < 4)) return [3 /*break*/, 48];
          return [
            4 /*yield*/,
            prisma.questionOption.upsert({
              where: {
                questionId_displayOrder: { questionId: question.id, displayOrder: optionIndex },
              },
              update: {
                content: 'Ph\u01B0\u01A1ng \u00E1n '.concat(String.fromCharCode(65 + optionIndex)),
                isCorrect: optionIndex === 0,
              },
              create: {
                questionId: question.id,
                content: 'Ph\u01B0\u01A1ng \u00E1n '.concat(String.fromCharCode(65 + optionIndex)),
                isCorrect: optionIndex === 0,
                displayOrder: optionIndex,
              },
            }),
          ];
        case 46:
          _p.sent();
          _p.label = 47;
        case 47:
          optionIndex += 1;
          return [3 /*break*/, 45];
        case 48:
          index += 1;
          return [3 /*break*/, 43];
        case 49:
          index = 0;
          _p.label = 50;
        case 50:
          if (!(index < 2)) return [3 /*break*/, 60];
          classSection = classSections[index];
          return [
            4 /*yield*/,
            prisma.exam.upsert({
              where: { examCode: 'EXAM-20252-'.concat(index + 1) },
              update: { name: 'Ki\u1EC3m tra m\u1EABu '.concat(index + 1) },
              create: {
                examCode: 'EXAM-20252-'.concat(index + 1),
                name: 'Ki\u1EC3m tra m\u1EABu '.concat(index + 1),
                courseId: classSection.courseId,
                classSectionId: classSection.id,
                createdByUserId: lecturers[index].userId,
                startsAt: new Date('2026-07-'.concat(20 + index, 'T01:00:00Z')),
                endsAt: new Date('2026-07-'.concat(20 + index, 'T04:00:00Z')),
                durationMinutes: 60,
                maxAttempts: 1,
                passScore: '5.00',
                questionCount: 10,
                shuffleQuestions: true,
                shuffleOptions: true,
                showResult: true,
                status: client_1.ExamStatus.SCHEDULED,
              },
            }),
          ];
        case 51:
          exam = _p.sent();
          questionIndex = 0;
          _p.label = 52;
        case 52:
          if (!(questionIndex < 10)) return [3 /*break*/, 55];
          question = questions[index * 10 + questionIndex];
          return [
            4 /*yield*/,
            prisma.examQuestion.upsert({
              where: { examId_questionId: { examId: exam.id, questionId: question.id } },
              update: { displayOrder: questionIndex + 1 },
              create: {
                examId: exam.id,
                questionId: question.id,
                points: '1.00',
                displayOrder: questionIndex + 1,
              },
            }),
          ];
        case 53:
          _p.sent();
          _p.label = 54;
        case 54:
          questionIndex += 1;
          return [3 /*break*/, 52];
        case 55:
          ((_j = 0), (_k = students.slice(0, 10)));
          _p.label = 56;
        case 56:
          if (!(_j < _k.length)) return [3 /*break*/, 59];
          student = _k[_j];
          return [
            4 /*yield*/,
            prisma.examAssignment.upsert({
              where: { examId_studentId: { examId: exam.id, studentId: student.id } },
              update: {},
              create: { examId: exam.id, studentId: student.id },
            }),
          ];
        case 57:
          _p.sent();
          _p.label = 58;
        case 58:
          _j++;
          return [3 /*break*/, 56];
        case 59:
          index += 1;
          return [3 /*break*/, 50];
        case 60:
          return [
            4 /*yield*/,
            prisma.tuitionPolicy.findFirst({
              where: { semesterId: semesters[1].id, name: 'Chính sách học phí chuẩn 2025-2026' },
            }),
          ];
        case 61:
          tuitionPolicy = _p.sent();
          if (!(tuitionPolicy !== null && tuitionPolicy !== void 0)) return [3 /*break*/, 62];
          _l = tuitionPolicy;
          return [3 /*break*/, 64];
        case 62:
          return [
            4 /*yield*/,
            prisma.tuitionPolicy.create({
              data: {
                semesterId: semesters[1].id,
                name: 'Chính sách học phí chuẩn 2025-2026',
                description: 'Tính theo tín chỉ đăng ký trong học kỳ',
                creditFee: '650000',
                effectiveFrom: new Date('2026-01-01'),
                isActive: true,
              },
            }),
          ];
        case 63:
          _l = tuitionPolicy = _p.sent();
          _p.label = 64;
        case 64:
          _l;
          return [
            4 /*yield*/,
            prisma.tuitionItem.findFirst({
              where: { tuitionPolicyId: tuitionPolicy.id, name: 'Phí dịch vụ sinh viên' },
            }),
          ];
        case 65:
          serviceFee = _p.sent();
          if (!(serviceFee !== null && serviceFee !== void 0)) return [3 /*break*/, 66];
          _m = serviceFee;
          return [3 /*break*/, 68];
        case 66:
          return [
            4 /*yield*/,
            prisma.tuitionItem.create({
              data: {
                tuitionPolicyId: tuitionPolicy.id,
                name: 'Phí dịch vụ sinh viên',
                type: client_1.TuitionItemType.ADDITIONAL_FEE,
                amount: '300000',
              },
            }),
          ];
        case 67:
          _m = serviceFee = _p.sent();
          _p.label = 68;
        case 68:
          _m;
          return [
            4 /*yield*/,
            prisma.feeType.upsert({
              where: { code: 'TUITION' },
              update: {},
              create: {
                code: 'TUITION',
                name: 'Học phí',
                category: 'TUITION',
                calculationMethod: 'PER_CREDIT',
                isMandatory: true,
              },
            }),
          ];
        case 69:
          tuitionFeeType = _p.sent();
          return [
            4 /*yield*/,
            prisma.feeType.upsert({
              where: { code: 'REGISTRATION_FEE' },
              update: {},
              create: {
                code: 'REGISTRATION_FEE',
                name: 'Phí nhập học',
                category: 'OTHER',
                calculationMethod: 'FIXED',
                isMandatory: true,
              },
            }),
          ];
        case 70:
          regFeeType = _p.sent();
          return [
            4 /*yield*/,
            prisma.feeType.upsert({
              where: { code: 'EXAM_FEE' },
              update: {},
              create: {
                code: 'EXAM_FEE',
                name: 'Phí thi lại',
                category: 'EXAM',
                calculationMethod: 'FIXED',
                isMandatory: false,
              },
            }),
          ];
        case 71:
          examFeeType = _p.sent();
          // Prevent unused vars lint error
          console.log('Created fee types:', tuitionFeeType.code, regFeeType.code, examFeeType.code);
          return [
            4 /*yield*/,
            prisma.tuitionRate.findFirst({
              where: { academicYearId: academicYear.id, feeTypeId: tuitionFeeType.id },
            }),
          ];
        case 72:
          tuitionRate = _p.sent();
          if (!!tuitionRate) return [3 /*break*/, 74];
          return [
            4 /*yield*/,
            prisma.tuitionRate.create({
              data: {
                academicYearId: academicYear.id,
                feeTypeId: tuitionFeeType.id,
                amountPerCredit: '650000',
                effectiveFrom: new Date('2025-08-01'),
              },
            }),
          ];
        case 73:
          _p.sent();
          _p.label = 74;
        case 74:
          return [
            4 /*yield*/,
            prisma.scholarship.upsert({
              where: { code: 'SCH-100' },
              update: {},
              create: {
                code: 'SCH-100',
                name: 'Học bổng toàn phần',
                discountType: 'PERCENTAGE',
                discountValue: '100',
                effectiveFrom: new Date('2025-08-01'),
                isActive: true,
              },
            }),
          ];
        case 75:
          _p.sent();
          invoices = [];
          index = 0;
          _p.label = 76;
        case 76:
          if (!(index < 5)) return [3 /*break*/, 81];
          return [
            4 /*yield*/,
            prisma.invoice.upsert({
              where: { invoiceCode: 'INV-20252-'.concat(String(index + 1).padStart(4, '0')) },
              update: {},
              create: {
                invoiceCode: 'INV-20252-'.concat(String(index + 1).padStart(4, '0')),
                studentId: students[index].id,
                semesterId: semesters[1].id,
                subtotal: '7800000',
                totalAmount: '8100000',
                balanceAmount: '8100000',
                dueDate: new Date('2026-07-31'),
                status: client_1.InvoiceStatus.UNPAID,
              },
            }),
          ];
        case 77:
          invoice = _p.sent();
          invoices.push(invoice);
          return [4 /*yield*/, prisma.invoiceItem.count({ where: { invoiceId: invoice.id } })];
        case 78:
          if (!(_p.sent() === 0)) return [3 /*break*/, 80];
          return [
            4 /*yield*/,
            prisma.invoiceItem.createMany({
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
            }),
          ];
        case 79:
          _p.sent();
          _p.label = 80;
        case 80:
          index += 1;
          return [3 /*break*/, 76];
        case 81:
          return [
            4 /*yield*/,
            prisma.paymentTransaction.upsert({
              where: { idempotencyKey: 'seed-payment-success-001' },
              update: {},
              create: {
                transactionCode: 'PAY-SEED-0001',
                invoiceId: invoices[0].id,
                studentId: students[0].id,
                provider: client_1.PaymentProvider.MOCK,
                externalTransactionId: 'MOCK-SUCCESS-0001',
                idempotencyKey: 'seed-payment-success-001',
                amount: '2000000',
                status: client_1.PaymentStatus.SUCCEEDED,
                completedAt: new Date('2026-07-10T03:00:00Z'),
              },
            }),
          ];
        case 82:
          successfulPayment = _p.sent();
          return [
            4 /*yield*/,
            prisma.invoice.update({
              where: { id: invoices[0].id },
              data: {
                paidAmount: '2000000',
                balanceAmount: '6100000',
                status: client_1.InvoiceStatus.PARTIALLY_PAID,
              },
            }),
          ];
        case 83:
          _p.sent();
          return [
            4 /*yield*/,
            prisma.receipt.upsert({
              where: { paymentTransactionId: successfulPayment.id },
              update: {},
              create: {
                receiptNumber: 'RCPT-SEED-0001',
                invoiceId: invoices[0].id,
                paymentTransactionId: successfulPayment.id,
                amount: '2000000',
              },
            }),
          ];
        case 84:
          _p.sent();
          return [
            4 /*yield*/,
            prisma.paymentWebhook.upsert({
              where: {
                provider_eventId: {
                  provider: client_1.PaymentProvider.MOCK,
                  eventId: 'SEED-EVENT-0001',
                },
              },
              update: {},
              create: {
                paymentTransactionId: successfulPayment.id,
                provider: client_1.PaymentProvider.MOCK,
                eventId: 'SEED-EVENT-0001',
                signature: 'development-seed-signature',
                payload: { status: 'success', transactionCode: successfulPayment.transactionCode },
                status: 'PROCESSED',
                processedAt: new Date('2026-07-10T03:00:01Z'),
              },
            }),
          ];
        case 85:
          _p.sent();
          return [
            4 /*yield*/,
            prisma.paymentTransaction.upsert({
              where: { idempotencyKey: 'seed-payment-failed-001' },
              update: {},
              create: {
                transactionCode: 'PAY-SEED-0002',
                invoiceId: invoices[1].id,
                studentId: students[1].id,
                provider: client_1.PaymentProvider.MOCK,
                externalTransactionId: 'MOCK-FAILED-0001',
                idempotencyKey: 'seed-payment-failed-001',
                amount: '1000000',
                status: client_1.PaymentStatus.FAILED,
                failureReason: 'Giao dịch mô phỏng thất bại',
                completedAt: new Date('2026-07-11T03:00:00Z'),
              },
            }),
          ];
        case 86:
          _p.sent();
          return [
            4 /*yield*/,
            prisma.paymentTransaction.upsert({
              where: { idempotencyKey: 'seed-payment-pending-001' },
              update: {},
              create: {
                transactionCode: 'PAY-SEED-0003',
                invoiceId: invoices[2].id,
                studentId: students[2].id,
                provider: client_1.PaymentProvider.MOCK,
                idempotencyKey: 'seed-payment-pending-001',
                amount: '1500000',
                status: client_1.PaymentStatus.PENDING,
              },
            }),
          ];
        case 87:
          _p.sent();
          return [
            4 /*yield*/,
            prisma.notification.findFirst({
              where: {
                userId: students[0].userId,
                type: client_1.NotificationType.PAYMENT_SUCCESS,
              },
            }),
          ];
        case 88:
          if (!!_p.sent()) return [3 /*break*/, 90];
          return [
            4 /*yield*/,
            prisma.notification.create({
              data: {
                userId: students[0].userId,
                type: client_1.NotificationType.PAYMENT_SUCCESS,
                title: 'Thanh toán thành công',
                content: 'Nhà trường đã ghi nhận khoản thanh toán 2.000.000 VND.',
              },
            }),
          ];
        case 89:
          _p.sent();
          _p.label = 90;
        case 90:
          academicRiskRules = [
            {
              code: 'LOW_GPA',
              name: 'GPA học kỳ thấp',
              type: 'LOW_GPA',
              defaultSeverity: 'MEDIUM',
              evaluationPeriodType: 'semester',
              thresholdConfig: { minGpa: 2.0 },
              isActive: true,
            },
            {
              code: 'GPA_DECLINE',
              name: 'GPA giảm mạnh',
              type: 'GPA_DECLINE',
              defaultSeverity: 'MEDIUM',
              evaluationPeriodType: 'semester',
              thresholdConfig: { maxDecline: 0.5 },
              isActive: true,
            },
            {
              code: 'HIGH_ABSENCE',
              name: 'Tỷ lệ vắng cao',
              type: 'HIGH_ABSENCE',
              defaultSeverity: 'HIGH',
              evaluationPeriodType: 'semester',
              thresholdConfig: { maxAbsenceRate: 0.2 },
              isActive: true,
            },
            {
              code: 'CONSECUTIVE_ABSENCE',
              name: 'Vắng liên tiếp',
              type: 'CONSECUTIVE_ABSENCE',
              defaultSeverity: 'HIGH',
              evaluationPeriodType: 'week',
              thresholdConfig: { maxConsecutive: 3 },
              isActive: true,
            },
            {
              code: 'FAILED_COURSES',
              name: 'Trượt nhiều môn',
              type: 'FAILED_COURSES',
              defaultSeverity: 'HIGH',
              evaluationPeriodType: 'semester',
              thresholdConfig: { maxFailedCourses: 2 },
              isActive: true,
            },
            {
              code: 'LOW_CREDIT_COMPLETION',
              name: 'Hoàn thành ít tín chỉ',
              type: 'LOW_CREDIT_COMPLETION',
              defaultSeverity: 'MEDIUM',
              evaluationPeriodType: 'semester',
              thresholdConfig: { minCompletionRate: 0.5 },
              isActive: true,
            },
            {
              code: 'EXAM_INCOMPLETE',
              name: 'Bỏ lỡ kỳ thi',
              type: 'EXAM_INCOMPLETE',
              defaultSeverity: 'MEDIUM',
              evaluationPeriodType: 'semester',
              thresholdConfig: { maxMissedExams: 1 },
              isActive: true,
            },
            {
              code: 'FINANCIAL_HOLD',
              name: 'Công nợ quá hạn',
              type: 'FINANCIAL_HOLD',
              defaultSeverity: 'MEDIUM',
              evaluationPeriodType: 'month',
              thresholdConfig: { overdueThresholdDays: 30 },
              isActive: true,
            },
          ];
          ((_o = 0), (academicRiskRules_1 = academicRiskRules));
          _p.label = 91;
        case 91:
          if (!(_o < academicRiskRules_1.length)) return [3 /*break*/, 94];
          rule = academicRiskRules_1[_o];
          return [
            4 /*yield*/,
            prisma.academicRiskRule.upsert({
              where: { code: rule.code },
              update: rule,
              create: rule,
            }),
          ];
        case 92:
          _p.sent();
          _p.label = 93;
        case 93:
          _o++;
          return [3 /*break*/, 91];
        case 94:
          console.info(
            'Seed hoàn tất: 3 khoa, 5 giảng viên, 20 sinh viên, 10 môn học, 2 học kỳ, 8 lớp học phần, 30 câu hỏi, 2 kỳ thi và 5 hóa đơn.',
          );
          console.info(
            'Tài khoản phát triển dùng mật khẩu Password@123. Không sử dụng mật khẩu này ở production.',
          );
          return [2 /*return*/];
      }
    });
  });
}
main()
  .catch(function (error) {
    console.error('Không thể seed dữ liệu:', error);
    process.exitCode = 1;
  })
  .finally(function () {
    return __awaiter(void 0, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, prisma.$disconnect()];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  });
