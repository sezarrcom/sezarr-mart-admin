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
    rules: {
      // Allow 'any' type for mock data and API responses
      "@typescript-eslint/no-explicit-any": "warn",
      // Allow unused variables (for components under development)
      "@typescript-eslint/no-unused-vars": "warn",
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
