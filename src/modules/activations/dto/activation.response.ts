import { ApiProperty } from "@nestjs/swagger";

export class ActivationResponseDto {
  @ApiProperty({ example: "2a8f4dbf-75c0-4c1a-a28c-1fe25fa2f879" })
  id!: string;

  @ApiProperty({ example: "user@example.com" })
  email!: string;

  @ApiProperty({ example: "2026-04-06T11:46:38.000Z" })
  createdAt!: string;
}

export class ActivatedPromoCodeDto {
  @ApiProperty({ example: "caa6d4c4-6c52-41f4-95cc-df0625bbd5b8" })
  id!: string;

  @ApiProperty({ example: "WELCOME10" })
  code!: string;

  @ApiProperty({ example: 10 })
  discountPercent!: number;
}

export class ActivatePromoCodeResponseDto {
  @ApiProperty({ type: ActivatedPromoCodeDto })
  promoCode!: ActivatedPromoCodeDto;

  @ApiProperty({ type: ActivationResponseDto })
  activation!: ActivationResponseDto;
}

