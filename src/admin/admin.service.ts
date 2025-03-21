import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { CreateAdminParams } from 'src/admin/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private AdminRepository: Repository<AdminEntity>,
  ) {}

  async createAdmin(adminDetails: CreateAdminParams) {
    const newAdmin = this.AdminRepository.create(adminDetails);
    return await this.AdminRepository.save(newAdmin);
  }

  async findOne(username: string) {
    return await this.AdminRepository.findOneByOrFail({ username });
  }

  async find() {
    return await this.AdminRepository.find();
  }
}
