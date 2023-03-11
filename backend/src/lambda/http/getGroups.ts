import 'source-map-support/register'
import * as express from 'express'
// A library that allows to use express in lambda functions
import * as awsServerlessExpress from 'aws-serverless-express'
import { getAllGroups } from '../../businessLogic/groups';

const app = express()

app.get('/groups', async (_req, res) => {
  const groups = await getAllGroups()

  res.json({
    items: groups
  })
})

// Create Express server
const server = awsServerlessExpress.createServer(app)
// Pass API Gateway events to the Express server
exports.handler = (event, context) => {awsServerlessExpress.proxy(server, event, context)}
