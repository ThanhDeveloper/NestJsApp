import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { usersProviders } from './users.providers';
import { Sequelize } from 'sequelize-typescript';
import { databaseConfig } from '../../core/database/database.config';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;
  const config = databaseConfig.test;
  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      dialect: 'postgres',
      define: {
        timestamps: false,
      },
    },
  );
  // Before any tests run, clear the DB and run migrations with Sequelize sync()
  beforeAll(async () => {
    sequelize.addModels([User]);
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AutomapperModule.forRoot({
          options: [{ name: 'classMapper', pluginInitializer: classes }],
          singular: true,
        }),
      ],
      controllers: [UsersController],
      providers: [UsersService, ...usersProviders],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should be create new user', async () => {
    const user = {
      username: 'user_test',
      password: 'test_password',
    };
    await service.create(user);
  });

  it('should be get all user', async () => {
    const users = await controller.getAllUser();
    expect(users).not.toBe(undefined);
    expect(users[0]['dataValues']).not.toHaveProperty('password');
  });
});
