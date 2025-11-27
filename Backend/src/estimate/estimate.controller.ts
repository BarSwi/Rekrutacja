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
  CreateEstimateSchema,
  UpdateEstimateSchema,
} from './schemas/estimate.schema';
import { PaginationSchema } from '../common/schemas/pagination.schema';

@Controller('estimate')
export class EstimateController {
  constructor(private readonly estimateService: EstimateService) {}

  @Get('paginated')
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
}
