import path from "node:path";
import { readFile, stat } from 'node:fs/promises';

export async function readJson(filePath) {
	if (!filePath) {
		return null;
	}
  try {
    const data = await readFile(path.resolve(filePath), "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading file ${filePath}: `, error.message);
    return null;
  }
}
