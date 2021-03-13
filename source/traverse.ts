import * as fs from 'fs';
import path from 'path';

const Template = `/*	Auto generated	*/
{$SUBFOLDER$}
{$DOCUMENTS$}`;

const WriteOptions: fs.WriteFileOptions = {
	encoding: 'utf8'
}


/**
 * Creates a markdown index page
 * @param folder 
 * @returns True if the page was made.
 */
export function CreateFolder(folder: string): boolean {
	if (folder.includes('.git'))
		return false;

	let SubFolders: string[] = [];
	let Documents: string[] = [];

	//Get childern of folder
	let childern = fs.readdirSync(folder);

	//If childern is not undefined and has content then process it
	if (childern && childern.length > 0) {
		//Loop over
		for (let I = 0; I < childern.length; I++) {
			//grab item
			const child = childern[I];
			let subfolder = path.join(folder, child);

			//if child is an directory or not
			if (fs.statSync(subfolder).isDirectory()) {
				//Create index page, if succesfull we create a reference

				if (CreateFolder(subfolder)) {
					SubFolders.push(`export * as ${child.replace(/[ \t]/gi, '_')} from "./${child}/include";`);
				}
			}
			else {
				//If the child is a .md page create a reference
				if (child.endsWith('.ts') && child != 'include.ts') {
					Documents.push(`export * from "./${child}";`);
				}
			}
		}
	}

	//If there are any reference made we create the index page and return succes
	if (SubFolders.length > 0 || Documents.length > 0) {
		let filepath = path.join(folder, 'index.md');
		let Name = GetFolderName(folder);
		console.log('writing: ' + filepath);

		let Content = Template.replace(/\{\$SUBFOLDER\$\}/gi, SubFolders.join('\r\n'));
		Content = Content.replace(/\{\$DOCUMENTS\$\}/gi, Documents.join('\r\n'));

		fs.writeFileSync(filepath, Content, WriteOptions);
		return true;
	}

	return false;
}


/**
 * Returns the name of the folder
 * @param folderpath The whole folder path
 * @returns The name of the folder
 */
function GetFolderName(folderpath: string): string {
	let LastIndex = folderpath.lastIndexOf('/');

	if (LastIndex >= 0) {
		return folderpath.substring(LastIndex + 1, folderpath.length);
	}

	return folderpath;
}