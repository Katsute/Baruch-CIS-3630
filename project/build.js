const fs = require("fs");
const path = require("path");
const sass = require("sass");

//

let folder = path.join(__dirname, "site", "dependencies", "css");

fs.existsSync(folder) || fs.mkdirSync(folder, {recursive: true});
fs.writeFileSync(path.join(folder, "style.css"), sass.compile(path.join(__dirname, "src", "dependencies", "css", "style.scss")).css);

//

folder = path.join(__dirname, "site", "dependencies", "js");
fs.existsSync(folder) || fs.mkdirSync(folder, {recursive: true});

fs.copyFileSync(
    path.join(__dirname, "node_modules", "bootstrap", "dist", "css", "bootstrap.min.css"),
    path.join(__dirname, "site", "dependencies", "css", "bootstrap.min.css")
);

fs.copyFileSync(
    path.join(__dirname, "node_modules", "bootstrap", "dist", "js", "bootstrap.min.js"),
    path.join(__dirname, "site", "dependencies", "js", "bootstrap.min.js")
);