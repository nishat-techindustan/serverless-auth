import AWS from 'aws-sdk'

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function deleteUser(event, _) {
    const { userId } = event.pathParameters
    let user
    var params = {
        TableName: 'UsersTable',
        Key: {
            id: userId
        }
    }

    try {
        const result = await dynamoDB.get(params).promise()
        user = result.Item
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Something went wrong!Please try again later.', error, event }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Fetched Successfully', user }),
    };
}

export const handler = deleteUser;