import { decode } from 'jsonwebtoken';

const parseToken = (token:string): string => {
  const payload = decode(token);
  // @ts-ignore
  return payload.id;
};
export default parseToken;
