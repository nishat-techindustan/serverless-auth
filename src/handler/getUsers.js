import AWS from 'aws-sdk'
import verifyJWT from '../../utils/verifyJWT'

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getUsers(event, context) {
    let users
    if (!Boolean(event.headers && event.headers.Authorization)) {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'You are not authorised to view this page' })
        }
    }
    let token = event.headers.Authorization.replace(/^Bearer /, '')

    const result = await verifyJWT(token)
    if (result === 'error') {
        return {
            statusCode: 400,
            message: JSON.stringify({ message: 'Invalid token aur token expired.' })
        }
    }
    try {
        const results = await dynamoDB.scan({
            TableName: 'UsersTable',
        }).promise()

        users = results.Items
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Something went wrong!Please try again later.' }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User listing', results: users, token, }),
    }
}

export const handler = getUsers;