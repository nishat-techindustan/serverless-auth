import { CognitoUserPool, AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js'


const poolData = {
    UserPoolId: 'us-east-1_c6BGgOzdr',
    ClientId: '6esq07ori0kk488gj80aaeok6k'
}

const userPool = new CognitoUserPool(poolData)

function authLogin(event, context, callback) {
    const { email, password } = JSON.parse(event.body)

    const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
    })
    let userData = {
        Username: email,
        Pool: userPool
    }
    let cognitoUser = new CognitoUser(userData)
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            if (result) {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        message: 'Logged in successfully.',
                        data: result
                    }),
                })
            }
        },
        onFailure: function (err) {
            if (err) {
                callback({
                    statusCode: 500,
                    body: JSON.stringify({ error: err }),
                }, null)
            }
        },
        newPasswordRequired: function (userAttributes, requiredAttributes) {
            console.log(userAttributes, requiredAttributes, 'userAttributes...')
        }
    })
}

export const handler = authLogin