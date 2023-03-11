# Udagram-Serverless
Your own Serverless Instagram on AWS

## Features
Udagram-Serverless allows you to:
* Create a group of images
* Display your groups
* Upload a new image and add it to a group
* Display images belonging to a group
* Send upload notifications to all users of the application via a web socket when an image is uploaded

## Authentication
The current version of the application uses a symmetric algorithm to sign the JWT tokens on Auth0.
Make sure to create an application on [Auth0](https://auth0.com/) following these steps:
  * Create a "Single Page Web Applications" type Auth0 application
  * Go to the App settings, and setup the Allowed Callback URLs
  * Setup the Allowed Web Origins for CORS options
  * Choose your prefered encryption algorithm
  * Copy "domain" and "client id" to save in the `/client/src/config.ts` file

If you choose to implement an asymmetric authentication model, open the `/backend/serverless.yml` file and follow these steps:
  * Uncomment the **RS256Auth** function definition
  * Comment out the **Auth** function definition
  * Modify the `authorizer` field in the `createGroup` and `createImage` functions from **Auth** to **RS256Auth**

## Configuration
* Edit the `/client/src/config.ts` file to configure your Auth0 client application and API endpoint
* Add your Auth0 application's JSON Web Key Set url by changing the value of the `jwksUrl` variable in `backend/src/lambda/auth/rs256Auth0Authorizor.ts`

## Setup
* Install the Serverless Framework’s CLI (version 3.27.0) by running the command:
    `npm install -g serverless@3.27.0`
* Create an AWS IAM user with Administrative access (or equivalent permissions) and store your user credentials safely
* Configure serverless to use the IAM user credentials to deploy the application
You need to have a pair of Access key (YOUR_ACCESS_KEY_ID and YOUR_SECRET_KEY) of an IAM user with Admin access permissions:
`sls config credentials --provider aws --key <YOUR_ACCESS_KEY_ID> --secret <YOUR_SECRET_KEY> --profile <YOUR_SERVERLESS_AWS_PROFILE_NAME>`
* After deploying the backend application to AWS, run the React application (view instructions on the README files inside the client and backend folders).
To run the client app, switch to node 12:
  1. Install nvm (if you haven't yet)
  2. Install node 12 (if you haven't yet) by running:
  `nvm install v12.0.0`
  3. Switch node versions by running the command:
  `nvm use v12.0.0`

## AWS Services
* AWS Lambda
* API Gateway
* S3 - to store images and thumbnails
* DynamoDB - to store groups and images metadata
* SNS - to send topics to subscribed functions when an image is uploaded to S3
* AWS Secrets Manager - to store Auth0 secret
* AWS KMS - to encrypt Auth0 secret
* Amazon OpenSearch - to manage the ElasticSearch cluster which is synchronized to DynamoDB  updates stream in order to 
* AWS XRay - to trace user requests across multiple services in our application

## Plugins
The following Serverless Framewark plugins are required:
- serverless-webpack
-  serverless-iam-roles-per-function
- serverless-plugin-canary-deployments (this plugin is optional. It's used to experiment with the concept of [canary deployments](https://docs.aws.amazon.com/apigateway/latest/developerguide/canary-release.html#:~:text=Canary%20release%20is%20a%20software,operations%20on%20the%20same%20stage). You can remove it from the `/backend/serverless.yml` and `package.json` files if you wish)

## Request Validation
In order to prevent unnecessary Lambda function invocations, request data for certain functions is validated to ensure that it's properly formatted. For this purpose, json schema is used to define request data models in the `/backend/models` folder. These definitions are used by the `createGroup` and `createImage` functions.

