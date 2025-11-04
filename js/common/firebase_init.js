/** Initialize Firebase once using runtime env values (window.__ENV__) */
(function(){
  if (typeof firebase === 'undefined') { return; }
  // Avoid double init
  if (firebase.apps && firebase.apps.length > 0) { return; }
  var E = (typeof window !== 'undefined' && window.__ENV__) ? window.__ENV__ : {};
  var cfg = {
    apiKey: E.FIREBASE_API_KEY,
    authDomain: E.FIREBASE_AUTH_DOMAIN,
    projectId: E.FIREBASE_PROJECT_ID,
    storageBucket: E.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: E.FIREBASE_MESSAGING_SENDER_ID,
    appId: E.FIREBASE_APP_ID
  };
  try { firebase.initializeApp(cfg); } catch (e) { /* noop: likely already initialized */ }
})();
