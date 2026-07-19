import { Module } from '@nestjs/common';
import { LecturersController } from './lecturers.controller';
import { LecturersService } from './lecturers.service';
import { ClassSectionsModule } from '../modules/class-sections/class-sections.module';
import { SchedulesModule } from '../modules/schedules/schedules.module';

@Module({
  imports: [ClassSectionsModule, SchedulesModule],
  controllers: [LecturersController],
  providers: [LecturersService],
  exports: [LecturersService],
})
export class LecturersModule {}
