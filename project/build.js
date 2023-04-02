const fs = require("fs");
const path = require("path");

// css

let folder = path.join(__dirname, "site", "dependencies", "css");
fs.existsSync(folder) || fs.mkdirSync(folder, {recursive: true});

fs.copyFileSync(
    path.join(__dirname, "src", "dependencies", "css", "style.css"),
    path.join(folder, "style.css")
);

// js

folder = path.join(__dirname, "site", "dependencies", "js");
fs.existsSync(folder) || fs.mkdirSync(folder, {recursive: true});

// assets

folder = path.join(__dirname, "site", "dependencies", "assets");
fs.existsSync(folder) || fs.mkdirSync(folder, {recursive: true});

fs.copyFileSync(
    path.join(__dirname, "Logo.png"),
    path.join(folder, "logo.png")
);

// html

const def = fs.readFileSync(path.join(__dirname, "template", "default.html"), "utf-8");

for(const file of fs.readdirSync(path.join(__dirname, "src"), {withFileTypes: true})
    .filter(f => f.isFile())
    .map(f => f.name)
    .filter(f => f.endsWith(".html")))
    fs.writeFileSync(
        path.join(__dirname, "site", file),
        def // {{ content }}
            .replace(/( *){{ *content *}}/gm, (_, indent,) =>
                fs // {{ .html }}
                    .readFileSync(path.join(__dirname, "src", file), "utf-8")
                    .replace(/^/gm, indent)
            )
            // {{ .html }}
            .replace(/( *){{(.*)}}/gm, (_, indent, template) =>
                fs.readFileSync(path.join(__dirname, "template", template.trim()), "utf-8")
                    .replace(/^/gm, indent)
            )
            .replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, '') // comments
            .replace(/^ +$/gm, "") // trim lines
            .replace(/(?:\r?\n){2,}/gm, '\n') // extra newlines
            .trim(), // trim
        "utf-8"
    );