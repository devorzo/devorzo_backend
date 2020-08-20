import minimist from 'minimist';
import express from 'express';
// import "ejs"
import cors from 'cors';
import helmet from 'helmet';
// import path from "path"
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import path from 'path';
import { initEnv } from './config/config';
import logger, { Level } from './lib/logger';
import initDatabase from './schema/database/mongoose';
import { TypegooseMiddleware } from './lib/typegooseMiddleware';
import UserResolver from './schema/resolvers/userResolver';
import ArticleResolver from './schema/resolvers/articleResolver';
import CommunityResolver from './schema/resolvers/communityResolver';

// import session from "express-session"
// import { default as connectMongoDBSession } from "connect-mongodb-session"
// import { v4 as uuid } from "uuid"

const argv = minimist(process.argv.slice(2));
initEnv(argv.env);

initDatabase();

const app = express();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const whitelist = require('../whitelist.json');

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const corsOptionsDelegate = (req: any, callback: any) => {
  let corsOptions;
  console.log(req.header('Origin'), whitelist.indexOf(req.header('Origin')));
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.set('port', (process.env.PORT || 5000));

const schema = buildSchema({
  resolvers: [UserResolver, ArticleResolver, CommunityResolver],
  emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
  // use document converting middleware
  globalMiddlewares: [TypegooseMiddleware],
  // use ObjectId scalar mapping
  // scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
  validate: false,
});

const server = new ApolloServer({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  schema,
});

server.applyMiddleware({ app });

app.use(helmet());
if (process.env.NODE_ENV == 'development') {
  app.use(cors());
} else {
  app.use((req, res, next) => {
    if (whitelist.indexOf(req.header('Origin')) !== -1
      && process.env.ENABLE_RFC1918) {
      res.append('Access-Control-Allow-External', 'true');
    }
    next();
  });
  app.use(cors(corsOptionsDelegate));
}

/* body parser */
app.use(bodyParser.urlencoded({
  limit: '50mb',
  parameterLimit: 100000,
  extended: true,
}));
app.use(bodyParser.json({
  limit: '50mb',
}));

app.listen(app.get('port'), process.env.IP!, () => {
  logger(`Server started at ${app.get('port')}`, Level.INFO);
  logger(`env: ${process.env.NODE_ENV}`);
  // logger(`Graphql path: ${server.graphqlPath}`);
});
