async function demo(event, context, callback) {
    const { name } = JSON.parse(event.body)
    const response_success = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'ok',
            name
        }),
    };

    const response_error = {
        statusCode: 400,
        body: JSON.stringify({
            message: 'error'
        }),
    };
    return callback(null, response_success)

}

export const handler = demo