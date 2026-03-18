import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsEnum, IsObject, IsOptional } from 'class-validator';

export class SendNotificationDto {
  @ApiProperty({ 
    example: 'EMAIL', 
    enum: ['EMAIL'], 
    description: 'El canal por el cual se enviará la notificación' 
  })
  @IsEnum(['EMAIL'])
  type: 'EMAIL';

  @ApiProperty({ 
    example: 'usuario_test@gmail.com', 
    description: 'Correo electrónico o número de teléfono del destinatario' 
  })
  @IsEmail()
  recipient: string;

  @ApiProperty({ 
    example: 'Confirmación de Registro', 
    description: 'El asunto que aparecerá en el mensaje' 
  })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ 
    example: {
      template: 'welcome',
      context: {
        name: 'Juan Pérez',
        action_url: 'https://example.com/verify'
      }
    }, 
    description: 'Cuerpo del mensaje. Puede ser un string plano o un objeto JSON para templates' 
  })
  @IsNotEmpty()
  body: any;
}