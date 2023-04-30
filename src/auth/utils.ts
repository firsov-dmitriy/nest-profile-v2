import { genSalt, hashSync, compare } from 'bcrypt';
export const cryptPassword = async (password: string) => {
  const salt = await genSalt();
  const hash = hashSync(password, salt);
  return hash;
};

export const checkPassword = async (password: string, hash: string) => {
  return await compare(password, hash);
};
