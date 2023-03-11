<!---
title: 'AWS Serverless Image Gallery Application in NodeJS'
description: 'An application for uploading, grouping, and displaying images built with Node.js and is running on AWS Lambda and API Gateway using the Serverless Framework.'
layout: Doc
framework: v3
platform: AWS
language: nodeJS
nodeVersion: 18.x
--->

# Serverless Backend Application for Udagram-Serverless

## Usage

### Deployment

```
$ serverless deploy --aws-profile <your_serverless_aws_profile_name>
```

After deploying, you should see output similar to:

```bash
Deploying aws-node-yourgram-project to stage dev (us-east-1)

✔ Service deployed to stack aws-node-yourgram-project-dev (152s)

endpoint: GET - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/groups
functions:
  hello: aws-node-yourgram-project-dev-getGroups (1.9 kB)
```

### Invocation

After successful deployment, you can call the created application via HTTP:

```bash
curl https://xxxxxxx.execute-api.us-east-1.amazonaws.com/dev/groups
```

Which should result in response similar to the following:

```json
{
  "items": [
    ...
  ]
}
```

### Local development

You can invoke your function locally by using the following command:

```bash
serverless invoke local --function getGroups
```

Which should result in response similar to the following:

```json
{
  "statusCode": 200,
  "body": {
    "items": [
    ...
    ]
  }
}
```


Alternatively, it is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).
