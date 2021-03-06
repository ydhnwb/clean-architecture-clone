/* istanbul ignore file */

import config from '@backend/infrastructure/config';
import { logger } from '@backend/infrastructure/winston';
import mongoose from 'mongoose';

mongoose.set('debug', process.env.DEBUG !== undefined);

const mongoServer: any =
  config.mongo.url === 'inmemory' && require('mongodb-memory-server');

const opts = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: config.mongo.useCreateIndex,
  keepAlive: true,
  keepAliveInitialDelay: 300000,
  autoIndex: config.mongo.autoIndex,
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  useFindAndModify: false,
};

class MongoConnection {
  private static _instance: MongoConnection;

  private _mongoServer?: any;

  static getInstance(): MongoConnection {
    if (!MongoConnection._instance) {
      MongoConnection._instance = new MongoConnection();
    }
    return MongoConnection._instance;
  }

  public async open(): Promise<void> {
    try {
      if (config.mongo.url === 'inmemory') {
        logger.debug('connecting to inmemory mongo db');
        this._mongoServer = new mongoServer.MongoMemoryServer();
        const mongoUrl = await this._mongoServer.getUri();
        logger.info('mongoUrl:', mongoUrl);
        await mongoose.connect(mongoUrl, opts);
      } else {
        logger.debug('connecting to mongo db: ' + config.mongo.url);
        mongoose.connect(config.mongo.url, opts);
      }

      mongoose.connection.on('connected', () => {
        logger.info('Mongo: connected');
      });

      mongoose.connection.on('disconnected', () => {
        logger.error('Mongo: disconnected');
      });

      mongoose.connection.on('error', (err) => {
        logger.error(`Mongo:  ${String(err)}`);
        if (err.name === 'MongoNetworkError') {
          setTimeout(function () {
            mongoose.connect(config.mongo.url, opts).catch((err) => {
              logger.debug(`${err}`);
            });
          }, 5000);
        }
      });
    } catch (err) {
      logger.error(`db.open: ${err}`);
      throw err;
    }
  }

  public async close(): Promise<void> {
    try {
      await mongoose.disconnect();
      if (config.mongo.url === 'inmemory') {
        await this._mongoServer?.stop();
      }
    } catch (err) {
      logger.error(`db.open: ${err}`);
      throw err;
    }
  }
}

export default MongoConnection.getInstance();
