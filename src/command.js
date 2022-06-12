"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExitCommand = exports.DecompressCommand = exports.CompressCommand = exports.HashCommand = exports.OsCommand = exports.RmCommand = exports.MvCommand = exports.CpCommand = exports.RnCommand = exports.AddCommand = exports.CatCommand = exports.LsCommand = exports.CdCommand = exports.UpCommand = exports.Command = void 0;
const process_1 = __importDefault(require("process"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const os_1 = __importDefault(require("os"));
const crypto_1 = __importDefault(require("crypto"));
const zlib_1 = __importDefault(require("zlib"));
class Command {
    constructor(params, currentPath) {
        this.params = params;
        this.currentPath = currentPath;
    }
}
exports.Command = Command;
class UpCommand extends Command {
    execute() {
        let path = process_1.default.cwd().split("\\");
        let newPath = path.slice(0, path.length - 1).join("\\");
        this.currentPath.path = newPath;
    }
}
exports.UpCommand = UpCommand;
class CdCommand extends Command {
    execute() {
        if (fs_1.default.existsSync(this.params[0])) {
            this.currentPath.path = this.params[0];
        }
        else {
            throw new Error(`Path: ${this.params[0]} doesn't exist!`);
        }
    }
}
exports.CdCommand = CdCommand;
class LsCommand extends Command {
    execute() {
        const currentFolder = process_1.default.cwd();
        fs_1.default.readdir(currentFolder, (err, files) => {
            files.forEach((file) => {
                console.log(file);
            });
        });
    }
}
exports.LsCommand = LsCommand;
class CatCommand extends Command {
    execute() {
        const filePath = this.params[0];
        const readableStream = fs_1.default.createReadStream(filePath, "utf-8");
        readableStream.on("error", function (error) {
            console.log(`error: ${error.message}`);
        });
        readableStream.on("data", (chunk) => {
            console.log(chunk);
        });
    }
}
exports.CatCommand = CatCommand;
class AddCommand extends Command {
    execute() {
        const filePath = path_1.default.join(this.currentPath.path, this.params[0]);
        let writeStream = fs_1.default.createWriteStream(filePath);
        writeStream.write("", "base64");
        writeStream.on("finish", () => {
            console.log("New file added  successfully!");
        });
        writeStream.end();
    }
}
exports.AddCommand = AddCommand;
class RnCommand extends Command {
    execute() {
        const newFileName = path_1.default.join(path_1.default.basename(this.currentPath.path), this.params[1]);
        if (fs_1.default.existsSync(this.params[0])) {
            fs_1.default.rename(this.params[0], newFileName, (err) => {
                if (err)
                    throw Error("Rn operation failed");
                console.log("File renamed successfully");
            });
        }
        else {
            throw new Error(`Path to file doesn't correct!`);
        }
    }
}
exports.RnCommand = RnCommand;
class CpCommand extends Command {
    execute() {
        const to = this.params[1];
        const from = this.params[0];
        if (fs_1.default.existsSync(this.params[0])) {
            fs_1.default.copyFile(from, to, (err) => {
                if (err)
                    throw Error("Cp operation failed");
                console.log("File copied successfully");
            });
        }
        else {
            throw new Error(`Path to file doesn't correct!`);
        }
    }
}
exports.CpCommand = CpCommand;
class MvCommand extends Command {
    execute() {
        const to = this.params[1];
        const from = this.params[0];
        if (fs_1.default.existsSync(this.params[0]) || fs_1.default.existsSync(this.params[0])) {
            fs_1.default.copyFile(from, to, (err) => {
                if (err)
                    throw Error(`Mv operation failed: ${err}`);
                fs_1.default.unlink(from, (err) => {
                    if (err)
                        throw Error(`Mv operation failed: ${err}`);
                    console.log("File moved successfully");
                });
            });
        }
        else {
            throw new Error(`Path doesn't correct!`);
        }
    }
}
exports.MvCommand = MvCommand;
class RmCommand extends Command {
    execute() {
        if (fs_1.default.existsSync(this.params[0])) {
            fs_1.default.unlink(this.params[0], (err) => {
                if (err)
                    throw Error("Rm operation failed");
                console.log("File deleted successfully");
            });
        }
        else {
            throw new Error(`Path doesn't correct!`);
        }
    }
}
exports.RmCommand = RmCommand;
class OsCommand extends Command {
    execute() {
        switch (this.params[0]) {
            case "--EOL":
                console.log(`End-Of-Line: ${JSON.stringify(os_1.default.EOL)}`);
                break;
            case "--cpus":
                console.log(os_1.default.cpus());
                break;
            case "--homedir":
                console.log(os_1.default.homedir());
                break;
            case "--username":
                console.log(os_1.default.userInfo().username);
                break;
            case "--architecture":
                console.log(os_1.default.arch());
                break;
        }
    }
}
exports.OsCommand = OsCommand;
class HashCommand extends Command {
    execute() {
        if (fs_1.default.existsSync(this.params[0])) {
            const readableStream = fs_1.default.createReadStream(this.params[0]);
            readableStream.on("error", function (error) {
                console.log(`error: ${error.message}`);
            });
            readableStream.on("data", (chunk) => {
                let hash = crypto_1.default.createHash("sha256").update(chunk).digest("hex");
                console.log(hash);
            });
        }
        else {
            throw new Error(`Path to file doesn't correct!`);
        }
    }
}
exports.HashCommand = HashCommand;
class CompressCommand extends Command {
    execute() {
        const inpPath = this.params[0];
        const outPath = this.params[1];
        if (fs_1.default.existsSync(this.params[0])) {
            const gzip = zlib_1.default.createGzip();
            const inp = fs_1.default.createReadStream(inpPath);
            var out = fs_1.default.createWriteStream(outPath);
            inp.pipe(gzip).pipe(out);
        }
        else {
            throw new Error(`Path to file doesn't correct!`);
        }
    }
}
exports.CompressCommand = CompressCommand;
class DecompressCommand extends Command {
    execute() {
        const decompressedPath = this.params[1];
        const compressedPath = this.params[0];
        if (fs_1.default.existsSync(this.params[0])) {
            var unzip = zlib_1.default.createUnzip();
            var read = fs_1.default.createReadStream(compressedPath);
            var write = fs_1.default.createWriteStream(decompressedPath);
            read.pipe(unzip).pipe(write);
            console.log("unZipped Successfully");
        }
        else {
            throw new Error(`Path to file doesn't correct!`);
        }
    }
}
exports.DecompressCommand = DecompressCommand;
class ExitCommand extends Command {
    execute() {
        const args = process_1.default.argv.slice(2);
        const username = args[0].split("=")[1];
        console.log(`\n Thank you for using File Manager, ${username}`);
        process_1.default.exit();
    }
}
exports.ExitCommand = ExitCommand;
