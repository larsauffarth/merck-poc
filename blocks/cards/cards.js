import {createOptimizedPicture} from '../../scripts/aem.js';
import { videoTrackingEvents } from '../../scripts/analytics.js';
import {createVideoElement, isVideoUrl, replaceControls} from '../../scripts/video.js';

function createCardStructure(block) {
    /* change to ul, li */
    const ul = document.createElement('ul');
    [...block.children].forEach((row) => {
        const li = document.createElement('li');
        while (row.firstElementChild) li.append(row.firstElementChild);
        [...li.children].forEach((div) => {
            if (div.children.length === 1 && div.querySelector('picture')) {
                div.className = 'cards-card-image';
            } else {
                div.className = 'cards-card-body';
            }
        });
        ul.append(li);
    });
    return ul;
}

export default function decorate(block) {
    const isVideo = block.classList.contains('video');
    if (isVideo) return createVideoCards(block);

    const ul = createCardStructure(block);

    ul.querySelectorAll('picture > img')
        .forEach((img) => img.closest('picture')
            .replaceWith(createOptimizedPicture(img.src, img.alt, false, [{width: '750'}])));
    block.textContent = '';
    block.append(ul);
}

function createVideoCards(block) {
    const ul = createCardStructure(block);

    ul.querySelectorAll('li').forEach((li) => {
        let posterImage = null;
        let videoUrl = null;

        const imageDiv = li.querySelector('.cards-card-image');
        const bodyDiv = li.querySelector('.cards-card-body');

        if (imageDiv) {
            posterImage = imageDiv.querySelector('picture > img');
        }

        if (bodyDiv) {
            // Find the first anchor element with a video mimetype URL
            const videoLink = bodyDiv.querySelector('a[href]');
            if (videoLink && isVideoUrl(videoLink.href)) {
                videoUrl = videoLink.href;
                videoLink.remove();
            }
        }

        // Create video element if we have both poster and video URL
        if (posterImage && videoUrl && imageDiv) {
            // Replace the image div with video container
            imageDiv.replaceWith(createVideoElement(posterImage, videoUrl));
        }
    });

    block.textContent = '';
    block.append(ul);

    replaceControls(block);
    videoTrackingEvents();
}
