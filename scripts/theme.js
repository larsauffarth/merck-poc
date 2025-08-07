import { getMetadata } from './aem.js';

/**
 * Loads a theme-specific CSS file into the document only if it has not been loaded already.
 *
 * @param {string} theme The name of the theme to load. It determines the CSS file to be applied.
 * @param {string} blockName The name of the block to load.
 * @return {void}
 */
export function loadThemeBlockCSS(theme, blockName) {
    const existingLink = document.querySelector(`link[data-${blockName}-theme="${theme}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `/blocks/${blockName}/theme/${theme}.${blockName}.css`;
    link.setAttribute(`data-${blockName}-theme`, theme);
    document.head.appendChild(link);
}

/**
 * Generic theme decoration utility that loads theme-specific CSS and calls theme decorators.
 * This function can be reused across all blocks that support theming.
 *
 * @param {Element} block The block element to decorate
 * @param {string} blockName The name of the block (e.g., 'hero', 'cards')
 * @param {Object} themeDecorators Object mapping theme names to decorator functions
 * @param {Function} [fallbackDecorator] Optional fallback decorator for when no theme is specified
 * @return {boolean} Returns true if theme decoration was applied, false if fallback was used
 */
export function decorateWithTheme(block, blockName, themeDecorators = {}, fallbackDecorator) {
    const theme = getMetadata('theme');
    
    if (theme) {
        loadThemeBlockCSS(theme, blockName);
        const decorator = themeDecorators[theme];
        
        if (decorator) {
            decorator(block);
            return true;
        } else {
            console.warn(`Unknown theme: ${theme} for block: ${blockName}`);
        }
    }
    
    // Call fallback decorator if provided and no theme was applied
    if (fallbackDecorator) {
        fallbackDecorator(block);
    }
    
    return false;
}
