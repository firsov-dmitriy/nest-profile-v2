import { genSalt, hashSync } from 'bcrypt';
export const cryptPassword = async (password: string) => {
  const salt = await genSalt();
  const hash = hashSync(password, salt);
  return hash;
};
