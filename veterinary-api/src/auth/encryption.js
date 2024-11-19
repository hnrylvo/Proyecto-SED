const config = require('../config')

function encrypt(text) {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode =
      text.charCodeAt(i) ^ config.SECRET_KEY.charCodeAt(i % config.SECRET_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return Buffer.from(result).toString("base64");
}

function decrypt(encryptedText) {
  const text = Buffer.from(encryptedText, "base64").toString();
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode =
      text.charCodeAt(i) ^ config.SECRET_KEY.charCodeAt(i % config.SECRET_KEY.length);
    result += String.fromCharCode(charCode);
  }
  return result;
}

module.exports = {
  encrypt,
  decrypt,
};
