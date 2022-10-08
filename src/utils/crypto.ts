import cryptoJs from "crypto-js";

const key = "OMSIP2019"; // The first 8 passwords are valid
//DES 加密
function encryptByDES(message: string) {
  const keyHex = cryptoJs.enc.Utf8.parse(key);
  const encrypted = cryptoJs.DES.encrypt(message, keyHex, {
    mode: cryptoJs.mode.ECB,
    padding: cryptoJs.pad.Pkcs7,
  });
  return encrypted.ciphertext.toString(cryptoJs.enc.Base64);
}

//DES 解密
function decryptByDES(ciphertext: string) {
  const keyHex = cryptoJs.enc.Utf8.parse(key);
  const decrypted = cryptoJs.DES.decrypt(
    {
      ciphertext: cryptoJs.enc.Base64.parse(ciphertext),
    },
    keyHex,
    {
      mode: cryptoJs.mode.ECB,
      padding: cryptoJs.pad.Pkcs7,
    }
  );
  return decrypted.toString(cryptoJs.enc.Utf8);
}

function strToBase64(rawStr: string) {
  const wordArray = cryptoJs.enc.Utf8.parse(rawStr);
  const base64 = cryptoJs.enc.Base64.stringify(wordArray);
  return atob(base64);
}

function base64ToStr(base64: any) {
  const ss = btoa(base64);
  const parsedWordArray = cryptoJs.enc.Base64.parse(ss);
  const parsedStr = parsedWordArray.toString(cryptoJs.enc.Utf8);
  return parsedStr;
}

export function encryptByBase64DES(paramStr: string) {
  const des = encryptByDES(paramStr);
  return strToBase64(des);
}

export function decryptByBase64DES(base64Str: any) {
  const str = base64ToStr(base64Str);
  return decryptByDES(str);
}
