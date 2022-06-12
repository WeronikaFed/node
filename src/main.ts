import { CommandFactory } from "./commandFactory";
import os from "os";

async function readlineAsync(question: string): Promise<string> {
  return new Promise<string>((resolve) => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("\nPlease enter command!\n", (args: string) => {
      resolve(args);
      readline.close();
    });
  });
}

async function main() {
  process.on('exit', function () {
    //handle your on exit code
    console.log(`\nThank you for using File Manager, ${username}`);
   });
  
  const currentDirectory = { path: os.homedir() };
  const commandFactory = new CommandFactory();
  const args = process.argv.slice(2);
  
  if (!args[0].startsWith("--username=")) {
    throw new Error("Username parameter should be specified!");
  }
  
  const username = args[0].split("=")[1];
  console.log(`Welcome to the File Manager, ${username}`);
  
  do {
    console.log(`You are currently in ${currentDirectory.path}`);
    try {
      let answer = await readlineAsync("Please enter command!");
      let command = commandFactory.create(answer, currentDirectory);
      command.execute();
    } catch (e) {
      console.log("Error: ", e);
    }
  } while (true);
}

main();