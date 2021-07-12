const { SQSClient, SendMessageCommand } = require('@aws-sdk/client-sqs');

const REGION = 'us-east-1';

class EmailQueue {
  static instance = new SQSClient({ region: REGION })

  constructor() {
    return this
  }

  async sendEmailMessage({ subject, body, to }) {
    try {
      const params = {
        DelaySeconds: 5,
        MessageAttributes: {
          "subject": {
            DataType: "String",
            StringValue: subject
          },
          "body": {
            DataType: "String",
            StringValue: body
          },
          "to": {
            DataType: "String",
            StringValue: JSON.stringify(to)
          }
        },
        MessageBody: "Email",
        QueueUrl: process.env.AWS_SQS_URL
      };

      return EmailQueue.instance.send(new SendMessageCommand(params));
    } catch (err) {
      console.log('Error adding email message to queue: ', err);
    }
  }
}

const emailQueue = new EmailQueue();

module.exports = emailQueue;
