const fs = require("fs");
const path = require("path");

!fs.existsSync(path.join(__dirname, "site")) || fs.rmSync(path.join(__dirname, "site"), {recursive: true});