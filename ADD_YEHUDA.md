# Add Yehuda as an educator

Email: `yehuda@standwithus.com`

## If the classroom gallery is already installed

1. Replace `gallery.js` in your GitHub repository with the updated version in this ZIP. Do **not** overwrite your existing completed `firebase-config.js` with this ZIP's blank template.
2. In Firebase Console, open **Firestore Database → Rules**. Replace the rules with the complete contents of this ZIP's `firestore.rules` and click **Publish**. Uploading the file to GitHub alone does not change access permissions.
3. Open the published activity and select **For teachers → First time? Create account**. Register `yehuda@standwithus.com`, choose a password, and follow the verification email. If an account already exists, sign in or reset the password.
4. Sign in as Yehuda and create a test classroom.

All three educators can create and manage **their own** classes, and they cannot read one another's classroom submissions. Pupils still submit using their class code.

**Recommended GitHub commit message:**

`Add Yehuda to authorised educator accounts`
