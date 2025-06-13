import { REGEXP } from './regExp';

export const isBase64Image = (logo: string) => {
  const regex: RegExp = REGEXP.BASE64IMG;
  const match: RegExpExecArray | null = regex.exec(logo);

  if (!match) {
    return false;
  }
  return true;
};
