import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

/**
 * Read file content
 */
export async function readFileContent(filePath: string): Promise<string> {
  return await readFile(filePath, 'utf-8');
}

/**
 * Write file content
 */
export async function writeFileContent(filePath: string, content: string): Promise<void> {
  await writeFile(filePath, content, 'utf-8');
}

/**
 * Ensure directory exists
 */
export async function ensureDir(dirPath: string): Promise<void> {
  const { mkdir } = await import('fs/promises');
  await mkdir(dirPath, { recursive: true });
}

/**
 * Get file extension
 */
export function getFileExtension(filePath: string): string {
  return path.extname(filePath).toLowerCase();
}

/**
 * Check if file exists
 */
export function fileExists(filePath: string): boolean {
  return existsSync(filePath);
}

