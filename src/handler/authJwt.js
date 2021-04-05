import fetch from 'node-fetch'
import jwkToPem from 'jwk-to-pem'
import jwt from 'jsonwebtoken'
import { promisify } from 'util'


async function authJWT(event, context, callback) {
    let pems = {}
    let url = `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_c6BGgOzdr/.well-known/jwks.json`
    let token = event.headers.Authorization.replace(/^Bearer /, '')
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
            return {
                statusCode: 200,
                body: JSON.stringify({
                    message: 'User unauthenticated',
                    reason: 'Invalid token'
                })
            }
        }

        let kid = decodedJwt.header.kid;
        let pem = pems[kid];
        if (!pem) {
            console.log('Invalid token');
            return;
        }
        const decoded = await promisify(jwt.verify)(token, pem);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'user authenticated',
                data: result['keys'],
                pems,
                event: token,
                decodedJwt,
                decoded
            })
        }
    } catch (error) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'User unauthenticated', error })
        }
    }
}

export const handler = authJWT