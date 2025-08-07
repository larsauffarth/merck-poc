export default async function decorate(block) {
    let contentWrapper = block.querySelector('div > div');
    if (!contentWrapper) return;

    // Safety Check
    if (contentWrapper.children.length === 1 && contentWrapper.children[0].tagName === 'DIV') {
        contentWrapper = contentWrapper.children[0];
    }

    const elements = [...contentWrapper.children];
    if (elements.length === 0) return;

    const details = document.createElement('details');

    // Use the first paragraph as the summary if it exists
    const firstElement = elements[0];
    const summary = document.createElement('summary');

    if (firstElement && firstElement.tagName === 'P') {
        summary.innerHTML = firstElement.innerHTML;
        // Remove the first element from the list since it's now the summary
        elements.shift();
    } else {
        // Fallback summary if no paragraph found
        summary.textContent = 'Details';
    }

    // Construct Details Hierarchy
    details.appendChild(summary);
    elements.forEach(element => {
        details.appendChild(element);
    });

    // Replace the original content with the details element
    contentWrapper.innerHTML = '';
    contentWrapper.appendChild(details);
}
