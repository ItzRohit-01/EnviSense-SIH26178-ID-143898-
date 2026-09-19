---
name: Lumina Commerce
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#464555'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 36px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style
The design system is engineered for a premium e-commerce experience that balances the technical precision of a fintech platform with the approachable elegance of modern retail. The brand personality is authoritative yet welcoming, focusing on clarity, trust, and frictionless transactions.

The visual style follows a **Corporate / Modern** aesthetic with subtle **Glassmorphism** influences for secondary overlays. It prioritizes high legibility, generous whitespace, and a sophisticated use of depth to guide the user's focus toward conversion points and product imagery.

## Colors
The palette is anchored by **Deep Indigo**, a color that evokes stability and modern technology. 

- **Primary:** Used for main actions, active states, and brand signifiers.
- **Secondary:** A sophisticated Slate Gray used for sub-navigation, supporting text, and icon strokes.
- **Backgrounds:** Light mode utilizes a layered approach with Pure White (#FFFFFF) for cards and Off-White (#F8FAFC) for page backgrounds. Dark mode transitions to a Deep Slate (#0f172a).
- **Accents:** High-saturation semantic colors ensure that system feedback (success, errors) is immediately recognizable and meets AA accessibility standards.

## Typography
This design system utilizes **Inter** exclusively to achieve a clean, systematic feel. The type hierarchy is built on a tight scale to maintain density for data-rich admin views while allowing for expressive headers in customer-facing storefronts.

Large display styles use negative letter-spacing to appear more cohesive, while small labels use increased tracking for legibility at small sizes. All line heights are optimized for a baseline grid to ensure vertical rhythm.

## Layout & Spacing
The layout is based on a **Fluid Grid** system with a strict **8px spacing rhythm**. 

- **Desktop (1280px+):** 12-column grid, 24px gutters, 32px side margins. Content max-width is capped at 1440px for readability.
- **Tablet (768px - 1279px):** 8-column grid, 24px gutters, 24px side margins.
- **Mobile (0px - 767px):** 4-column grid, 16px gutters, 16px side margins. 

Containers use padding increments of 8px (e.g., 16, 24, 32) to maintain alignment. Component spacing relies on the `base` unit to ensure developer predictability.

## Elevation & Depth
Depth is created through **Ambient Shadows** and tonal layering. 

- **Flat Layer:** Default page background.
- **Elevated (Level 1):** Subtle 1px border (#e2e8f0) with a soft shadow (0 1px 3px rgba(0,0,0,0.1)). Used for standard product cards.
- **Raised (Level 2):** More pronounced shadow (0 4px 6px rgba(0,0,0,0.05)). Used for hover states on interactive cards and dropdown menus.
- **Overlay (Level 3):** High-diffused shadow (0 20px 25px rgba(0,0,0,0.1)) with a 20px backdrop blur. Used for modals and flyout carts to separate them from the primary interface.

## Shapes
The shape language is modern and approachable. All primary containers and buttons use a base **8px (0.5rem)** radius. Secondary elements like large product banners or hero sections use the **rounded-xl (24px)** setting to create a softer, more premium look. Interactive small elements like checkboxes or tags utilize a smaller **4px** radius to maintain visual sharpness.

## Components
- **Buttons:** Primary buttons feature a subtle vertical gradient (Indigo-600 to Indigo-500) and a 1px inner border for a tactile feel. Hover states should include a brightness increase of 5% and a slight lift (Level 2 shadow).
- **Inputs:** Text fields use a 1px neutral-300 border that transitions to a 2px Indigo border on focus, accompanied by a soft indigo glow (shadow).
- **Cards:** Product cards are white with a 1px border. On hover, the border color remains the same but the elevation increases to Level 2.
- **Chips/Badges:** Used for stock status or categories. They should use low-opacity versions of the status colors (e.g., Success Green at 10% opacity) with high-contrast text.
- **Lists:** Use 1px horizontal dividers (#f1f5f9). Interactive list items should have a transparent background that transitions to Neutral-100 on hover.
- **Progress Indicators:** Use thin, 4px height bars with rounded caps for step-based checkouts.