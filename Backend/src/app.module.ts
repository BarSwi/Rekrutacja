import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EstimateController } from './estimate/estimate.controller';
import { EstimateService } from './estimate/estimate.service';
import { EstimateRepository } from './estimate/estimate.repository';
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
    ]),
  ],
  controllers: [EstimateController],
  providers: [EstimateService, EstimateRepository],
})
export class AppModule {}
