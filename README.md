# weird-ui
Reusable React UI components powered by GSAP, shadcn primitives, and Tailwind CSS.

## Install
Install directly from GitHub:
```bash
npm install git+https://github.com/carincon93/weird-ui.git
```

### Tailwind CSS Configuration
Since Tailwind CSS v4 is CSS-first, you no longer need a `tailwind.config.js`. Instead, add the library's source files to your CSS using the `@source` directive so the styles are generated:

```css
@import "tailwindcss";
/* Scan the library for used classes */
@source "../node_modules/@carincon93/weird-ui/src/**/*.{js,ts,jsx,tsx}";
```

## Usage
There are two ways to consume the styles:

### Option 1: CSS Import (Easiest)
Import the bundled stylesheet once in your app root. This is the simplest way to get started.

```tsx
import '@carincon93/weird-ui/styles.css';
import { Button, GlassButton } from '@carincon93/weird-ui';
```

### Optimized Tailwind CSS Integration (Optional)
If you are already using Tailwind CSS v4 in your project, you can scan the library's source instead of importing the full CSS file. This allows Tailwind to deduplicate styles and keep your bundle small:

1. Skip importing `@carincon93/weird-ui/styles.css`.
2. Add the library to your CSS using `@source`:

```css
@import "tailwindcss";

/* Scan the library for used classes */
@source "../node_modules/@carincon93/weird-ui/src/**/*.{js,ts,jsx,tsx}";
```

## Development
```bash
npm install
npm run build
```
