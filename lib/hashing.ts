import { hash as _hash, compare, genSalt } from 'bcryptjs';

export async function hash(str: string): Promise<string> {
  const salt = await genSalt(5);
  return await _hash(str, salt);
}

export async function verify(str: string, hashedStr: string): Promise<boolean> {
  return await compare(str, hashedStr);
}
