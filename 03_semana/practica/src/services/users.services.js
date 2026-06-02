import fs from "fs/promises";

export const readUsers = async (filePath) => {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
};

export const saveUsers = async (filePath, data) => {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};
