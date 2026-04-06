import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreatePromoCodeDto } from "./dto/create-promocode.dto";
import { ListPromoCodesQuery } from "./dto/list-promocodes.query";
import { UpdatePromoCodeDto } from "./dto/update-promocode.dto";
import { parseOptionalIsoDate } from "./utils/date.utils";

@Injectable()
export class PromoCodesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePromoCodeDto) {
    const validFrom = parseOptionalIsoDate(dto.validFrom);
    const validTo = parseOptionalIsoDate(dto.validTo);
    if (validFrom && validTo && validFrom > validTo) {
      throw new BadRequestException("validFrom must be <= validTo");
    }

    try {
      return await this.prisma.promoCode.create({
        data: {
          code: dto.code,
          discountPercent: dto.discountPercent,
          activationLimit: dto.activationLimit,
          validFrom,
          validTo,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("Promo code already exists");
      }
      throw e;
    }
  }

  async list(query: ListPromoCodesQuery) {
    const skip = query.skip ?? 0;
    const take = query.take ?? 20;
    const q = query.q?.trim();

    const where: Prisma.PromoCodeWhereInput | undefined = q
      ? { code: { contains: q, mode: "insensitive" } }
      : undefined;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.promoCode.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
      }),
      this.prisma.promoCode.count({ where }),
    ]);

    return { items, total, skip, take };
  }

  async getById(id: string) {
    const promo = await this.prisma.promoCode.findUnique({ where: { id } });
    if (!promo) throw new NotFoundException("Promo code not found");
    return promo;
  }

  async getByCode(code: string) {
    const promo = await this.prisma.promoCode.findUnique({ where: { code } });
    if (!promo) throw new NotFoundException("Promo code not found");
    return promo;
  }

  async update(id: string, dto: UpdatePromoCodeDto) {
    const validFrom = parseOptionalIsoDate(dto.validFrom);
    const validTo = parseOptionalIsoDate(dto.validTo);
    if (validFrom && validTo && validFrom > validTo) {
      throw new BadRequestException("validFrom must be <= validTo");
    }

    try {
      return await this.prisma.promoCode.update({
        where: { id },
        data: {
          code: dto.code,
          discountPercent: dto.discountPercent,
          activationLimit: dto.activationLimit,
          validFrom,
          validTo,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        throw new NotFoundException("Promo code not found");
      }
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        throw new ConflictException("Promo code already exists");
      }
      throw e;
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.promoCode.delete({ where: { id } });
      return { ok: true };
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2025") {
        throw new NotFoundException("Promo code not found");
      }
      throw e;
    }
  }
}

