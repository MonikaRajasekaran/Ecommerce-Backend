module.exports = {
  database: {},
  aws: {
    accessKeyId: process.env.AWS_ACCESSKEYID,
    secretAccessKey: process.env.AWS_SECRET,
    clientId: process.env.COGNITO_APP_CLIENT_ID,
    aws_region: process.env.AWS_REGION,
    bucket: 'hil-commerce',
  },
  cloudFront: "https://dkchihacxsn9e.cloudfront.net/",
  forex: process.env.FOREX,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_host: process.env.DB_HOST,
  db_name: process.env.DB_NAME,
  key: process.env.ENCRYPTION_KEY,
  ivString: process.env.IV_STRING,
  jwt_secret: process.env.JWT_SECRET,
  sendgrid_api_key: process.env.SENDGRID_API_KEY,
  email: {
    from: 'noreply@higglerslab.com',
  },
  sendGrid_templates: {
    email_verify: 'd-e836ddba7652470e83befd2e3b6cd4c3',
  },
  rekognition: {
    collection: `Exp-${process.env.ENV}`,
  },
  sk_config: [
    'aws.accessKeyId',
    'aws.secretAccessKey',
    'forex',
    'db_username',
    'db_password',
    'jwt_secret',
    'sendgrid_api_key',
  ],
  base_url: 'https://api.influencer.com',
};
