# JWT
> https://jwt.io/ 
> jsonwebtoken

## 官方定义字段
```
header:{
    "alg": "HS256",表示签名的算法, HMAC SHA256（写成 HS256）
    "typ": "JWT" ,这个令牌（token）的类型（type），JWT 令牌统一写为JWT
}
payload:{
    iss (issuer)：签发人
    exp (expiration time)：过期时间
    sub (subject)：主题
    aud (audience)：受众
    nbf (Not Before)：生效时间
    iat (Issued At)：签发时间
    jti (JWT ID)：编号
}
```

## JWT的方法
### 信息转token
1. sign
`sign(payload, secretKey, [option,callback]) => token`
```
payload: 官方字段+自定义字段

secretKey: 秘钥,可以用一个也可以用2个的，公秘钥

option: 属于比较便利的添加payload值, option的属性名是全称, 属性值是使用string和number来表示
Eg: expiresIn:  60, "2 days", "10h", "7d"."120" is equal to "120ms"

callback:(err,decode) => 返回错误和结果

```

### token转信息
1. decode,不检验token,直接解析
`JWT.decode(token,{ complete:true }) => payload + header`
```
complete ,默认为false, 仅显示payload
```

2. verify, token检验
`JWT.verify(token, secretKey, , [options, callback] => info`
```
token: 检验的token
secretKey：和生成token同一个秘钥
options: 可以用于检验该token是否是和生成的info相同
```
