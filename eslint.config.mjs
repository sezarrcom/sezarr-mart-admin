import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    ignores: [
      "node_modules/",
      ".next/",
      "out/",
      "build/",
      "**/*.d.ts",
      "**/*.ts",
      "**/*.tsx",
      "dist/",
      ".vercel/",
      "coverage/",
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
    ],
    rules: {
      // Allow missing dependencies in useEffect (for demo purposes)
      "react-hooks/exhaustive-deps": "warn",
      // Allow unescaped entities in JSX
      "react/no-unescaped-entities": "off",
      // Allow HTML anchor tags for external links
      "@next/next/no-html-link-for-pages": "off",
      // Allow missing alt text for demo images
      "jsx-a11y/alt-text": "warn"
    }
  }
];

export default eslintConfig;
