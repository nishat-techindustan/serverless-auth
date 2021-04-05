import AWS from 'aws-sdk'

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function getUsers(event, context) {
    let users
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
        body: JSON.stringify({ message: 'User listing', results: users }),
    };
}

export const handler = getUsers;