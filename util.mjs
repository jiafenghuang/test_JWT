import { v4 as uuidv4 } from "uuid";
class Generator {
  alg = "HS256";
  // JWTId
  genUUid() {
    return uuidv4();
  }

  //256 bit secret key
  genKey() {}
}

function isJWTKeys(keys) {
  if (typeof keys === "string" && keys.length !== 3) return false;
  const defaultKeysArray = ["alg", "typ", "iss", "exp", "sub", "aud", "nbf", "iat", "jti"];
  return defaultKeysArray.includes(keys);
}

function assignJWTKeys(payload, ...optionsArr) {
  optionsArr.forEach((options) => {
    for (let key in options) {
      isJWTKeys(key) && Object.assign(payload, { key: options[key] });
    }
  });

  return payload;
}
function isNull(str) {
  return ["", undefined, null].includes(str);
}

// function
export { Generator, assignJWTKeys, isNull };
