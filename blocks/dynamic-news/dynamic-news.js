import { createOptimizedPicture, readBlockConfig } from '../../scripts/aem.js';

async function fetchQueryData() {
  try {
    const response = await fetch('/query-index.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching query data:', error);
    return [];
  }
}

function createCard(item) {
  const li = document.createElement('li');
  
  // Create image container
  if (item.image) {
    const imageDiv = document.createElement('div');
    imageDiv.className = 'dynamic-news-card-image';
    
    const picture = createOptimizedPicture(item.image, item.title || '', false, [{ width: '750' }]);
    imageDiv.append(picture);
    li.append(imageDiv);
  }
  
  // Create content container
  const bodyDiv = document.createElement('div');
  bodyDiv.className = 'dynamic-news-card-body';
  
  // Add title
  if (item.title) {
    const titleElement = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.href = item.path;
    titleLink.textContent = item.title;
    titleElement.append(titleLink);
    bodyDiv.append(titleElement);
  }
  
  // Add description
  if (item.description) {
    const descElement = document.createElement('p');
    descElement.textContent = item.description;
    bodyDiv.append(descElement);
  }
  
  li.append(bodyDiv);
  return li;
}

export default async function decorate(block) {
  try {
    // Read block configuration (e.g., limit, filter) BEFORE altering DOM
    const config = readBlockConfig(block);
    
    // Show loading state
    block.innerHTML = '<p>Loading cards...</p>';
    const rawLimit = Number.parseInt(config.limit, 10);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : null;
    const filterValue = (config.filter || '').toString().toLowerCase().trim();

    // Fetch data from query-index.json
    const items = await fetchQueryData();
    
    // Clear loading state
    block.innerHTML = '';
    
    if (items.length === 0) {
      block.innerHTML = '<p>No cards found.</p>';
      return;
    }
    
    // Apply filtering by category (case-insensitive substring match)
    let processedItems = items;
    if (filterValue) {
      processedItems = processedItems.filter((item) => {
        const category = item.category;
        if (!category) return false;
        if (Array.isArray(category)) {
          return category.join(',').toLowerCase().includes(filterValue);
        }
        return category.toString().toLowerCase().includes(filterValue);
      });
      // If filter yields no results, disregard the filter
      if (processedItems.length === 0) {
        processedItems = items;
      }
    }

    // Sort by lastModified desc (newest first)
    processedItems.sort((a, b) => {
      const aTime = Number.parseInt(a.lastModified, 10) || 0;
      const bTime = Number.parseInt(b.lastModified, 10) || 0;
      return bTime - aTime;
    });

    // Apply limit if provided
    if (limit) {
      processedItems = processedItems.slice(0, limit);
    }

    if (processedItems.length === 0) {
      block.innerHTML = '<p>No cards found.</p>';
      return;
    }

    // Create the cards list
    const ul = document.createElement('ul');
    
    // Adjust layout based on number of items (1, 2, 3)
    const existingLayouts = ['layout-1', 'layout-2', 'layout-3'];
    existingLayouts.forEach((cls) => block.classList.remove(cls));
    const count = processedItems.length;
    if (count === 1) block.classList.add('layout-1');
    else if (count === 2) block.classList.add('layout-2');
    else if (count === 3) block.classList.add('layout-3');

    processedItems.forEach((item) => {
      const card = createCard(item);
      ul.append(card);
    });
    
    block.append(ul);
    
  } catch (error) {
    console.error('Error creating query cards:', error);
    block.innerHTML = '<p>Error loading cards. Please try again later.</p>';
  }
}