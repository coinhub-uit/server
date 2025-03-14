import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';
import { MethodController } from './method.controller';
import { MethodService } from './method.service';

@Module({
  imports: [TypeOrmModule.forFeature([MethodEntity])],
  controllers: [MethodController],
  providers: [MethodService],
})
export class MethodModule {}
