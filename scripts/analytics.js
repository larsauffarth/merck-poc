import {getMetadata} from "./aem.js";

const DEV_LAUNCH_SCRIPT = "https://assets.adobedtm.com/b5a2629b807e/d0efdbcb4d5a/launch-4237def7f3de-development.min.js";
const STAGING_LAUNCH_SCRIPT = "https://assets.adobedtm.com/b5a2629b807e/d0efdbcb4d5a/launch-2deabcd6f062-staging.min.js";
const PROD_LAUNCH_SCRIPT = "https://assets.adobedtm.com/b5a2629b807e/d0efdbcb4d5a/launch-dae9a5df2b25.min.js";


const pushAnalytics = (data) => {
    window.adobeDataLayer = window.adobeDataLayer || [];
    window.adobeDataLayer.push(data);

    console.info('adobeDataLayer', window.adobeDataLayer);
};
const language = navigator.language || navigator.userLanguage;
const countryCode = language.split('-')[1];
const pageName = document.title;
const today = new Date();
const formatted = `${today.getDate().toString().padStart(2, '0')}/${
  (today.getMonth() + 1).toString().padStart(2, '0')
}/${today.getFullYear()}`;

const initializeAdobeDataLayer = () => {
    const theme = getMetadata('theme');
    const mkgDL = {
        page: {
            brand: theme || "",
            contentLevel: "",
            contentTopic: "",
            contentType: "",
            pageType: "",
            hierarchy: "",
            name: "",
            publishDate: formatted || ""
        },
        site: {
            country: countryCode || "",
            language: language || "",
            name: pageName,
            sector: "",
            owner: ""
        }
    };

    pushAnalytics(mkgDL);
};

/**
 * Initializes click analytics tracking for elements within the `.video-container` class.
 *
 * This function binds click event listeners to elements within `.video-container` that are
 * not already bound. When an element is clicked, it prevents the default event propagation
 * and pushes analytics data with `linkName` and `linkUrl` based on the video properties
 * within the container.
 *
 * The function ensures that each element is only bound to the click handler once by
 * utilizing a `data-analytics-bound` attribute.
 */
const videoTrackingEvents = () => {
    // Setup Tracking on Video Elements
    const videoContainer = document.querySelectorAll('.custom-play-pause');
    videoContainer.forEach((element) => {
        const videoContainer = element.closest('.video-container');
        const videoElement = videoContainer.querySelector('video');
        const linkName = videoElement ? videoElement.getAttribute('poster') : 'Unknown Video';
        const linkUrl = videoElement ? videoElement.querySelector('source').getAttribute('src') : 'Unknown URL';

        if (!element.dataset.analyticsBound) {
            element.addEventListener('click', (event) => {
                event.stopPropagation();
                const action = videoElement.paused ? 'pause' : 'play';
                pushAnalytics({event: 'linkClicks', state: {linkName, linkUrl, action}});
            });
            element.dataset.analyticsBound = true; // Mark as bound
        }
    });
};

/**
 * Dynamically appends a script tag to the document's head with a source
 * URL based on the current hostname. If the hostname includes 'adobe.com',
 * the script source is set to the production launch script URL. Otherwise,
 * the development launch script URL is used. The script is added asynchronously.
 */
const addLaunchScript = () => {
    const source = window.location.hostname.includes('adobe.com')
        ? PROD_LAUNCH_SCRIPT
        : DEV_LAUNCH_SCRIPT;
    const script = document.createElement('script');
    script.src = source;
    script.async = true;
    document.head.appendChild(script);
};

export {initializeAdobeDataLayer, videoTrackingEvents, addLaunchScript};
