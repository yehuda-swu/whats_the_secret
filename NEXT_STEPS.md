# Final connection steps

The Firebase web configuration has been added to `firebase-config.js` for the existing **Explore Classroom Gallery** project.

## Upload the activity to GitHub

1. Extract the supplied ZIP file on your computer.
2. Open the existing `whats_the_secret` repository in GitHub.
3. Upload **the contents** of the extracted folder into the repository root. Include `index.html`, `firebase-config.js`, `gallery.js`, `gallery-loader.js`, `script.js`, `style.css`, `research.js` and `assets/`. Replace the existing files when prompted.
4. Use commit message: `Connect Firebase classroom gallery and add educator access`.
5. Open your published website and refresh it after GitHub Pages finishes deploying.

## Before the class: educator test

1. In Firebase Authentication, confirm **Email/Password** and **Anonymous** sign in are enabled. Check that `yehuda-swu.github.io` is an Authorised domain.
2. In Firestore Database → Rules, confirm the rules from this ZIP are published. The latest rules should mention all three educator addresses.
3. Open the website and click **For teachers**. Register or sign in with `edeni@standwithus.com`, `egarfunkel@standwithus.com`, or `yehuda@standwithus.com`. Use the account's own password and follow the email verification message.
4. Create a classroom. Copy its seven character code.
5. Open the website in a separate private browsing window. As a pupil, answer all five questions and upload a small test picture. Enter the code and select **Submit presentation**.
6. Check that the presentation appears in the correct educator gallery, and select **Present** to confirm the image loads.
7. Test **Download**. Finally, close the classroom and check that further submissions are no longer accepted.

## Important notes

* GitHub Pages hosts the site. Firebase stores the submitted presentations. Uploading `firestore.rules` to GitHub does not publish Firestore rules.
* The Firebase web configuration identifies your project and is safe to include in a public website. It is not a private administrator credential.
* A visible **Online gallery connected** label confirms the Firebase SDK initialised, not that a full classroom submission has been tested. Complete the test above.
* Pupils do not need accounts. Group names should not identify individual pupils.
* Only the educator who created a classroom can access its submissions.
* If you see a permission error, check the classroom code, whether the classroom is still open, the security rules and authorised domains.
