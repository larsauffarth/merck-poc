import { createOptimizedPicture } from '../../scripts/aem.js';

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
    
    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.title || '';
    img.loading = 'lazy';
    
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
  // Show loading state
  block.innerHTML = '<p>Loading cards...</p>';
  
  try {
    // Fetch data from query-index.json
    const items = await fetchQueryData();
    
    // Clear loading state
    block.innerHTML = '';
    
    if (items.length === 0) {
      block.innerHTML = '<p>No cards found.</p>';
      return;
    }
    
    // Create the cards list
    const ul = document.createElement('ul');
    
    items.forEach((item) => {
      const card = createCard(item);
      ul.append(card);
    });
    
    block.append(ul);
    
  } catch (error) {
    console.error('Error creating query cards:', error);
    block.innerHTML = '<p>Error loading cards. Please try again later.</p>';
  }
}