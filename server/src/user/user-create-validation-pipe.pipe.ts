import { CreateUserInput } from './dto/create-user.input';
import { yupErrorMessageFormatter } from './../helpers/yupErrorMessageFormatter';
import {
  Injectable,
  PipeTransform,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import * as yup from 'yup';
import PasswordValidator = require('password-validator');
import { EOL } from 'os';

const passwordValidator = new PasswordValidator();

passwordValidator
  .has()
  .uppercase()
  .has()
  .lowercase()
  .has()
  .digits(2)
  .has()
  .not()
  .spaces();

@Injectable()
export class UserCreateValidationPipe implements PipeTransform {
  private readonly schema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .min(6, 'Username is required to be a minium of 6 characters')
      .max(45, `Username can't be more than 45 characters`)
      .required('Username is required'),
    email: yup
      .string()
      .trim()
      .email('A valid email is required')
      .required('Email is required'),
    password: yup
      .string()
      .trim()
      .min(8, 'Password must be a minimum of 8 characters')
      .max(100, 'Password must not have more than 100 characters')
      .required('Password is required')
      .test(
        'passwordValidator',
        'Password must have at least one uppercase letter, lowercase letter, a minimum of 2 digits, and no spaces',
        (value) => {
          if (passwordValidator.validate(value)) {
            return true;
          }
          return false;
        },
      ),
    passwordConfirmation: yup
      .string()
      .trim()
      .test(
        'passwordConfirmation',
        'Password Confirmation must match `Password`',
        (value, { parent: { password } }) => {
          if (value !== password) {
            return false;
          }
          return true;
        },
      ),
    imageUrl: yup
      .string()
      .trim()
      .nullable()
      .url('Image Url must be a valid url'),
  });
  async transform(value: CreateUserInput) {
    try {
      await this.schema.validate(value, { abortEarly: false });
      return value;
    } catch (e) {
      const errors = yupErrorMessageFormatter(e);
      throw new HttpException(
        Object.keys(errors).reduce((acc, value) => {
          acc += errors[value] + EOL;
          return acc;
        }, ''),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
