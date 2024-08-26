import { unsign } from 'cookie-signature';
import { SECRET_KEYS } from './constants';

const rotated = rotatedKeys();

function rotatedKeys() {
  const rotated = new Map<string, string[]>();
  return ({
    addKey(id: string, secret: string) {
      if (rotated.has(id)) {
        rotated.get(id)!.push(secret);
      } else {
        rotated.set(id, [secret]);
      }
    },
    userUsedKey(id: string, secret: string) {
      const keyList = rotated.has(id);
      if (keyList && rotated.get(id)!.includes(secret)) {
        return true;
      }
      return false;
    }
  });
}

function cookieSignatureHandler(id: number, cookie: string) {
  for (let idx = 1; idx < SECRET_KEYS.length; idx++) {
    const sekretKey = SECRET_KEYS[idx];
    const isUsedKey = !!unsign(cookie, sekretKey);
    console.log(
      `Is "${sekretKey}" being used right now?: ${isUsedKey}, `,
      `Has user already used the key "${sekretKey}":`, rotated.userUsedKey(String(id), sekretKey),
    );
    if (isUsedKey) {
      if (rotated.userUsedKey(String(id), sekretKey)) {
        handledCookie.maliciousCookieUsage = true;
      } else {
        rotated.addKey(String(id), sekretKey);
      }
    }
  }
}

export const handledCookie = {
  maliciousCookieUsage: false,
  cookieSignatureHandler,
};