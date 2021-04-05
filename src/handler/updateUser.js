import AWS from 'aws-sdk'
import * as yup from 'yup'

const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function updateUser(event, context) {
    const { userId } = event.pathParameters
    const { username, password, products } = JSON.parse(event.body)
    const updatedAt = new Date().toLocaleDateString()
    let user
    var params = {
        TableName: 'UsersTable',
        Key: {
            id: userId
        },
        UpdateExpression: 'set username = :username, password = :password, products = :products, updatedAt = :updatedAt',
        ExpressionAttributeValues: {
            ':username': username,
            ':password': password,
            ':products': products,
            ':updatedAt': updatedAt
        },
        ReturnValues: 'ALL_NEW',
    }

    try {
        const result = await dynamoDB.update(params).promise()
        user = result
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Something went wrong!Please try again later.', error }),
        };
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User Updated Successfully.', user }),
    };
}

export const handler = updateUser;