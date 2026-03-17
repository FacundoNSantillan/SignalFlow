import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailTemplateService {
  private readonly logger = new Logger(MailTemplateService.name);

  compile(templateName: string, context: any): string {
    try {
      const templatePath = path.resolve(process.cwd(), 'dist/infrastructure/templates', `${templateName}.hbs`);
      
      this.logger.debug(`Buscando template en: ${templatePath}`);

      if (!fs.existsSync(templatePath)) {
        const fallbackPath = path.resolve(process.cwd(), 'src/infrastructure/templates', `${templateName}.hbs`);
        if (fs.existsSync(fallbackPath)) {
          const content = fs.readFileSync(fallbackPath, 'utf8');
          return handlebars.compile(content)(context);
        }
        throw new Error(`Archivo no encontrado en dist ni en src: ${templatePath}`);
      }

      const templateContent = fs.readFileSync(templatePath, 'utf8');
      return handlebars.compile(templateContent)(context);
    } catch (error) {
      this.logger.error(`Error en MailTemplateService: ${error.message}`);
      throw error;
    }
  }
}