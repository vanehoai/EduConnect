import { Controller, Get, Put, Post, Param, Body, UseGuards, Ip, Headers } from '@nestjs/common';
import { ExamAttemptsService } from './exam-attempts.service';
import { AutoSaveAnswerDto } from './dto/auto-save-answer.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';

@Controller()
@UseGuards(JwtAuthGuard, PermissionsGuard)
export class ExamAttemptsController {
  constructor(private readonly examAttemptsService: ExamAttemptsService) {}

  @Post('exams/:id/attempts/start')
  @Permissions('attempt.start')
  startAttempt(
    @Param('id') examId: string,
    @CurrentUser() user: AuthenticatedUser,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ) {
    return this.examAttemptsService.startAttempt(examId, user.id, ip, userAgent);
  }

  @Get('exam-attempts/:id')
  getAttemptDetails(
    @Param('id') attemptId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.examAttemptsService.getAttemptDetails(attemptId, user);
  }

  @Put('exam-attempts/:id/answers/:questionId')
  @Permissions('attempt.start')
  autoSaveAnswer(
    @Param('id') attemptId: string,
    @Param('questionId') questionId: string,
    @Body() dto: AutoSaveAnswerDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.examAttemptsService.autoSaveAnswer(attemptId, questionId, dto.selectedOptionIds, user.id);
  }

  @Post('exam-attempts/:id/submit')
  @Permissions('attempt.submit')
  submitAttempt(
    @Param('id') attemptId: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.examAttemptsService.submitAttempt(attemptId, user.id);
  }
}
