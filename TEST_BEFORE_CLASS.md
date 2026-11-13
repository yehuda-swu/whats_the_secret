# Classroom gallery: prelesson test

Do this once after configuring Firebase and updating GitHub Pages.

1. In the published website select **For teachers**, sign in with an approved educator account and verify the email.
2. Create a practice classroom. Write down the seven character code.
3. In a different browser or private window, open the same website as a pupil.
4. Select a topic, enter a group name and fill in all five questions.
5. Upload a picture and a caption to at least one question.
6. Enter the practice classroom code and select **Submit presentation**.
7. Check for a success message. Do not treat a button click alone as success.
8. Return to the educator gallery. The test group should appear without needing to refresh.
9. Select **Present** and check all five slides and the uploaded picture.
10. Select **Download** in the educator gallery to save a copy.
11. Select **Close submissions**. Confirm the pupil can no longer send a fresh presentation to that classroom.
12. Remove the test submission when you are finished.

If a test fails, read the troubleshooting section of `README.md`. Do not use the gallery with pupils until the entire sequence passes. Pupils can still use **Download a copy** as a backup.

## Classroom deletion test

1. Create a second practice classroom and submit a sample presentation with a picture.
2. Download it if you would like to keep a copy.
3. Select **Delete classroom** and verify that the confirmation stays disabled until you enter the matching classroom code.
4. Confirm deletion and keep the page open until the success message appears.
5. Check that the room disappears from the educator gallery.
6. Open Firebase Firestore and confirm the classroom document and its `submissions` documents have been removed.
7. Try sending to the old classroom code and confirm the submission is rejected.
8. If Firebase says permission denied, publish the latest `firestore.rules` from this ZIP and repeat.
