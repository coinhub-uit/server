import { INestApplication } from '@nestjs/common';
import * as session from 'express-session';
import { RedisStore } from 'connect-redis';
import { createClient } from 'redis';

export async function configAppSession(app: INestApplication<any>) {
  const redisClient = createClient({
    url: process.env.REDIS_URL,
  });

  await redisClient.connect();
  const redisStore = new RedisStore({
    client: redisClient,
  });

  app.use(
    session({
      store: redisStore,
      secret: process.env.ADMIN_JWT_SECRET, // huhmm
      cookie: {
        maxAge: 60 * 15 * 1000, // 15 mins
      },
    }),
  );
}
