import { Injectable, BadRequestException } from '@nestjs/common'; // <-- Aquí importamos la excepción
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    // 1. Verificar si el correo ya existe
    const existingUser = await this.usersRepository.findOneBy({ email: createUserDto.email });
    if (existingUser) {
      throw new BadRequestException('El correo ya está registrado en el gimnasio');
    }

    // 2. Encriptar la contraseña (10 es el nivel de "sal" o complejidad estándar)
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // 3. Crear el usuario reemplazando la contraseña plana por la encriptada
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    // 4. Guardar en la base de datos y retornar
    return await this.usersRepository.save(newUser);
  }

  async findAll() {
    return await this.usersRepository.find();
  }

  async findOneByEmail(email: string) {
    return await this.usersRepository.findOneBy({ email });
  }

}