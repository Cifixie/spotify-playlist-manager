const fs = require("fs");
const path = require("path");

const dir = path.resolve(__dirname + "/../../data");
fs.mkdirSync(dir, { recursive: true });

const write = (p, content) => {
  fs.writeFileSync(path.join(dir, p), JSON.stringify(content, null, 2));
};

const read = (p) => {
  return JSON.parse(fs.readFileSync(path.join(dir, p), "utf-8"));
};

module.exports = {
  write,
  read,
};
