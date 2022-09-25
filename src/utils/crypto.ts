import cryptoJs from "crypto-js";
//DES加密
export const encryptDes = (message: string, key: string = "OMSIP2019") => {
  const keyHex = cryptoJs.enc.Utf8.parse(key);
  const encrypted = cryptoJs.DES.encrypt(message, keyHex, {
    mode: cryptoJs.mode.ECB,
    padding: cryptoJs.pad.NoPadding,
  });
  // cryptoJs.enc.Base64
  return encrypted.ciphertext.toString();
};
//DES解密
export const decryptDes = (ciphertext: string, key: string = "OMSIP2019") => {
  const keyHex = cryptoJs.enc.Utf8.parse(key);
  const decrypted = cryptoJs.DES.decrypt(
    {
      ciphertext: cryptoJs.enc.Hex.parse(ciphertext),
    },
    keyHex,
    {
      mode: cryptoJs.mode.ECB,
      padding: cryptoJs.pad.NoPadding,
    }
  );
  const result_value = decrypted.toString(cryptoJs.enc.Utf8);
  return result_value;
};

export const encodeUserInfo = (val: string) => {
  const res = encryptDes(val);
  return btoa(res);
};

export const decodeUserInfo = (val: string) => {
  const res = atob(val);
  return decryptDes(res);
};
