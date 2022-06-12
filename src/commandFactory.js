"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandFactory = void 0;
const command_1 = require("./command");
class CommandFactory {
    constructor() {
        this.commandWithNames = new Map([
            ["up", (params, currentPath) => new command_1.UpCommand(params, currentPath)],
            ["cd", (params, currentPath) => new command_1.CdCommand(params, currentPath)],
            ["ls", (params, currentPath) => new command_1.LsCommand(params, currentPath)],
            ["cat", (params, currentPath) => new command_1.CatCommand(params, currentPath)],
            ["add", (params, currentPath) => new command_1.AddCommand(params, currentPath)],
            ["rn", (params, currentPath) => new command_1.RnCommand(params, currentPath)],
            ["cp", (params, currentPath) => new command_1.CpCommand(params, currentPath)],
            ["mv", (params, currentPath) => new command_1.MvCommand(params, currentPath)],
            ["rm", (params, currentPath) => new command_1.RmCommand(params, currentPath)],
            ["os", (params, currentPath) => new command_1.OsCommand(params, currentPath)],
            ["hash", (params, currentPath) => new command_1.HashCommand(params, currentPath)],
            ["compress", (params, currentPath) => new command_1.CompressCommand(params, currentPath)],
            ["decompress", (params, currentPath) => new command_1.DecompressCommand(params, currentPath)],
            [".exit", (params, currentPath) => new command_1.ExitCommand(params, currentPath)]
        ]);
    }
    create(args, currentDirectory) {
        let preparedArgs = args
            .split(" ")
            .map((el) => el.trim())
            .filter((el) => el !== "");
        if (preparedArgs.length === 0) {
            throw new Error("No command found!");
        }
        if (!this.commandWithNames.has(preparedArgs[0])) {
            throw new Error("Such command is not found!");
        }
        let creator = this.commandWithNames.get(preparedArgs[0]);
        return creator(preparedArgs.slice(1), currentDirectory);
    }
}
exports.CommandFactory = CommandFactory;
