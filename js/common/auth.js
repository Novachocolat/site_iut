(function(){
  /**
   * Firebase Auth bootstrapper
   * - Wires Google and Microsoft providers
   * - Exposes current user and roles on window (currentUser, currentUserRoles)
   * - Dispatches 'authchange' CustomEvent on window with { user, roles }
   * - Supports login.html buttons (google-login, ms-login, logout-btn)
   */
  function initAuth(){
    if (!window.firebase || !firebase.auth) return;
    const auth = firebase.auth();
    const providers = {
      google: new firebase.auth.GoogleAuthProvider(),
      microsoft: new firebase.auth.OAuthProvider('microsoft.com')
    };
    const btn = document.getElementById('auth-btn');

    /** Update globals and UI when user is logged in */
    function setLoggedIn(user, claims){
      if (btn) { btn.textContent = 'Se déconnecter'; }
      window.currentUser = user;
      window.currentUserRoles = {
        admin: !!(claims && claims.admin),
        editor: !!(claims && claims.editor)
      };
      try { window.Analytics && window.Analytics.track('auth_login', { provider: user.providerData && user.providerData[0] ? user.providerData[0].providerId : 'unknown' }); } catch {}
    }
    /** Update globals and UI when user is logged out */
    function setLoggedOut(){
      if (btn) { btn.textContent = 'Se connecter'; }
      window.currentUser = null;
      window.currentUserRoles = { admin: false, editor: false };
      try { window.Analytics && window.Analytics.track('auth_logout'); } catch {}
    }

    auth.onAuthStateChanged(async (user)=>{
      if (user) {
        try{
          const tokenRes = await user.getIdTokenResult(true);
          setLoggedIn(user, tokenRes && tokenRes.claims);
          try { window.dispatchEvent(new CustomEvent('authchange', { detail: { user, roles: window.currentUserRoles } })); } catch {}
        }catch(e){ setLoggedIn(user, {}); }
      } else {
        setLoggedOut();
        try { window.dispatchEvent(new CustomEvent('authchange', { detail: { user: null, roles: { admin:false, editor:false } } })); } catch {}
      }
    });

    if (btn){
      btn.addEventListener('click', async ()=>{
        const user = auth.currentUser;
        if (user) {
          try { await auth.signOut(); } catch {}
          return;
        }
        // Try Google first, fallback to Microsoft if blocked
        try {
          await auth.signInWithPopup(providers.google);
        } catch (e) {
          try { await auth.signInWithPopup(providers.microsoft); } catch {}
        }
      });
    }

    // Login page buttons support
    const gbtn = document.getElementById('google-login');
    const mbtn = document.getElementById('ms-login');
    const lbtn = document.getElementById('logout-btn');
    if (gbtn) gbtn.addEventListener('click', async ()=>{
      try { await auth.signInWithPopup(providers.google); } catch {}
    });
    if (mbtn) mbtn.addEventListener('click', async ()=>{
      try { await auth.signInWithPopup(providers.microsoft); } catch {}
    });
    if (lbtn) lbtn.addEventListener('click', async ()=>{
      try { await auth.signOut(); } catch {}
    });
  }

  document.addEventListener('DOMContentLoaded', initAuth);
})();
