import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { randomUUID } from 'node:crypto';
import { AdminModule } from './admin/admin.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { CsrfGuard } from './auth/guards/csrf.guard';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { PermissionsGuard } from './auth/guards/permissions.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { validateEnvironment } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { DepartmentsModule } from './departments/departments.module';
import { LecturersModule } from './lecturers/lecturers.module';
import { StudentsModule } from './students/students.module';
import { AcademicYearsModule } from './academic-years/academic-years.module';
import { SemestersModule } from './semesters/semesters.module';
import { CoursesModule } from './courses/courses.module';
import { ClassSectionsModule } from './modules/class-sections/class-sections.module';
import { SchedulesModule } from './modules/schedules/schedules.module';
import { PrismaModule } from './prisma/prisma.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { GradesModule } from './modules/grades/grades.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { ExamsModule } from './modules/exams/exams.module';
import { ExamAttemptsModule } from './modules/exam-attempts/exam-attempts.module';
import { FinanceModule } from './modules/finance/finance.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { AcademicRisksModule } from './modules/academic-risks/academic-risks.module';
import { ServiceRequestsModule } from './modules/service-requests/service-requests.module';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { NotificationPreferencesModule } from './modules/notification-preferences/notification-preferences.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        genReqId: (req) => req.headers['x-request-id'] || randomUUID(),
        redact: {
          paths: [
            'req.headers.authorization',
            'req.headers.cookie',
            'req.body.password',
            'req.body.token',
          ],
          censor: '***',
        },
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { singleLine: true },
              }
            : undefined,
      },
    }),
    PrismaModule,
    AuditModule,
    AuthModule,
    AdminModule,
    DepartmentsModule,
    LecturersModule,
    StudentsModule,
    AcademicYearsModule,
    SemestersModule,
    CoursesModule,
    ClassSectionsModule,
    SchedulesModule,
    HealthModule,
    EnrollmentsModule,
    AttendanceModule,
    GradesModule,
    QuestionsModule,
    ExamsModule,
    ExamAttemptsModule,
    FinanceModule,
    DashboardModule,
    AnalyticsModule,
    AcademicRisksModule,
    ServiceRequestsModule,
    AnnouncementsModule,
    NotificationPreferencesModule,
    NotificationsModule,
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ApiResponseInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard,
    },
    {
      provide: APP_GUARD,
      useClass: CsrfGuard,
    },
  ],
})
export class AppModule {}
