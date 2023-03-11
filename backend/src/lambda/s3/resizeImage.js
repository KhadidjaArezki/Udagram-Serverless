const AWS = require('aws-sdk')
const Jimp = require('jimp')
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3()

const imagesBucket = process.env.IMAGES_S3_BUCKET
const thumbnailsBucket = process.env.THUMBNAILS_S3_BUCKET

exports.handler = async (event) => {
  console.log('Processing SNS event ', JSON.stringify(event))
  
  for (const snsRecord of event.Records) {
    const s3EventStr = snsRecord.Sns.Message
    
    console.log('Processing S3 event', s3EventStr)
    const s3Event = JSON.parse(s3EventStr)

    for (const record of s3Event.Records) {
      await processImage(record)
    }
  }
}

async function processImage(record) {
  const key = record.s3.object.key
  const response = await s3
  .getObject({
    Bucket: imagesBucket,
    Key: key
  })
  .promise()

  const body = response.Body
  // Read an image with the Jimp library
  const image = await Jimp.read(body)

  // Resize an image maintaining the ratio between the image's width and height
  image.resize(150, Jimp.AUTO)

  // Convert an image to a buffer that we can write to a different bucket
  const convertedBuffer = await image.getBufferAsync(Jimp.AUTO)
  
  await s3
  .putObject({
    Bucket: thumbnailsBucket,
    Key: `${key}.jpeg`,
    Body: convertedBuffer
  })
  .promise()
}
