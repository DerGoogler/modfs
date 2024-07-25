import ModFS from "./dist/index.js";

const fs = new ModFS({
  ADB: "/data/adb",
  MODULES: "<ADB>/modules",
});

const text = ModFS.format("Nice one, <NAME>", {
  NAME: "Marvin",
  // NAME: undefined -- handle null/undefined values etc
});

console.log("ModFS.format:", text);

console.log("get:", fs.get("MODULES"));

console.log("formatEntries:", fs.formatEntries());

console.log("entries:", fs.entries);

console.log("stringify:", fs.stringify(null, 4));

console.log("stringifyEntries:", fs.stringifyEntries(null, 4));
