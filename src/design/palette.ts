/**
 * "Blocks" Flat Color System, Curated Chapter Palettes, Category Colors,
 * and WCAG 2.1 Contrast Verification Utilities.
 *
 * Strictly flat saturated color fields — zero gradients, zero glow, zero grain.
 */

import type { Category } from '../../contracts/data.js';
import type { PaletteTheme } from '../../contracts/story.js';

export type RGBTuple = [number, number, number];

export const CORE_COLORS = {
  ink: '#0F1214',
  bone: '#E4E0D7',
  paper: '#F1EDE5',
  ghostOnInk: '#141D2F',
  ghostOnBone: '#E2E8F0',
  emptyCell: '#172236',
  dimCell: '#111929',
  quietCell: '#1E2B42',
  ruleDark: '#26334D',
  ruleLight: '#CBD5E1',
  mutedTextOnInk: '#94A3B8',
  mutedTextOnBone: '#475569',
  solar: '#F0C454',
  rose: '#7DD3FC',
  olive: '#34D399',
  ember: '#FF7A5C',
  ochre: '#FBBF54',
  coral: '#F48FB1',
  lavender: '#A5B4FC',
  mint: '#6EE7B7',
  cobalt: '#60A5FA',
  lime: '#A3E635',
  cyan: '#38BDF8',
  peach: '#FDBA74',
} as const;

/**
 * Parse a 6-digit or 3-digit hex color string into an [R, G, B] tuple (0..255).
 */
export function hexToRgb(hex: string): RGBTuple {
  const clean = hex.replace(/^#/, '').trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0]! + clean[0]!, 16);
    const g = parseInt(clean[1]! + clean[1]!, 16);
    const b = parseInt(clean[2]! + clean[2]!, 16);
    return [r, g, b];
  }
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return [r, g, b];
}

/**
 * Convert an [R, G, B] tuple (0..255) to a #RRGGBB hex string.
 */
export function rgbToHex(rgb: Readonly<RGBTuple>): string {
  const clampByte = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return (
    '#' +
    clampByte(rgb[0]).toString(16).padStart(2, '0').toUpperCase() +
    clampByte(rgb[1]).toString(16).padStart(2, '0').toUpperCase() +
    clampByte(rgb[2]).toString(16).padStart(2, '0').toUpperCase()
  );
}

/**
 * Linearly interpolate between two RGB tuples.
 */
export function mixRgb(a: Readonly<RGBTuple>, b: Readonly<RGBTuple>, t: number): RGBTuple {
  const clamped = Math.max(0, Math.min(1, t));
  return [
    a[0] + (b[0] - a[0]) * clamped,
    a[1] + (b[1] - a[1]) * clamped,
    a[2] + (b[2] - a[2]) * clamped,
  ];
}

/**
 * Compute WCAG 2.1 relative luminance (0.0 for pure black, 1.0 for pure white).
 */
export function getRelativeLuminance(hexOrRgb: string | Readonly<RGBTuple>): number {
  const [r, g, b] = typeof hexOrRgb === 'string' ? hexToRgb(hexOrRgb) : hexOrRgb;
  const toLinear = (channel: number): number => {
    const sRGB = channel / 255;
    return sRGB <= 0.04045 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/**
 * Compute WCAG 2.1 contrast ratio between two colors (range 1.0 .. 21.0).
 */
export function getContrastRatio(
  fg: string | Readonly<RGBTuple>,
  bg: string | Readonly<RGBTuple>
): number {
  const l1 = getRelativeLuminance(fg);
  const l2 = getRelativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Verify whether a foreground/background pair meets WCAG AA contrast (default >= 4.5).
 */
export function meetsContrastAA(
  fg: string | Readonly<RGBTuple>,
  bg: string | Readonly<RGBTuple>,
  minRatio = 4.5
): boolean {
  return getContrastRatio(fg, bg) >= minRatio;
}

/**
 * Category metadata and high-contrast flat colors for all 17 canonical categories.
 * Every category color is chosen so that `getContrastRatio(color, CORE_COLORS.ink) >= 6.5`.
 */
export interface CategoryMeta {
  id: Category;
  label: string;
  shortLabel: string;
  color: string;
  rgb: RGBTuple;
  textColor: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  groceries: '#A3E635', // Chartreuse Sage
  'eating out': '#FF7A5C', // Burnished Coral
  takeaway: '#FDBA74', // Apricot Sand
  coffee: '#F0C454', // Sovereign Gold
  transport: '#A5B4FC', // Periwinkle Indigo
  travel: '#60A5FA', // Sovereign Azure
  shopping: '#F48FB1', // Rose Quartz
  fun: '#FDE068', // Warm Citrine
  subscriptions: '#38BDF8', // Electric Cyan
  bills: '#6EE7B7', // Seafoam Jade
  rent: '#C4B5FD', // Soft Violet
  health: '#86EFAC', // Fresh Sage
  gifts: '#FDA4AF', // Blush Coral
  fees: '#CBD5E1', // Cool Silver
  savings: '#5EEAD4', // Turquoise Mint
  transfers: '#94A3B8', // Slate Mist
  income: '#34D399', // Emerald Mint
};

export const CATEGORY_LABELS: Record<Category, string> = {
  groceries: 'Groceries',
  'eating out': 'Eating out',
  takeaway: 'Takeaway',
  coffee: 'Coffee',
  transport: 'Transport',
  travel: 'Travel',
  shopping: 'Shopping',
  fun: 'Fun',
  subscriptions: 'Subscriptions',
  bills: 'Bills',
  rent: 'Rent',
  health: 'Health',
  gifts: 'Gifts',
  fees: 'Fees',
  savings: 'Savings',
  transfers: 'Transfers',
  income: 'Income',
};

export const CATEGORY_META: Record<Category, CategoryMeta> = Object.fromEntries(
  (Object.keys(CATEGORY_COLORS) as Category[]).map((cat) => {
    const color = CATEGORY_COLORS[cat];
    return [
      cat,
      {
        id: cat,
        label: CATEGORY_LABELS[cat],
        shortLabel: CATEGORY_LABELS[cat].toUpperCase(),
        color,
        rgb: hexToRgb(color),
        textColor: CORE_COLORS.ink,
      },
    ];
  })
) as Record<Category, CategoryMeta>;

/**
 * 5-step jewel-toned intensity ramp for the 53×7 contribution grid (quiet -> peak):
 * Deep Slate -> Petrol Teal -> Refined Jade -> Sovereign Gold -> Crisp Alabaster.
 */
export const GRID_INTENSITY_STEPS_RGB: readonly RGBTuple[] = [
  hexToRgb('#172236'), // Step 0: Quiet / near-zero
  hexToRgb('#1E4E5F'), // Step 1: Low (Petrol Teal)
  hexToRgb('#2EA88B'), // Step 2: Medium (Refined Jade)
  hexToRgb(CORE_COLORS.solar), // Step 3: High (Sovereign Gold)
  hexToRgb(CORE_COLORS.bone), // Step 4: Loudest (Crisp Alabaster)
];

export const GRID_INTENSITY_STEPS_HEX: readonly string[] = GRID_INTENSITY_STEPS_RGB.map(rgbToHex);

/**
 * Compute the 0..4 intensity bucket for a day's spend relative to the p97 threshold.
 */
export function getIntensityBucket(spendMinor: number, p97Minor: number): 0 | 1 | 2 | 3 | 4 {
  if (spendMinor <= 0 || p97Minor <= 0) return 0;
  const v = Math.min(1, Math.sqrt(spendMinor / p97Minor));
  if (v < 0.14) return 0;
  if (v < 0.36) return 1;
  if (v < 0.6) return 2;
  if (v < 0.82) return 3;
  return 4;
}

/**
 * 9 Curated Executive Financial Palettes for Chapters.
 * Unified Midnight Obsidian (#0B111E) base canvas with distinct harmonious accent pairs.
 * Every foreground/background pair is verified to have WCAG contrast >= 6.5.
 */
export const PALETTES: Record<string, PaletteTheme> = {
  ink_solar: {
    id: 'ink_solar',
    name: 'Deep Obsidian & Champagne Gold',
    bg: '#0F1214',
    fg: '#E4E0D7',
    accent: '#F0C454',
    secondary: '#7DD3FC',
    muted: '#94A3B8',
    blocks: {
      primary: { bg: '#F0C454', fg: '#0F1214' },
      secondary: { bg: '#7DD3FC', fg: '#0F1214' },
      tertiary: { bg: '#FF7A5C', fg: '#0F1214' },
      quaternary: { bg: '#A5B4FC', fg: '#0F1214' },
    },
  },
  solar_ember: {
    id: 'solar_ember',
    name: 'Sovereign Gold & Burnished Coral',
    bg: '#0F1214',
    fg: '#E4E0D7',
    accent: '#F0C454',
    secondary: '#FF7A5C',
    muted: '#94A3B8',
    blocks: {
      primary: { bg: '#F0C454', fg: '#0F1214' },
      secondary: { bg: '#FF7A5C', fg: '#0F1214' },
      tertiary: { bg: '#7DD3FC', fg: '#0F1214' },
      quaternary: { bg: '#A5B4FC', fg: '#0F1214' },
    },
  },
  ink_rose: {
    id: 'ink_rose',
    name: 'Deep Obsidian & Glacier Sky',
    bg: '#0F1214',
    fg: '#E4E0D7',
    accent: '#7DD3FC',
    secondary: '#F0C454',
    muted: '#94A3B8',
    blocks: {
      primary: { bg: '#7DD3FC', fg: '#0F1214' },
      secondary: { bg: '#F0C454', fg: '#0F1214' },
      tertiary: { bg: '#6EE7B7', fg: '#0F1214' },
      quaternary: { bg: '#60A5FA', fg: '#0F1214' },
    },
  },
  paper_studio: {
    id: 'paper_studio',
    name: 'Champagne Paper & Burnished Coral',
    bg: '#0F1214',
    fg: '#E4E0D7',
    accent: '#E4E0D7',
    secondary: '#FF7A5C',
    muted: '#94A3B8',
    blocks: {
      primary: { bg: '#F1EDE5', fg: '#0F1214' },
      secondary: { bg: '#FF7A5C', fg: '#0F1214' },
      tertiary: { bg: '#34D399', fg: '#0F1214' },
      quaternary: { bg: '#F0C454', fg: '#0F1214' },
    },
  },
  olive_lime: {
    id: 'olive_lime',
    name: 'Emerald & Chartreuse Sage',
    bg: '#0F1214',
    fg: '#E4E0D7',
    accent: '#34D399',
    secondary: '#A3E635',
    muted: '#94A3B8',
    blocks: {
      primary: { bg: '#34D399', fg: '#0F1214' },
      secondary: { bg: '#A3E635', fg: '#0F1214' },
      tertiary: { bg: '#FBBF54', fg: '#0F1214' },
      quaternary: { bg: '#6EE7B7', fg: '#0F1214' },
    },
  },
  lavender_night: {
    id: 'lavender_night',
    name: 'Periwinkle Indigo & Rose Quartz',
    bg: '#0F1214',
    fg: '#E4E0D7',
    accent: '#A5B4FC',
    secondary: '#F48FB1',
    muted: '#94A3B8',
    blocks: {
      primary: { bg: '#A5B4FC', fg: '#0F1214' },
      secondary: { bg: '#F48FB1', fg: '#0F1214' },
      tertiary: { bg: '#F0C454', fg: '#0F1214' },
      quaternary: { bg: '#FF7A5C', fg: '#0F1214' },
    },
  },
  cobalt_bone: {
    id: 'cobalt_bone',
    name: 'Sovereign Azure & Champagne',
    bg: '#0F1214',
    fg: '#E4E0D7',
    accent: '#60A5FA',
    secondary: '#F0C454',
    muted: '#94A3B8',
    blocks: {
      primary: { bg: '#60A5FA', fg: '#0F1214' },
      secondary: { bg: '#E4E0D7', fg: '#0F1214' },
      tertiary: { bg: '#F0C454', fg: '#0F1214' },
      quaternary: { bg: '#6EE7B7', fg: '#0F1214' },
    },
  },
  crimson_ink: {
    id: 'crimson_ink',
    name: 'Burnished Coral & Warm Amber',
    bg: '#0F1214',
    fg: '#E4E0D7',
    accent: '#FF7A5C',
    secondary: '#FBBF54',
    muted: '#94A3B8',
    blocks: {
      primary: { bg: '#FF7A5C', fg: '#0F1214' },
      secondary: { bg: '#FBBF54', fg: '#0F1214' },
      tertiary: { bg: '#F0C454', fg: '#0F1214' },
      quaternary: { bg: '#E4E0D7', fg: '#0F1214' },
    },
  },
  mint_obsidian: {
    id: 'mint_obsidian',
    name: 'Seafoam Jade & Electric Cyan',
    bg: '#0F1214',
    fg: '#E4E0D7',
    accent: '#6EE7B7',
    secondary: '#38BDF8',
    muted: '#94A3B8',
    blocks: {
      primary: { bg: '#6EE7B7', fg: '#0F1214' },
      secondary: { bg: '#38BDF8', fg: '#0F1214' },
      tertiary: { bg: '#A5B4FC', fg: '#0F1214' },
      quaternary: { bg: '#F0C454', fg: '#0F1214' },
    },
  },
};

export const PALETTE_LIST: readonly PaletteTheme[] = Object.values(PALETTES);

/**
 * Retrieve a PaletteTheme by ID, falling back to `ink_solar` if unknown.
 */
export function getPaletteById(paletteId?: string): PaletteTheme {
  if (paletteId && PALETTES[paletteId]) {
    return PALETTES[paletteId]!;
  }
  return PALETTES.ink_solar!;
}
