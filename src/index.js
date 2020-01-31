import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from "koa-bodyparser";
import { timingLogger, exceptionHandler, jwtConfig } from './utils';
import { router as noteRouter } from './note';
import { router as authRouter } from './auth';
import jwt from 'koa-jwt';
import cors from '@koa/cors';
import {init} from "./utils/wsBroadcast";

// const app = new Koa();
// const server = require('http').createServer(app.callback());
//
// app.use(cors());
//
// init(server);
//
// app.use(timingLogger);
// app.use(exceptionHandler);
// app.use(bodyParser());

const app = new Koa();

app.use(cors());
app.use(timingLogger);
app.use(exceptionHandler);
app.use(bodyParser());

const prefix = '/api';

// public
const publicApiRouter = new Router({ prefix });
publicApiRouter
  .use('/auth', authRouter.routes());
app
  .use(publicApiRouter.routes())
  .use(publicApiRouter.allowedMethods());

 app.use(jwt(jwtConfig));


// protected
const protectedApiRouter = new Router({ prefix });
protectedApiRouter
    .use('/book', noteRouter.routes());
app
    .use(protectedApiRouter.routes())
    .use(protectedApiRouter.allowedMethods());


if (!module.parent) {
  app.listen(3000);
  console.log('started on port 3000');
}
