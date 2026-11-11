# What's the Secret? | Simplified Explore workshop

A self contained website for the StandWithUs UK Explore programme. Pupils work in groups of four to investigate how Israeli communities and innovators have responded to challenges.

## How the activity works

1. The team selects one of six research topics.
2. The team enters a name and researches its topic using the original workshop material and further sources.
3. Pupils answer **five questions**. Each question becomes one presentation slide: the challenge, the breakthrough, the people, the impact and the secret.
4. For each question, pupils can upload a picture they saved or made, or paste a public image URL. They can add a caption and source.
5. Pupils select **Download presentation**, send the downloaded HTML file to the teacher and the teacher opens it in a browser. Arrow keys switch slides. The presentation can be printed or saved to PDF.

No pupil logins, database or server are required. Pupils use **one device per group**. Answers are automatically saved in that browser. Downloaded presentations contain the complete question text, pupil answers, uploaded images and captions.

**Important:** If an image was added with a web link instead of an uploaded file, it depends on the external image provider and may need an internet connection when presented. For reliable offline sharing, download the picture to the device first and use **Upload picture**.

## Publish using GitHub Pages

1. Make a new repository named `whats_the_secret` (or update the existing one).
2. Extract the ZIP file on your computer.
3. Upload **all the files and the assets folder**, with `index.html` at the root of your repository. Do not upload the ZIP as one file.
4. Commit the changes using the message below.
5. In repository **Settings**, select **Pages**. Choose **Deploy from a branch**, select `main` and `/(root)`, and save.
6. Open the published URL from the Pages section.

Suggested GitHub commit message:

```
Simplify What's the Secret to five questions and image presentations
```

If working with Git locally in an existing repository:

```bash
git add .
git commit -m "Simplify What's the Secret to five questions and image presentations"
git push origin main
```

If your branch is not called `main`, replace `main` in the final command with the branch you use.

## Sharing and saving pupil work

**Download presentation** creates a single `.html` file for each team. The teacher can open it in Chrome, Edge, Safari or Firefox and display the slides. It has its own navigation and Print or PDF button.

**Save editable project** creates a `.json` file containing the answers and uploaded images. This is a backup, not the file pupils normally send for presenting. A team can restore it with **Restore a project**. In the educator view, teachers can also preview an imported editable project.

Pictures are reduced in size when uploaded so the presentation and project are more manageable. A maximum of one image can be attached to each question. The original uploaded file on the pupil's computer is not changed.

Browser storage can be cleared, and some school browsers may limit storage. Encourage pupils to download the editable project before finishing if they expect to work on it later.

This is a static website, so team members do not edit the same project live from separate devices. It also does not automatically send work to the teacher. Use the school's usual learning platform or permitted method for collecting files.

## Educational material and credits

The six supplied research documents are included as classroom starting points and have not been comprehensively fact checked. Encourage students to verify important dates, claims and statistics, consider limitations, and credit the original source of any pictures used.

The images and branding included in the website were supplied with the original workshop. Before publishing a public site, confirm the necessary image rights and permissions.

## Files

- `index.html`: simplified application layout
- `script.js`: five questions, image uploads and standalone presentation export
- `style.css`: website styles, including mobile layout
- `research.js`: original supplied research text
- `assets/`: original supplied workshop visuals and logos
- `TEACHER_GUIDE.md`: short educator instructions
- `example_project.json`: sample editable project with text only

No external JavaScript libraries are needed. The page uses an optional Google Fonts stylesheet and will use system fonts if those fonts cannot load.
