import process from "process";
import path, { PlatformPath } from "path";
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
    this.currentPath.path = path.basename(this.currentPath.path);
    console.log(`You are in "${process.cwd()}"`);
  }
}

export class CdCommand extends Command {
  execute() {
    this.currentPath.path = this.params[0];
    console.log(`You are in "${process.cwd()}"`);
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
    const readableStream = fs.createReadStream(filePath);
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
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const filePath = path.join(__dirname, this.params[0]);
    // fs.writeFile(filePath, "", (err) => {
    //   if (err) {
    //     console.log("Add operation failed due to: ", err);
    //   } else {
    //     console.log("New file added  successfully!");
    //   }
    // });

    let writeStream = fs.createWriteStream(filePath);
    writeStream.write("", "base64");
    writeStream.on("finish", () => {
      console.log("wrote all data to file");
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
    fs.rename(this.params[0], newFileName, (err) => {
      if (err) throw Error("Rn operation failed");
      console.log("File renamed successfully");
    });
  }
}

export class CpCommand extends Command {
  execute() {
    const to = this.params[1];
    const from = this.params[0];
    fs.copyFile(from, to, (err) => {
      if (err) throw Error("Cp operation failed");
      console.log("File copied successfully");
    });
  }
}

export class MvCommand extends Command {
  execute() {
    const to = this.params[1];
    const from = this.params[0];
    fs.copyFile(from, to, (err) => {
      if (err) throw Error("Mv operation failed");
      console.log("File moved successfully");
    });
    fs.unlink(from, (err) => {
      if (err) throw Error("Mv operation failed");
    });
  }
}

export class RmCommand extends Command {
  execute() {
    fs.unlink(this.params[0], (err) => {
      if (err) throw Error("Rm operation failed");
      console.log("File deleted successfully");
    });
  }
}

export class OsCommand extends Command {
  execute() {
    switch (this.params[0]) {
      case "--EOL":
        console.log(os.EOL);
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
    const readableStream = fs.createReadStream(this.params[0]);
    readableStream.on("error", function (error) {
      console.log(`error: ${error.message}`);
    });
    readableStream.on("data", (chunk) => {
      let hash = crypto.createHash("sha256").update(chunk).digest("hex");
      console.log(hash);
    });

    // fs.readFile(this.params[0], "utf-8", (err, data) => {
    //   if (err) throw Error("Hash operation failed");
    //   let hash = crypto.createHash("sha256").update(data).digest("hex");
    //   console.log(hash);
    // });
  }
}

export class CompressCommand extends Command {
  execute() {
    const inpPath = this.params[0];
    const outPath = this.params[1];
    const gzip = zlib.createGzip();
    const inp = fs.createReadStream(inpPath);
    var out = fs.createWriteStream(outPath);
    inp.pipe(gzip).pipe(out);
  }
}

export class DecompressCommand extends Command {
  execute() {
    const decompressedPath = this.params[0];
    const compressedPath = this.params[1];
    var unzip = zlib.createUnzip();
    var read = fs.createReadStream(compressedPath);
    var write = fs.createWriteStream(decompressedPath);
    read.pipe(unzip).pipe(write);
    console.log("unZipped Successfully");
  }
}
