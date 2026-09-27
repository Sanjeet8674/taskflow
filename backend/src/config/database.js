import { Sequelize } from 'sequelize';
import { config } from './env.js';

export const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: 'postgres',
    logging: config.nodeEnv === 'development' ? console.log : false,
  },
);

export async function connectDatabase() {
  await sequelize.authenticate();
  await sequelize.sync({ alter: config.nodeEnv === 'development' });
}
