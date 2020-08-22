/* eslint-disable @typescript-eslint/no-explicit-any */
// import * as data from "../../env.json"
import { v4 as uuid } from 'uuid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const data = require('../../env.json');

const objectSetter = (from: any, to: any) => {
  if (typeof from === 'object' && from !== null) {
    Object.keys(from).forEach((key) => {
      if (typeof from[key] === 'object' && from[key] !== null) {
        to[key] = objectSetter(from[key], to);
      } else {
        to[key] = from[key];
      }
    });
  }
  return to;
};
export const initEnv = (env = process.env.NODE_ENV): 'development' | 'production' | 'test' => {
  env = (env == null) ? 'development' : env;
  if (env == 'p' || env == 'prod') {
    env = 'production';
  } else if (env == 'd' || env == 'dev') {
    env = 'production';
  } else if (env == 't') {
    env = 'test';
  }

  if (env === 'development' || env === 'test' || env === 'production') {
    const config = data;
    // console.log(data)
    const envConfig = config[env];

    process.env = objectSetter(envConfig, process.env);
    // console.log(process.env)
    // Object.keys(envConfig).forEach((key) => {
    //     process.env[key] = envConfig[key]
    //     if (key == "Logging")
    //         console.log({ f: envConfig[key], g: process.env[key] })
    // })

    if (env === 'production') {
      process.env.JWT_SECRET = uuid();
    }
  } else {
    throw 'Invalid Environment!';
  }
  process.env.NODE_ENV = env;
  return env;
};

export const makeid = (len = 6): string => {
  let text = '';
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const possible2 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ.!@#$%^&*';

  for (let i = 0; i < len / 2; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
    text += possible2.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};
