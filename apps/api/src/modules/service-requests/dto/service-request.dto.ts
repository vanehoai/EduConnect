import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsUUID,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ServiceRequestPriority, CommentVisibility } from '@school/shared-types';

export class AttachmentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fileName!: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  fileSize?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  mimeType?: string;
}

export class CreateServiceRequestCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  owningDepartmentId?: string;

  @ApiPropertyOptional({ enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'] })
  @IsEnum(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
  @IsOptional()
  defaultPriority?: ServiceRequestPriority;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  defaultAssigneeRoleId?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  slaHours?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requiresAttachment?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateServiceRequestCategoryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  owningDepartmentId?: string;

  @ApiPropertyOptional({ enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'] })
  @IsEnum(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
  @IsOptional()
  defaultPriority?: ServiceRequestPriority;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  defaultAssigneeRoleId?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  slaHours?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requiresAttachment?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class CreateServiceRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  categoryId!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  subject!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional({ enum: ['LOW', 'NORMAL', 'HIGH', 'URGENT'] })
  @IsEnum(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
  @IsOptional()
  priority?: ServiceRequestPriority;

  @ApiPropertyOptional({ type: [AttachmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  attachments?: AttachmentDto[];
}

export class AssignServiceRequestDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  assignedToUserId!: string;
}

export class ResolveServiceRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  resolutionSummary!: string;
}

export class CancelServiceRequestDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cancelReason!: string;
}

export class CreateServiceRequestCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ enum: ['PUBLIC', 'INTERNAL'] })
  @IsEnum(['PUBLIC', 'INTERNAL'])
  @IsOptional()
  visibility?: CommentVisibility;

  @ApiPropertyOptional({ type: [AttachmentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  attachments?: AttachmentDto[];
}
