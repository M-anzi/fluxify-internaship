# Design System Guide

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| **Primary** | `#2563EB` | Main buttons, links, primary actions |
| **Secondary** | `#F9FAFB` | Backgrounds, cards, neutral elements |
| **Accent** | `#F59E0B` | Highlights, warnings, secondary buttons |
| **Background** | `#F9FAFB` | Page background |
| **Text** | `#111827` | Main text content |

## Typography

- **Primary Font**: Roboto
- **Secondary Font**: Open Sans
- **Fallback**: Arial

Fonts are automatically loaded from Google Fonts in `index.css`.

## CSS Utilities

Ready-to-use Tailwind components defined in `index.css`:

```jsx
// Primary Button (Blue)
<button className="btn-primary">Click Me</button>

// Secondary Button (Light Gray)
<button className="btn-secondary">Secondary</button>

// Accent Button (Orange)
<button className="btn-accent">Action</button>

// Headings
<h1 className="heading-primary">Main Title</h1>
<h2 className="heading-secondary">Subtitle</h2>

// Text Variants
<p className="text-muted">Muted text</p>
```

## Usage Examples

### Applying Colors in Components

**Tailwind Classes:**
```jsx
// Use custom color names
<div className="bg-primary text-white">Primary Section</div>
<div className="bg-secondary border border-gray-300">Card</div>
<button className="bg-accent hover:opacity-90">Action Button</button>
<p className="text-text">Dark text</p>
```

**CSS Variables (if using index.css):**
```jsx
<div style={{ backgroundColor: '#2563EB', color: '#FFFFFF' }}>
  Primary Themed
</div>
```

## Quick Reference

```
Background Color: #F9FAFB
Text Color: #111827
Primary Action (Buttons): #2563EB (Blue)
Secondary/Neutral: #F9FAFB (Light Gray)
Highlights/Warnings: #F59E0B (Amber/Orange)
```

## Tailwind Config

All custom colors are configured in `tailwind.config.js`:

```js
colors: {
  primary: '#2563EB',
  secondary: '#F9FAFB',
  accent: '#F59E0B',
  background: '#F9FAFB',
  text: '#111827',
  dark: '#111827',
}
```

Use them anywhere in your components with Tailwind's utility classes!
