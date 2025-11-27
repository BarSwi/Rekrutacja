import { Injectable } from '@nestjs/common';
import { EstimateRepository } from './estimate.repository';

@Injectable()
export class EstimateService {
  constructor(private readonly estimateRepository: EstimateRepository) {}

  async getPaginated(page: number, pageSize: number) {
    return this.estimateRepository.getPaginatedWithTotals(page, pageSize);
  }
}
