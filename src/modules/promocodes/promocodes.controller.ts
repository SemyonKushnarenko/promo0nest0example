import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CreatePromoCodeDto } from "./dto/create-promocode.dto";
import { ListPromoCodesResponseDto } from "./dto/list-promocodes.response";
import { ListPromoCodesQuery } from "./dto/list-promocodes.query";
import { PromoCodeResponseDto } from "./dto/promocode.response";
import { UpdatePromoCodeDto } from "./dto/update-promocode.dto";
import { PromoCodesService } from "./promocodes.service";

@ApiTags("promocodes")
@Controller("promocodes")
export class PromoCodesController {
  constructor(private readonly promoCodes: PromoCodesService) {}

  @Post()
  @ApiOperation({ summary: "Create promo code" })
  @ApiOkResponse({ type: PromoCodeResponseDto })
  @ApiBadRequestResponse({ description: "Validation error or invalid dates" })
  @ApiConflictResponse({ description: "Promo code already exists" })
  create(@Body() dto: CreatePromoCodeDto) {
    return this.promoCodes.create(dto);
  }

  @Get()
  @ApiOperation({ summary: "List promo codes" })
  @ApiOkResponse({ type: ListPromoCodesResponseDto })
  list(@Query() query: ListPromoCodesQuery) {
    return this.promoCodes.list(query);
  }

  @Get("by-code/:code")
  @ApiOperation({ summary: "Get promo code by code" })
  @ApiParam({ name: "code", example: "WELCOME10" })
  @ApiOkResponse({ type: PromoCodeResponseDto })
  @ApiNotFoundResponse({ description: "Promo code not found" })
  getByCode(@Param("code") code: string) {
    return this.promoCodes.getByCode(code);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get promo code by id" })
  @ApiOkResponse({ type: PromoCodeResponseDto })
  @ApiNotFoundResponse({ description: "Promo code not found" })
  get(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.promoCodes.getById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update promo code" })
  @ApiOkResponse({ type: PromoCodeResponseDto })
  @ApiBadRequestResponse({ description: "Validation error or invalid dates" })
  @ApiConflictResponse({ description: "Promo code already exists" })
  @ApiNotFoundResponse({ description: "Promo code not found" })
  update(@Param("id", new ParseUUIDPipe()) id: string, @Body() dto: UpdatePromoCodeDto) {
    return this.promoCodes.update(id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete promo code" })
  @ApiOkResponse({ schema: { example: { ok: true } } })
  @ApiNotFoundResponse({ description: "Promo code not found" })
  remove(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.promoCodes.remove(id);
  }
}

