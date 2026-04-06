import { Transform } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsInt,
  IsISO8601,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from "class-validator";

export class CreatePromoCodeDto {
  @ApiProperty({
    description: "Promo code (will be uppercased).",
    example: "WELCOME10",
  })
  @IsString()
  @MinLength(3)
  @Transform(({ value }) => String(value).trim().toUpperCase())
  code!: string;

  @ApiProperty({
    description: "Discount percent (1..100).",
    example: 10,
    minimum: 1,
    maximum: 100,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  discountPercent!: number;

  @ApiProperty({
    description: "Maximum number of activations for this promo code.",
    example: 100,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  activationLimit!: number;

  @ApiPropertyOptional({
    description: "Start of validity window (ISO8601).",
    example: "2026-01-01T00:00:00.000Z",
  })
  @IsOptional()
  @IsISO8601()
  validFrom?: string;

  @ApiPropertyOptional({
    description: "End of validity window (ISO8601).",
    example: "2026-12-31T23:59:59.000Z",
  })
  @IsOptional()
  @IsISO8601()
  validTo?: string;
}

