# Educator guide | What's the Secret?

## Before the workshop

Your organisation's Firebase administrator must complete the **one time online gallery setup** in `README.md`. GitHub Pages alone cannot receive pupil submissions. Do not begin a live class until you have tested the complete submission process.

1. Open the activity and select **For teachers**.
2. Sign in with your verified educator email and password. On your first visit, create your account and verify the email message.
3. Enter a class name, such as `Y12 Thursday`, and select **Create classroom**.
4. Display the **seven character classroom code** on the projector or write it on the board. Different classes should use separate classrooms.
5. Leave the gallery open. New submissions appear automatically.

Eden: edeni@standwithus.com

Eliana: egarfunkel@standwithus.com

Yehuda: yehuda@standwithus.com

Only the educator who owns a classroom can view its submissions in the gallery. Another educator can create their own classroom and share that classroom's code.

## Suggested workshop structure

**5 minutes: Introduce the challenge**

What makes Israel such a centre for innovation? Groups of four choose one of six research themes.

**30 minutes: Research and prepare**

Teams use the research extracts and further credible sources. They answer exactly five questions:

1. The challenge: what needed solving?
2. The breakthrough: what idea helped?
3. The people: who made it happen?
4. The impact: what difference did it make?
5. The secret: what does this reveal about resilience or innovation?

Each question can include one picture with a caption or source. Encourage a simple answer of two or three sentences.

**5 minutes: Submit**

The group enters the classroom code at the bottom of the activity and chooses **Submit presentation**. A green confirmation message means the data has been received. Pupils do not need an email account. Submitted presentations include resized uploaded images. If submissions cannot be sent, use **Download a copy** instead.

**10 to 20 minutes: Present and discuss**

Open the gallery, choose each group and select **Present**. Use the arrow keys to move between slides. You can download the file from the educator gallery as a backup. Discuss the strengths and limitations of each innovation and the sources used.

## During and after the lesson

* Use the built in classroom timer if useful.
* The code is shown in the **For teachers** gallery. Share only the code with pupils, not your sign in details.
* Select **Close submissions** once the session ends. You can reopen it if a group needs to submit again.
* Select **Remove** on any individual submission you no longer need. There is no automatic deletion of pupil work.
* Encourage team names rather than pupils' full names. Do not upload personal photographs unless school and organisational policies permit it.

## What if an online submission fails?

Ask the team to check its code and internet connection. If the gallery has not been configured, or the school network blocks Firebase, the team can still **Download a copy** containing the five slides and uploaded pictures. It will open in any modern browser and can be attached to an email manually.

**Important:** The Email Eden, Email Eliana and Email Yehuda buttons prepare an email but cannot attach the presentation automatically. Direct gallery submission is the recommended method.

## Removing an old classroom

1. Sign in to the **For teachers** gallery as the educator who created the classroom.
2. Under **Your classrooms**, select the classroom to remove.
3. Download any presentations you want to keep. **Deletion is permanent.**
4. Click **Delete classroom** beside **Close submissions**.
5. Enter the classroom's seven character code and confirm.
6. Keep the page open while the system closes submissions, deletes presentation files and pictures from Firestore and removes the classroom.
7. If the process is interrupted, the classroom is left closed. Return to it and select **Delete classroom** again.

Only the classroom's original educator can delete it. Each educator still sees only their own classrooms. The updated Firestore security rules in this ZIP **must be published** separately in Firebase Console.

## Deletion troubleshooting

If Firebase denies deletion after closing the classroom, the educator should ask the project administrator to publish the latest `firestore.rules`. The classroom can then be selected and deleted again. Previously submitted work may have already been removed.
