import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';
import { MethodController } from './controllers/method.controller';
import { MethodService } from './services/method.service';

@Module({
  imports: [TypeOrmModule.forFeature([MethodEntity])],
  controllers: [MethodController],
  providers: [MethodService],
  exports: [MethodService, TypeOrmModule],
})
export class MethodModule {}
