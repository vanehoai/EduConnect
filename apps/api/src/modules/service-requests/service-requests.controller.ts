import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ServiceRequestsService } from './service-requests.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { Permissions } from '../../auth/decorators/permissions.decorator';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { AuthUser, ServiceRequestStatus, ServiceRequestPriority } from '@school/shared-types';
import {
  CreateServiceRequestCategoryDto,
  UpdateServiceRequestCategoryDto,
  CreateServiceRequestDto,
  AssignServiceRequestDto,
  ResolveServiceRequestDto,
  CancelServiceRequestDto,
  CreateServiceRequestCommentDto,
} from './dto/service-request.dto';

@ApiTags('Service Requests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class ServiceRequestsController {
  constructor(private readonly serviceRequestsService: ServiceRequestsService) {}

  // ================= CATEGORIES =================

  @ApiOperation({ summary: 'Get all service request categories' })
  @Get('service-request-categories')
  async getCategories(@Query('isActive') isActive?: boolean) {
    // Both students and staff can view categories
    return this.serviceRequestsService.getCategories(
      isActive !== undefined ? String(isActive) === 'true' : undefined,
    );
  }

  @ApiOperation({ summary: 'Create service request category' })
  @Permissions('role.manage') // Assuming manage permission for categories
  @Post('service-request-categories')
  async createCategory(
    @Body() dto: CreateServiceRequestCategoryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.serviceRequestsService.createCategory(dto, user);
  }

  @ApiOperation({ summary: 'Update service request category' })
  @Permissions('role.manage')
  @Patch('service-request-categories/:id')
  async updateCategory(
    @Param('id') id: string,
    @Body() dto: UpdateServiceRequestCategoryDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.serviceRequestsService.updateCategory(id, dto, user);
  }

  @ApiOperation({ summary: 'Delete (deactivate) service request category' })
  @Permissions('role.manage')
  @Delete('service-request-categories/:id')
  async deleteCategory(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.serviceRequestsService.deleteCategory(id, user);
  }

  // ================= SERVICE REQUESTS =================

  @ApiOperation({ summary: 'Get service requests (Admin/Staff)' })
  @Permissions('service-request.read')
  @Get('service-requests')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'assigneeId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async getRequests(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: ServiceRequestStatus,
    @Query('priority') priority?: ServiceRequestPriority,
    @Query('categoryId') categoryId?: string,
    @Query('assigneeId') assigneeId?: string,
    @Query('search') search?: string,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.serviceRequestsService.getServiceRequests(
      page,
      limit,
      { status, priority, categoryId, assigneeId, search },
      user!,
    );
  }

  @ApiOperation({ summary: 'Get student service requests' })
  @Get('students/me/service-requests')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getStudentRequests(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: ServiceRequestStatus,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.serviceRequestsService.getServiceRequests(page, limit, { status }, user!);
  }

  @ApiOperation({ summary: 'Create service request (Student)' })
  @Permissions('service-request.create')
  @Post('students/me/service-requests')
  async createRequest(@Body() dto: CreateServiceRequestDto, @CurrentUser() user: AuthUser) {
    return this.serviceRequestsService.createServiceRequest(user.id, dto, user);
  }

  @ApiOperation({ summary: 'Get service request details' })
  @Get('service-requests/:id')
  async getRequestById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.serviceRequestsService.getServiceRequestById(id, user);
  }

  @ApiOperation({ summary: 'Get student service request details' })
  @Get('students/me/service-requests/:id')
  async getStudentRequestById(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.serviceRequestsService.getServiceRequestById(id, user);
  }

  // ================= WORKFLOW ACTIONS =================

  @ApiOperation({ summary: 'Assign service request' })
  @Permissions('service-request.assign')
  @Post('service-requests/:id/assign')
  async assignRequest(
    @Param('id') id: string,
    @Body() dto: AssignServiceRequestDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.serviceRequestsService.assignRequest(id, dto, user);
  }

  @ApiOperation({ summary: 'Unassign service request' })
  @Permissions('service-request.assign')
  @Post('service-requests/:id/unassign')
  async unassignRequest(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.serviceRequestsService.unassignRequest(id, user);
  }

  @ApiOperation({ summary: 'Start progress on service request' })
  @Permissions('service-request.update')
  @Post('service-requests/:id/start')
  async startProgress(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.serviceRequestsService.startProgress(id, user);
  }

  @ApiOperation({ summary: 'Resolve service request' })
  @Permissions('service-request.resolve')
  @Post('service-requests/:id/resolve')
  async resolveRequest(
    @Param('id') id: string,
    @Body() dto: ResolveServiceRequestDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.serviceRequestsService.resolveRequest(id, dto, user);
  }

  @ApiOperation({ summary: 'Close service request' })
  @Permissions('service-request.resolve')
  @Post('service-requests/:id/close')
  async closeRequest(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.serviceRequestsService.closeRequest(id, user);
  }

  @ApiOperation({ summary: 'Reopen service request' })
  @Permissions('service-request.resolve')
  @Post('service-requests/:id/reopen')
  async reopenRequest(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.serviceRequestsService.reopenRequest(id, user);
  }

  @ApiOperation({ summary: 'Cancel service request' })
  @Permissions('service-request.cancel')
  @Post('service-requests/:id/cancel')
  async cancelRequest(
    @Param('id') id: string,
    @Body() dto: CancelServiceRequestDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.serviceRequestsService.cancelRequest(id, dto, user);
  }

  // ================= COMMENTS =================

  @ApiOperation({ summary: 'Add comment to service request' })
  @Permissions('service-request.comment')
  @Post('service-requests/:id/comments')
  async addComment(
    @Param('id') id: string,
    @Body() dto: CreateServiceRequestCommentDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.serviceRequestsService.addComment(id, dto, user);
  }

  @ApiOperation({ summary: 'Get comments of a service request' })
  @Permissions('service-request.read')
  @Get('service-requests/:id/comments')
  async getComments(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.serviceRequestsService.getComments(id, user);
  }

  @ApiOperation({ summary: 'Export service requests CSV' })
  @Permissions('service-request.export')
  @Get('service-requests/reports/export')
  async exportCsv() {
    const csvContent = await this.serviceRequestsService.exportToCsv();
    return csvContent; // Could be decorated with @Header('Content-Type', 'text/csv') etc, handled simply here
  }

  @ApiOperation({ summary: 'Get service requests summary report' })
  @Permissions('service-request.report')
  @Get('service-requests/reports/summary')
  async getReportSummary() {
    return this.serviceRequestsService.getReportSummary();
  }

  @ApiOperation({ summary: 'Get service requests by category report' })
  @Permissions('service-request.report')
  @Get('service-requests/reports/by-category')
  async getReportByCategory() {
    return this.serviceRequestsService.getReportByCategory();
  }

  @ApiOperation({ summary: 'Get service requests by status report' })
  @Permissions('service-request.report')
  @Get('service-requests/reports/by-status')
  async getReportByStatus() {
    return this.serviceRequestsService.getReportByStatus();
  }

  @ApiOperation({ summary: 'Get service requests by assignee report' })
  @Permissions('service-request.report')
  @Get('service-requests/reports/by-assignee')
  async getReportByAssignee() {
    return this.serviceRequestsService.getReportByAssignee();
  }

  @ApiOperation({ summary: 'Get service requests SLA report' })
  @Permissions('service-request.report')
  @Get('service-requests/reports/sla')
  async getReportSla() {
    return this.serviceRequestsService.getReportSla();
  }
}
