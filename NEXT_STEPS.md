# Version 4.3: Publish classroom deletion

The Firebase web configuration is already included. The existing Explore pupil activity and all three educator accounts remain unchanged.

## Publish the update

1. Extract the ZIP and upload its contents to the existing GitHub repository `whats_the_secret`, replacing matching files. Keep the `assets` folder as a folder.
2. In [Firebase Console](https://console.firebase.google.com/), open **Explore Classroom Gallery → Firestore Database → Rules**.
3. Copy the complete contents of the **new** `firestore.rules` file included in this ZIP, replace the existing rules and select **Publish**. The GitHub upload cannot publish Firebase rules for you.
4. Open the published activity, select **For teachers** and sign in to the verified account that created the practice classroom.
5. Select that classroom and click **Delete classroom**. Enter its seven character code to confirm.
6. Keep the page open until deletion finishes. The classroom and all submitted presentations should disappear.

**Important:** Only the educator who created a classroom can delete it. Deletion also removes all the classroom's pupil submissions and pictures. Download any work you want to retain first.

Suggested commit message: `Add classroom deletion and presentation cleanup`

If using Git locally:

```bash
git add .
git commit -m "Add classroom deletion and presentation cleanup"
git push origin main
```

See `TEST_BEFORE_CLASS.md` for a deletion test. This deletion feature was checked with mocked classroom records, but the live Firebase workflow must be tested after publishing.

## If deleting a classroom shows Access denied

Version 4.2 did not permit parent document deletion. In Firebase Console → Firestore Database → Rules, replace the entire contents with this package's `firestore.rules` and select Publish. Wait for the rules to take effect, refresh the website, and retry. If the classroom is closed, retrying is safe.
