const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  projectId: 'kuliapp-2d9b7',
  keyFilename: path.join(__dirname, 'kuliapp-2d9b7-firebase-adminsdk-fbsvc-9775ef30e3.json'),
});

const bucketName = 'kuliapp-2d9b7.appspot.com';

async function setCors() {
  console.log(`🎯 Targeting bucket: ${bucketName}...`);
  const bucket = storage.bucket(bucketName);
  
  await bucket.setCorsConfiguration([
    {
      maxAgeSeconds: 3600,
      method: ['GET', 'POST', 'PUT', 'DELETE'],
      origin: ['*'],
      responseHeader: ['Content-Type', 'Authorization', 'x-goog-resumable'],
    },
  ]);

  console.log(`✅ SUCCESS: CORS configuration updated for ${bucketName}`);
  console.log(`🚀 You can now proceed with your identity verification uploads.`);
}

setCors().catch(err => {
  console.error('❌ CONFIG ERROR:', err.message);
  if (err.message.includes('403') || err.message.includes('permission')) {
    console.log('\n💡 RECOMMENDATION:');
    console.log('Your Service Account needs the "Storage Admin" role.');
    console.log('Go to: https://console.cloud.google.com/iam-admin/iam');
    console.log('Find: firebase-adminsdk-fbsvc@kuliapp-2d9b7.iam.gserviceaccount.com');
    console.log('Add Role: Storage Admin');
  }
});
