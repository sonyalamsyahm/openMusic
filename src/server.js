/* eslint-disable no-console */
const Hapi = require('@hapi/hapi');

const init = async () => {
  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // await server.register({
  //   plugin: '',
  //   options: {
  //     service: '',
  //     validator: '',
  //   },
  // });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

init();
