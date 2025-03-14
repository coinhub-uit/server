import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MethodEntity } from 'src/method/entities/method.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MethodService {
  constructor(
    @InjectRepository(MethodEntity)
    private readonly methodRepository: Repository<MethodEntity>,
  ) {}

  getMethodById(id: string) {
    return this.methodRepository.findOneOrFail({ where: { id: id } });
  }
}
