import { IsEmail, IsString } from "class-validator";

export class ForgotPasswordDto{
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
}
