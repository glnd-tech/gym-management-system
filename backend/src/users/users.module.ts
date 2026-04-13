import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // <-- Esta línea es la clave
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule] // Lo exportamos por si otros módulos lo necesitan después
})
export class UsersModule { }