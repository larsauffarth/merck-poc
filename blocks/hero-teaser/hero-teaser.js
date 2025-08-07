/**
 * Decorates the hero-teaser block
 * @param {Element} block The hero-teaser block element
 */
export default function decorate(block) {
  // Check if this is a news variant
  if (block.classList.contains('news')) {
    // Find the second div (content column)
    const contentDiv = block.querySelector('div > div:nth-child(2)');
    
    if (contentDiv) {
      // Collect all H2 elements from the entire page
      const h2Elements = document.querySelectorAll('h2');
      
      if (h2Elements.length > 0) {
        // Create a new paragraph for the anchor links
        const linksContainer = document.createElement('p');
        linksContainer.className = 'news-anchor-links';
        
        // Convert H2s to anchor links
        h2Elements.forEach((h2, index) => {
          // Create or use existing ID for the H2
          let h2Id = h2.id;
          if (!h2Id) {
            // Generate ID from text content if none exists
            h2Id = h2.textContent
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');
            h2.id = h2Id;
          }
          
          // Create anchor link
          const link = document.createElement('a');
          link.href = `#${h2Id}`;
          link.textContent = h2.textContent;
          link.className = 'news-anchor-link';
          
          // Add link to container
          linksContainer.appendChild(link);
          
          // Add separator between links (except for the last one)
          if (index < h2Elements.length - 1) {
            const separator = document.createElement('span');
            separator.textContent = ' | ';
            separator.className = 'news-link-separator';
            linksContainer.appendChild(separator);
          }
        });
        
        // Append the links container as the third paragraph
        contentDiv.appendChild(linksContainer);
      }
    }
  }
}
