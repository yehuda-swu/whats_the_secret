# Version 4.4: Classroom deletion permission fix

* Updates the parent classroom delete rule to check its existing owner email directly and require a closed classroom.
* Provides a precise message when outdated Firebase rules block final deletion after presentations were removed.
* Preserves the seven character confirmation and closes submissions before deleting saved work.
* Keeps the existing educators, pupils, image handling and five question presentation flow.

**Essential:** Publish the included `firestore.rules` in the Firebase Console. GitHub uploads cannot publish database security rules.
