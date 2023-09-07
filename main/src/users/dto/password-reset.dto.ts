import { IsEmail, IsString, IsStrongPassword, IsUUID } from 'class-validator';

export class PasswordResetDto {
  @IsEmail(
    {
      allow_display_name: true,
      allow_ip_domain: true,
      domain_specific_validation: true,
    },
    {
      message: 'email must be a valid format',
    }
  )
  @IsString()
  readonly email: string;

  @IsString()
  @IsUUID()
  readonly passwordResetCode: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  readonly newPassword: string;
}
