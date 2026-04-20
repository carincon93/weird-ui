# weird-ui
Reusable React UI components powered by GSAP, shadcn primitives, and Tailwind CSS.

## Install
Install directly from GitHub:
```bash
npm install git+https://github.com/carincon93/weird-ui.git
```

### Tailwind CSS Configuration
If you are using Tailwind CSS in your project, add the library's source files to your `content` array (or `source` in Tailwind v4) so the styles are generated:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@carincon93/weird-ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
}
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
