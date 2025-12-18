// Netlify Function to update site statistics
// Supports Firebase Firestore, JSONBin.io, or falls back gracefully

const USE_FIREBASE = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY;
const STATS_BIN_ID = process.env.STATS_BIN_ID || 'default-stats';
const JSONBIN_MASTER_KEY = process.env.JSONBIN_MASTER_KEY || '';

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
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Always return a response, even if Firebase fails
  try {
    const body = JSON.parse(event.body || '{}');
    const { action } = body; // 'incrementVisit' or 'incrementPlay'

    // Log for debugging
    console.log('Update stats called:', { action, USE_FIREBASE, hasAdmin: !!admin });

    // Initialize Firebase if needed
    const firebaseAdmin = initializeFirebase();
    
    // Try Firebase first
    if (firebaseAdmin) {
      const db = firebaseAdmin.firestore();
      const statsRef = db.collection('siteStats').doc('main');

      if (action === 'incrementVisit') {
        await statsRef.set({
          totalVisits: firebaseAdmin.firestore.FieldValue.increment(1),
          lastVisit: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        console.log('Firebase: Incremented visit');
      } else if (action === 'incrementPlay') {
        await statsRef.set({
          totalPlays: firebaseAdmin.firestore.FieldValue.increment(1),
        }, { merge: true });
        console.log('Firebase: Incremented play');
      }

      // Get updated stats
      const statsDoc = await statsRef.get();
      const data = statsDoc.data() || { totalVisits: 0, totalPlays: 0, lastVisit: Date.now() };

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          stats: {
            totalVisits: data.totalVisits || 0,
            totalPlays: data.totalPlays || 0,
            lastVisit: data.lastVisit?.toMillis?.() || data.lastVisit || Date.now(),
          },
        }),
      };
    }

    // Fallback to JSONBin.io
    if (STATS_BIN_ID !== 'default-stats' && JSONBIN_MASTER_KEY) {
      // Get current stats
      const getResponse = await fetch(`https://api.jsonbin.io/v3/b/${STATS_BIN_ID}/latest`, {
        headers: {
          'X-Master-Key': JSONBIN_MASTER_KEY,
        },
      });

      let currentStats = {
        totalVisits: 0,
        totalPlays: 0,
        lastVisit: Date.now(),
      };

      if (getResponse.ok) {
        const data = await getResponse.json();
        currentStats = data.record || currentStats;
      }

      // Update stats
      if (action === 'incrementVisit') {
        currentStats.totalVisits = (currentStats.totalVisits || 0) + 1;
        currentStats.lastVisit = Date.now();
      } else if (action === 'incrementPlay') {
        currentStats.totalPlays = (currentStats.totalPlays || 0) + 1;
      }

      // Save updated stats
      const updateResponse = await fetch(`https://api.jsonbin.io/v3/b/${STATS_BIN_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': JSONBIN_MASTER_KEY,
        },
        body: JSON.stringify(currentStats),
      });

      if (updateResponse.ok) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, stats: currentStats }),
        };
      }
    }

    // No database configured, but still return success
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Stats update logged (database not configured)' }),
    };
  } catch (error) {
    console.error('Error updating stats:', error);
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
      body: JSON.stringify({ 
        success: false, 
        error: error.message, 
        message: 'Update failed - check logs',
        fallback: 'Using localStorage'
      }),
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
        success: false, 
        error: 'Function error',
        message: error.message 
      }),
    };
  }
};

