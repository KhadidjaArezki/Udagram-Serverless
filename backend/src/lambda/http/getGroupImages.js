const AWS = require("aws-sdk")
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const dynamo = new XAWS.DynamoDB.DocumentClient()

const groupsTable = process.env.GROUPS_TABLE
const imagesTable = process.env.IMAGES_TABLE

exports.handler = async (event) => {
  console.log("Processing event: ", event)

  const groupId = event.pathParameters.groupId
  const validGroupId = await groupExists(groupId)

  if (!validGroupId) {
    return {
      statusCode: 404,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Group does not exist",
      }),
    }
  }

  const result = await dynamo
    .query({
      TableName: imagesTable,
      KeyConditionExpression: "groupId = :groupId",
      ExpressionAttributeValues: {
        ":groupId": groupId,
      },
      ScanIndexForward: false, // reverse sort order
    })
    .promise()

  const items = result.Items

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      items,
    }),
  }
}

async function groupExists(groupId) {
  const result = await dynamo
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
