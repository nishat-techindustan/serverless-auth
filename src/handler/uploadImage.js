import AWS from 'aws-sdk';

const s3 = new AWS.S3();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function uploadPictureToS3(key, body) {
  const result = await s3.upload({
    Bucket: 'usersproduct',
    Key: key,
    Body: body,
    ContentEncoding: 'base64',
    ContentType: 'image/jpeg',
  }).promise();

  return result;
}

export async function getUserById(id) {
  let user;

  try {
    const result = await dynamoDB.get({
      TableName: 'UsersTable',
      Key: { id },
    }).promise();

    user = result.Item;
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Something went wrong!', }),
    };
  }

  if (!user) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: `User with ID "${id}" not found!` })
    };
  }

  return user;
}

export async function uploadImage(event) {
  const { id } = event.pathParameters;
  const user = await getUserById(id);
  const { image } = JSON.parse(event.body)
  const base64 = image.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');
  const uploadToS3Result = await uploadPictureToS3(user.id + '.jpg', buffer);

  return {
    statusCode: 201,
    body: JSON.stringify({ message: 'Uploaded successfully', uploadToS3Result }),
  };
}

export const handler = uploadImage;