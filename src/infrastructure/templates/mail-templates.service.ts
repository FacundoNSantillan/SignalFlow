import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MailTemplateService {
  private readonly logger = new Logger(MailTemplateService.name);

  compile(templateName: string, context: any): string {
    try {
      const templateDir = path.join(__dirname); 
      const templatePath = path.join(templateDir, `${templateName}.hbs`);
      
      this.logger.debug(`Buscando template en: ${templatePath}`);

      if (!fs.existsSync(templatePath)) {
        throw new Error(`El archivo de plantilla no existe en la ruta: ${templatePath}`);
      }

      const templateContent = fs.readFileSync(templatePath, 'utf8');
      const template = handlebars.compile(templateContent);
      
      return template(context);
    } catch (error) {
      this.logger.error(`Error en MailTemplateService: ${error.message}`);
      throw error; 
    }
  }
}