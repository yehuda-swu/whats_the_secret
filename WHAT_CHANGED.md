# Version 4.3: Delete classrooms

* Adds a clear Delete classroom button in the selected educator classroom.
* Requires the educator to type the matching classroom code to confirm permanent removal.
* Closes submissions before deleting each presentation and its embedded pictures.
* Deletes the classroom only after the submissions have been removed.
* Restricts deletion to the verified educator who created the classroom.
* Recovers cleanly if a room is removed while another is selected.
* Updates Firestore rules to allow owner deletion only when submissions are closed.
* Keeps the existing five questions, image uploads, downloads and educator accounts unchanged.

**Setup action required:** Publish the new `firestore.rules` in Firebase Console after uploading this update to GitHub. It does not publish automatically.
