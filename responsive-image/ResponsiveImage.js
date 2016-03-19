/*jshint browser: true */
/*jshint devel: true */
/*jshint globalstrict: true */

"use strict";

// Responsive Image script v1.0.0 by @mikehdt
// Written with ES2015 bits and pieces, so make sure you use a transpiler such
// as Babel if required...
//
// Usage
// -----
// Basic responsive images:
//     <img src="placeholder.png" class="ri"
//       data-images='{
//         "320" : "img-320.png",
//         "640" : "img-640.png",
//         "1280": "img-1280.png"
//       }' alt="Responsive Image">
//
// Note that "" is required for JSON, so '' are used to enclose the data-images
// attribute here.
//
// Then, in your main script when the DOM is ready:
//     import ResponsiveImage from './ResponsiveImage';
//     let responsiveImage = new ResponsiveImage('.ri');
//
// You can also supply sets of responsive images, effectively allowing you to
// swap the dimensions of responsive images on the fly, like <picture><source>:
//     <img src="placeholder.png" class="ri"
//       data-imagemap='{
//         "640": "square",
//         "641": "rectangle"
//      }'
//      data-images-square='{
//         "320": "square-1.jpg",
//         "640": "square-2.jpg"
//      }'
//      data-images-rectangle='{
//         "960" : "rectangle-1.jpg",
//         "1280": "rectangle-2.jpg
//      }' alt="Multiple Dataset Responsive Image">
//
// Future improvements: coalesce all Promises into one set, rather than using
// multiple handlers, add support for resizing image aspects before the image
// proper has loaded (ie., the placeholder image is being shown)

class ResponsiveImage {
    constructor (selector, lowerThreshold) {
        // 1. Ratio between 0 -> 1 of how much a lower-res image is allowed to
        //    scale before it decides to grab a higher res one
        this.elements = document.querySelectorAll(selector);
        this.lowerThreshold = lowerThreshold || 0.2; // [1]
        this.isRetinaDisplay = this.isRetinaDisplay();

        // If you intialise two RI classes, this will be doubled; consider a
        // way to improve this in the future (resizer be a separate singleton?)
        this.resizer = this.throttle(this.resizeImages, 250);

        // Add unloaded class to all elements initially (this may be also done
        // by hand to avoid excess reflow, so is a "just in case" here)
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].classList.add('ri--unloaded');
        }

        // Set up the event listener to .resize() and do an initial resize
        window.addEventListener('resize', this.resizer);

        this.resizeImages();
    }

    // From what I can tell, there's no "proper" or "reliable" way yet to
    // accurately detect a retina display's value, so we'll just set a boolean
    // for now. In the future, it may be worth revisitng this, to allow for
    // other ratio screens (for now, assume retina true = 2×)
    isRetinaDisplay () {
        if (window.matchMedia) {
            // Using matchMedia allows us to execute a CSS media query and
            // return the result, but it feels a bit... hacky
            const MQ = window.matchMedia('only screen and (min--moz-device-pixel-ratio: 1.3), only screen and (-o-min-device-pixel-ratio: 2.6/2), only screen and (-webkit-min-device-pixel-ratio: 1.3), only screen and (min-device-pixel-ratio: 1.3), only screen and (min-resolution: 1.3dppx)');
            return (MQ && MQ.matches || (window.devicePixelRatio > 1));
        }
        else if (window.devicePixelRatio) {
            // Older browser fallback
            return (window.devicePixelRatio > 1);
        }

        // Either not, or browser does not support this feature detect
        return false;
    }

    // Determine which sets of images we need
    getImageUrlData (el) {
        const elWidth = el.offsetWidth;

        if (!el.dataset.images && !el.dataset.imagemap) {
            // No valid image data set found
            this.imageLoadFailed(el);

            console.error('Element', el, 'does not have any data-images attribute');
            return false;
        }

        if (el.dataset.imagemap) {
            const IMAGE_MAP_DATASET = JSON.parse(el.dataset.imagemap),
                  IMAGE_MAP_WIDTH = this.calculateWidth(elWidth, IMAGE_MAP_DATASET, true, true);

            return JSON.parse(el.dataset['images'+ this.capitalizeFirstLetter(IMAGE_MAP_DATASET[IMAGE_MAP_WIDTH])]);
        }
        else {
            return JSON.parse(el.dataset.images);
        }
    }

    capitalizeFirstLetter (string) {
        if (typeof string === 'undefined') { return; }

        return string[0].toUpperCase() + string.slice(1);
    }

    // The main logic for RI
    resizeImages () {
        // @@@ future feature: consider combining all the promises and using
        //     Promise.all() to better handle things?
        [...this.elements].forEach(this.calculateImages, this);
    }

    // Determine widths by finding upper and lower bounds, then returning the
    // closest matching key value
    calculateWidth (testWidth, imgData, isMapTest = false) {
        let keyArray = Object.keys(imgData),
            lowerLimit = 0, upperLimit = 0, delta = 0;

        if (!isMapTest && this.isRetinaDisplay) { testWidth *= 2; }
        if (this.lowerThreshold !== 0) { testWidth += testWidth * this.lowerThreshold; }

        upperLimit = keyArray.findIndex((element, index, array) =>
            (testWidth < element || index === array.length - 1) ? true : false
        );

        lowerLimit = (upperLimit ===  0) ? 0 : upperLimit - 1;

        return (+keyArray[lowerLimit] === testWidth) ? keyArray[lowerLimit] : keyArray[upperLimit];
    }

    calculateImages (el, index, itemList) {
        // 1. See notes above for isRetinaDisplay() function
        let imgData = {},
            elWidth = el.offsetWidth,
            chosenWidth = 0;

        imgData = this.getImageUrlData(el);

        if (!imgData) { return; }

        chosenWidth = this.calculateWidth(elWidth, imgData);

        // Check if already loaded
        if (el.src === imgData[chosenWidth]) { return; }

        // Otherwise, load
        // As above, may consider reworking this to allow coalescing of Promises
        if (imgData[chosenWidth]) {
            let newImage = this.loadImage(imgData[chosenWidth]);

            newImage
                .then((img) => {
                    // If it's an <img> tag, replace the src, otherwise assume
                    // it's the background-image of an element
                    if (el.tagName.toLowerCase() === 'img') {
                        el.src = img.src;
                    }
                    else {
                        el.style.backgroundImage = 'url(' + img.src + ')';
                    }

                    this.imageLoadSuccess(el);
                })
                .catch((error) => {
                    console.error('RI promise failed', error);
                    this.imageLoadFailed(el);
                });
        }
        else {
            this.imageLoadFailed(el);
        }
    }

    loadImage (url) {
        return new Promise((resolve, reject) => {
            let img = new Image();

            img.onload = function imageLoadSuccess () {
                resolve(img);
            };

            img.onerror = function imageLoadError () {
                let errorMessage = 'Could not load image at ' + url;
                reject(new Error(errorMessage));
            };

            img.src = url;
        });
    }

    imageLoadSuccess (el) {
        el.classList.remove('ri--unloaded');
        el.classList.add('ri--loaded');
    }

    imageLoadFailed (el) {
        el.classList.remove('ri--unloaded');
        el.classList.add('ri--failed');
    }

    // Rate limiting
    throttle (theFunction, delay) {
        let timeout, lastTick = 0;

        // +(new Date) is forcing a number from the Date using unary +
        // Also, yay for fat arrow this context ;)
        return (...args) => {
            const NOW = +(new Date()),
                throttled = (...args) => {
                    lastTick = NOW;
                    theFunction.apply(this, args);
                };

            clearTimeout(timeout);

            if (NOW >= lastTick + delay) {
                throttled();
            }
            else {
                timeout = setTimeout(throttled, delay);
            }
        };
    }
}

export default ResponsiveImage;