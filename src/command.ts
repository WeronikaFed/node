import process from "process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import os from "os";
import crypto from "crypto";
import zlib from "zlib";
import { CurrentPath } from "./currentPath";

export abstract class Command {
  constructor(
    protected params: Array<string>,
    protected currentPath: CurrentPath
  ) {}
  abstract execute(): void;
}

export class UpCommand extends Command {
  execute() {
    let path = process.cwd().split("\\");
    let newPath = path.slice(0, path.length - 1).join("\\");
    this.currentPath.path = newPath;
  }
}

export class CdCommand extends Command {
  execute() {
    if (fs.existsSync(this.params[0])) {
      this.currentPath.path = this.params[0];
    } else {
      throw new Error(`Path: ${this.params[0]} doesn't exist!`);
    }
  }
}

export class LsCommand extends Command {
  execute() {
    const currentFolder = process.cwd();
    fs.readdir(currentFolder, (err, files) => {
      files.forEach((file) => {
        console.log(file);
      });
    });
  }
}

export class CatCommand extends Command {
  execute() {
    const filePath = this.params[0];
    const readableStream = fs.createReadStream(filePath, "utf-8");
    readableStream.on("error", function (error) {
      console.log(`error: ${error.message}`);
    });
    readableStream.on("data", (chunk) => {
      console.log(chunk);
    });
  }
}

export class AddCommand extends Command {
  execute() {
    const filePath = path.join(this.currentPath.path, this.params[0]);
    let writeStream = fs.createWriteStream(filePath);
    writeStream.write("", "base64");
    writeStream.on("finish", () => {
      console.log("New file added  successfully!");
    });
    writeStream.end();
  }
}

export class RnCommand extends Command {
  execute() {
    const newFileName = path.join(
      path.basename(this.currentPath.path),
      this.params[1]
    );
    if (fs.existsSync(this.params[0])) {
      fs.rename(this.params[0], newFileName, (err) => {
        if (err) throw Error("Rn operation failed");
        console.log("File renamed successfully");
      });
    } else {
      throw new Error(`Path to file doesn't correct!`);
    }
  }
}

export class CpCommand extends Command {
  execute() {
    const to = this.params[1];
    const from = this.params[0];
    if (fs.existsSync(this.params[0])) {
      fs.copyFile(from, to, (err) => {
        if (err) throw Error("Cp operation failed");
        console.log("File copied successfully");
      });
    } else {
      throw new Error(`Path to file doesn't correct!`);
    }
  }
}

export class MvCommand extends Command {
  execute() {
    const to = this.params[1];
    const from = this.params[0];
    if (fs.existsSync(this.params[0]) || fs.existsSync(this.params[0])) {
      fs.copyFile(from, to, (err) => {
        if (err) throw Error(`Mv operation failed: ${err}`);
        fs.unlink(from, (err) => {
          if (err) throw Error(`Mv operation failed: ${err}`);
          console.log("File moved successfully");
        });
      });
    } else {
      throw new Error(`Path doesn't correct!`);
    }
  }
}

export class RmCommand extends Command {
  execute() {
    if(fs.existsSync(this.params[0])){
    fs.unlink(this.params[0], (err) => {
      if (err) throw Error("Rm operation failed");
      console.log("File deleted successfully");
    });
  } else {
    throw new Error(`Path doesn't correct!`);
  }
  }
}

export class OsCommand extends Command {
  execute() {
    switch (this.params[0]) {
      case "--EOL":
        console.log(`End-Of-Line: ${JSON.stringify(os.EOL)}`);
        break;
      case "--cpus":
        console.log(os.cpus());
        break;
      case "--homedir":
        console.log(os.homedir());
        break;
      case "--username":
        console.log(os.userInfo().username);
        break;
      case "--architecture":
        console.log(os.arch());
        break;
    }
  }
}

export class HashCommand extends Command {
  execute() {
    if(fs.existsSync(this.params[0])){
    const readableStream = fs.createReadStream(this.params[0]);
    readableStream.on("error", function (error) {
      console.log(`error: ${error.message}`);
    });
    readableStream.on("data", (chunk) => {
      let hash = crypto.createHash("sha256").update(chunk).digest("hex");
      console.log(hash);
    });
  } else {
    throw new Error(`Path to file doesn't correct!`);
  }
}
}

export class CompressCommand extends Command {
  execute() {
    const inpPath = this.params[0];
    const outPath = this.params[1];
    if(fs.existsSync(this.params[0])){
    const gzip = zlib.createGzip();
    const inp = fs.createReadStream(inpPath);
    var out = fs.createWriteStream(outPath);
    inp.pipe(gzip).pipe(out);
  }else {
    throw new Error(`Path to file doesn't correct!`);
  }
} 
}

export class DecompressCommand extends Command {
  execute() {
    const decompressedPath = this.params[1];
    const compressedPath = this.params[0];
    if(fs.existsSync(this.params[0])){
    var unzip = zlib.createUnzip();
    var read = fs.createReadStream(compressedPath);
    var write = fs.createWriteStream(decompressedPath);
    read.pipe(unzip).pipe(write);
    console.log("unZipped Successfully");
  }else {
    throw new Error(`Path to file doesn't correct!`);
  }
}
}

export class ExitCommand extends Command {
  execute(): void {
    const args = process.argv.slice(2);
    const username = args[0].split("=")[1];
    console.log(`\n Thank you for using File Manager, ${username}`);
    process.exit();
  }
}
