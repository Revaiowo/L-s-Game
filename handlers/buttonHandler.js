import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';

export const loadButtons = async (client, __dirname) =>{

    const foldersPath = path.join(__dirname, 'buttons'); // this gives path to the buttons folder
    const buttonFiles = fs.readdirSync(foldersPath).filter(file => file.endsWith('.js')); // This puts all the files wihtin that folder into an array

    for (const file of buttonFiles) {

        const filePath = path.join(foldersPath, file);
        const fileUrl = pathToFileURL(filePath); // need to turn path into url cause import does not accept path

        let button  = await import(fileUrl.href);
        button = button.default;
        
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('customId' in button && 'execute' in button) {
            client.buttons.set(button.customId, button);

        } else {
            console.log(`[WARNING] The button at ${filePath} is missing a required "customId" or "execute" property.`);
        }
    }
    
}