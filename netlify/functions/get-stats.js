// Netlify Function to get site statistics
// Supports Firebase Firestore, JSONBin.io, or falls back to defaults

const USE_FIREBASE = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY;
const STATS_BIN_ID = process.env.STATS_BIN_ID || 'default-stats';

// Initialize Firebase Admin (only if Firebase is configured)
let admin = null;
let firebaseInitialized = false;

function initializeFirebase() {
  if (firebaseInitialized) return admin;
  
  if (!USE_FIREBASE) {
    console.log('Firebase not configured - missing environment variables');
    return null;
  }

  try {
    // Try to require firebase-admin
    try {
      admin = require('firebase-admin');
    } catch (requireError) {
      console.error('Failed to require firebase-admin:', requireError.message);
      return null;
    }

    if (!admin.apps || admin.apps.length === 0) {
      // Handle private key - remove quotes if present and replace \n
      let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';
      if (!privateKey) {
        console.error('FIREBASE_PRIVATE_KEY is missing');
        return null;
      }
      
      // Remove surrounding quotes if present
      if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.slice(1, -1);
      }
      // Replace escaped newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
      
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: privateKey,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      };
      
      if (!serviceAccount.projectId || !serviceAccount.clientEmail) {
        console.error('Missing Firebase credentials:', {
          hasProjectId: !!serviceAccount.projectId,
          hasClientEmail: !!serviceAccount.clientEmail,
          hasPrivateKey: !!serviceAccount.privateKey,
        });
        return null;
      }
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      firebaseInitialized = true;
      console.log('Firebase initialized successfully');
    } else {
      admin = admin.apps[0];
      firebaseInitialized = true;
    }
    
    return admin;
  } catch (error) {
    console.error('Firebase initialization error:', error.message);
    console.error('Error stack:', error.stack);
    return null;
  }
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  const defaultStats = {
    totalVisits: 0,
    totalPlays: 0,
    lastVisit: Date.now(),
  };

  // Always return a response, even if Firebase fails
  try {
    // Initialize Firebase if needed
    const firebaseAdmin = initializeFirebase();
    
    // Log for debugging
    console.log('Get stats called:', { USE_FIREBASE, hasAdmin: !!firebaseAdmin });
    
    // Try Firebase first
    if (firebaseAdmin) {
      const db = firebaseAdmin.firestore();
      const statsDoc = await db.collection('siteStats').doc('main').get();
      console.log('Firebase: Document exists:', statsDoc.exists);
      
      if (statsDoc.exists) {
        const data = statsDoc.data();
        // Handle Firestore Timestamp
        let lastVisit = Date.now();
        if (data.lastVisit) {
          if (data.lastVisit.toMillis) {
            lastVisit = data.lastVisit.toMillis();
          } else if (data.lastVisit.seconds) {
            lastVisit = data.lastVisit.seconds * 1000;
          } else if (typeof data.lastVisit === 'number') {
            lastVisit = data.lastVisit;
          }
        }
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            totalVisits: data.totalVisits || 0,
            totalPlays: data.totalPlays || 0,
            lastVisit: lastVisit,
          }),
        };
      }
      
      // Document doesn't exist, create it with defaults
      await db.collection('siteStats').doc('main').set(defaultStats);
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(defaultStats),
      };
    }

    // Fallback to JSONBin.io
    if (STATS_BIN_ID !== 'default-stats') {
      const response = await fetch(`https://api.jsonbin.io/v3/b/${STATS_BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': process.env.JSONBIN_MASTER_KEY || '',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify(data.record || defaultStats),
        };
      }
    }

    // Return defaults if no database is configured
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(defaultStats),
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      USE_FIREBASE,
      envVars: {
        hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
        hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
        hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      }
    });
    // Always return a valid response, even on error
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(defaultStats),
    };
  }
};

// Wrap the entire handler to catch any initialization errors
const originalHandler = exports.handler;
exports.handler = async (event, context) => {
  try {
    return await originalHandler(event, context);
  } catch (error) {
    console.error('Uncaught error in handler:', error);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        totalVisits: 0,
        totalPlays: 0,
        lastVisit: Date.now(),
        error: 'Function error',
        message: error.message 
      }),
    };
  }
};

