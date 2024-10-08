'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');

const UINT32_MAX = 0xffffffff;
const BUF_LEN = 1024;
const BUF_SIZE = BUF_LEN * Uint32Array.BYTES_PER_ELEMENT;

const randomPrefetcher = {
  buf: crypto.randomBytes(BUF_SIZE),
  pos: 0,
  next() {
    const { buf, pos } = this;
    let start = pos;
    if (start === buf.length) {
      start = 0;
      crypto.randomFillSync(buf);
    }
    const end = start + Uint32Array.BYTES_PER_ELEMENT;
    this.pos = end;
    return buf.subarray(start, end);
  },
};

const cryptoRandom = (min: number, max: number) => {
  const buf = randomPrefetcher.next();
  const rnd = buf.readUInt32LE(0) / (UINT32_MAX + 1);
  if (min === undefined) return rnd;
  const [a, b] = max === undefined ? [0, min] : [min, max];
  return a + Math.floor(rnd * (b - a + 1));
};

const random = (min: number, max: number) => {
  const rnd = Math.random();
  if (min === undefined) return rnd;
  const [a, b] = max === undefined ? [0, min] : [min, max];
  return a + Math.floor(rnd * (b - a + 1));
};

const generateUUID = crypto.randomUUID;

const generateKey = (possible: string, length: number) => {
  if (length < 0) return '';
  const base = possible.length;
  if (base < 1) return '';
  const key = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    const index = crypto.randomInt(0, base);
    key[i] = possible.charCodeAt(index);
  }
  return String.fromCharCode.apply(null, key as never);
};

const CRC_LEN = 4;

const crcToken = (secret: string, key: number) => {
  const md5 = crypto.createHash('md5').update(key + secret);
  return md5.digest('hex').substring(0, CRC_LEN);
};

const generateToken = (secret: string, characters: string, length: number) => {
  if (length < CRC_LEN || secret === '' || characters === '') return '';
  const key = generateKey(characters, length - CRC_LEN);
  return key + crcToken(secret, key as never);
};

const validateToken = (secret: string, token: string) => {
  if (!token) return false;
  const len = token.length;
  const crc = token.slice(len - CRC_LEN);
  const key = token.slice(0, -CRC_LEN);
  const secretSign = Buffer.from(crcToken(secret, key as never));
  const tokenSign = Buffer.from(crc);
  return crypto.timingSafeEqual(secretSign, tokenSign);
};

// Only change these if you know what you're doing
const SCRYPT_PARAMS = { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };
const SCRYPT_PREFIX = '$scrypt$N=32768,r=8,p=1,maxmem=67108864$';

const serializeHash = (hash: string, salt: string) => {
  // @ts-ignore
  const saltString = salt.toString('base64').split('=')[0];
  // @ts-ignore
  const hashString = hash.toString('base64').split('=')[0];
  return `${SCRYPT_PREFIX}${saltString}$${hashString}`;
};

const parseOptions = (options: string) => {
  const values = [];
  const items = options.split(',');
  for (const item of items) {
    const [key, val] = item.split('=');
    values.push([key, Number(val)]);
  }
  return Object.fromEntries(values);
};

const HASH_PARTS = 5;

const deserializeHash = (phcString: string) => {
  const parts = phcString.split('$');
  if (parts.length !== HASH_PARTS) {
    throw new Error('Invalid format; Expected $name$options$salt$hash');
  }
  const [, name, options, salt64, hash64] = parts;
  if (name !== 'scrypt') {
    throw new Error('Node.js crypto module only supports scrypt');
  }
  const params = parseOptions(options);
  const salt = Buffer.from(salt64, 'base64');
  const hash = Buffer.from(hash64, 'base64');
  return { params, salt, hash };
};

const SALT_LEN = 32;
const KEY_LEN = 64;

const hashPassword = (password: string) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(SALT_LEN, (err: Error, salt: string) => {
      if (err) return void reject(err);
      crypto.scrypt(password, salt, KEY_LEN, SCRYPT_PARAMS, (err: Error, hash: string) => {
        if (err) return void reject(err);
        resolve(serializeHash(hash, salt));
      });
    });
  });

const validatePassword = (password: string, serHash: string) => {
  const { params, salt, hash } = deserializeHash(serHash);
  return new Promise((resolve, reject) => {
    const callback = (err: Error, hashedPassword: string) => {
      if (err) return void reject(err);
      resolve(crypto.timingSafeEqual(hashedPassword, hash));
    };
    crypto.scrypt(password, salt, hash.length, params, callback);
  });
};

const md5 = (filePath: string) => {
  const hash = crypto.createHash('md5');
  const file = fs.createReadStream(filePath);
  return new Promise((resolve, reject) => {
    file.on('error', reject);
    hash.once('readable', () => {
      resolve(hash.read().toString('hex'));
    });
    file.pipe(hash);
  });
};

const DNS_PREFIX = 'DNS:';

const getX509names = (cert: { subject: string, subjectAltName: string; }) => {
  const { subject, subjectAltName } = cert;
  const name = subject.split('=').pop();
  const names = subjectAltName
    .split(', ')
    .filter((name) => name.startsWith(DNS_PREFIX))
    .map((name) => name.substring(DNS_PREFIX.length, name.length));
  return [name, ...names];
};

export {
  cryptoRandom,
  random,
  generateUUID,
  generateKey,
  crcToken,
  generateToken,
  validateToken,
  serializeHash,
  deserializeHash,
  hashPassword,
  validatePassword,
  md5,
  getX509names,
};