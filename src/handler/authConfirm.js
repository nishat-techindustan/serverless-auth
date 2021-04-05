import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js'

let poolData = {
    UserPoolId: 'us-east-1_c6BGgOzdr',
    ClientId: '6esq07ori0kk488gj80aaeok6k',
};

let userPool = new CognitoUserPool(poolData);

function authConfirm(event, context, callback) {
    const { email, code } = JSON.parse(event.body)
    let userData = {
        Username: email,
        Pool: userPool,
    };

    let cognitoUser = new CognitoUser(userData);

    cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
            callback({
                statusCode: 500,
                body: JSON.stringify({ message: 'Confirmed unsuccessful.', error: err.message }),
            })
        } else {
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({ message: 'Confirmed successfully.', result }),
            })
        }
    });
}

export const handler = authConfirm