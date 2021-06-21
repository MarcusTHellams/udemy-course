import { Injectable } from '@nestjs/common';
import { CreateHelloInput } from './dto/create-hello.input';
import { UpdateHelloInput } from './dto/update-hello.input';

@Injectable()
export class HelloService {
  create(createHelloInput: CreateHelloInput) {
    return 'This action adds a new hello';
  }

  findAll() {
    return `This action returns all hello`;
  }

  findOne(id: number) {
    return { exampleField: id };
  }

  update(id: number, updateHelloInput: UpdateHelloInput) {
    return `This action updates a #${id} hello`;
  }

  remove(id: number) {
    return `This action removes a #${id} hello`;
  }
}
