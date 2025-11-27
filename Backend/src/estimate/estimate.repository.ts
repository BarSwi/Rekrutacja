import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IEstimate, ISingleItem } from '../models/estimate.mongo.schema';
import { UpdateEstimate } from './schemas/estimate.schema';

@Injectable()
export class EstimateRepository {
  constructor(
    @InjectModel('Estimate') private readonly estimateModel: Model<IEstimate>,
  ) {}

  async getPaginated(
    page: number,
    pageSize: number,
  ): Promise<{
    data: Array<{
      _id: string;
      name: string;
      createdAt: Date;
      items: ISingleItem[];
    }>;
    total: number;
    page: number;
    pageSize: number;
  }> {
    const skip = page * pageSize;

    const estimates = await this.estimateModel
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalCount = await this.estimateModel.countDocuments();

    return {
      data: estimates.map((estimate: any) => ({
        _id: estimate._id,
        name: estimate.name,
        createdAt: estimate.createdAt,
        items: estimate.items || [],
      })),
      total: totalCount,
      page,
      pageSize,
    };
  }

  async create(name: string): Promise<IEstimate> {
    const newEstimate = new this.estimateModel({ name });
    return newEstimate.save();
  }
  async getSingle(id: string): Promise<IEstimate | null> {
    return (await this.estimateModel.findById(id)).toObject();
  }
  async update(
    id: string,
    updateEstimateDto: UpdateEstimate,
  ): Promise<IEstimate | null> {
    return (
      await this.estimateModel.findByIdAndUpdate(id, updateEstimateDto, {
        new: true,
      })
    ).toObject();
  }
  async delete(id: string): Promise<IEstimate | null> {
    return (await this.estimateModel.findByIdAndDelete(id)).toObject();
  }
}
