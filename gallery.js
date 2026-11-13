/* Classroom gallery: Firebase Auth and Firestore. No server keys are stored here. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js';
import {
  getAuth, onAuthStateChanged, signInAnonymously,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, sendPasswordResetEmail, signOut,
} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js';
import {
  getFirestore, collection, doc, setDoc, addDoc, deleteDoc, updateDoc,
  onSnapshot, query, where, limit, getDocsFromServer, writeBatch, serverTimestamp
} from 'https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js';

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const teacherEmails = new Set(['edeni@standwithus.com','egarfunkel@standwithus.com','yehuda@standwithus.com']);
const config = window.SECRET_FIREBASE_CONFIG || {};
const configured = ['apiKey','authDomain','projectId','appId'].every(k => typeof config[k] === 'string' && config[k].trim() && !config[k].includes('REPLACE'));
const status = (message, cls = '') => {
  const el = $('#submission-status');
  el.textContent = message;
  el.className = 'submission-status' + (cls ? ' ' + cls : '');
};
const connection = (message, active = false) => {
  const el = $('#gallery-connection');
  el.textContent = message;
  el.className = 'connection-indicator ' + (active ? 'online' : 'offline');
};
const show = (id, yes) => { const el = $(id); if (el) el.classList.toggle('hidden', !yes); };
const notify = message => { if (typeof window.toast === 'function') window.toast(message); };
let auth, db, currentRoom = '', unsubscribeRooms = null, unsubscribeSubmissions = null, rooms = [], roomSubmissions = [], authLoaded = false;
let deletingRoom = false, pendingDeleteRoom = null;
let loadAuth;
const authReady = new Promise(resolve => { loadAuth = resolve; });

if (!configured) {
  connection('Online gallery not connected');
  show('#gallery-not-configured', true);
  show('#teacher-login', false);
  status('Online submission will become available after the educator connects the gallery. You can still download your presentation.');
  authLoaded = true; loadAuth();
} else {
  try {
    const app = initializeApp(config);
    auth = getAuth(app);
    db = getFirestore(app);
    auth.languageCode = 'en';
    connection('Online gallery connected', true);
    onAuthStateChanged(auth, user => {
      if (!authLoaded) { authLoaded = true; loadAuth(); }
      renderAuth(user);
    }, err => {
      if (!authLoaded) { authLoaded = true; loadAuth(); }
      connection('Authentication error');
      $('#auth-message').textContent = readable(err);
    });
  } catch (err) {
    connection('Gallery setup error');
    show('#gallery-not-configured', true);
    $('#gallery-not-configured p').textContent = 'The Firebase configuration could not be opened. Check firebase-config.js and try again.';
    authLoaded = true; loadAuth();
  }
}

function readable(err) {
  const code = String(err?.code || '');
  if (code.includes('permission-denied')) return 'Access denied. Check the classroom code, your email verification and the Firestore security rules.';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) return 'The email or password does not match. Try again or reset your password.';
  if (code.includes('email-already-in-use')) return 'This email already has an account. Please sign in.';
  if (code.includes('weak-password')) return 'Choose a stronger password of at least eight characters.';
  if (code.includes('network')) return 'The connection failed. Check your internet access and try again.';
  if (code.includes('unauthorised-domain') || code.includes('unauthorized-domain')) return 'This website domain has not been authorised in Firebase Authentication.';
  if (code.includes('operation-not-allowed')) return 'Enable Anonymous and Email/Password sign in in Firebase Authentication.';
  return 'The gallery could not complete that action. Please try again. ' + (code || '');
}
function educator(user) {
  return Boolean(user && user.emailVerified && teacherEmails.has((user.email || '').toLowerCase()));
}
function stopListeners() {
  unsubscribeRooms?.(); unsubscribeRooms = null;
  unsubscribeSubmissions?.(); unsubscribeSubmissions = null;
  currentRoom = ''; rooms = []; roomSubmissions = [];
}
function renderAuth(user) {
  const eligibleAddress = Boolean(user?.email && teacherEmails.has(user.email.toLowerCase()));
  const confirmed = educator(user);
  show('#gallery-not-configured', false);
  show('#teacher-login', !confirmed && !(eligibleAddress && !user.emailVerified));
  show('#verify-email', eligibleAddress && !confirmed);
  show('#gallery-account', confirmed);
  if (eligibleAddress && !confirmed) $('#verify-description').textContent = `We sent a verification link to ${user.email}. Open it and return here to continue.`;
  if (confirmed) {
    $('#signed-in-as').textContent = `Signed in as ${user.email}`;
    if (!unsubscribeRooms) watchRooms(user.email.toLowerCase());
  } else stopListeners();
}
function emailAllowed() {
  const email = $('#educator-email').value.trim().toLowerCase();
  if (!teacherEmails.has(email)) throw Error('Only Eden, Eliana or Yehuda can register for the educator gallery.');
  return email;
}
function authMessage(message) { $('#auth-message').textContent = message; }
async function signIn(event) {
  event.preventDefault();
  try { const email = emailAllowed(); const pw = $('#educator-password').value; authMessage('Signing in…'); await signInWithEmailAndPassword(auth, email, pw); authMessage(''); }
  catch (err) { authMessage(err.message?.startsWith('Only ') ? err.message : readable(err)); }
}
async function createEducator() {
  try {
    const email = emailAllowed(); const pw = $('#educator-password').value;
    if (pw.length < 8) throw Error('Choose a password of at least eight characters.');
    authMessage('Creating your educator account…');
    const cred = await createUserWithEmailAndPassword(auth, email, pw);
    await sendEmailVerification(cred.user);
    authMessage('Verification email sent. Check your inbox, then select I have verified my email.');
  } catch (err) { authMessage(err.message?.startsWith('Choose') || err.message?.startsWith('Only ') ? err.message : readable(err)); }
}
async function forgotPassword() {
  try { const email = emailAllowed(); await sendPasswordResetEmail(auth, email); authMessage('Password reset email sent. Please check your inbox.'); }
  catch (err) { authMessage(err.message?.startsWith('Only ') ? err.message : readable(err)); }
}
async function refreshVerified() {
  try {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    await auth.currentUser.getIdToken(true);
    if (educator(auth.currentUser)) { renderAuth(auth.currentUser); $('#verify-message').textContent = ''; }
    else $('#verify-message').textContent = 'Email not yet verified. Open the message in your inbox and select the verification link.';
  } catch (err) { $('#verify-message').textContent = readable(err); }
}
async function resendVerification() {
  try { await sendEmailVerification(auth.currentUser); $('#verify-message').textContent = 'A new verification email has been sent.'; }
  catch (err) { $('#verify-message').textContent = readable(err); }
}
function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(7); crypto.getRandomValues(bytes);
  return [...bytes].map(n => chars[n % chars.length]).join('');
}
async function createRoom(event) {
  event.preventDefault();
  const user = auth?.currentUser;
  if (!educator(user)) return;
  const name = $('#classroom-name').value.trim().slice(0,65);
  if (!name) return;
  $('#create-room').disabled = true;
  try {
    const code = generateCode();
    await setDoc(doc(db,'classrooms',code), { name, ownerEmail: user.email.toLowerCase(), closed: false, createdAt: serverTimestamp() });
    $('#classroom-name').value = '';
    currentRoom = code;
    notify('Classroom created. Share the code with your groups.');
    setTimeout(() => selectRoom(code), 250);
  } catch (err) { notify(readable(err)); }
  finally { $('#create-room').disabled = false; }
}
function watchRooms(email) {
  unsubscribeRooms?.();
  const q = query(collection(db,'classrooms'), where('ownerEmail','==',email));
  unsubscribeRooms = onSnapshot(q, snap => {
    rooms = snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
    // When a classroom is deleted, choose another rather than retaining a stale selection.
    if (currentRoom && !rooms.some(r=>r.id===currentRoom)) {
      unsubscribeSubmissions?.(); unsubscribeSubmissions = null;
      currentRoom = ''; roomSubmissions = [];
      show('#selected-classroom', false);
    }
    renderRooms();
    if (currentRoom && rooms.some(r=>r.id===currentRoom)) selectRoom(currentRoom);
  }, err => { $('#rooms-list').textContent = readable(err); });
}
function renderRooms() {
  const el = $('#rooms-list');
  if (!rooms.length) { el.innerHTML = '<p>No classrooms yet. Create one above to get started.</p>'; show('#selected-classroom', false); return; }
  el.innerHTML = rooms.map(room => `<button type="button" data-room="${esc(room.id)}" class="room-tile ${room.id === currentRoom?'selected':''}"><strong>${esc(room.name)}</strong><small class="room-tile-code">${esc(room.id)}</small><small>${room.closed ? 'Submissions closed' : 'Accepting submissions'}</small></button>`).join('');
  el.querySelectorAll('[data-room]').forEach(button => button.onclick=()=>selectRoom(button.dataset.room));
  if (!currentRoom) selectRoom(rooms[0].id);
}
function selectRoom(code) {
  const room = rooms.find(r=>r.id === code);
  if (!room) return;
  const changed = currentRoom !== code;
  currentRoom = code;
  show('#selected-classroom', true);
  $('#selected-room-code').textContent = room.id;
  $('#selected-room-title').textContent = room.name;
  $('#selected-room-meta').textContent = room.closed ? 'Closed to new submissions' : 'Accepting new submissions';
  $('#close-classroom').textContent = room.closed ? 'Reopen submissions' : 'Close submissions';
  $('#rooms-list').querySelectorAll('[data-room]').forEach(b=>b.classList.toggle('selected',b.dataset.room===code));
  if (changed || !unsubscribeSubmissions) {
    unsubscribeSubmissions?.();
    $('#gallery-list').textContent = 'Loading submissions…';
    unsubscribeSubmissions = onSnapshot(collection(db,'classrooms',code,'submissions'), snap => {
      roomSubmissions = snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
      renderSubmissions();
    }, err => { $('#gallery-list').textContent = readable(err); });
  }
}
function renderSubmissions() {
  $('#submission-count').textContent = roomSubmissions.length;
  const el = $('#gallery-list');
  if (!roomSubmissions.length) { el.innerHTML = '<p class="muted">No presentations yet. Share your classroom code with pupils.</p>'; return; }
  el.innerHTML = roomSubmissions.map(p=> {
    const date = p.createdAt?.toDate?.();
    const when = date ? new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(date) : 'Just submitted';
    const titles = {land:'Changing the land',community:'Kibbutzim and community',early:'A country under pressure',water:'Water and solar power',breakthroughs:'Everyday breakthroughs',global:'Ideas that travel'};
    return `<article class="gallery-card"><div class="gallery-card-top">PRESENTATION RECEIVED</div><h4>${esc(p.team)}</h4><p>${esc(titles[p.theme]||'Research presentation')}</p><p>${esc(when)}</p><div class="gallery-card-actions"><button type="button" class="btn primary" data-present="${esc(p.id)}">Present ↗</button><button type="button" class="btn secondary" data-download="${esc(p.id)}">Download</button><button type="button" class="btn secondary" data-delete="${esc(p.id)}" aria-label="Remove submission by ${esc(p.team)}">Remove</button></div></article>`;
  }).join('');
  el.querySelectorAll('[data-present]').forEach(b=>b.onclick=()=>openSubmitted(b.dataset.present));
  el.querySelectorAll('[data-download]').forEach(b=>b.onclick=()=>downloadSubmitted(b.dataset.download));
  el.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>deleteSubmitted(b.dataset.delete));
}
function safeProject(id) {
  const data = roomSubmissions.find(p=>p.id===id);
  if (!data) throw Error('This submission was not found.');
  return window.sanitiseProject(data);
}
function openSubmitted(id) { try { window.previewPresentation(safeProject(id)); } catch (err) { notify(err.message); } }
function downloadSubmitted(id) {
  try {
    const p = safeProject(id);
    const name = p.team.toLowerCase().replace(/[^a-z0-9]+/g,'_').slice(0,35)||'team';
    window.triggerDownload(new Blob([window.presentationDocument(p)],{type:'text/html;charset=utf-8'}),name+'_presentation.html');
  } catch (err) { notify(err.message); }
}
async function deleteSubmitted(id) {
  const data = roomSubmissions.find(p=>p.id===id);
  if (!data || !confirm(`Remove the submission from ${data.team}? This cannot be undone.`)) return;
  try { await deleteDoc(doc(db,'classrooms',currentRoom,'submissions',id)); notify('Submission removed.'); }
  catch (err) { notify(readable(err)); }
}
async function toggleClosed() {
  const room = rooms.find(r=>r.id===currentRoom); if (!room) return;
  try { await updateDoc(doc(db,'classrooms',currentRoom),{closed:!room.closed}); notify(room.closed?'Classroom reopened.':'New submissions closed.'); }
  catch (err) { notify(readable(err)); }
}

// Classroom removal is deliberately restricted to the verified educator who owns it.
// Firestore does not cascade document deletion to its subcollections, so remove
// submissions first, in small batches, then remove the empty classroom document.
function openDeleteRoomDialog() {
  const user = auth?.currentUser;
  const room = rooms.find(r => r.id === currentRoom);
  if (deletingRoom || !educator(user) || !room || room.ownerEmail !== user.email.toLowerCase()) return;
  pendingDeleteRoom = room.id;
  $('#delete-room-name').textContent = room.name;
  $('#delete-room-code').textContent = room.id;
  $('#delete-room-code-input').value = '';
  $('#delete-room-feedback').textContent = '';
  $('#confirm-delete-room').disabled = true;
  $('#delete-room-dialog').showModal();
  $('#delete-room-code-input').focus();
}
function cancelDeleteRoom() {
  if (deletingRoom) return;
  pendingDeleteRoom = null;
  $('#delete-room-dialog').close();
}
function validateRoomDeleteCode() {
  const input = $('#delete-room-code-input');
  input.value = input.value.trim().toUpperCase().replace(/[^A-Z2-9]/g,'').slice(0,7);
  $('#confirm-delete-room').disabled = deletingRoom || !pendingDeleteRoom || input.value !== pendingDeleteRoom;
}
async function deleteClassroom(event) {
  event.preventDefault();
  if (deletingRoom || !pendingDeleteRoom || $('#delete-room-code-input').value !== pendingDeleteRoom) return;
  const roomId = pendingDeleteRoom;
  const user = auth?.currentUser;
  const room = rooms.find(r => r.id === roomId);
  if (!educator(user) || !room || room.ownerEmail !== user.email.toLowerCase()) {
    $('#delete-room-feedback').textContent = 'You can only delete classrooms that you created.';
    return;
  }
  deletingRoom = true;
  $('#cancel-delete-room').disabled = true;
  $('#confirm-delete-room').disabled = true;
  $('#delete-room-code-input').disabled = true;
  const msg = $('#delete-room-feedback');
  let removed = 0, closedForDeletion = false;
  try {
    // Close the room before deleting its submissions to prevent new uploads.
    await updateDoc(doc(db, 'classrooms', roomId), {closed: true});
    closedForDeletion = true;
    msg.textContent = 'Classroom closed. Removing presentations…';
    const submissions = collection(db, 'classrooms', roomId, 'submissions');
    while (true) {
      // Using the server avoids accidentally treating cached results as empty.
      const page = await getDocsFromServer(query(submissions, limit(8)));
      if (page.empty) break;
      const batch = writeBatch(db);
      page.docs.forEach(item => batch.delete(item.ref));
      await batch.commit();
      removed += page.size;
      msg.textContent = `Removing presentations… ${removed} removed.`;
    }
    // Never delete the parent before all known submission documents have gone.
    await deleteDoc(doc(db, 'classrooms', roomId));
    pendingDeleteRoom = null;
    $('#delete-room-dialog').close();
    if (currentRoom === roomId) {
      unsubscribeSubmissions?.(); unsubscribeSubmissions = null;
      currentRoom = ''; roomSubmissions = [];
      show('#selected-classroom', false);
      $('#submission-count').textContent = '0';
    }
    notify(`Classroom deleted. ${removed} presentation${removed===1?'':'s'} removed.`);
  } catch (err) {
    msg.textContent = closedForDeletion
      ? `Could not finish deleting this classroom. ${readable(err)} The classroom is closed to new submissions. Check your connection and try again.`
      : `Could not begin deleting this classroom. ${readable(err)} Please check your connection and try again.`;
  } finally {
    deletingRoom = false;
    $('#cancel-delete-room').disabled = false;
    $('#delete-room-code-input').disabled = false;
    validateRoomDeleteCode();
  }
}
async function compressForGallery(src) {
  if (!src?.startsWith('data:image/')) return src || '';
  const img = new Image();
  await new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(Error('Could not prepare one of your pictures.'));img.src=src;});
  let width = Math.min(980,img.naturalWidth), height = Math.min(700,img.naturalHeight);
  const ratio = Math.min(width/img.naturalWidth, height/img.naturalHeight, 1);
  width = Math.max(1,Math.round(img.naturalWidth*ratio)); height = Math.max(1,Math.round(img.naturalHeight*ratio));
  for (let iteration=0;iteration<5;iteration++) {
    const canvas = document.createElement('canvas');canvas.width=width;canvas.height=height;
    const ctx = canvas.getContext('2d');ctx.fillStyle='#ffffff';ctx.fillRect(0,0,width,height);ctx.drawImage(img,0,0,width,height);
    for (let quality=.76;quality>=.34;quality-=.1) {
      const out=canvas.toDataURL('image/jpeg',quality);
      if (out.length <= 115000) return out;
    }
    width=Math.max(200,Math.round(width*.78));height=Math.max(140,Math.round(height*.78));
  }
  throw Error('One image is too detailed for online submission. Remove it or try a smaller version. You can still download your presentation.');
}
async function prepareSubmission(user) {
  const p = window.getSecretProject?.();
  if (!p || p.answers.some(a=>!a.text.trim())) throw Error('Please answer all five questions before submitting.');
  if (!p.team.trim()) throw Error('Please enter a team name.');
  const answers = await Promise.all(p.answers.map(async a=>({
    text: String(a.text).slice(0,850), caption: String(a.caption||'').slice(0,180), image: await compressForGallery(a.image)
  })));
  const data = {team:p.team.slice(0,65),theme:p.theme,answers,authorUid:user.uid,createdAt:serverTimestamp()};
  if (new TextEncoder().encode(JSON.stringify({...data,createdAt:null})).length > 750000) throw Error('This presentation is too large to submit. Try smaller images. Downloading still works.');
  return data;
}
async function submitPresentation(event) {
  event.preventDefault();
  const submitButton = $('#submit-button');
  if (!configured || !db) { status('Online submissions are not connected yet. Please download a copy instead.','error'); return; }
  const roomId = $('#class-code').value.trim().toUpperCase().replace(/[^A-Z2-9]/g,'');
  $('#class-code').value = roomId;
  if (!/^[A-Z2-9]{7}$/.test(roomId)) { status('Enter the seven character code provided by your Educator.','error'); return; }
  submitButton.disabled = true;
  submitButton.textContent = 'Submitting your presentation…';
  status('Preparing answers and pictures for the classroom gallery…');
  try {
    await authReady;
    if (!auth.currentUser) await signInAnonymously(auth);
    const payload = await prepareSubmission(auth.currentUser);
    const key = `secret_gallery_submit_${roomId}_${window.getSecretProject?.()?.theme}`;
    const raw = new TextEncoder().encode(JSON.stringify({team:payload.team,theme:payload.theme,answers:payload.answers}));
    const hash = await crypto.subtle.digest('SHA-256',raw);
    const fingerprint = Array.from(new Uint8Array(hash)).map(n=>n.toString(16).padStart(2,'0')).join('');
    let prev = null; try { prev = JSON.parse(localStorage.getItem(key) || 'null'); } catch {}
    if (prev?.fingerprint===fingerprint) { status('This version has already been submitted successfully. Your Educator can find it in the gallery.','success'); return; }
    const ref = await addDoc(collection(db,'classrooms',roomId,'submissions'),payload);
    try { localStorage.setItem('secret_gallery_room',roomId);localStorage.setItem(key,JSON.stringify({id:ref.id,fingerprint})); }catch{}
    status('Success! Your presentation is now in your Educator’s classroom gallery. You can still download a copy.','success');
    submitButton.textContent = 'Submitted ✓';
    notify('Presentation submitted successfully.');
  } catch(err) {
    status(readable(err).startsWith('Access denied') ? 'Submission not accepted. Check the classroom code with your Educator and make sure submissions are open.' : (err.message?.startsWith('Please') || err.message?.startsWith('This presentation') || err.message?.startsWith('One image') ? err.message : readable(err)),'error');
  } finally { submitButton.disabled=false; if(submitButton.textContent!=='Submitted ✓')submitButton.textContent='Submit presentation →'; }
}

// Attach event handlers even if the educator has not connected a Firebase project yet.
$('#submit-form').addEventListener('submit',submitPresentation);
$('#class-code').value = localStorage.getItem('secret_gallery_room') || '';
$('#class-code').addEventListener('input',()=>{$('#submit-button').textContent='Submit presentation →';status('Ready to submit when you have finished all five answers.');});
$('#login-form').addEventListener('submit',signIn);
$('#create-educator').addEventListener('click',createEducator);
$('#forgot-password').addEventListener('click',forgotPassword);
$('#verification-refresh').addEventListener('click',refreshVerified);
$('#verification-resend').addEventListener('click',resendVerification);
$('#verification-signout').addEventListener('click',()=>signOut(auth));
$('#educator-signout').addEventListener('click',()=>signOut(auth));
$('#new-classroom-form').addEventListener('submit',createRoom);
$('#copy-class-code').addEventListener('click',()=>{if(currentRoom){navigator.clipboard?.writeText(currentRoom).then(()=>notify('Classroom code copied.')).catch(()=>notify('Classroom code: '+currentRoom));}});
$('#close-classroom').addEventListener('click',toggleClosed);
$('#refresh-gallery').addEventListener('click',()=>{if(auth?.currentUser && educator(auth.currentUser)) {stopListeners();watchRooms(auth.currentUser.email.toLowerCase());}});

$('#delete-classroom').addEventListener('click', openDeleteRoomDialog);
$('#cancel-delete-room').addEventListener('click', cancelDeleteRoom);
$('#delete-room-code-input').addEventListener('input', validateRoomDeleteCode);
$('#delete-room-form').addEventListener('submit', deleteClassroom);
$('#delete-room-dialog').addEventListener('cancel', event => {
  if (deletingRoom) event.preventDefault();
  else pendingDeleteRoom = null;
});
