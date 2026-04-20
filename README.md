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
Import the bundled stylesheet once in your app root, then use components.

```tsx
import '@carincon93/weird-ui/styles.css';
import { Button, GlassButton } from '@carincon93/weird-ui';

export default function Example() {
  return (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button>shadcn Button</Button>
      <GlassButton>Glass Button</GlassButton>
    </div>
  );
}
```

## Development
```bash
npm install
npm run build
```
