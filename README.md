# What's the Secret?

An interactive online research workshop for the StandWithUs UK Explore programme.

## What pupils do

Pupils work in groups of four and investigate one of six missions. Each team researches Israel's development and innovation, reads the supplied research materials, finds other sources and builds a digital thought board. The board has five sections: The Challenge, The Breakthrough, The People, The Impact and The Secret.

Each team then writes a short conclusion and presents its discoveries to the class.

## What's included

- Six research missions inspired by the original workshop and the six supplied research documents
- Built in research library using the supplied written materials
- Links to the Israel Innovation Authority, Netafim, the National Library of Israel and Jewish National Fund for further research
- Thought boards with editable notes, source fields and draggable cards
- Automatic saving in the browser on the team's device
- Compressed share links carrying a snapshot of a completed board
- Downloadable JSON backups and print or PDF presentations
- A teacher studio with a 30 minute timer, suggested lesson structure, reflection prompts and a class gallery
- Mobile, tablet and desktop layouts
- Images and branding extracted from the supplied presentation and research materials

No external libraries, server or API keys are required.

## Publish on GitHub Pages

1. Create a new, empty public repository in your GitHub account. The suggested name is `whats_the_secret`. Leave the automatic README option unticked.
2. Download and extract the ZIP. Do not upload the ZIP as a single file.
3. Upload `index.html`, `style.css`, `script.js`, `research.js`, `favicon.svg`, `README.md`, `TEACHER_GUIDE.md`, `example_board.json`, and the complete `assets` folder to the root of the repository.
4. Commit the files.
5. Open the repository's **Settings**, then **Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**, choose **main** and **/(root)**, then save.
7. Open the GitHub Pages URL shown in the Pages settings when publication is complete.

To publish with Git instead, open a terminal in the extracted folder and use the following commands. Replace the repository URL if you choose a different name.

```bash
git init
git branch -M main
git remote add origin https://github.com/yehuda-swu/whats_the_secret.git
git add .
git commit -m "Build What's the Secret online Explore workshop"
git push -u origin main
```

For future updates:

```bash
git add .
git commit -m "Improve What's the Secret classroom activity"
git push origin main
```

## How sharing works

GitHub Pages serves static files and does not run an online database. Each team therefore edits a board on **one device**. Its browser saves the board automatically using local storage.

When finished, the team selects **Share board**. The app creates a link containing a compressed snapshot of the board. Send this link to the educator through your school's normal communications platform. The educator pastes the link into the **Teacher studio** to add the group to the gallery.

A shared link is a snapshot and will not update as pupils make later changes. To share a new version, create a new link. The teacher can also collect and import the JSON backups. For boards containing many long notes, download a JSON backup in case the link exceeds the limit of a school messaging service.

There are no user accounts, cloud storage or simultaneous edits across devices. Avoid entering sensitive pupil details in team names or boards. If a class needs true live collaboration between individual pupils' devices, add a separately configured online database and access controls before using that mode.

## Test the example board

Open **Teacher studio** and choose **Import saved board**. Select `example_board.json` to see a short demonstration board, which can then be presented to the class.

## Resource and copyright note

The research texts were copied from the six user supplied Word documents for use as classroom starting points. They have not been independently verified in full. Encourage pupils to verify important assertions, dates, figures, attributions and claims using reliable sources. The Hula drainage case, for example, can be used to consider environmental consequences alongside agricultural development.

Photographs and branded images were extracted from the presentation and the supplied research documents. Because some source images may have third party rights, confirm permissions and credits before making a public GitHub repository. The app can also be used in a restricted learning context if appropriate to the rights held.

## Technical notes

- Compatible with current Chrome, Edge, Firefox and Safari versions that support ordinary browser storage.
- Link compression uses the browser's `CompressionStream` where available and falls back to an uncompressed URL payload.
- The share link contains the board text itself. Treat the link as content that can be forwarded.
- The app works without an external service. Research source links require internet access.
- If browser storage is cleared, unsaved local content may be lost. Download backups for important work.
