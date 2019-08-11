import express from 'express';
import constants from './config/constants';
import configMiddleware from './config/middlewares';
import './config/database';
import routesConfig from './module';

const app = express();

configMiddleware(app);

routesConfig(app);

app.listen(constants.PORT, () =>
  {
    console.log(`

      ███████╗██╗   ██╗██╗     ███████╗    ██████╗  ██████╗ ███████╗
      ██╔════╝██║   ██║██║     ██╔════╝    ██╔══██╗██╔═══██╗██╔════╝
      ███████╗██║   ██║██║     █████╗      ██████╔╝██║   ██║███████╗
      ╚════██║██║   ██║██║     ██╔══╝      ██╔═══╝ ██║   ██║╚════██║
      ███████║╚██████╔╝███████╗███████╗    ██║     ╚██████╔╝███████║
      ╚══════╝ ╚═════╝ ╚══════╝╚══════╝    ╚═╝      ╚═════╝ ╚══════╝
    `);
    console.log(`
      PORT:       ${constants.PORT}
      ENV:        ${process.env.NODE_ENV}`);
  }
);

process.on('SIGINT', () => {
  console.log('Bye bye!');
  process.exit();
});
