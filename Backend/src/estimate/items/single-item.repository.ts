import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { IEstimate } from 'src/models/estimate.mongo.schema';
import {
  CreateSingleItemDto,
  UpdateSingleItemDto,
} from '../schemas/single-item.schema';
import { es } from 'zod/v4/locales';

@Injectable()
export class SingleItemRepository {
  constructor(
    @InjectModel('Estimate') private readonly estimateModel: Model<IEstimate>,
  ) {}

  async create(
    estimateId: ObjectId,
    createSingleItemDto: CreateSingleItemDto,
  ): Promise<IEstimate> {
    const estimate = await this.estimateModel.findById(estimateId);
    if (!estimate) {
      throw new Error('Estimate not found');
    }
    estimate.items.push(createSingleItemDto);
    return estimate.save();
  }
  async delete(
    estimateId: ObjectId,
    itemId: ObjectId,
  ): Promise<IEstimate | null> {
    return this.estimateModel.findByIdAndUpdate(
      estimateId,
      { $pull: { items: { _id: itemId } } },
      { new: true },
    );
  }

  async update(
    estimateId: ObjectId,
    itemId: ObjectId,
    updateData: UpdateSingleItemDto,
  ): Promise<IEstimate | null> {
    return this.estimateModel.findByIdAndUpdate(
      estimateId,
      { $set: { 'items.$[item]': updateData } },
      { arrayFilters: [{ 'item._id': itemId }], new: true },
    );
  }
}
