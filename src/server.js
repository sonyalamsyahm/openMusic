/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');
const openMusic = require('./api/openMusic');
const OpenMusicService = require('./services/postgres/openMusicService');
const openMusicValidator = require('./validation/openMusic');

require('dotenv').config();

// Config dalam .env merupakan config development dimana HOST masih localhost
// Dalam submission tidak dicantumkan untuk membuat config untuk production jadi tidak saya buat
// Saya lampiran file .env untuk memastikan kesesuian dengan kriteria submission

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
