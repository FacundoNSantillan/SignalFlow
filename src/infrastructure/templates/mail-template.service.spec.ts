import { Test, TestingModule } from '@nestjs/testing';
import { MailTemplateService } from './mail-templates.service';

describe('MailTemplateService', () => {
  let service: MailTemplateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MailTemplateService],
    }).compile();

    service = module.get<MailTemplateService>(MailTemplateService);
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });

  it('Debe lanzar un error si el template no existe', () => {
    expect(() => service.compile('template-fantasma', {})).toThrow(/Archivo no encontrado/);
  });
});