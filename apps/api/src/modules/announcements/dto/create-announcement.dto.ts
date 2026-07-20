import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  AnnouncementCategory,
  AnnouncementPriority,
  AnnouncementAudienceType,
} from '@prisma/client';

export class CreateAnnouncementAudienceDto {
  @IsEnum(['ALL_USERS', 'ROLE', 'DEPARTMENT', 'CLASS_SECTION', 'STUDENT', 'LECTURER'])
  audienceType!: AnnouncementAudienceType;

  @IsOptional()
  @IsString()
  roleId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  classSectionId?: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsString()
  lecturerId?: string;
}

export class CreateAnnouncementDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsEnum([
    'GENERAL',
    'ACADEMIC',
    'EXAM',
    'ATTENDANCE',
    'FINANCE',
    'SCHOLARSHIP',
    'SYSTEM',
    'EVENT',
    'OTHER',
  ])
  @IsOptional()
  category?: AnnouncementCategory;

  @IsEnum(['LOW', 'NORMAL', 'HIGH', 'URGENT'])
  @IsOptional()
  priority?: AnnouncementPriority;

  @IsOptional()
  @IsDateString()
  publishAt?: string;

  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnnouncementAudienceDto)
  audiences!: CreateAnnouncementAudienceDto[];
}
