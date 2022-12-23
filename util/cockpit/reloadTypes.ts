import {Cockpit2} from "./index";


Cockpit2.getTypeDefinitions([
    "emmausbote"
]).then(types => {
    const file = types.map(({model, types}) =>
        `'${model}': {${Object.entries(types).map(([key, typ]) => `'${key}': ${typ}`).join(",\n")}}`).join("\n\n")
    console.log(file);
})