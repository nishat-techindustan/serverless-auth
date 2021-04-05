import { CognitoUserPool, CognitoUserAttribute } from 'amazon-cognito-identity-js'

const poolData = {
    UserPoolId: 'us-east-1_c6BGgOzdr',
    ClientId: '6esq07ori0kk488gj80aaeok6k'
}

const userPool = new CognitoUserPool(poolData)

function authRegister(event, context, callback) {
    var attributeList = []
    const { name, email, phoneNumber, password } = JSON.parse(event.body)

    attributeList.push(new CognitoUserAttribute({ Name: 'name', Value: name }))
    attributeList.push(new CognitoUserAttribute({ Name: 'email', Value: email }))
    attributeList.push(new CognitoUserAttribute({ Name: 'phone_number', Value: phoneNumber }))
    userPool.signUp(email, password, attributeList, null, function (err, result) {
        if (err) {
            callback({
                statusCode: 500,
                body: JSON.stringify({ message: 'Registered unsuccessful.', error: err.message }),
            })
        } else {
            let cognitoUser = result.user
            callback(null, {
                statusCode: 201,
                body: JSON.stringify({ message: 'Registered successfully.', cognitoUser }),
            })
        }
    })
}

export const handler = authRegister