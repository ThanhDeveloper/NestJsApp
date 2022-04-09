import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InvalidArgumentException } from '../../core/utils/error-handler.util';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
    private sequelize: Sequelize,
  ) {}

  async validateUser(username: string, pass: string) {
    // find if user exist with this email
    const user = await this.userService.findOneByUsername(username);
    if (!user) {
      return null;
    }

    // find if user password match
    const match = await AuthService.comparePassword(pass, user.password);
    if (!match) {
      return null;
    }

    // tslint:disable-next-line: no-string-literal
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user['dataValues'];

    return result;
  }

  public async login(user) {
    const token = await this.generateToken(user);
    return {
      id: user.id,
      username: user.username,
      message: 'successfully logged',
      token,
    };
  }

  public async register(user) {
    let transaction;
    try {
      transaction = await this.sequelize.transaction();

      const userExist = await this.userService.findOneByUsername(user.username);
      if (userExist) {
        throw new InvalidArgumentException('This username already exist');
      }

      // hash the password
      const pass = await AuthService.hashPassword(user.password);

      // create the user
      const newUser = await this.userService.create({
        ...user,
        password: pass,
      });
      // tslint:disable-next-line: no-string-literal
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = newUser['dataValues'];

      // generate token
      const token = await this.generateToken(result);

      await transaction.commit();

      // return the user and the token
      return {
        id: result.id,
        username: result.username,
        message: 'Register success',
        token,
      };
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      throw error;
    }
  }

  private async generateToken(user) {
    return await this.jwtService.signAsync(user);
  }

  private static async hashPassword(password) {
    return await bcrypt.hash(password, 10);
  }

  private static async comparePassword(enteredPassword, dbPassword) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }
}
