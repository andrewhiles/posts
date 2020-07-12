---
layout: post
title: Fetching zip files from S3 Buckets with NodeJS
date: 2020-03-03
categories: [NodeJS, AWS, Serverless]
---

Recently, I've been working on a project that uses a lot of Serverless technology. In most cases, I'm writing Serverless functions in AWS using their FaaS (functions as a service) offering, [AWS Lambda](https://aws.amazon.com/lambda/). Amazon have did a great job in providing a [SDK for NodeJS](https://aws.amazon.com/sdk-for-node-js/) which makes writing Lambda functions in JavaScript very simple as it provides lots of different APIs for interacting with other AWS services.

Just last week, I was tasked with writing a Lambda function that would receive an SNS event each time a new zip file was uploaded to any S3 Bucket in a specific AWS account. The Lambda had to parse the event metadata to get the file key, fetch the file, unzip the file and then read the data into a temporary file that could be used for further processing. This sounds reasonably straight forward but it took me a moment to re-familiarize myself with NodeJS Streams and how to use them.

I've been making a conscious effort to use [async/await](https://javascript.info/async-await) in most places where I'm dealing with asynchronous code and the AWS SDK for NodeJS works well with Promises ([despite them not mentioning this very publicly](https://aws.amazon.com/blogs/developer/support-for-promises-in-the-sdk/)) so it made sense to take advantage here. The code snippet below shows how I implemented a solution to fetch a zip file from S3, unzip it and write the contents of the file out to a temporary file in the Lambda's temporary working directory. 

PS. It's worth noting, normally when making a call to get a file from S3, you should be able to access the raw file data by accessing the body of the result. The reason why this task was reasonably cumbersome was because I had to deal with .zip files and streams. Thankfully, using [zlib](https://node.readthedocs.io/en/latest/api/zlib/) made this all a bit more manageable.

```javascript
const aws = require('aws-sdk');
const fs = require('fs');
const zlib = require('zlib');
const s3 = new aws.S3();

exports.handler = async (event, context, callback) => {

  // parse event data to get bucket and file details
  const s3BucketName = snsMessage.Records[0].s3.bucket.name;
  const s3FileKey = snsMessage.Records[0].s3.object.key;

  const s3BucketParams = {
    Bucket: s3BucketName,
    Key: s3FileKey
  };

  const s3ReadStream = await s3.getObject(s3BucketParams).createReadStream();
  const streamS3FileToLocalFile = (inputStream) => {
    return new Promise((resolve, reject) => {
      const fileWriteStream = fs.createWriteStream('/tmp/data.txt');
      const unzip = zlib.createGunzip();
      inputStream
        .pipe(unzip)
        .pipe(fileWriteStream)
        .on('finish', () => {
          resolve({ message: 'Complete!' });
        })
        .on('error', (err) => {
          reject({ message: `Something went wrong ${err.message}`});
        });
    });
  };

  await streamS3FileToLocalFile(s3ReadStream);

  // do stuff with file data

  // end lambda execution
  await { message: "Successfully fetched S3 file data :)" };
}
```

The above code was the solution I ended-up settling with. When you fetch a file from a S3 Bucket, you need to create a read stream. Once you have setup your stream, that is what you pass to the 'streamS3FileToLocalFile' function which wraps all of the downstream async function calls in a Promise. If either the unzip or writing to local file steps should encounter an error, the error event emitter will fire and the promise rejected. If the Promise resolves successfully, the file has been fetched from S3, unzipped and it's contents written to a local file.

This works really well for myself and has been reasonably performant. I was unsure how well the code would handle large zip files containing thousands of lines but it seems like a robust solution. The reason for sharing this was because I struggled to find any good examples on the internet myself so I figured it would be worth sharing once I'd implemented a satisfactory solution that could hopefully help others, and possibly myself, should I ever need to do this again.

Thanks for reading! :)

Andrew
