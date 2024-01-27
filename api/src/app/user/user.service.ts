import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './user.dto';
import { User } from '@/app/user/user.entity';
import { HashService } from '@/shared/services/hash.service';
import { Nullable } from '@/shared/types/nullable.type';
import { Occupation } from '../occupation/occupation.entity';
import { UpdateProfileDTO } from '../account/account.dto';
import { InjectS3, S3 } from '@/shared/s3/';

@Injectable()
export class UserService {
  @InjectS3()
  private readonly s3: S3;

  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private hashService: HashService,
  ) {}

  public async count(): Promise<number> {
    return await this.repository.countBy({});
  }

  public async findOne(id: number): Promise<User> {
    return await this.repository.findOne({
      where: { id },
      relations: ['occupation'],
    });
  }

  public async findByEmail(email: string): Promise<Nullable<User>> {
    return this.repository.findOne({
      where: { email },
      relations: ['occupation'],
    });
  }

  public async update(data: User): Promise<User> {
    return await this.repository.save(data);
  }

  create(body: CreateUserDTO): Promise<User> {
    const { password, ...userData } = body;
    const passwordHash = this.hashService.createHash(password);
    const user = this.repository.create({
      ...userData,
      password: passwordHash,
    });
    user.occupation = { id: body.occupation_id } as Occupation;
    return this.repository.save(user);
  }

  public async updateProfile(
    body: UpdateProfileDTO,
    user: User,
  ): Promise<User> {
    const userData = await this.findOne(user.id);
    if (!userData) {
      throw new HttpException('User not found', 404);
    }

    if (body.image?.originalname) {
      const ext = body.image?.originalname?.split('.').pop();
      const uid = Math.random().toString(36).substring(2, 36);
      const imageName = `avatars/${user.id}/avatar-${uid}.${ext}`;

      await this.s3.putObject({
        ACL: 'public-read',
        Bucket: this.s3.config['bucket'],
        Key: imageName,
        Body: body.image.buffer,
      });

      userData.avatar = imageName;
    }

    return await this.repository.save(userData);
  }
}
