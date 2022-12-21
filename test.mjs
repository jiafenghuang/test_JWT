import fs from "fs";
import JWT from "jsonwebtoken";

var privateKey1 = fs.readFileSync("./private.key");
var token1 = JWT.sign({ foo: "bar" }, "shhhh");
console.log(token1);
