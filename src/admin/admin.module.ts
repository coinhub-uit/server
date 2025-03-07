import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';

@Module({ imports: [TypeOrmModule.forFeature([AdminEntity])] })
export class AdminModule {}
