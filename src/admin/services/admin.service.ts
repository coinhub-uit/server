import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin/entities/admin.entity';
import { Repository } from 'typeorm';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { hash } from 'lib/hashing';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private AdminRepository: Repository<AdminEntity>,
  ) {}

  async createAdmin(adminDetails: CreateAdminDto) {
    const hasedPassword = await hash(adminDetails.password);
    const newAdmin: AdminEntity = this.AdminRepository.create({
      ...adminDetails,
      password: hasedPassword,
    });
    return await this.AdminRepository.save(newAdmin);
  }

  async findOne(username: string) {
    return await this.AdminRepository.findOne({ where: { username } });
  }

  async find() {
    return await this.AdminRepository.find();
  }
}
