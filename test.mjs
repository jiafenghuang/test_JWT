import fs from "fs";
import JWT from "jsonwebtoken";

var privateKey1 = fs.readFileSync("./private.key");
var publicKey1 = fs.readFileSync("./public.key");
var token = JWT.sign({ foo: "bar" }, privateKey1, { algorithm: "RS256" });

setTimeout(() => {
  console.log(token);
  JWT.verify(token, publicKey1, function (err, decoded) {
    console.log(decoded); // bar
  });
}, 1000);
