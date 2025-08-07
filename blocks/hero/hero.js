import {createVideoElement, isVideoUrl, replaceControls} from '../../scripts/video.js';
import {decorateAAA} from "./theme/site-aaa.hero.js";
import {decorateBBB} from "./theme/site-bbb.hero.js";
import {decorateWithTheme} from "../../scripts/theme.js";
import {videoTrackingEvents} from "../../scripts/analytics.js";

function createVideoHero(block) {
    // Prepare Text Section
    const textDiv = block.querySelector('div');
    textDiv?.classList.add('text');

    // Prepare Video Section
    // Find the first anchor element with a video mimetype URL
    let videoUrl = '';
    const videoLink = block.querySelector('a[href]');
    if (videoLink && isVideoUrl(videoLink.href)) {
        videoUrl = videoLink.href;
        videoLink.remove();
    }

    // Find first image in markup
    const posterImage = block.querySelector('picture > img');

    // Create Video Container and append
    const videoContainer = document.createElement('div');
    videoContainer.className = 'video-container';
    videoContainer.appendChild(createVideoElement(posterImage, videoUrl));
    block.append(videoContainer);

    // Remove original image from markup
    posterImage.remove();
    videoTrackingEvents();
}

function decorateDefaultHero(block) {
    const isVideo = block.classList.contains('video');
    if (isVideo) {
        createVideoHero(block);
        replaceControls(block); // Call enhanceVideos with the block parameter
    }

    const h1 = block.querySelector('h1');
    if (!h1) return;

    // set aria role to subtitle
    const subtitle = h1.previousElementSibling;
    if (subtitle) {
        subtitle.setAttribute('aria-role', 'doc-subtitle');
    }
}

export default async function decorate(block) {
    const themeDecorators = {
        'site-aaa': decorateAAA,
        'site-bbb': decorateBBB,
    };

    decorateWithTheme(block, 'hero', themeDecorators, decorateDefaultHero);
}
