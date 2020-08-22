/* eslint-disable @typescript-eslint/no-explicit-any */
import { decode } from 'jsonwebtoken';

const parseToken = (token: string): any => {
  const payload = decode(token);
  return payload;
};
export default parseToken;
