import { Injectable } from '@nestjs/common';
import { SingleItemRepository } from './single-item.repository';
import { ObjectId } from 'mongodb';
import { CreateSingleItemDto } from '../schemas/single-item.schema';
import { ItemType } from 'src/models/estimate.mongo.schema';

@Injectable()
export class SingleItemService {
  constructor(private readonly singleItemRepository: SingleItemRepository) {}

  async create(estimateId: ObjectId, createSingleItemDto: CreateSingleItemDto) {
    if (createSingleItemDto.type === ItemType.MATERIAL) {
      createSingleItemDto.totalPrice =
        createSingleItemDto.unitPrice * createSingleItemDto.quantity;
    }
    return this.singleItemRepository.create(estimateId, createSingleItemDto);
  }
}
