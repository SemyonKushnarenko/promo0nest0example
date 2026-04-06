import { ApiProperty } from "@nestjs/swagger";
import { PromoCodeResponseDto } from "./promocode.response";

export class ListPromoCodesResponseDto {
  @ApiProperty({ type: [PromoCodeResponseDto] })
  items!: PromoCodeResponseDto[];

  @ApiProperty({ example: 1 })
  total!: number;

  @ApiProperty({ example: 0 })
  skip!: number;

  @ApiProperty({ example: 20 })
  take!: number;
}

