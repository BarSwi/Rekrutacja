import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EstimateController } from './estimate/estimate.controller';
import { SingleItemController } from './single-item/single-item.controller';
import { EstimateService } from './estimate/estimate.service';
import { EstimateRepository } from './estimate/estimate.repository';
import { SingleItemMongoSchema } from './models/single-item.mongo.schema';
import { EstimateMongoSchema } from './models/estimate.mongo.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    MongooseModule.forFeature([
      { name: 'Estimate', schema: EstimateMongoSchema },
      { name: 'SingleItem', schema: SingleItemMongoSchema },
    ]),
  ],
  controllers: [EstimateController, SingleItemController],
  providers: [EstimateService, EstimateRepository],
})
export class AppModule {}
