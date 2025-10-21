const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Firebase Admin Initialization with YOUR CREDENTIALS
const serviceAccount = {
  "type": "service_account",
  "project_id": "iiiii-5e9bf",
  "private_key_id": "a9fcb967f38d2291521b7ca4a2e26134ea768193",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxTo5AhsHngx65\nGI4mFL0P9x1cxEnezmoRj5CV75/MaYx+f7hsmQVd9JIbkc1RdPTJgPgmOqvzCELE\n0NZfBNpf44W3nFfBD86z2HmnQ8iR+NHJK7e71+8ATqmXmV4aGbGQzJJ6hW8s0BKd\njeeJ/x0QjFxkNCxmkyI7grwXxfVqXDsQpjEKwQ6qdWSZ87jXxAMUp3VK8+IDlMgW\nn88Fqb/2AnzmPgyyoIxytApiigGndca5ZRK4DOrc8X4vm6huKWTe5mDyoZ1nY7hP\nQrK2kQQAz7DgerasdcYdwRLifcL4/xUOffuUnsJ5gUWIeJg4tw3JJklXZ4uwuxRg\nP15OVn/XAgMBAAECggEAKASCX7bqeb2iyATuRFMG7t0HwAG/aG2vC+Kar/SC3Qhv\ngLeD4OLSjsed2GIadImQnBAjMcGpQHN7Wl+GGrEGNoEsE2pSdg0Cyp2Pq3xFfwip\nFJ3s3JUaaLfYWBJx5jMpW/SIFOYb1wHpSa0W9pLhNPRw/960rLwFjGfv2u+/ea8R\n4GRmF90QKwGKBzHCjZQN1UZCISmTOuH4blCGkm8IeuxmUKjzvNWTFmDB1NNWt4+q\n+/sJWrCnfx3QoF05eYGCRmBxyUi7luCBXSytWywO+gijHzoS5RtF9FjWxwqYsRwz\nPpx+vR9QFQEWiG06ttproV87nGQDYE1IvlKxukdMPQKBgQDmZUCWfbZLXqA9kzCo\nqs3PhBtEg/gHtPKAAjhTTyuz4ZtZWi/C2DKD3oSBknmnLxuon1sEJlTF0CRbZxpF\nX51Y+mjlrMU1u1Kh0k5WExl8P1j8lLGf7YdZ/iWwO4Gznj5BQDZA8FVFjH3aJ0St\nwr21BogVrVCZIVNAz6nma4WgVQKBgQDFAu6gF+dpjGBanYDFre7zg3Y2RhE6o9V/\nNPxhHvlulafJMZGm9hKeN9HUVNnIbvKRTgVuGesg7Rs7Bw5tKQcEpsTNRUfkzTMn\nKRdzprACiBsEOSRoi5zKrfH9Fjqjj7uIq2/DZ+R/KWDIXwjsGE4OqbKq/K14+uOv\nVImYO9ObewKBgQC94DZhkEs7REn1VSfl6ZZibnJ2ffhciaDNJIc9CWNwBP+dnPj9\nsGW5ThqQGqJNyUIXLvW4rspwmEBOX+NDxzALE5x9pGyHAtFv8b2DrIv1XNO+neDh\nd8VzwkNXQUN8P275Ia1UyXzNK6LQtkoglfz4guCGVOa2vMM7B6ny7ywaXQKBgQCl\nZvbMtgT1WoOy0DVCweqxy5c9rcndP5uJNwUEzSqBK2g4xEMSt9mduCOUbsCBRJSm\nZaitbVk4xZhtEFmOUDmyMAlehWH8uELQB/HGiRWQqpB0FT16AGzcxPk7kKQemhfK\ngJROrDTsheLZluA4x5cRPGvink1OGuV5WDJE+0WHbQKBgD9fwe9r15lDGsW/kyH7\numic2vcUQD0LtpmQJ3ygzeYqETFPhOTw5f8WtKBM/iIsgRSfRoEQ0scndscFXdOE\n44645mcaYu8DF1rmPMgC63OLAscxc77A47ZJz686ye5K/BfdRDG/kM4dQ32yclkM\nxvKYZimLIpbAnAaW2NYA+yOk\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@iiiii-5e9bf.iam.gserviceaccount.com",
  "client_id": "109536432770303608065",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40iiiii-5e9bf.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://iiiii-5e9bf-default-rtdb.firebaseio.com"
});

// Health Check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Review Share Notification Server is Running! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Send Notification API
app.post('/send-notification', async (req, res) => {
  try {
    const { token, title, body, data } = req.body;

    console.log('📨 Received notification request:', { token, title, body });

    if (!token || !title || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: token, title, body'
      });
    }

    const message = {
      notification: {
        title: title,
        body: body
      },
      data: data || {},
      token: token,
      webpush: {
        fcm_options: {
          link: 'https://reviewa2z.com/chat.html'
        }
      }
    };

    console.log('🚀 Sending FCM message...');
    const response = await admin.messaging().send(message);
    
    console.log('✅ Notification sent successfully:', response);

    res.json({
      success: true,
      messageId: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error sending notification:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      code: error.code
    });
  }
});

// Test API
app.post('/test', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        error: 'Token is required'
      });
    }

    const message = {
      notification: {
        title: '🎉 Server Test Successful!',
        body: 'Your notification server is working perfectly!'
      },
      data: {
        type: 'server_test',
        message: 'Server is configured correctly!',
        timestamp: new Date().toISOString()
      },
      token: token
    };

    const response = await admin.messaging().send(message);

    res.json({
      success: true,
      message: 'Test notification sent successfully!',
      messageId: response
    });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Review Share Notification Server running on port ${PORT}`);
  console.log(`📍 Health: http://localhost:${PORT}`);
  console.log(`✅ Ready to send notifications!`);
});