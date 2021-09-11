"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateFolder = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const Template = `/*	Auto generated	*/
{$SUBFOLDER$}
{$DOCUMENTS$}`;
function createContent(SubFolders, Documents) {
    return Template.replace(/\{\$SUBFOLDER\$\}/gi, SubFolders.join("\r\n")).replace(/\{\$DOCUMENTS\$\}/gi, Documents.join("\r\n"));
}
const WriteOptions = {
    encoding: "utf8",
};
/**
 * Creates a markdown index page
 * @param folder
 * @returns True if the page was made.
 */
function CreateFolder(folder, excludes) {
    if (folder.includes(".git"))
        return false;
    const SubFolders = [];
    const Documents = [];
    //Get childern of folder
    const childern = fs.readdirSync(folder);
    //If childern is not undefined and has content then process it
    if (childern && childern.length > 0) {
        //Loop over
        for (let I = 0; I < childern.length; I++) {
            //grab item
            const child = childern[I];
            if (IsExcluded(child, excludes))
                continue;
            const subfolder = path_1.default.join(folder, child);
            //if child is an directory or not
            if (fs.statSync(subfolder).isDirectory()) {
                //Create index page, if succesfull we create a reference
                if (CreateFolder(subfolder, excludes)) {
                    SubFolders.push(`export * as ${child.replace(/[ \t]/gi, "_")} from "./${child}/include";`);
                }
            }
            else {
                //If the child is a .md page create a reference
                if (child.endsWith(".ts") && child != "include.ts") {
                    Documents.push(`export * from "./${child.substring(0, child.length - 3)}";`);
                }
            }
        }
    }
    //If there are any reference made we create the index page and return succes
    if (SubFolders.length > 0 || Documents.length > 0) {
        const filepath = path_1.default.join(folder, "include.ts");
        console.log("writing: " + filepath);
        fs.writeFileSync(filepath, createContent(SubFolders, Documents), WriteOptions);
        return true;
    }
    return false;
}
exports.CreateFolder = CreateFolder;
function IsExcluded(filename, excludes) {
    for (let I = 0; I < excludes.length; I++) {
        if (excludes[I](filename))
            return true;
    }
    return false;
}
//# sourceMappingURL=traverse.js.map