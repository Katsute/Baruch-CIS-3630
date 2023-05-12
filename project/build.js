const fs = require("fs");
const path = require("path");

const yaml = require("yaml");
const format = require("html-format");
const liquid = require("liquidjs");

// copy

const copyDir = (src, dest) => {
    fs.existsSync(dest) || fs.mkdirSync(dest, {recursive: true});
    for(const file of fs.readdirSync(src, {withFileTypes: true}))
        file.isDirectory()
        ? copyDir(path.join(src, file.name), path.join(dest, file.name))
        : fs.existsSync(path.join(dest, file.name)) || fs.copyFileSync(path.join(src, file.name), path.join(dest, file.name));
}

// css

let folder = path.join(__dirname, "site", "dependencies", "css");
fs.existsSync(folder) || fs.mkdirSync(folder, {recursive: true});

fs.copyFileSync(
    path.join(__dirname, "src", "dependencies", "css", "style.css"),
    path.join(folder, "style.css")
);

// assets

folder = path.join(__dirname, "site", "dependencies", "assets");
fs.existsSync(folder) || fs.mkdirSync(folder, {recursive: true});

for(const logo of ["logo.png", "logo-alt.png", "logo-sm.png", "logo.ico"])
    fs.copyFileSync(path.join(__dirname, logo), path.join(folder, logo));

// icons

copyDir(
    path.join(__dirname, "src", "dependencies", "icons"),
    path.join(__dirname, "site", "dependencies", "icons")
);

// images

copyDir(
    path.join(__dirname, "src", "dependencies", "images"),
    path.join(__dirname, "site", "dependencies", "images")
);

// fonts

folder = path.join(__dirname, "site", "dependencies", "fonts");
fs.existsSync(folder) || fs.mkdirSync(folder, {recursive: true});

fs.copyFileSync(
    path.join(__dirname, "node_modules", "@fontsource", "lexend-deca", "files", "lexend-deca-latin-300-normal.woff"),
    path.join(folder, "lexend-deca.woff")
);

// html

const data = {};

for(const file of fs.readdirSync(path.join(__dirname, "data")))
    data[file.split('.')[0]] = yaml.parse(fs.readFileSync(path.join(__dirname, "data", file), "utf-8"));

const engine = new liquid.Liquid({
    partials: path.join(__dirname, "template"),
    strictFilters: true,
    globals: {
        newline: '\n',
        data
    }
});

engine.registerFilter("repeat", (initial, repeat) => initial.repeat(repeat));
engine.registerFilter("rand", (_, min, max) => Math.floor(Math.random() * (max - min + 1)) + min);

const def = fs.readFileSync(path.join(__dirname, "template", "default.html"), "utf-8");

for(const file of fs.readdirSync(path.join(__dirname, "src"), {withFileTypes: true})
    .filter(f => f.isFile())
    .map(f => f.name)
    .filter(f => f.endsWith(".html")))
    fs.writeFileSync(
        path.join(__dirname, "site", file),
        format(
            engine.parseAndRenderSync(
                def.replace("{{ content }}", fs.readFileSync(path.join(__dirname, "src", file), "utf-8")), {
                    file: file
                })
                .replace(/(<!--.*?-->)|(<!--[\S\s]+?-->)|(<!--[\S\s]*?$)/g, '') // comments
                .replace(/^ +$/gm, "") // trim lines
                .replace(/(?:\r?\n){2,}/gm, '\n') // extra newlines
                .trim() // trim
        , "    ", Infinity),
        "utf-8"
    );