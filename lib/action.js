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
const traverse_1 = require("./traverse");
const fs = __importStar(require("fs"));
const core = __importStar(require("@actions/core"));
const picomatch_1 = __importDefault(require("picomatch"));
//Start code
try {
    // This should be a token with access to your repository scoped in as a secret.
    // The YML workflow will need to set myToken with the GitHub Secret Token
    // token: ${{ secrets.GITHUB_TOKEN }}
    const Folder = core.getInput("folder");
    const excludes = core.getMultilineInput("excludes", { required: false, trimWhitespace: true }).map((x) => picomatch_1.default(x));
    var result = false;
    console.log("starting on: " + Folder);
    if (fs.existsSync(Folder)) {
        result = traverse_1.CreateFolder(Folder, excludes);
    }
    else {
        throw { message: "Couldnt not find folder: " + Folder };
    }
    if (result) {
        console.log("success");
    }
    else {
        console.log("failure");
        core.setFailed("no pages were created");
    }
}
catch (error) {
    let message;
    if (error.message)
        message = error.message;
    else
        message = JSON.stringify(error);
    if (core)
        core.setFailed(message);
    else {
        console.log(message);
        process.exit(1);
    }
}
//# sourceMappingURL=action.js.map