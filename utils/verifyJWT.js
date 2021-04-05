import fetch from 'node-fetch'
import jwkToPem from 'jwk-to-pem'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'


async function verifyJWT(token) {
    let pems = {}
    let url = `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_c6BGgOzdr/.well-known/jwks.json`
    try {
        const Json = await fetch(url)
        const result = await Json.json()
        let keys = result['keys'];
        for (let i = 0; i < keys.length; i++) {
            let key_id = keys[i].kid;
            let modulus = keys[i].n;
            let exponent = keys[i].e;
            let key_type = keys[i].kty;
            let jwk = { kty: key_type, n: modulus, e: exponent };
            let pem = jwkToPem(jwk);
            pems[key_id] = pem;
        }

        let decodedJwt = jwt.decode(token, { complete: true });

        if (!decodedJwt) {
            return 'error'
        }

        let kid = decodedJwt.header.kid;
        let pem = pems[kid];
        if (!pem) {
            return 'error';
        }

        await promisify(jwt.verify)(token, pem);

        return 'success'
    } catch (err) {
        return 'error'
    }
}

export default verifyJWT