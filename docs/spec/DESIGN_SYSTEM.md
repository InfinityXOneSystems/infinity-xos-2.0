# Infinity X AI Design System

**Based on infinityxai.com homepage - use this as the brand package for the entire site.**

## Colors

### Primary Colors
- **Deep Blue Background**: `#020410` (base)
- **Neon Green**: `#39FF14` (primary accent, CTAs, success states)
- **Electric Blue**: `#0066FF` or `#3399FF` (secondary accent, links, highlights)

### Semantic Colors
- **Green** = Go / Success / Positive / Active
- **Yellow** = Caution / Medium / Warning
- **Red** = Stop / Danger / Negative / Error

### Gradients
- Background: Deep blue (#020410) with subtle blue-to-green gradient
- Text glow: Blue glow for "REDEFINED" and key headings
- Card backgrounds: `rgba(255, 255, 255, 0.05)` with backdrop blur

## Typography

### Fonts
- **Headings**: Orbitron (bold, uppercase for hero titles)
- **Body**: Inter or system font
- **Code/Mono**: JetBrains Mono

### Sizes & Styles
- Hero title: Very large, uppercase, with text glow effect
- Section headings: Orbitron, bold, electric blue or neon green
- Body text: White with 70-80% opacity for secondary text

## Components

### Glass-Panel Cards
```css
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}
```

### Buttons
- **Primary**: Neon green (#39FF14) background, black text, shadow glow
- **Secondary**: Electric blue (#3399FF) background, white text, shadow glow
- **Outline**: Transparent background, white/green border, hover glow

### Badges
- "System Online v4.2": White text, green dot, rounded pill, border
- Status indicators: Green dot for active, yellow for caution, red for error

### Mode Toggle
- Pill-shaped container with 3 options
- Selected: Neon green background with glow
- Unselected: Gray text, transparent background
- Description text below in green

## Animations

### Framer Motion
- Use `framer-motion` for all animations
- Fade in + slide up for content reveal
- Scale + glow on hover for interactive elements
- Smooth transitions (0.3-0.5s duration)

### Neural Network Canvas
- Animated particle network background
- Blue particles with connecting lines
- Subtle movement and pulsing

## Layout

### Spacing
- Generous padding and margins
- Centered content with max-width containers
- Vertical rhythm with consistent gaps

### Structure
- Hero section: Full viewport height, centered content
- Feature sections: Grid layout with glass-panel cards
- Footer: Minimal, dark background

## Wording Style

### Tone
- Bold, confident, futuristic
- Technical but accessible
- Action-oriented CTAs

### Examples
- "INTELLIGENCE REDEFINED"
- "Unleash Vision Cortex"
- "How easy do you want to make your life or business?"
- "We are building the neural architecture for the next generation of business"
- "Real-time data. Autonomous agents. Absolute clarity."

## Implementation Notes

- All pages should use the same deep blue background
- All cards should use glass-panel effect
- All headings should use Orbitron font
- All interactive elements should have hover animations
- All CTAs should use neon green or electric blue
- All status indicators should follow the traffic light system (green/yellow/red)
