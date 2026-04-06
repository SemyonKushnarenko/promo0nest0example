import { Transform } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class ActivatePromoCodeDto {
  @ApiProperty({ description: "Promo code (will be uppercased).", example: "WELCOME10" })
  @IsString()
  @MinLength(1)
  @Transform(({ value }) => String(value).trim().toUpperCase())
  code!: string;

  @ApiProperty({ description: "User email to bind activation to.", example: "user@example.com" })
  @IsEmail()
  @Transform(({ value }) => String(value).trim().toLowerCase())
  email!: string;
}

