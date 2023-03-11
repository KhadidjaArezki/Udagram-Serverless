const AWS = require("aws-sdk")
import * as AWSXRay from 'aws-xray-sdk'
const uuid = require("uuid")
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()

const groupsTable = process.env.GROUPS_TABLE
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const S3 = new XAWS.S3({
  signatureVersion: "v4",
})

exports.handler = middy(async (event) => {
  console.log("Processing event: ", event)

  const groupId = event.pathParameters.groupId
  const validGroupId = await groupExists(groupId)

  if (!validGroupId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: "Group does not exist",
      }),
    }
  }

  const itemId = uuid.v4()
  const parsedBody = JSON.parse(event.body)

  const newItem = {
    imageId: itemId,
    groupId: groupId,
    timestamp: new Date().toISOString(),
    ...parsedBody,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`,
  }

  await docClient
    .put({
      TableName: imagesTable,
      Item: newItem,
    })
    .promise()

  const url = getUploadUrl(itemId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem,
      uploadUrl: url,
    }),
  }
})

async function groupExists(groupId) {
  const result = await docClient
    .get({
      TableName: groupsTable,
      Key: {
        id: groupId,
      },
    })
    .promise()

  console.log("Get group: ", result)
  return !!result.Item
}

// Create a signed url that allows us to add a new file to the bucket
function getUploadUrl(imageId) {
  return S3.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: imageId,
    Expires: parseInt(urlExpiration),
  })
}

// Add CORS headers to our http response and allow browser to send credentials
handler.use(
  cors({
    credentials: true
  })
)
