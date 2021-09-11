import pm from "picomatch";
/**
 * Creates a markdown index page
 * @param folder
 * @returns True if the page was made.
 */
export declare function CreateFolder(folder: string, excludes: (pm.MatcherWithState | pm.Matcher)[]): boolean;
