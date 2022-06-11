import { Command, AddCommand, CatCommand, CdCommand, CompressCommand, CpCommand, DecompressCommand, HashCommand, LsCommand, MvCommand, OsCommand, RmCommand, RnCommand, UpCommand, ExitCommand } from "./command";
import { CurrentPath } from "./currentPath";

export class CommandFactory {
  private commandWithNames = new Map<string, (params: Array<string>, currentPath: CurrentPath) => Command> ([
    ["up", (params: Array<string>, currentPath: CurrentPath) => new UpCommand(params, currentPath)],
    ["cd", (params: Array<string>, currentPath: CurrentPath) => new CdCommand(params, currentPath)],
    ["ls", (params: Array<string>, currentPath: CurrentPath) => new LsCommand(params, currentPath)],
    ["cat", (params: Array<string>, currentPath: CurrentPath) => new CatCommand(params, currentPath)],
    ["add", (params: Array<string>, currentPath: CurrentPath) => new AddCommand(params, currentPath)],
    ["rn", (params: Array<string>, currentPath: CurrentPath) => new RnCommand(params, currentPath)],
    ["cp", (params: Array<string>, currentPath: CurrentPath) => new CpCommand(params, currentPath)],
    ["mv", (params: Array<string>, currentPath: CurrentPath) => new MvCommand(params, currentPath)],
    ["rm", (params: Array<string>, currentPath: CurrentPath) => new RmCommand(params, currentPath)],
    ["os", (params: Array<string>, currentPath: CurrentPath) => new OsCommand(params, currentPath)],
    ["hash", (params: Array<string>, currentPath: CurrentPath) => new HashCommand(params, currentPath)],
    ["compress", (params: Array<string>, currentPath: CurrentPath) => new CompressCommand(params, currentPath)],
    ["decompress", (params: Array<string>, currentPath: CurrentPath) => new DecompressCommand(params, currentPath)],
    [".exit", (params: Array<string>, currentPath: CurrentPath) => new ExitCommand(params, currentPath)]
  ]);
  create(args: string, currentDirectory: CurrentPath): Command {
    let preparedArgs = args
      .split(" ")
      .map((el) => el.trim())
      .filter((el) => el !== "");
    if (preparedArgs.length === 0) {
      throw new Error("No command found!");
    }
    if(!this.commandWithNames.has(preparedArgs[0])) {
        throw new Error ("Such command is not found!")
    }
    let creator = this.commandWithNames.get(preparedArgs[0])!;
    return creator(preparedArgs.slice(1), currentDirectory)
  }
}
