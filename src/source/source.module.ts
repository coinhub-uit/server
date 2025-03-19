import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceService } from './services/source.service';

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity])],
  exports: [SourceService],
  providers: [SourceService],
})
export class SourceModule {}
