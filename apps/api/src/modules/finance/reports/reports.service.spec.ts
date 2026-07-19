import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../../../prisma/prisma.service';

describe('ReportsService', () => {
  let service: ReportsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  describe('escapeCsv', () => {
    it('should escape strings starting with =', () => {
      expect(service.escapeCsv('=1+1')).toBe("'=" + '1+1');
    });
    it('should escape strings starting with +', () => {
      expect(service.escapeCsv('+1+1')).toBe("'+1+1");
    });
    it('should escape strings starting with -', () => {
      expect(service.escapeCsv('-1+1')).toBe("'-1+1");
    });
    it('should escape strings starting with @', () => {
      expect(service.escapeCsv('@SUM(A1:A2)')).toBe("'@SUM(A1:A2)");
    });
    it('should enclose in quotes if contains comma', () => {
      expect(service.escapeCsv('hello,world')).toBe('"hello,world"');
    });
    it('should enclose in quotes and double quotes if contains quotes', () => {
      expect(service.escapeCsv('hello"world')).toBe('"hello""world"');
    });
    it('should enclose in quotes if contains newline', () => {
      expect(service.escapeCsv('hello\nworld')).toBe('"hello\nworld"');
    });
    it('should do both injection prevention and quote escaping', () => {
      expect(service.escapeCsv('=cmd|/c calc.exe",')).toBe('"\'=cmd|/c calc.exe"","');
      // If it starts with =, it becomes '=cmd|...
      // Then if it has quotes or commas, it wraps the whole thing in quotes and doubles the inner quotes.
      // So '=cmd|/c calc.exe", becomes "'=cmd|/c calc.exe"",""|/c calc.exe"","
    });
  });

  describe('CSV Injection Test specifically', () => {
    it('escapes correctly', () => {
      const input = '=cmd|/C"calc"!A0';
      // Step 1: injection prefix: '=cmd|/C"calc"!A0
      // Step 2: contains quote, so wrap in quotes and double quotes
      // '"\'=cmd|/C""calc""!A0"'
      const escaped = service.escapeCsv(input);
      expect(escaped).toBe('"\'=cmd|/C""calc""!A0"');
    });
  });
});
