/* Loads the online classroom connection only after it has been configured. */
(function () {
  const cfg = window.SECRET_FIREBASE_CONFIG || {};
  const enabled = ['apiKey','authDomain','projectId','appId'].every(k=>typeof cfg[k]==='string' && cfg[k].trim() && !cfg[k].includes('PASTE') && !cfg[k].includes('REPLACE'));
  const status = document.getElementById('gallery-connection');
  const offlineBox = document.getElementById('gallery-not-configured');
  const sendStatus = document.getElementById('submission-status');
  window.SECRET_GALLERY_LOADED = false;
  function offline(msg) {
    status.textContent = msg;
    status.className = 'connection-indicator offline';
    offlineBox.classList.remove('hidden');
    sendStatus.textContent = msg + '. You can still download a presentation.';
    const login = document.getElementById('teacher-login');
    login.classList.add('hidden');
  }
  // Prevent refreshing the pupil's board if an online submission is not available.
  document.getElementById('submit-form').addEventListener('submit',function (event) {
    if (!window.SECRET_GALLERY_LOADED) {
      event.preventDefault();
      sendStatus.textContent = enabled ? 'Online submissions are not available on this connection. Download your presentation instead.' : 'The online gallery has not been connected yet. Download your presentation instead.';
      sendStatus.className = 'submission-status error';
    }
  });
  if (!enabled) { offline('Online gallery not connected'); return; }
  import('./gallery.js').then(() => {window.SECRET_GALLERY_LOADED = true;}).catch(err=>{
    offline('Online gallery unavailable');
    console.error('Gallery loading error:',err);
  });
})();
