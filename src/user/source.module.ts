import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from 'src/user/source/entities/source.entity';

@Module({ imports: [TypeOrmModule.forFeature([SourceEntity])] })
export class SourceModule {}
