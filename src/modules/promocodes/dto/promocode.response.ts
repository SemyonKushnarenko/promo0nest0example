import { ApiProperty } from "@nestjs/swagger";

export class PromoCodeResponseDto {
  @ApiProperty({ example: "caa6d4c4-6c52-41f4-95cc-df0625bbd5b8" })
  id!: string;

  @ApiProperty({ example: "WELCOME10" })
  code!: string;

  @ApiProperty({ example: 10, minimum: 1, maximum: 100 })
  discountPercent!: number;

  @ApiProperty({ example: 100, minimum: 1 })
  activationLimit!: number;

  @ApiProperty({ nullable: true, example: "2026-01-01T00:00:00.000Z" })
  validFrom!: string | null;

  @ApiProperty({ nullable: true, example: "2026-12-31T23:59:59.000Z" })
  validTo!: string | null;

  @ApiProperty({ example: "2026-04-06T11:46:38.000Z" })
  createdAt!: string;

  @ApiProperty({ example: "2026-04-06T11:46:38.000Z" })
  updatedAt!: string;
}

