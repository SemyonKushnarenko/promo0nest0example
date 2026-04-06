import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ACTIVATIONS_MAX_RETRIES } from "./activations.consts";
import { isWithinValidityWindow } from "./utils/validity.utils";

@Injectable()
export class ActivationsService {
  constructor(private readonly prisma: PrismaService) {}

  async activateByEmail(input: { code: string; email: string }) {
    const now = new Date();

    for (let attempt = 0; attempt < ACTIVATIONS_MAX_RETRIES; attempt++) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const promo = await tx.promoCode.findUnique({
              where: { code: input.code },
              select: {
                id: true,
                code: true,
                discountPercent: true,
                activationLimit: true,
                validFrom: true,
                validTo: true,
                _count: {
                  select: {
                    activations: true,
                  },
                },
              },
            });
            if (!promo) throw new NotFoundException("Promo code not found");
            if (
              !isWithinValidityWindow({
                now,
                validFrom: promo.validFrom,
                validTo: promo.validTo,
              })
            ) {
              throw new BadRequestException("Promo code is not active");
            }

            if (promo._count.activations >= promo.activationLimit) {
              throw new ConflictException("Activation limit exceeded");
            }

            try {
              const activation = await tx.activation.create({
                data: {
                  promoCodeId: promo.id,
                  email: input.email,
                },
                select: {
                  id: true,
                  email: true,
                  createdAt: true,
                },
              });

              return {
                promoCode: {
                  id: promo.id,
                  code: promo.code,
                  discountPercent: promo.discountPercent,
                },
                activation,
              };
            } catch (e: unknown) {
              if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
                throw new ConflictException("This email already activated this promo code");
              }
              throw e;
            }
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (e: unknown) {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          (e.code === "P2034" || e.code === "P2028")
        ) {
          if (attempt === ACTIVATIONS_MAX_RETRIES - 1) {
            throw new ServiceUnavailableException("Please retry");
          }
          continue;
        }
        throw e;
      }
    }

    throw new ServiceUnavailableException("Please retry");
  }
}

