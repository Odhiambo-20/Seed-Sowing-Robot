export const awsConfig = {
  region: process.env.AWS_REGION || 'us-east-1',
  
  cognito: {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || '',
    clientId: process.env.AWS_COGNITO_CLIENT_ID || '',
    identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID || '',
  },
  
  dynamodb: {
    tables: {
      users: process.env.DYNAMODB_TABLE_USERS || 'seed-robot-users',
      robots: process.env.DYNAMODB_TABLE_ROBOTS || 'seed-robot-robots',
      farms: process.env.DYNAMODB_TABLE_FARMS || 'seed-robot-farms',
      sessions: process.env.DYNAMODB_TABLE_SESSIONS || 'seed-robot-sessions',
      alerts: process.env.DYNAMODB_TABLE_ALERTS || 'seed-robot-alerts',
      telemetry: process.env.DYNAMODB_TABLE_TELEMETRY || 'seed-robot-telemetry',
      missions: process.env.DYNAMODB_TABLE_MISSIONS || 'seed-robot-missions',
      maintenance: process.env.DYNAMODB_TABLE_MAINTENANCE || 'seed-robot-maintenance',
      reports: process.env.DYNAMODB_TABLE_REPORTS || 'seed-robot-reports',
      auditLogs: process.env.DYNAMODB_TABLE_AUDIT_LOGS || 'seed-robot-audit-logs',
    },
  },
  
  iot: {
    endpoint: process.env.AWS_IOT_ENDPOINT || '',
    topicPrefix: process.env.AWS_IOT_TOPIC_PREFIX || 'seed-robot',
  },
  
  s3: {
    buckets: {
      media: process.env.S3_BUCKET_MEDIA || 'seed-robot-media',
      reports: process.env.S3_BUCKET_REPORTS || 'seed-robot-reports',
      logs: process.env.S3_BUCKET_LOGS || 'seed-robot-logs',
    },
  },
  
  sagemaker: {
    endpoints: {
      cropRecognition: process.env.SAGEMAKER_ENDPOINT_CROP || '',
      diseaseDetection: process.env.SAGEMAKER_ENDPOINT_DISEASE || '',
      weedDetection: process.env.SAGEMAKER_ENDPOINT_WEED || '',
    },
  },
  
  kinesis: {
    streams: {
      telemetry: process.env.KINESIS_STREAM_TELEMETRY || 'seed-robot-telemetry',
      alerts: process.env.KINESIS_STREAM_ALERTS || 'seed-robot-alerts',
    },
  },
};

export const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.AWS_COGNITO_USER_POOL_ID;
