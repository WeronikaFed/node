"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandFactory_1 = require("./commandFactory");
const os_1 = __importDefault(require("os"));
function readlineAsync(question) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve) => {
            const readline = require("readline").createInterface({
                input: process.stdin,
                output: process.stdout,
            });
            readline.question("\nPlease enter command!\n", (args) => {
                resolve(args);
                readline.close();
            });
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        process.on('exit', function () {
            //handle your on exit code
            console.log(`\nThank you for using File Manager, ${username}`);
        });
        const currentDirectory = { path: os_1.default.homedir() };
        const commandFactory = new commandFactory_1.CommandFactory();
        const args = process.argv.slice(2);
        if (!args[0].startsWith("--username=")) {
            throw new Error("Username parameter should be specified!");
        }
        const username = args[0].split("=")[1];
        console.log(`Welcome to the File Manager, ${username}`);
        do {
            console.log(`You are currently in ${currentDirectory.path}`);
            try {
                let answer = yield readlineAsync("Please enter command!");
                let command = commandFactory.create(answer, currentDirectory);
                command.execute();
            }
            catch (e) {
                console.log("Error: ", e);
            }
        } while (true);
    });
}
main();
