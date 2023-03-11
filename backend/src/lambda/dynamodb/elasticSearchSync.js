const elasticsearch = require('elasticsearch')
const httpAwsEs = require('http-aws-es')

const esHost = process.env.ES_ENDPOINT

const es = new elasticsearch.Client({
  hosts: [esHost],
  connectionClass: httpAwsEs
})

exports.handler = async (event) => {
  console.log('Processing events batch from DynamoDB:', JSON.stringify(event))

  for (const record of event.Records) {
    console.log('Processing record: ', JSON.stringify(record))
    
    // We also need to keep track of delete and update operations not only insert
    if (record.eventName !== 'INSERT') {
      continue
    }
    
    const newItem = record.dynamodb.NewImage
    const imageId = newItem.imageId.S
    
    const body = {
      imageId,
      groupId: newItem.groupId.S,
      imageUrl: newItem.imageUrl.S,
      title: newItem.title.S,
      timestamp: newItem.timestamp.S
    }
    
    await es.index({
      index: 'images-index',
      type: 'images',
      id: imageId,
      body
    })
  }
}
