import fs from "fs/promises";
import __joiner from "../utils/paths.js";
import checkFileExists from "../utils/checkFile.js";

const FILE_PATH = __joiner("uploads.json");

class FileManager {
    async _read() {
        const exists = await checkFileExists(FILE_PATH);
        if (!exists) return [];
        const data = await fs.readFile(FILE_PATH, "utf-8");
        return JSON.parse(data);
    }

    async _write(data) {
        await fs.writeFile(FILE_PATH, JSON.stringify(data, null, 2));
    }

    async addUploadedFile(file) {
        const files = await this._read();
        const newFile = { ...file, id: `uploaded_file_${Date.now()}` };
        files.push(newFile);
        await this._write(files);
        return newFile;
    }

    async addUploadedFiles(files) {
        for (const file of files) {
            await this.addUploadedFile(file);
        }
    }
}

export default FileManager;
