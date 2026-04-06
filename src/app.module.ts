import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";
import { DEFAULT_THROTTLER_OPTIONS } from "./common/consts/throttling.consts";
import { validateEnv } from "./config/env.validation";
import { ActivationsModule } from "./modules/activations/activations.module";
import { PromoCodesModule } from "./modules/promocodes/promocodes.module";
import { PrismaModule } from "./modules/prisma/prisma.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([
      DEFAULT_THROTTLER_OPTIONS,
    ]),
    PrismaModule,
    PromoCodesModule,
    ActivationsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

