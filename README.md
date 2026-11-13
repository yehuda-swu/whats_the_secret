# What's the Secret? | Explore Classroom Gallery

Version 4.4 keeps the simple five question pupil activity and adds educator classroom deletion to the existing gallery. Groups can submit answers and uploaded images directly from their device. Eden, Eliana and Yehuda can see incoming work in a private gallery, present the slides, download copies, close submissions after the session and permanently delete an old classroom together with its presentations.

**Firebase web settings have been inserted for the Explore Classroom Gallery project.** Authentication and Firestore rules still need to be enabled and published in Firebase (you have already completed those steps). Upload the updated files to GitHub Pages and publish the revised Firestore rules. The new deletion flow must be tested using a practice classroom.

## Updating from the previous gallery version

1. Upload the full contents of this ZIP to your existing GitHub Pages repository, replacing matching files. The Firebase configuration is already included.
2. Open **Firebase Console → Firestore Database → Rules** and publish the *updated* `firestore.rules` file. Uploading that rules file to GitHub does **not** publish database rules.
3. Existing educator accounts do not need to register again. Sign in as usual.
4. Each educator sees only the classrooms they personally created. Adding Yehuda does not grant access to Eden's or Eliana's existing classrooms.

**This version includes your configured `firebase-config.js`.** Do not replace it with the earlier blank version.

## How the activity works

1. An Educator signs in, creates a classroom and puts the seven character code on the screen.
2. Each team selects a research theme and answers the five questions, optionally uploading one image per question.
3. The team enters the classroom code and selects **Submit presentation**. No pupil sign in or email address is needed.
4. The Educator opens **For teachers**, selects their classroom and sees submissions appear automatically.
5. Select **Present** to display the slides, **Download** to save a presentation, or **Remove** to delete an incorrect submission.
6. In **Your classrooms**, select a classroom and choose **Delete classroom** to permanently erase its presentations and then the classroom itself. Enter its seven character code to confirm. A classroom can only be deleted by its creator.
7. Pupils retain **Preview**, **Download a copy**, **Save editable project** and optional manual email buttons.

## One time setup: Firebase (required for live submissions)

This version uses Google's Firebase Authentication and Cloud Firestore. You do not need to set up a standalone server or pay for file storage. Images are resized for submission and included within Firestore documents. Each presentation has a maximum size, so extremely detailed images might need to be reduced. [Firebase instructions](https://firebase.google.com/docs/web/setup) | [Firestore free tier and usage limits](https://firebase.google.com/docs/firestore/quotas).

### Step 1: Create the project

1. Visit https://console.firebase.google.com/ and create a Firebase project called, for example, `Explore Classroom Gallery`.
2. Add a **Web app** in Project settings. Copy the *Firebase configuration* object shown in its setup page. You need the `apiKey`, `authDomain`, `projectId` and `appId` values. Do not copy credentials from a service account, private key or Firebase Admin SDK.
3. For this version, `firebase-config.js` already contains your web app configuration. No editing is necessary. Keep private admin credentials out of GitHub.

Example layout (the letters below are deliberately invalid placeholders):

```js
window.SECRET_FIREBASE_CONFIG = {
  apiKey: 'PASTE_API_KEY',
  authDomain: 'PASTE_PROJECT.firebaseapp.com',
  projectId: 'PASTE_PROJECT_ID',
  appId: 'PASTE_APP_ID'
};
```

### Step 2: Enable Authentication

1. In Firebase go to **Build → Authentication → Sign in method**.
2. Enable **Email/Password** and **Anonymous**. Do not enable open public educator access or allow arbitrary email addresses in the gallery.
3. In Authentication settings, add `yehuda-swu.github.io` to **Authorised domains** (or whichever domain is hosting the site). This is a domain, not the full URL. Add `localhost` only while testing locally if necessary.
4. Eden, Eliana and Yehuda each choose **For teachers → First time? Create account**, using their own email and password. The app sends them a verification email. They must verify their address before viewing pupil work.

The educator gallery recognises only these verified accounts:

* `edeni@standwithus.com`
* `egarfunkel@standwithus.com`
* `yehuda@standwithus.com`

These email addresses are also enforced by database rules; the interface alone is not the access control.

### Step 3: Create Firestore and publish its security rules

1. Open **Build → Firestore Database → Create database**. Choose a region and **production mode**. You can use the default database. Do not leave the database in permissive test mode.
2. Open **Firestore Database → Rules**.
3. Replace the existing rules with the **entire contents** of the supplied `firestore.rules` file.
4. Select **Publish**. Check that the rules have been published successfully.

The rules enforce these controls: only verified educator accounts can read classroom work; educators can access only their own classrooms; anonymous pupils can create submissions only when they know an open classroom code; pupils cannot list, read or edit other teams' work; and educator accounts can remove individual submissions or delete their own classrooms once closed.

**Important:** This update changes the Firestore security rules. Publish the new `firestore.rules` in Firebase Console before using Delete classroom. GitHub does not automatically apply the rules. The activity closes a room, removes its submissions in small batches and then deletes the classroom. Do not close the browser while deletion is underway. If deletion is interrupted, open the classroom again and retry.

**Do not replace the supplied rules with `allow read, write: if true`.** That would expose pupils' work.

### Step 4: Publish to GitHub Pages

1. Extract this ZIP.
2. Upload `index.html`, `style.css`, `script.js`, `research.js`, `gallery.js`, `gallery-loader.js`, `firebase-config.js`, `firestore.rules`, the `assets/` folder and the documentation into your existing `whats_the_secret` GitHub repository. Preserve the folder structure. The `.rules` file is there for setup and is not automatically applied by GitHub.
3. If GitHub Pages is not already on, use **Settings → Pages → Deploy from a branch → main → /(root)**.
4. Open `https://yehuda-swu.github.io/whats_the_secret/` after the commit finishes publishing.
5. Open **For teachers**, create a classroom and test submitting a project from a separate browser or private window.

Suggested commit message:

```text
Add secure classroom deletion with presentation cleanup
```

If using Git locally:

```bash
git add .
git commit -m "Add secure classroom deletion with presentation cleanup"
git push origin main
```

If the branch is not `main`, use your existing branch name.

### Fixing "Access denied" when deleting a classroom

If the deletion dialogue says the classroom is closed but access was denied, the website may have already removed presentations but Firebase is still applying earlier rules. In particular, the previous Version 4.2 rules contained `allow delete: if false;`. Open **Firestore Database → Rules** and replace the rules there with the full supplied `firestore.rules` file, then select **Publish**. Return to the gallery, refresh and retry deleting the closed classroom. The new rule checks the existing classroom document's owner email and requires it to be closed.

If the error continues with the new rules published, confirm that you are signed in using the same verified educator account that created the classroom. In the Firestore Data tab, inspect the classroom's `ownerEmail` and `closed` fields. Do not switch to open access rules.

## Common issues

| What happens | What to check |
| --- | --- |
| Gallery not connected | `firebase-config.js` contains all four correct web app values. |
| Permission denied when submitting | Check the seven character code, whether submissions are closed, and whether the supplied Firestore rules were published. |
| Educator cannot sign in | Enable Email/Password in Firebase; use the correct email and password. |
| Email verification does not work | Check spam; select **Send another email**, then **I have verified my email**. |
| No classrooms listed | Sign in as the educator who created that classroom. Each educator sees only their own rooms. |
| Images missing from submitted work | Upload image files rather than linking to external sites. External image URLs depend on their original hosts. |
| Online submission is too large | Use smaller images or rely on the local downloadable presentation. |
| Pupils use a restricted device | Download the presentation and deliver it manually. Some school networks may block Firebase. |

## Safeguarding and data handling

* Ask pupils to choose a **group name**, not a full legal name. Avoid personal or sensitive information in answers, captions and pictures.
* Submitted answers and resized uploaded images are stored in your Firebase project's Cloud Firestore. They do not become public websites. A person with a classroom code can submit a presentation while the room is open, but cannot see others' work.
* Firebase user credentials and database management remain under the account that creates the Firebase project. Use an organisation controlled Firebase project and align its data location, retention, access and privacy notices with StandWithUs UK policy.
* Educators should remove submissions when no longer needed. Removing a submission from the gallery deletes its stored document. Closing a classroom stops new submissions but does not delete existing work. **Delete classroom** permanently erases the classroom and its submitted presentations, including images. Download anything you wish to keep before deleting. There is no automated retention period in this version.
* The supplied research extracts have not been independently verified. Encourage students to check claims and credit sources and pictures.

## Files

* `index.html`: activity and classroom gallery
* `style.css`: responsive layouts and large readable controls
* `script.js`: existing five question workflow, image upload and presentation export
* `research.js`: supplied classroom research materials
* `gallery.js` and `gallery-loader.js`: secure Firebase educator sign in, classroom codes and submissions
* `firebase-config.js`: already filled in with your Firebase project web settings
* `firestore.rules`: **copy into Firestore security rules and publish**
* `TEACHER_GUIDE.md`: lesson instructions
* `assets/`: supplied logos and classroom visuals

No Firebase administrator key or secret is included. The Firebase web configuration is in place. Test classroom deletion after the GitHub Pages site and Firebase rules have updated.
