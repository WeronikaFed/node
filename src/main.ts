import { CommandFactory } from "./commandFactory";
import os from "os";

const currentDirectory = {path: os.homedir()}
const commandFactory = new CommandFactory();
const args = process.argv.slice(2);

do {
    try {
        const readline = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
          });
          
          readline.question('Please enter command!', args => {
            let command = commandFactory.create(args, currentDirectory);
            command.execute();
            readline.close();
          });
        
    } catch (e) {
        console.log('Error: ', e)
    }
} while (true);