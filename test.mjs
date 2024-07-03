import ModFS from "./dist/index.js";


const fs = new ModFS({
    ADB: "/data/adb",
    MODULES: "<ADB>/modules",
  });
  
  const text = ModFS.format("Nice one, <NAME>", {
    NAME: "Kevin",
  });
  
  console.log(text);
  
  console.log(fs.get("MODULES"));
  
  console.log(fs.formatEntries());
  
  console.log(fs.stringify(null, 4));
  
  console.log(fs.stringifyEntries(null, 4));