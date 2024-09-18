import ModFS from "./dist/index.js";

const fs = new ModFS({
  ADB: "/data/adb",
  MODULES: "<ADB>/modules",
  NESTED: {
    NAME: "Kevin",
    PATH: "<ADB>/user/<NESTED.NAME>",
  },
  CALL: () => {
    return "Nice";
  },
});

const text = ModFS.format(
  "The family of <human.firstName> goes averagely over <avgAge> years and the fun fact is that the last name of the family is <human.lastName>. Currently the family has a member count of <familyMembers.length>. The names of family are <familyMembers(, )>.",
  {
    human: {
      firstName: "Kevin",
      lastName: undefined,
    },
    avgAge: 100,
    familyMembers: ["Granpa", "Papa", "Mama"],
  }
);

const zips = ["https://google.com", "https://google.com"];

const urls = ModFS.format('mmrl install local <ZIPFILES( |"")>', {
  ZIPFILES: zips,
});

console.log("arrays:", urls);

console.log("ModFS.format:", text);

console.log("get:", fs.get("MODULES"));

console.log("get (nested):", fs.get("NESTED"));
console.log("get (nested.PATH):", fs.get("NESTED.PATH")); // returns "/data/adb/user/Kevin"
console.log("get (nested.NAME):", fs.get("NESTED.NAME")); // returns "Kevin"

console.log("get (function):", fs.get("CALL"));

console.log("formatEntries:", fs.formatEntries());

console.log("entries:", fs.entries);

console.log("stringify:", fs.stringify(null, 4));

console.log("stringifyEntries:", fs.stringifyEntries(null, 4));

const result = ModFS.format("Module <valdilate=(magisk|mkshrc)>", {
  valdilate: (root, mod) => {
    if (root.toLowerCase() === "magisk") {
      return { module: mod };
    } else {
      return "";
    }
  },
});

console.log(result);
