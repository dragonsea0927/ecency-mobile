import CryptoJS from 'crypto-js';
import * as dsteem from '@esteemapp/dhive';
import { Buffer } from 'buffer';
import { proxifyImageSrc } from '@esteemapp/esteem-render-helpers';
import { Platform } from 'react-native';

const whatOs = Platform.OS;

export const generateSignature = (media, privateKey) => {
  const STRING = 'ImageSigningChallenge';
  const prefix = Buffer.from(STRING);

  const commaIdx = media.data.indexOf(',');
  const dataBs64 = media.data.substring(commaIdx + 1);
  const data = Buffer.from(dataBs64, 'base64');

  const hash = CryptoJS.SHA256(prefix, data);
  const buffer = Buffer.from(hash.toString(CryptoJS.enc.Hex), 'hex');
  const array = new Uint8Array(buffer);
  const key = dsteem.PrivateKey.fromString(privateKey);

  return key.sign(Buffer.from(array)).toString();
};

export const catchEntryImage = (entry, width = 0, height = 0, format = 'match') => {
  // return from json metadata if exists
  let meta;
  format = whatOs === 'android' ? 'webp' : 'match';

  try {
    meta = JSON.parse(entry.json_metadata);
  } catch (e) {
    meta = null;
  }

  if (meta && meta.image && meta.image.length > 0) {
    if (meta.image[0]) {
      return proxifyImageSrc(meta.image[0], width, height, format);
    }
  }

  // try to extract images by regex
  const imgReg2 = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpe?g|gif|png)/gim;
  const m = entry.body.match(imgReg2);
  if (m) {
    return proxifyImageSrc(m[0], width, height, format);
  }

  // If no image specified in json metadata, try extract first image href from entry body
  let imgReg = /<img.+src=(?:"|')(.+?)(?:"|')(.*)>/;
  let bodyMatch = entry.body.match(imgReg);
  if (bodyMatch) {
    return proxifyImageSrc(bodyMatch[1], width, height, format);
  }

  // If there is no <img> tag, check from markdown img tag ![](image.png)
  imgReg = /(?:!\[(.*?)\]\((.*?)\))/;
  bodyMatch = imgReg.exec(entry.body);
  if (bodyMatch) {
    return proxifyImageSrc(bodyMatch[2], width, height, format);
  }

  return null;
};

export const catchDraftImage = (body, format = 'match') => {
  const imgRegex = /(https?:\/\/.*\.(?:tiff?|jpe?g|gif|png|svg|ico|PNG|GIF|JPG))/g;
  format = whatOs === 'android' ? 'webp' : 'match';

  if (body && imgRegex.test(body)) {
    const imageMatch = body.match(imgRegex);

    return proxifyImageSrc(imageMatch[0], 0, 0, format);
  }
  return null;
};

export const getResizedImage = (url, size = 600, format = 'match') => {
  //TODO: implement fallback onError, for imagehoster is down case
  format = whatOs === 'android' ? 'webp' : 'match';
  if (!url) {
    return '';
  }
  return proxifyImageSrc(url, size, 0, format);
};

export const getResizedAvatar = (author, sizeString = 'large') => {
  if (!author) {
    return '';
  }
  const url = whatOs === 'android' ? 'https://images.ecency.com/webp' : 'https://images.ecency.com';
  return `${url}/u/${author}/avatar/${sizeString}`;
};
