import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';

@Module({ imports: [TypeOrmModule.forFeature([MethodEntity])] })
export class MethodModule {}
