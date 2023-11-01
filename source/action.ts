import { createFolder } from "./traverse";

import pm from "picomatch";
import * as fs from "fs";
import * as core from "@actions/core";

//Start code
try {
  // This should be a token with access to your repository scoped in as a secret.
  // The YML workflow will need to set myToken with the GitHub Secret Token
  // token: ${{ secrets.GITHUB_TOKEN }}
  const Folder = core.getInput("folder");
  const excludes = core.getMultilineInput("excludes", { required: false, trimWhitespace: true }).map((x) => pm(x));
  const export_sub_index = core.getBooleanInput("export_sub_index", { required: false });

  var result = false;

  console.log("starting on: " + Folder);

  if (fs.existsSync(Folder)) {
    result = createFolder(Folder, excludes, export_sub_index);
  } else {
    throw { message: "Couldn't not find folder: " + Folder };
  }

  if (result) {
    console.log("success");
  } else {
    console.log("failure");
    core.setFailed("no pages were created");
  }
} catch (error) {
  let message: string = JSON.stringify(error);

  if (core) core.setFailed(message);
  else {
    console.log(message);
    process.exit(1);
  }
}
