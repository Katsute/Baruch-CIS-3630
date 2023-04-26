const fs = require("fs");
const path = require("path");

// tailwindcss

const tws = path.join(__dirname, "site", "dependencies", "css", "tailwind.css");

fs.writeFileSync(
    tws,
    "/* tailwindcss v3.3.2 | MIT License | https://tailwindcss.com */" + '\n' +
    fs.readFileSync(tws, "utf-8")
        .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '') // comments
        .replace(/^ +$/gm, "") // trim lines
        .replace(/(?:\r?\n){2,}/gm, '\n') // extra newlines
        .trim(), // trim
    "utf-8"
);