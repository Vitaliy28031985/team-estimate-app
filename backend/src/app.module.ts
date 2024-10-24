import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { config } from 'dotenv';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
//import { AuthMiddleware } from './middlewares/auth.middleware';
import { UnitsModule } from './units/units.module';
import { PricesModule } from './prices/prices.module';
import { EmailModule } from './email/email.module';
config();

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_HOST),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    ProjectsModule,
    UnitsModule,
    PricesModule,
    EmailModule,
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(AuthMiddleware).forRoutes('projects');
  // }
}
