import { Body, Controller, Post } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from "@nestjs/swagger";
import { ActivatePromoCodeDto } from "./dto/activate.dto";
import { ActivatePromoCodeResponseDto } from "./dto/activation.response";
import { ActivationsService } from "./activations.service";

@ApiTags("activations")
@Controller("activations")
export class ActivationsController {
  constructor(private readonly activations: ActivationsService) {}

  @Post()
  @ApiOperation({ summary: "Activate promo code by email" })
  @ApiOkResponse({ type: ActivatePromoCodeResponseDto })
  @ApiBadRequestResponse({ description: "Validation error or promo code not active" })
  @ApiNotFoundResponse({ description: "Promo code not found" })
  @ApiConflictResponse({
    description:
      "This email already activated this promo code OR activation limit exceeded",
  })
  @ApiTooManyRequestsResponse({ description: "Rate limit exceeded" })
  activate(@Body() dto: ActivatePromoCodeDto) {
    return this.activations.activateByEmail(dto);
  }
}

