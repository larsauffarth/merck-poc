import {getMetadata} from '../../scripts/aem.js';
import {loadFragment} from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
const DEFAULT_FOOTER_PATH = '/footer';

/**
 * Determines the correct path for the footer fragment based on metadata.
 * @returns {string} The path to the footer fragment.
 */
function getFooterPath() {
    const footerMeta = getMetadata('footer');
    if (footerMeta) {
        return new URL(footerMeta, window.location).pathname;
    }

    const theme = getMetadata('theme');
    return theme ? `/${theme}/footer` : DEFAULT_FOOTER_PATH;
}

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
    const footerPath = getFooterPath();

    let fragment = await loadFragment(footerPath);
    if (!fragment && footerPath !== DEFAULT_FOOTER_PATH) {
        fragment = await loadFragment(DEFAULT_FOOTER_PATH);
    }

    // decorate footer DOM
    block.textContent = '';
    const footer = document.createElement('div');
    if (fragment) {
        footer.append(...fragment.children);
    }
    block.append(footer);
}
