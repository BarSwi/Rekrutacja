import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { EstimateService } from './estimate.service';
import {
  CreateEstimate,
  CreateEstimateSchema,
  IdParamsSchema,
  UpdateEstimate,
  UpdateEstimateSchema,
} from './schemas/estimate.schema';
import { PaginationSchema } from '../common/schemas/pagination.schema';
import { SingleItemService } from './items/single-item.service';
import {
  CreateSingleItemDto,
  CreateSingleItemSchema,
  SingleItemParamsSchema,
  UpdateSingleItemDto,
  UpdateSingleItemSchema,
} from './schemas/single-item.schema';
import { ObjectId } from 'mongodb';
@Controller('estimate')
export class EstimateController {
  constructor(
    private readonly estimateService: EstimateService,
    private readonly singleItemService: SingleItemService,
  ) {}

  @Get()
  async getPaginated(
    @Query(new ZodValidationPipe(PaginationSchema))
    pagination: {
      page: number;
      pageSize: number;
    },
  ) {
    const { page, pageSize } = pagination;
    const result = await this.estimateService.getPaginated(page, pageSize);
    return {
      data: result.data,
      pagination: {
        total: result.total,
        page: result.page,
        pageSize: result.pageSize,
      },
    };
  }

  @Get(':id')
  async getSingle(
    @Param(new ZodValidationPipe(IdParamsSchema)) params: { id: string },
  ) {
    const { id } = params;
    const data = await this.estimateService.getSingle(id);
    return { data };
  }

  @Put(':id')
  async update(
    @Param(new ZodValidationPipe(IdParamsSchema)) params: { id: string },
    @Body(new ZodValidationPipe(UpdateEstimateSchema))
    updateEstimateDto: UpdateEstimate,
  ) {
    const { id } = params;
    const data = await this.estimateService.update(id, updateEstimateDto);
    return { data };
  }

  @Delete(':id')
  async delete(
    @Param(new ZodValidationPipe(IdParamsSchema)) params: { id: string },
  ) {
    const { id } = params;
    const data = await this.estimateService.delete(id);
    return { data };
  }
  @Post()
  async create(
    @Body(new ZodValidationPipe(CreateEstimateSchema))
    createEstimateDto: CreateEstimate,
  ) {
    const data = await this.estimateService.create(createEstimateDto);
    return { data };
  }

  @Post(':id/single-item')
  async createSingleItem(
    @Param(new ZodValidationPipe(IdParamsSchema))
    params: { id: string },
    @Body(new ZodValidationPipe(CreateSingleItemSchema))
    createSingleItemDto: CreateSingleItemDto,
  ) {
    const { id } = params;
    const data = await this.singleItemService.create(
      new ObjectId(id),
      createSingleItemDto,
    );
    return { data };
  }

  @Delete(':estimateId/single-item/:itemId')
  async deleteSingleItem(
    @Param(new ZodValidationPipe(SingleItemParamsSchema))
    params: {
      estimateId: string;
      itemId: string;
    },
  ) {
    const { estimateId, itemId } = params;
    const data = await this.singleItemService.delete(
      new ObjectId(estimateId),
      new ObjectId(itemId),
    );
    return { data };
  }

  @Put(':estimateId/single-item/:itemId')
  async updateSingleItem(
    @Param(new ZodValidationPipe(SingleItemParamsSchema))
    params: {
      estimateId: string;
      itemId: string;
    },
    @Body(new ZodValidationPipe(UpdateSingleItemSchema))
    updateData: UpdateSingleItemDto,
  ) {
    const { estimateId, itemId } = params;
    const data = await this.singleItemService.update(
      new ObjectId(estimateId),
      new ObjectId(itemId),
      updateData,
    );
    return { data };
  }
}
