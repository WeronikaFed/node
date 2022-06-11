import { CommandFactory } from "./commandFactory";
import os from "os";

process.on('SIGINT', () => {
    console.log(`Thank you for using File Manager, ${username}`);  
      process.exit();
  });

const currentDirectory = { path: os.homedir() };
const commandFactory = new CommandFactory();
const args = process.argv.slice(2);


if(!args[0].startsWith("--username=")) {
    throw new Error ("Username parameter should be specified!")
}

const username = args[0].split("=")[1];

console.log(`Welcome to the File Manager, ${username}`);


do {
   console.log(`You are currently in ${process.cwd()}`)
  const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    readline.question("Please enter command!", (args: string) => {
      let command = commandFactory.create(args, currentDirectory);
      command.execute();
    });
  } catch (e) {
    console.log("Error: ", e);
  } finally {
    readline.close();
  }
} while (true);
