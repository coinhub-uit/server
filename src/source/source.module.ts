import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceService } from './services/source.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { SourceController } from './controllers/source.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity, UserEntity])],
  exports: [SourceService],
  providers: [SourceService],
  controllers: [SourceController],
})
export class SourceModule {}
