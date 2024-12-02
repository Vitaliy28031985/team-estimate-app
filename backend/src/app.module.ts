import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { UnitsModule } from './units/units.module';
import { PricesModule } from './prices/prices.module';
import { EmailModule } from './email/email.module';
import { User, UserSchema } from './mongo/schemas/user/user.schema';
import { SettingProjectModule } from './projects/setting-project/setting.project.module';
import { EstimatesModule } from './projects/estimates/estimates.module';
import { PositionsModule } from './projects/positions/positions.module';
import { MaterialsModule } from './projects/materials/materials.module';
import { AdvancesModule } from './projects/advances/advances.module';
import { ProjectPricesModule } from './projects/project-prices/project.prices.module';
import { LowEstimateModule } from './projects/low-estimate/low-estimate/low.estimate.module';
import { LowPositionModule } from './projects/low-estimate/low-position/low.position.module';
import { AuthRefreshMiddleware } from './middlewares/auth.refresh.middleware';
import { ReviewsModule } from './reviews/reviews.module';
import { LowProjectPriceModule } from './projects/low-project-price/low.project.price.module';
import { UserModule } from './user/user.module';
import { MiddlePricesModule } from './middle-prices/middle.prices.module';
config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_DB_HOST),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    AuthModule,
    ProjectsModule,
    UnitsModule,
    PricesModule,
    EmailModule,
    SettingProjectModule,
    EstimatesModule,
    PositionsModule,
    MaterialsModule,
    AdvancesModule,
    ProjectPricesModule,
    LowEstimateModule,
    LowPositionModule,
    ReviewsModule,
    LowProjectPriceModule,
    UserModule,
    MiddlePricesModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth/logout');
    consumer.apply(AuthMiddleware).forRoutes('prices');
    consumer.apply(AuthMiddleware).forRoutes('user');
    consumer.apply(AuthMiddleware).forRoutes('projects');
    consumer.apply(AuthMiddleware).forRoutes('setting/project');
    consumer.apply(AuthMiddleware).forRoutes('estimates');
    consumer.apply(AuthMiddleware).forRoutes('positions');
    consumer.apply(AuthMiddleware).forRoutes('materials');
    consumer.apply(AuthMiddleware).forRoutes('advances');
    consumer.apply(AuthMiddleware).forRoutes('project/prices');
    consumer.apply(AuthMiddleware).forRoutes('low/estimate');
    consumer.apply(AuthMiddleware).forRoutes('low/position');
    consumer.apply(AuthMiddleware).forRoutes('units');
    consumer.apply(AuthMiddleware).forRoutes('low/project/price');
    consumer.apply(AuthMiddleware).forRoutes('reviews/create');
    consumer.apply(AuthMiddleware).forRoutes('reviews/:reviewId');
    consumer.apply(AuthRefreshMiddleware).forRoutes('auth/refresh/current');
  }
}
