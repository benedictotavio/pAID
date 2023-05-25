import {
  IsBoolean,
  IsEmail,
  IsString,
  IsStrongPassword,
  IsUUID,
  Matches,
} from 'class-validator';

export class CreateUserDto {
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
  readonly firstName: string;

  @IsString()
  readonly lastName: string;

  @IsStrongPassword({
    minLength: 6,
    minLowercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1,
  })
  readonly password: string;

  @IsString()
  @Matches('password')
  readonly confirmPassword: string;

  @IsUUID('5')
  readonly verificationCode?: string;

  @IsString()
  readonly passwordResetCode?: string | null;

  @IsBoolean()
  readonly verified?: boolean;
}
