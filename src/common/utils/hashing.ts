import { hash as _hash, compare } from 'bcrypt';

export async function hash(str: string): Promise<string> {
  return await _hash(str, 2);
}

export async function verify(str: string, hashedStr: string): Promise<boolean> {
  return await compare(str, hashedStr);
}
