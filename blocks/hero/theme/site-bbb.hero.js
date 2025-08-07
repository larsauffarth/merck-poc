export async function decorateBBB(block) {
    const h1Element = block.querySelector('h1');
    const pElement = block.querySelector('p');

    // swap h1 and p, for demo purposes
    if (h1Element && pElement) {
        const placeholder = document.createElement('div');
        h1Element.parentNode.insertBefore(placeholder, h1Element);
        pElement.parentNode.insertBefore(h1Element, pElement);
        placeholder.parentNode.insertBefore(pElement, placeholder);
        placeholder.remove();
    }
}
