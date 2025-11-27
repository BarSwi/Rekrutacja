import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ISingleItem } from '../models/single-item.mongo.schema';
import { IEstimate } from '../models/estimate.mongo.schema';

@Injectable()
export class EstimateRepository {
  constructor(
    @InjectModel('SingleItem') private readonly itemModel: Model<ISingleItem>,
    @InjectModel('Estimate') private readonly estimateModel: Model<IEstimate>,
  ) {}

  async getPaginatedWithTotals(
    page: number,
    pageSize: number,
  ): Promise<{
    data: Array<{
      id: string;
      name: string;
      createdAt: Date;
      total: number;
    }>;
    total: number;
    page: number;
    pageSize: number;
  }> {
    const skip = page * pageSize;

    const result = await this.itemModel.aggregate([
      {
        $addFields: {
          itemTotal: {
            $cond: [
              { $eq: ['$type', 'material'] },
              { $multiply: ['$quantity', '$unitPrice'] },
              '$totalPrice',
            ],
          },
        },
      },
      {
        $group: {
          _id: '$estimateId',
          total: { $sum: '$itemTotal' },
          createdAt: { $first: '$createdAt' },
        },
      },
      {
        $lookup: {
          from: 'estimates',
          localField: '_id',
          foreignField: '_id',
          as: 'estimate',
        },
      },
      {
        $unwind: {
          path: '$estimate',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          data: [{ $skip: skip }, { $limit: pageSize }],
        },
      },
    ]);

    const totalCount = result[0].metadata[0]?.total || 0;
    const estimates = result[0].data.map((item: any) => ({
      id: item._id,
      name: item.estimate?.name || '',
      createdAt: item.createdAt,
      total: item.total,
    }));

    return {
      data: estimates,
      total: totalCount,
      page,
      pageSize,
    };
  }
}
