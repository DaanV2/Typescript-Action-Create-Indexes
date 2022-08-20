import * as fs from "fs";
import path from "path";
import pm from "picomatch";

const Template = `/*	Auto generated	*/
{$SUBFOLDER$}
{$DOCUMENTS$}`;

function createContent(SubFolders: string[], Documents: string[]): string {
  return Template.replace(/\{\$SUBFOLDER\$\}/gi, SubFolders.join("\r\n")).replace(/\{\$DOCUMENTS\$\}/gi, Documents.join("\r\n"));
}

const WriteOptions: fs.WriteFileOptions = {
  encoding: "utf8",
};

/**
 * Creates a markdown index page
 * @param folder
 * @returns True if the page was made.
 */
export function CreateFolder(folder: string, excludes: (pm.MatcherWithState | pm.Matcher)[], export_sub_index: boolean): boolean {
  if (folder.includes(".git")) return false;

  const SubFolders: string[] = [];
  const Documents: string[] = [];

  //Get childern of folder
  const childern = fs.readdirSync(folder);

  //If childern is not undefined and has content then process it
  if (childern && childern.length > 0) {
    //Loop over
    for (let I = 0; I < childern.length; I++) {
      //grab item
      const child = childern[I];
      if (IsExcluded(child, excludes)) continue;

      const subfolder = path.join(folder, child);

      //if child is an directory or not
      if (fs.statSync(subfolder).isDirectory()) {
        //Create index page, if succesfull we create a reference

        //If an indexes was made for the subfolder, add it to the list of subfolders
        if (CreateFolder(subfolder, excludes, export_sub_index)) {
          //If the option has been turned off, then dont add it
          if (export_sub_index) SubFolders.push(`export * as ${child.replace(/[ \t]/gi, "_")} from "./${child}/index";`);
        }
      } else {
        //If the child is a .md page create a reference
        if (child.endsWith(".ts") && child != "index.ts") {
          Documents.push(`export * from "./${child.substring(0, child.length - 3)}";`);
        }
      }
    }
  }

  //If there are any reference made we create the index page and return succes
  if (SubFolders.length > 0 || Documents.length > 0) {
    const filepath = path.join(folder, "index.ts");
    console.log("writing: " + filepath);

    fs.writeFileSync(filepath, createContent(SubFolders, Documents), WriteOptions);
    return true;
  }

  return false;
}

function IsExcluded(filename: string, excludes: (pm.MatcherWithState | pm.Matcher)[]): boolean {
  for (let I = 0; I < excludes.length; I++) {
    if (excludes[I](filename)) return true;
  }

  return false;
}
