import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
//import { AuthMiddleware } from './middlewares/auth.middleware';
import { UnitsModule } from './units/units.module';
import { PricesModule } from './prices/prices.module';
config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_HOST),
    AuthModule,
    ProjectsModule,
    UnitsModule,
    PricesModule,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes('projects');
  // }
}
