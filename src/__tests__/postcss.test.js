/**
 * PostCSS Configuration Tests
 * Tests PostCSS configuration and Tailwind CSS integration
 */

import { describe, it, expect, beforeAll } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

describe('PostCSS Configuration', () => {
  let packageJson;
  let postcssConfig;

  beforeAll(() => {
    // Read package.json
    const packageJsonPath = path.join(projectRoot, 'package.json');
    packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Read PostCSS config
    const postcssConfigPath = path.join(projectRoot, 'postcss.config.js');
    postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');
  });

  describe('Dependencies', () => {
    it('should have @tailwindcss/postcss installed', () => {
      expect(packageJson.dependencies['@tailwindcss/postcss']).toBeDefined();
    });

    it('should have tailwindcss installed', () => {
      expect(packageJson.dependencies['tailwindcss']).toBeDefined();
    });

    it('should have postcss installed', () => {
      expect(packageJson.dependencies['postcss']).toBeDefined();
    });

    it('should have autoprefixer installed', () => {
      expect(packageJson.dependencies['autoprefixer']).toBeDefined();
    });
  });

  describe('PostCSS Configuration', () => {
    it('should use @tailwindcss/postcss plugin', () => {
      expect(postcssConfig).toContain('@tailwindcss/postcss');
    });

    it('should include autoprefixer plugin', () => {
      expect(postcssConfig).toContain('autoprefixer');
    });

    it('should not use deprecated tailwindcss plugin', () => {
      expect(postcssConfig).not.toContain('tailwindcss: {}');
    });
  });

  describe('Configuration Files', () => {
    it('should have tailwind.config.js', () => {
      const tailwindConfigPath = path.join(projectRoot, 'tailwind.config.js');
      expect(fs.existsSync(tailwindConfigPath)).toBe(true);
    });

    it('should have postcss.config.js', () => {
      const postcssConfigPath = path.join(projectRoot, 'postcss.config.js');
      expect(fs.existsSync(postcssConfigPath)).toBe(true);
    });

    it('should have vite.config.ts', () => {
      const viteConfigPath = path.join(projectRoot, 'vite.config.ts');
      expect(fs.existsSync(viteConfigPath)).toBe(true);
    });
  });

  describe('Scripts', () => {
    it('should have validate:postcss script', () => {
      expect(packageJson.scripts['validate:postcss']).toBeDefined();
    });

    it('should have setup:postcss script', () => {
      expect(packageJson.scripts['setup:postcss']).toBeDefined();
    });

    it('should have validate:all script', () => {
      expect(packageJson.scripts['validate:all']).toBeDefined();
    });
  });
});

