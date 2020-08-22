/* eslint-disable @typescript-eslint/ban-ts-comment */
import { decode } from 'jsonwebtoken';

const parseToken = (token:string): string => {
  const payload = decode(token);
  // @ts-ignore
  return payload ? payload.id : '';
};
export default parseToken;
