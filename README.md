# weird-ui
Reusable React UI components powered by GSAP, shadcn primitives, and Tailwind CSS.

## Install
```bash
npm install weird-ui
```

## Usage
Import the bundled stylesheet once in your app root, then use components.

```tsx
import 'weird-ui/styles.css';
import { Button, GlassButton } from 'weird-ui';

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
