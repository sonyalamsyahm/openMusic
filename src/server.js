/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');

// openMusic
const openMusic = require('./api/openMusic');
const OpenMusicService = require('./services/postgres/OpenMusicService');
const OpenMusicValidator = require('./validation/openMusic');

// users
const users = require('./api/users');
const UsersService = require('./services/postgres/UsersService');
const UsersValidator = require('./validation/users');

// authentication
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validation/authentications');

// tokenize
const TokenManager = require('./tokenize/TokenManager');

// error
const ClientError = require('./exception/ClientError');

require('dotenv').config();

const init = async () => {
  const openMusicService = new OpenMusicService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();

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
        validator: OpenMusicValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  // use hapi lifecycle to handling Error
  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    let newResponse = null;
    if (response instanceof ClientError) {
      newResponse = h.response({
        status: 'fail',
        message: response.message,
      });
      newResponse.code(response.statusCode);
    } else if (response instanceof Error) {
      newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });

      newResponse.code(500);
      console.error(response);
    }

    if (newResponse) {
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
