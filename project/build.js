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

//

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
                    .replace(/( *){{(.*)}}/gm, (_, indent, template) =>
                        fs.readFileSync(path.join(__dirname, "template", template.trim()), "utf-8")
                            .replace(/^/gm, indent)
                    )
                    .replace(/^/gm, indent)
            )
            .replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, '') // comments
            .replace(/^ +$/gm, "") // trim lines
            .replace(/(?:\r?\n){2,}/gm, '\n'), // extra newlines
        "utf-8"
    );