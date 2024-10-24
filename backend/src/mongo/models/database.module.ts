import { Module } from '@nestjs/common';
import { databaseProviders } from '../lib/client';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../schemas/user/user.schema';
import { Project, ProjectSchema } from '../schemas/project/project.schema';
import { Price, PriceSchema } from '../schemas/price.schema';
import { Unit, UnitSchema } from '../schemas/units.schema';

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
