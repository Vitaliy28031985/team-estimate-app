import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './models/user/user.schema';
import { Project, ProjectSchema } from './models/project/project.schema';
import { Unit, UnitSchema } from './models/units.schema';
import { Price, PriceSchema } from './models/price.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Price.name, schema: PriceSchema }]),
    MongooseModule.forFeature([{ name: Unit.name, schema: UnitSchema }]),
  ],
  providers: [...databaseProviders],
  exports: [...databaseProviders],
})
export class DatabaseModule {}
