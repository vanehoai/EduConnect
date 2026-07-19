import type { ResourcePageConfig, ResourceOption } from '@/components/academic/resource-page';

const recordStatuses: ResourceOption[] = [
  { value: 'ACTIVE', label: 'Hoạt động' },
  { value: 'INACTIVE', label: 'Ngừng hoạt động' },
  { value: 'ARCHIVED', label: 'Lưu trữ' },
];
const genders: ResourceOption[] = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];
const departmentLookup = {
  endpoint: '/departments?limit=100&sortBy=code&sortOrder=asc',
  labelKeys: ['code', 'name'],
};
const academicYearLookup = {
  endpoint: '/academic-years?limit=100&sortBy=startDate&sortOrder=desc',
  labelKeys: ['code', 'name'],
};

export const departmentConfig: ResourcePageConfig = {
  title: 'Khoa',
  description: 'Quản lý cơ cấu khoa và trưởng khoa.',
  endpoint: '/departments',
  entityLabel: 'khoa',
  readPermission: 'department.read',
  createPermission: 'department.create',
  updatePermission: 'department.update',
  deletePermission: 'department.delete',
  columns: [
    { key: 'code', label: 'Mã khoa' },
    { key: 'name', label: 'Tên khoa' },
    { key: 'headLecturer.fullName', label: 'Trưởng khoa' },
    { key: 'status', label: 'Trạng thái' },
  ],
  fields: [
    { name: 'code', label: 'Mã khoa', required: true },
    { name: 'name', label: 'Tên khoa', required: true },
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    {
      name: 'headLecturerId',
      label: 'Trưởng khoa',
      type: 'select',
      lookup: {
        endpoint: '/lecturers?limit=100&sortBy=lecturerCode&sortOrder=asc',
        labelKeys: ['lecturerCode', 'fullName'],
      },
    },
    { name: 'status', label: 'Trạng thái', type: 'select', options: recordStatuses },
  ],
  filters: [
    { name: 'status', label: 'Trạng thái', options: recordStatuses },
    {
      name: 'includeDeleted',
      label: 'Dữ liệu đã xóa',
      options: [{ value: 'true', label: 'Hiển thị cả đã xóa' }],
    },
  ],
  sortOptions: [
    { value: 'code', label: 'Mã khoa' },
    { value: 'name', label: 'Tên khoa' },
    { value: 'createdAt', label: 'Ngày tạo' },
  ],
  defaultSort: 'code',
};

export const lecturerConfig: ResourcePageConfig = {
  title: 'Giảng viên',
  description: 'Hồ sơ giảng viên liên kết với tài khoản LECTURER.',
  endpoint: '/lecturers',
  entityLabel: 'giảng viên',
  readPermission: 'lecturer.read',
  createPermission: 'lecturer.create',
  updatePermission: 'lecturer.update',
  deletePermission: 'lecturer.delete',
  columns: [
    { key: 'lecturerCode', label: 'Mã GV' },
    { key: 'fullName', label: 'Họ tên' },
    { key: 'email', label: 'Email' },
    { key: 'department.code', label: 'Khoa' },
    { key: 'status', label: 'Trạng thái' },
  ],
  fields: [
    { name: 'lecturerCode', label: 'Mã giảng viên', required: true },
    { name: 'userId', label: 'ID tài khoản LECTURER', required: true, createOnly: true },
    {
      name: 'departmentId',
      label: 'Khoa',
      type: 'select',
      lookup: departmentLookup,
      required: true,
    },
    { name: 'fullName', label: 'Họ tên', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Số điện thoại' },
    { name: 'dateOfBirth', label: 'Ngày sinh', type: 'date' },
    { name: 'gender', label: 'Giới tính', type: 'select', options: genders },
    { name: 'academicRank', label: 'Học hàm/học vị' },
    { name: 'specialization', label: 'Chuyên môn' },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'ACTIVE', label: 'Hoạt động' },
        { value: 'ON_LEAVE', label: 'Nghỉ phép' },
        { value: 'RETIRED', label: 'Nghỉ hưu' },
        { value: 'INACTIVE', label: 'Ngừng hoạt động' },
      ],
    },
  ],
  filters: [
    {
      name: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'ACTIVE', label: 'Hoạt động' },
        { value: 'ON_LEAVE', label: 'Nghỉ phép' },
        { value: 'RETIRED', label: 'Nghỉ hưu' },
        { value: 'INACTIVE', label: 'Ngừng hoạt động' },
      ],
    },
    {
      name: 'includeDeleted',
      label: 'Dữ liệu đã xóa',
      options: [{ value: 'true', label: 'Hiển thị cả đã xóa' }],
    },
  ],
  sortOptions: [
    { value: 'lecturerCode', label: 'Mã GV' },
    { value: 'fullName', label: 'Họ tên' },
    { value: 'createdAt', label: 'Ngày tạo' },
  ],
  defaultSort: 'lecturerCode',
};

export const studentConfig: ResourcePageConfig = {
  title: 'Sinh viên',
  description: 'Quản lý hồ sơ, import và export danh sách sinh viên.',
  endpoint: '/students',
  entityLabel: 'sinh viên',
  readPermission: 'student.read',
  createPermission: 'student.create',
  updatePermission: 'student.update',
  deletePermission: 'student.delete',
  columns: [
    { key: 'studentCode', label: 'Mã SV' },
    { key: 'fullName', label: 'Họ tên' },
    { key: 'email', label: 'Email' },
    { key: 'department.code', label: 'Khoa' },
    { key: 'cohortClass', label: 'Lớp khóa' },
    { key: 'academicStatus', label: 'Trạng thái' },
  ],
  fields: [
    { name: 'studentCode', label: 'Mã sinh viên', required: true },
    { name: 'userId', label: 'ID tài khoản STUDENT', required: true, createOnly: true },
    {
      name: 'departmentId',
      label: 'Khoa',
      type: 'select',
      lookup: departmentLookup,
      required: true,
    },
    {
      name: 'admissionAcademicYearId',
      label: 'Năm nhập học',
      type: 'select',
      lookup: academicYearLookup,
    },
    { name: 'fullName', label: 'Họ tên', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'phone', label: 'Số điện thoại' },
    { name: 'dateOfBirth', label: 'Ngày sinh', type: 'date' },
    { name: 'gender', label: 'Giới tính', type: 'select', options: genders },
    { name: 'address', label: 'Địa chỉ', type: 'textarea' },
    { name: 'cohortClass', label: 'Lớp khóa', required: true },
    { name: 'cohort', label: 'Khóa', required: true },
    { name: 'enrollmentDate', label: 'Ngày nhập học', type: 'date', required: true },
    {
      name: 'academicStatus',
      label: 'Trạng thái học tập',
      type: 'select',
      options: [
        { value: 'STUDYING', label: 'Đang học' },
        { value: 'SUSPENDED', label: 'Bảo lưu' },
        { value: 'GRADUATED', label: 'Tốt nghiệp' },
        { value: 'WITHDRAWN', label: 'Thôi học' },
      ],
    },
  ],
  filters: [
    {
      name: 'academicStatus',
      label: 'Trạng thái',
      options: [
        { value: 'STUDYING', label: 'Đang học' },
        { value: 'SUSPENDED', label: 'Bảo lưu' },
        { value: 'GRADUATED', label: 'Tốt nghiệp' },
        { value: 'WITHDRAWN', label: 'Thôi học' },
      ],
    },
    {
      name: 'includeDeleted',
      label: 'Dữ liệu đã xóa',
      options: [{ value: 'true', label: 'Hiển thị cả đã xóa' }],
    },
  ],
  sortOptions: [
    { value: 'studentCode', label: 'Mã SV' },
    { value: 'fullName', label: 'Họ tên' },
    { value: 'enrollmentDate', label: 'Ngày nhập học' },
    { value: 'createdAt', label: 'Ngày tạo' },
  ],
  defaultSort: 'studentCode',
};

export const academicYearConfig: ResourcePageConfig = {
  title: 'Năm học',
  description: 'Chỉ một năm học được đánh dấu là hiện tại.',
  endpoint: '/academic-years',
  entityLabel: 'năm học',
  readPermission: 'academic-year.read',
  createPermission: 'academic-year.manage',
  updatePermission: 'academic-year.manage',
  deletePermission: 'academic-year.manage',
  columns: [
    { key: 'code', label: 'Mã' },
    { key: 'name', label: 'Tên năm học' },
    { key: 'startDate', label: 'Bắt đầu' },
    { key: 'endDate', label: 'Kết thúc' },
    { key: 'isCurrent', label: 'Hiện tại' },
  ],
  fields: [
    { name: 'code', label: 'Mã năm học', required: true },
    { name: 'name', label: 'Tên năm học', required: true },
    { name: 'startDate', label: 'Ngày bắt đầu', type: 'date', required: true },
    { name: 'endDate', label: 'Ngày kết thúc', type: 'date', required: true },
    { name: 'isCurrent', label: 'Đặt làm năm học hiện tại', type: 'checkbox' },
  ],
  filters: [
    {
      name: 'isCurrent',
      label: 'Hiện tại',
      options: [
        { value: 'true', label: 'Năm hiện tại' },
        { value: 'false', label: 'Không hiện tại' },
      ],
    },
  ],
  sortOptions: [
    { value: 'startDate', label: 'Ngày bắt đầu' },
    { value: 'code', label: 'Mã' },
    { value: 'name', label: 'Tên' },
    { value: 'createdAt', label: 'Ngày tạo' },
  ],
  defaultSort: 'startDate',
};

export const semesterConfig: ResourcePageConfig = {
  title: 'Học kỳ',
  description: 'Quản lý mốc thời gian và trạng thái đăng ký học.',
  endpoint: '/semesters',
  entityLabel: 'học kỳ',
  readPermission: 'semester.read',
  createPermission: 'semester.manage',
  updatePermission: 'semester.manage',
  deletePermission: 'semester.manage',
  columns: [
    { key: 'code', label: 'Mã' },
    { key: 'name', label: 'Tên học kỳ' },
    { key: 'academicYear.code', label: 'Năm học' },
    { key: 'startDate', label: 'Bắt đầu' },
    { key: 'status', label: 'Trạng thái' },
  ],
  fields: [
    {
      name: 'academicYearId',
      label: 'Năm học',
      type: 'select',
      lookup: academicYearLookup,
      required: true,
    },
    { name: 'code', label: 'Mã học kỳ', required: true },
    { name: 'name', label: 'Tên học kỳ', required: true },
    {
      name: 'term',
      label: 'Kỳ',
      type: 'select',
      required: true,
      options: [
        { value: 'FIRST', label: 'Kỳ 1' },
        { value: 'SECOND', label: 'Kỳ 2' },
        { value: 'SUMMER', label: 'Kỳ hè' },
      ],
    },
    { name: 'startDate', label: 'Ngày bắt đầu', type: 'date', required: true },
    { name: 'endDate', label: 'Ngày kết thúc', type: 'date', required: true },
    { name: 'registrationStartDate', label: 'Mở đăng ký', type: 'datetime-local', required: true },
    { name: 'registrationEndDate', label: 'Đóng đăng ký', type: 'datetime-local', required: true },
    { name: 'maxCredits', label: 'Số tín chỉ tối đa', type: 'number' },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'PLANNED', label: 'Dự kiến' },
        { value: 'REGISTRATION_OPEN', label: 'Mở đăng ký' },
        { value: 'IN_PROGRESS', label: 'Đang học' },
        { value: 'COMPLETED', label: 'Hoàn thành' },
        { value: 'CLOSED', label: 'Đã đóng' },
      ],
    },
  ],
  filters: [
    {
      name: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'PLANNED', label: 'Dự kiến' },
        { value: 'REGISTRATION_OPEN', label: 'Mở đăng ký' },
        { value: 'IN_PROGRESS', label: 'Đang học' },
        { value: 'COMPLETED', label: 'Hoàn thành' },
        { value: 'CLOSED', label: 'Đã đóng' },
      ],
    },
  ],
  sortOptions: [
    { value: 'startDate', label: 'Ngày bắt đầu' },
    { value: 'code', label: 'Mã' },
    { value: 'name', label: 'Tên' },
    { value: 'status', label: 'Trạng thái' },
    { value: 'createdAt', label: 'Ngày tạo' },
  ],
  defaultSort: 'startDate',
};

export const courseConfig: ResourcePageConfig = {
  title: 'Môn học',
  description: 'Quản lý danh mục môn học và điều kiện tiên quyết.',
  endpoint: '/courses',
  entityLabel: 'môn học',
  readPermission: 'course.read',
  createPermission: 'course.create',
  updatePermission: 'course.update',
  deletePermission: 'course.delete',
  detailPath: (row) => `/dashboard/courses/${String(row.id)}`,
  columns: [
    { key: 'courseCode', label: 'Mã môn' },
    { key: 'name', label: 'Tên môn' },
    { key: 'credits', label: 'Tín chỉ' },
    { key: 'department.code', label: 'Khoa' },
    {
      key: 'tuitionFeePerCredit',
      label: 'Học phí/TC',
      format: (value) => new Intl.NumberFormat('vi-VN').format(Number(value)),
    },
    { key: 'status', label: 'Trạng thái' },
  ],
  fields: [
    { name: 'courseCode', label: 'Mã môn học', required: true },
    { name: 'name', label: 'Tên môn học', required: true },
    {
      name: 'departmentId',
      label: 'Khoa',
      type: 'select',
      lookup: departmentLookup,
      required: true,
    },
    { name: 'credits', label: 'Số tín chỉ', type: 'number', required: true },
    { name: 'theoryPeriods', label: 'Số tiết lý thuyết', type: 'number' },
    { name: 'practicePeriods', label: 'Số tiết thực hành', type: 'number' },
    { name: 'tuitionFeePerCredit', label: 'Học phí mỗi tín chỉ', type: 'number', required: true },
    { name: 'description', label: 'Mô tả', type: 'textarea' },
    { name: 'status', label: 'Trạng thái', type: 'select', options: recordStatuses },
  ],
  filters: [
    { name: 'status', label: 'Trạng thái', options: recordStatuses },
    {
      name: 'includeDeleted',
      label: 'Dữ liệu đã xóa',
      options: [{ value: 'true', label: 'Hiển thị cả đã xóa' }],
    },
  ],
  sortOptions: [
    { value: 'courseCode', label: 'Mã môn' },
    { value: 'name', label: 'Tên môn' },
    { value: 'credits', label: 'Tín chỉ' },
    { value: 'createdAt', label: 'Ngày tạo' },
  ],
  defaultSort: 'courseCode',
};

export const classSectionConfig: ResourcePageConfig = {
  title: 'Lớp học phần',
  description: 'Quản lý các lớp học phần và phân công giảng dạy.',
  endpoint: '/class-sections',
  entityLabel: 'lớp học phần',
  readPermission: 'class-section.read',
  createPermission: 'class-section.create',
  updatePermission: 'class-section.update',
  deletePermission: 'class-section.delete',
  detailPath: (row) => `/dashboard/class-sections/${String(row.id)}`,
  columns: [
    { key: 'code', label: 'Mã lớp' },
    { key: 'name', label: 'Tên lớp' },
    { key: 'course.code', label: 'Môn học' },
    { key: 'semester.name', label: 'Học kỳ' },
    { key: 'lecturer.fullName', label: 'Giảng viên' },
    { key: 'enrolled', label: 'Sĩ số', format: (value, row) => `${value}/${row.capacity}` },
    { key: 'status', label: 'Trạng thái' },
  ],
  fields: [
    { name: 'code', label: 'Mã lớp', required: true },
    { name: 'name', label: 'Tên lớp', required: true },
    {
      name: 'courseId',
      label: 'Môn học',
      type: 'select',
      lookup: {
        endpoint: '/courses?limit=500&sortBy=courseCode&sortOrder=asc',
        labelKeys: ['courseCode', 'name'],
      },
      required: true,
    },
    {
      name: 'semesterId',
      label: 'Học kỳ',
      type: 'select',
      lookup: {
        endpoint: '/semesters?limit=100&sortBy=startDate&sortOrder=desc',
        labelKeys: ['code', 'name'],
      },
      required: true,
    },
    {
      name: 'lecturerId',
      label: 'Giảng viên',
      type: 'select',
      lookup: {
        endpoint: '/lecturers?limit=500&sortBy=lecturerCode&sortOrder=asc',
        labelKeys: ['lecturerCode', 'fullName'],
      },
    },
    { name: 'capacity', label: 'Sĩ số tối đa', type: 'number', required: true },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'PLANNED', label: 'Dự kiến' },
        { value: 'OPEN', label: 'Mở đăng ký' },
        { value: 'CLOSED', label: 'Đóng đăng ký' },
        { value: 'IN_PROGRESS', label: 'Đang diễn ra' },
        { value: 'COMPLETED', label: 'Đã kết thúc' },
        { value: 'CANCELLED', label: 'Đã hủy' },
      ],
    },
  ],
  filters: [
    {
      name: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'PLANNED', label: 'Dự kiến' },
        { value: 'OPEN', label: 'Mở đăng ký' },
        { value: 'CLOSED', label: 'Đóng đăng ký' },
        { value: 'IN_PROGRESS', label: 'Đang diễn ra' },
        { value: 'COMPLETED', label: 'Đã kết thúc' },
        { value: 'CANCELLED', label: 'Đã hủy' },
      ],
    },
  ],
  sortOptions: [
    { value: 'code', label: 'Mã lớp' },
    { value: 'name', label: 'Tên lớp' },
    { value: 'createdAt', label: 'Ngày tạo' },
  ],
  defaultSort: 'code',
};

export const enrollmentConfig: ResourcePageConfig = {
  title: 'Đăng ký học phần',
  description: 'Quản lý danh sách đăng ký môn học của sinh viên.',
  endpoint: '/enrollments',
  entityLabel: 'đăng ký',
  readPermission: 'enrollment.read',
  createPermission: 'enrollment.create',
  updatePermission: 'enrollment.manage',
  deletePermission: 'enrollment.cancel',
  detailPath: (row) => `/dashboard/enrollments/${String(row.id)}`,
  columns: [
    { key: 'student.studentCode', label: 'Mã SV' },
    { key: 'student.fullName', label: 'Tên SV' },
    { key: 'classSection.code', label: 'Mã lớp' },
    { key: 'status', label: 'Trạng thái' },
    {
      key: 'enrollmentDate',
      label: 'Ngày đăng ký',
      format: (value) => (value ? new Date(value as string).toLocaleString('vi-VN') : ''),
    },
  ],
  fields: [
    {
      name: 'studentId',
      label: 'Sinh viên',
      type: 'select',
      lookup: {
        endpoint: '/students?limit=500&sortBy=studentCode&sortOrder=asc',
        labelKeys: ['studentCode', 'fullName'],
      },
      required: true,
    },
    {
      name: 'classSectionId',
      label: 'Lớp học phần',
      type: 'select',
      lookup: {
        endpoint: '/class-sections?limit=500&sortBy=code&sortOrder=asc',
        labelKeys: ['code', 'name'],
      },
      required: true,
    },
    {
      name: 'status',
      label: 'Trạng thái',
      type: 'select',
      options: [
        { value: 'PENDING', label: 'Chờ duyệt' },
        { value: 'ENROLLED', label: 'Đã đăng ký' },
        { value: 'CANCELLED', label: 'Đã hủy' },
      ],
    },
  ],
  filters: [
    {
      name: 'status',
      label: 'Trạng thái',
      options: [
        { value: 'PENDING', label: 'Chờ duyệt' },
        { value: 'ENROLLED', label: 'Đã đăng ký' },
        { value: 'CANCELLED', label: 'Đã hủy' },
      ],
    },
  ],
  sortOptions: [
    { value: 'createdAt', label: 'Ngày tạo' },
    { value: 'enrollmentDate', label: 'Ngày đăng ký' },
  ],
  defaultSort: 'createdAt',
};
