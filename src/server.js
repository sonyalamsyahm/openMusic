/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');

// openMusic
const openMusic = require('./api/openMusic');
const OpenMusicService = require('./services/postgres/openMusicService');
const openMusicValidator = require('./validation/openMusic');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/usersService');
const UsersValidator = require('./validation/users');

require('dotenv').config();

const init = async () => {
  const openMusicService = new OpenMusicService();
  const usersService = new UsersService();

  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: openMusic,
      options: {
        service: openMusicService,
        validator: openMusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
