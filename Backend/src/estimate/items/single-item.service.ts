import { Injectable } from '@nestjs/common';
import { SingleItemRepository } from './single-item.repository';
import { ObjectId } from 'mongodb';
import {
  CreateSingleItemDto,
  UpdateSingleItemDto,
} from '../schemas/single-item.schema';
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
  async delete(estimateId: ObjectId, itemId: ObjectId) {
    return this.singleItemRepository.delete(estimateId, itemId);
  }
  async update(
    estimateId: ObjectId,
    itemId: ObjectId,
    updateData: UpdateSingleItemDto,
  ) {
    if (updateData.type === ItemType.MATERIAL) {
      updateData.totalPrice = updateData.unitPrice * updateData.quantity;
    }
    return this.singleItemRepository.update(estimateId, itemId, updateData);
  }
}
