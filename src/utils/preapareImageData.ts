import { REGEXP } from './regExp';
import { COMMON } from './common';

export function prepareImageData(logo: string, clientId: number) {
  const regex: RegExp = REGEXP.BASE64IMG;
  const match: RegExpExecArray | null = regex.exec(logo)!;
  const imageFormat: string = match[1]; // example: 'png', 'jpeg', 'svg+xml'
  const contentType: string = `${COMMON.IMGPATH}/${imageFormat}`;
  const key: string = `${COMMON.BASEPATH}-${clientId}.${imageFormat.split('+')[0]}`;

  const imageData: string = logo.replace(REGEXP.BASE64IMG, '');
  const encoding: BufferEncoding = COMMON.ENCODEING as BufferEncoding;

  const imageBuffer: Buffer = Buffer.from(imageData, encoding);

  return { key, imageBuffer, contentType };
}
