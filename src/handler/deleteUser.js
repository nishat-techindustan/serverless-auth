import AWS from 'aws-sdk'

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function deleteUser(event, _) {
    const { userId } = event.pathParameters
    try {
        await dynamoDB.delete({
            TableName: 'UsersTable',
            Key: {
                id: userId,
            }
        }).promise()
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Something went wrong!Please try again later.', error, event }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Deleted successfully' }),
    };
}

export const handler = deleteUser;