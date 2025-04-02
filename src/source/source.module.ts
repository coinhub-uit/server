import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SourceEntity } from 'src/source/entities/source.entity';
import { SourceService } from './services/source.service';
import { SourceController } from './controllers/source.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity]), UserModule],
  providers: [SourceService],
  controllers: [SourceController],
  exports: [SourceService, TypeOrmModule],
})
export class SourceModule {}
