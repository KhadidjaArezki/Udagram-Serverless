const AWS = require('aws-sdk')
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const connectionsTable = process.env.CONNECTIONS_TABLE

exports.handler = async (event) => {
  console.log('Websocket connect: ', event)

  const connectionId = event.requestContext.connectionId
  const timestamp = new Date().toISOString()

  const newItem = {
    id: connectionId,
    timestamp
  }

  await docClient.put({
    TableName: connectionsTable,
    Item: newItem
  }).promise()

  return {
    statusCode: 200,
    body: ''
  }
}
