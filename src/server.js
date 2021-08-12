/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
const openMusic = require('./api/openMusic');
const OpenMusicService = require('./services/postgres/openMusicService');
const openMusicValidator = require('./validation/openMusic');

require('dotenv').config();

const init = async () => {
  const openMusicService = new OpenMusicService();

  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: openMusic,
    options: {
      service: openMusicService,
      validator: openMusicValidator,
    },
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
