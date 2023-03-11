const AWS = require("aws-sdk")
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const dynamo = new XAWS.DynamoDB.DocumentClient()

const groupsTable = process.env.GROUPS_TABLE
const imagesTable = process.env.IMAGES_TABLE
const imageIdIndex = process.env.IMAGE_ID_INDEX

exports.handler = async (event) => {
  console.log("Processing event: ", event)
  
  const imageId = event.pathParameters.imageId
  const result = await dynamo
    .query({
      TableName: imagesTable,
      IndexName: imageIdIndex,
      KeyConditionExpression: "imageId = :imageId",
      ExpressionAttributeValues: {
        ":imageId": imageId,
      }
    })
    .promise()
    
  if (result.Count !== 0) {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(result.Items[0])
    }
  }
  
  return {
    statusCode: 404,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      error: "Image does not exist",
    }),
  }
}
