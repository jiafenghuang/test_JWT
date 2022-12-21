import JWT from "jsonwebtoken";
import fs from "fs";
import { assignJWTKeys, Generator, isNull } from "./util.mjs";
const generator = new Generator();
/*
官方字段
header:{
  "alg": "HS256",表示签名的算法, HMAC SHA256（写成 HS256）
  "typ": "JWT" ,这个令牌（token）的类型（type），JWT 令牌统一写为JWT
},
Payload:{
  iss (issuer)：签发人
  exp (expiration time)：过期时间
  sub (subject)：主题
  aud (audience)：受众
  nbf (Not Before)：生效时间
  iat (Issued At)：签发时间
  jti (JWT ID)：编号
}


sign=>()
first=>payload+custom data
second=>private key
third=>
algorithm (default: HS256)
expiresIn: 
Eg: 60, "2 days", "10h", "7d"."120" is equal to "120ms"

notBefore: 
Eg: 60, "2 days", "10h", "7d"."120" is equal to "120ms"

audience
issuer
jwtid
subject
noTimestamp
header
keyid
mutatePayload: if true, the sign function will modify the payload object directly. 

*/

class checkJWT {
  privateKey = "";
  publicKey = "";
  secret = "secret";
  options = {};
  constructor(privateKey, publicKey, options) {
    this.options = options; //algorithm + keyid + noTimestamp + expiresIn + notBefore
    this.privateKey = !isNull(privateKey) && privateKey;
    this.publicKey = !isNull(publicKey) && publicKey;
  }

  sign(payload, signOptions) {
    const jwtSignOptions = Object.assign({}, this.options, signOptions);
    return new Promise((resolve, reject) => {
      JWT.sign(assignJWTKeys(payload, signOptions), this.privateKey, jwtSignOptions, function (err, token) {
        console.log("err", err);
        console.log("token", token);
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      });
    });
  }

  refresh(token, refreshOptions) {
    const payload = JWT.verify(token, this.secret, refreshOptions.verify);
    delete payload.iat;
    delete payload.exp;
    delete payload.nbf;
    delete payload.jti;
    const jwtSignOptions = Object.assign({}, this.options, { jwtid: refreshOptions.jwtid });
    // The first signing converted all needed options into claims, they are already in the payload
    return JWT.sign(payload, this.secret, jwtSignOptions);
  }

  verify(token, verifyOptions) {
    return new Promise((resolve, reject) => {
      JWT.verify(token, this.publicKey, verifyOptions, function (err, decoded) {
        const result = {
          vaild: "",
          message: "",
          data: null,
        };
        if (err) {
          result.message = err.message;
          result.vaild = false;
          reject(result);
        } else {
          result.vaild = true;
          result.data = decoded;
          resolve(result);
        }
      });
    });
  }

  decode(token) {
    return JWT.decode(token);
  }
}

//------single secret key
const JWTOptions = { keyid: "1", noTimestamp: false, expiresIn: "8s", notBefore: "2s", algorithm: "RS256" };
const signOptions = { audience: "myaud", issuer: "myissuer", jwtid: "1", subject: "user" };
// const tokenGenerator = new checkJWT("a", JWTOptions);

var publicKeyPEM = fs.readFileSync("./public.key");
var privateKeyPEM = fs.readFileSync("./private.key");
// console.log(privateKeyPEM);
const RSAGenerator = new checkJWT(privateKeyPEM, publicKeyPEM, JWTOptions);

let token = "";
async function main() {
  token = await RSAGenerator.sign({ myclaim: "something" }, signOptions);
}
main();

setTimeout(async () => {
  try {
    console.log(await RSAGenerator.verify(token, { audience: "myaud" }));
  } catch (err) {
    console.log(err);
  }
}, 5000);
