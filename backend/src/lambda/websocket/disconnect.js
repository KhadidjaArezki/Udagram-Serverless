const AWS = require('aws-sdk')
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const connectionsTable = process.env.CONNECTIONS_TABLE

exports.handler = async (event) => {
  console.log('Websocket disconnect: ', event)

  const connectionId = event.requestContext.connectionId
  const key = {
    id: connectionId
  }

  await docClient.delete({
    TableName: connectionsTable,
    Key: key
  }).promise()

  return {
    statusCode: 200,
    body: ''
  }
}
