import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import type { Perspective } from './registries/types.js';

export interface ForgeConfig {
  author: string;
  persona: string;
  company?: string;
  defaultMode: string;
  perspective: Perspective;
  fonts: {
    primary: string;
    secondary: string;
  };
  memory?: {
    path?: string;
  };
}

const DEFAULT_CONFIG: ForgeConfig = {
  author: '',
  persona: '',
  company: process.env.FORGE_COMPANY || '',
  defaultMode: 'advisory',
  perspective: 'consultant',
  fonts: {
    primary: '',
    secondary: '',
  },
};

export function getDefaultConfigPath(): string {
  if (process.env.FORGE_CONFIG_PATH) {
    return process.env.FORGE_CONFIG_PATH;
  }
  return join(homedir(), '.signal-forge', 'config.json');
}

export function loadConfig(): ForgeConfig {
  const configPath = getDefaultConfigPath();

  if (!existsSync(configPath)) {
    if (!DEFAULT_CONFIG.author) {
      console.warn('[signal-forge] No configuration found. Run `forge init` to set up your author, persona, and company.');
    }
    return { ...DEFAULT_CONFIG };
  }

  try {
    const rawConfig = readFileSync(configPath, 'utf-8');
    const userConfig = JSON.parse(rawConfig);

    // Deep merge logic (simplified for this depth)
    return {
      ...DEFAULT_CONFIG,
      ...userConfig,
      fonts: {
        ...DEFAULT_CONFIG.fonts,
        ...(userConfig.fonts || {}),
      },
      memory: {
        ...(userConfig.memory || {}),
      }
    };
  } catch (error) {
    console.warn(`[WARNING] Failed to parse config file at ${configPath}. Using defaults.`);
    console.warn(`Error: ${(error as Error).message}`);
    return { ...DEFAULT_CONFIG };
  }
}

export function saveConfig(config: ForgeConfig): void {
  const configPath = getDefaultConfigPath();
  const dir = dirname(configPath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');
}

export function createDefaultConfig(): void {
  const configPath = getDefaultConfigPath();
  const dir = dirname(configPath);

  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  if (!existsSync(configPath)) {
    const initConfig: ForgeConfig = {
      ...DEFAULT_CONFIG,
      author: 'Your Name',
      persona: 'your role or title',
      company: 'Your Company',
    };
    writeFileSync(configPath, JSON.stringify(initConfig, null, 2), 'utf-8');
    console.log(`Created default configuration at ${configPath}`);
    console.log('Edit this file to set your author, persona, and company.');
  } else {
    console.log(`Configuration already exists at ${configPath}`);
  }
}

export function configExists(): boolean {
  return existsSync(getDefaultConfigPath());
}
