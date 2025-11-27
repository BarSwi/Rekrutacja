import { Injectable } from '@nestjs/common';
import { EstimateRepository } from './estimate.repository';
import { CreateEstimate, UpdateEstimate } from './schemas/estimate.schema';
import { ItemType } from 'src/models/estimate.mongo.schema';

@Injectable()
export class EstimateService {
  constructor(private readonly estimateRepository: EstimateRepository) {}

  private calculateTotal(items: any[]): number {
    return items?.reduce((sum: number, item: any) => {
      if (item.type === ItemType.MATERIAL) {
        return sum + item.quantity * item.unitPrice;
      } else {
        return sum + item.totalPrice;
      }
    }, 0);
  }

  async getPaginated(page: number, pageSize: number) {
    const result = await this.estimateRepository.getPaginated(page, pageSize);

    return {
      ...result,
      data: result.data.map((estimate: any) => ({
        ...estimate,
        total: this.calculateTotal(estimate.items),
      })),
    };
  }

  async create(createEstimateDto: CreateEstimate) {
    return this.estimateRepository.create(createEstimateDto.name);
  }

  async getSingle(id: string) {
    return this.estimateRepository.getSingle(id);
  }
  async update(id: string, updateEstimateDto: UpdateEstimate) {
    return this.estimateRepository.update(id, updateEstimateDto);
  }
  async delete(id: string) {
    return this.estimateRepository.delete(id);
  }
}
