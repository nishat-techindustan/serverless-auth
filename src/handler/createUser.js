import AWS from 'aws-sdk'
import { v4 as uuid } from 'uuid'
import * as yup from 'yup'

const dynamoDB = new AWS.DynamoDB.DocumentClient();

function verifyCreateUser(data) {
    let schema = yup.object().shape({
        username: yup.string().required(),
        password: yup.string(),
        products: yup.array().of(yup.string()),
    });
    const response = schema
        .validateSync({ username: data.username, password: data.password, products: data.products })
    return { ...response }
}

async function createUser(event, context) {
    const { username, password, products } = JSON.parse(event.body)
    let users = { id: uuid(), username, password, products, createdAt: new Date().toLocaleDateString() }
    const response = verifyCreateUser({ username, password, products })

    if (!Boolean(Object.keys(response).length)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Data creation failed!', reason: response }),
        };
    }

    try {
        await dynamoDB.put({
            TableName: 'UsersTable',
            Item: users
        }).promise()
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Something went wrong! Please try again later.' }),
            error
        };
    }
    return {
        statusCode: 201,
        body: JSON.stringify({ message: 'User created succussfully!', results: users }),
    };
}

export const handler = createUser;