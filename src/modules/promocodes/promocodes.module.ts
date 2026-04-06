import { Module } from "@nestjs/common";
import { PromoCodesController } from "./promocodes.controller";
import { PromoCodesService } from "./promocodes.service";

@Module({
  controllers: [PromoCodesController],
  providers: [PromoCodesService],
  exports: [PromoCodesService],
})
export class PromoCodesModule {}

