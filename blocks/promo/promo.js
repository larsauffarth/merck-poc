import { getMetadata } from '../../scripts/aem.js';
import { decorateWithTheme, loadThemeBlockCSS } from '../../scripts/theme.js';

export default function decorate(block) {
  // Load optional per-theme promo CSS
  decorateWithTheme(block, 'promo', {});
  // Fallback to purple theme if no theme metadata is present
  const pageTheme = getMetadata('theme');
  if (!pageTheme) {
    loadThemeBlockCSS('purple', 'promo');
  }
}
