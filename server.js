const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔑 New Service Account JSON
const serviceAccount = {
  "type": "service_account",
  "project_id": "iiiii-5e9bf",
  "private_key_id": "5aa29f889ac83de1035e9bee2f44e8d0df891e53",
  "private_key": `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCNxlCp7WOcYk2S
tZlMs7cSXh9dF7K5v5YjMimCc4aChWAHtZTKfNLqNqWIqo7r6loDkK0IPQLqraCt
3uXhbugagfg4iSKAlf7cwjXkeCw38oN8WDnIFm4S1yZ+qHSPxb9XIKSHYIKECN68
5L0GRGkm6/EtOoqSEH/LtawQ0+FD6xMNdxE8TmkD2a1OAerElHQ2Kdr4vp1B3jvc
noGHY3QbRiPUZGyxKLTaz8xL2YLwPBWFzsCQBJ4ePC3kDyxs4xoS+lePnVV2IU8h
qNrMswvEFcJvCLwpH8BqExQB3dTQ1gJqsLF7p+2MuU6ZVAOB1NWpepu5r1whmC+V
KF/Zip2xAgMBAAECggEAAtH4Fs6XFaxK7hPYtH2QCGMrl+F5zQIc+B7uU8mn2lQm
4IsMe6lXVLtjjZVppGhpWVAjxlnYWKy9g9fplhNrteNHTxtDPsWSZ/fLtKYYqGrq
51VQnkSmnzn9FQtAI6quWgsB2tjg9RlsEjExUBJE+TY7pPJY1qZSCc5XruStbXlp
trcfvegIi0dlQS26F6i1WnaEYRSNX9KbGrTmmCNYYPwkj05UmSW5gvfviDJjB/C6
JJf049sCungMXma6I0NHGZPGF7WLpFEwkXiQZoRNWusjU8kN60rYYWRi+eiyW3+g
tDjIbSPVqlWqaoa7CKNWb4FfPBIsQsd5UCEjkhUyQQKBgQDEZVvzuuxn9E7nItfg
gXQt34LO9OhCyh/Oz60Xth6y6mey4u8DYZgPUZ696bpe20YUwVoD14IFwUKtJZIn
IqxnEw/BueXf/wh7VhIwULPoQpFcLVDOzf9K8iZtyPyEzNPYW5/qxmMSE3aNISZx
xTllHtrFJ06m7SkDysKkrMX+CQKBgQC4zUBmrgC2go+UHNU4h5EvQ6FRWNAtOq1K
bZ8ClcfT6XwEyVr8XOuRLHukxq25yCmhuijovo03IbcH9EZS/RcDNlXeIoCrGdrM
EpUvipYbNw/WudJMdiQfiwSZdzGCgnkfz83y6AML4NAwxelRtqSnjkMjMx/GfqYB
YyY7XEUMaQKBgBMHdydgfzN7WoHOwHgCUw120KfY1wBRsU9KlAzuGn9fcvjEQEBl
nmQtlmH0WZiDSoEMUvp4USLZnOpF76lXFLlQAYDV0E4p2dqJdm20BBqHCKqTwXao
Qwox+EM+7Ci55/TYu9/1pPfFZwE5qw3u/CauHKhprJdD92tkpANssipxAoGBAI+Z
/wdLAwbPoZ5oYU+SGMFvfjVmHC5pQCtrz3oExcjn0BUwGmGsGukudc3vDSQmZCNm
M0/Ycod6zW2C5fqq7Gz0lfkNOoq6hoi5j+/ncwkm2knzD3WXAC76qdJPCsvtcw3D
PrgYjfV29pBP2iRDFuOU6pq5qWFnHLxLPXQ3GPixAoGBALcQALxXoTUPaqR0jylB
HIwgaEIBW+5RiuxSz5xbRbIU06dfOqj1/XT32F9w/Arwda2ELbb5+6Z+u+4IK3bn
vVZiiZXeGkbdi9gai7yYnHDoVcA1oortvryBlJTujSSHZbThkAYD734ACmxr5Owb
JUeETQiQgjYK5y4P3tARwgfI
-----END PRIVATE KEY-----`,
  "client_email": "firebase-adminsdk-fbsvc@iiiii-5e9bf.iam.gserviceaccount.com",
  "client_id": "109536432770303608065",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40iiiii-5e9bf.iam.gserviceaccount.com"
};

// 🔹 Fix newlines for Firebase Admin
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

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

    if (!token || !title || !body) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: token, title, body'
      });
    }

    const message = {
      notification: { title, body },
      data: data || {},
      token,
      webpush: { fcm_options: { link: 'https://reviewa2z.com/chat.html' } }
    };

    const response = await admin.messaging().send(message);

    res.json({
      success: true,
      messageId: response,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error sending notification:', error);
    res.status(500).json({ success: false, error: error.message, code: error.code });
  }
});

// Test API
app.post('/test', async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, error: 'Token is required' });

    const message = {
      notification: { title: '🎉 Server Test Successful!', body: 'Your notification server is working!' },
      data: { type: 'server_test', message: 'Server is configured correctly!', timestamp: new Date().toISOString() },
      token
    };

    const response = await admin.messaging().send(message);

    res.json({ success: true, message: 'Test notification sent successfully!', messageId: response });

  } catch (error) {
    console.error('Test error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Review Share Notification Server running on port ${PORT}`);
});
