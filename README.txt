HATE SPEECH DETECTION WEBSITE (GITHUB PAGES)

FILES
- index.html: website structure
- style.css: website design and responsive layout
- app.js: browser-side text processing and model prediction
- model.json: exported trained Decision Tree and CountVectorizer vocabulary

PUBLISH USING GITHUB PAGES
1. Create a public GitHub repository, e.g. Hate-Speech-Detection.
2. Upload index.html, style.css, app.js, model.json and this README into the ROOT of the repository. Do not put them inside another folder.
3. Open the repository and click Settings.
4. In the left sidebar, open Pages (under Code and automation).
5. Under Build and deployment, set Source to Deploy from a branch.
6. Under Branch, select main and /(root), then click Save.
7. Wait a few minutes. Refresh the Pages settings page. GitHub will show the published website URL.

IMPORTANT
- Do not upload twitter_data.csv. The website uses the exported trained model in model.json.
- The model was trained with a DecisionTreeClassifier and CountVectorizer using the provided dataset.
- Predictions run in the visitor's browser. No text is sent to a server by this project.
- This is an educational prototype. Predictions can be wrong and should not be used as the sole basis for moderation or punishment.

If the website does not load the model, check that model.json is in the repository root beside index.html, app.js and style.css.
