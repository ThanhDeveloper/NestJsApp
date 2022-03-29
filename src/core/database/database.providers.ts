import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';
import { User } from '../../modules/users/entities/user.entity';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
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
      sequelize.addModels([User]);
      return sequelize;
    },
  },
];
