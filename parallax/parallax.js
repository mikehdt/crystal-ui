// Just a bit of doodling for now... :) Enjoy!

// Known issue: Safari is a bit derpy with performance of this effect

// Use: add attribute data-parallax to any element you would like to apply the
// parallax effect to. Ensure that its parent has overflow: hidden; and you're
// good to go! :)

// Need to think upon this.

// Also, using some ES2015 features with the assumption of a browser that has
// native support.

'use strict';

// Closure because _get out of my kind of private stuff_ ;)
var Parallax = (function(){
    let parallaxStart     = [],
        parallaxHeight    = [],
        windowHeight      = 0,
        parallaxItems     = document.querySelectorAll('.parallax'),
        requestFrame      = window.requestAnimationFrame;

    // Only listen in if a valid parallax target exists
    if (parallaxItems) {
        // I wonder about using something cleaner here instead of () => ...
        window.addEventListener('resize', () => { throttle(requestFrame(getParallaxHeight), 500); });
        window.addEventListener('scroll', () => { throttle(requestFrame(setParallaxPosition), 60 / 100); });
        // ^^^ I can't believe that even with rAF, we still need to throttle :(

        requestFrame(getParallaxHeight);
    }

    function getParallaxHeight () {
        windowHeight = window.innerHeight;

        for (let i = 0; i < parallaxItems.length; ++i) {
            let parallaxItem = parallaxItems[i];

            // Get offset of element relative to page
            parallaxStart[i]  = parallaxItem.offsetTop - parallaxItem.scrollTop + parallaxItem.clientTop;
            parallaxHeight[i] = parallaxItem.height;
        }

        setParallaxPosition();
    }

    function setParallaxPosition () {
        // Older config... need to reimplement this...
        let parallaxRatio    = 0.7,
            parallaxDivision = 16;

        let scrollPosition   = window.scrollY,
            parallaxPosition = Math.floor(scrollPosition * parallaxRatio) / parallaxDivision;

        for (let i = 0; i < parallaxItems.length; ++i) {
            // Need to be more intelligent about this:
            // * Set it to above if above
            // * Set it to top if below
            // * And be mindful of its starting position!
            if (scrollPosition >= parallaxHeight[i]) {
                // Ignore, it's out of view
                continue;
            }

            // Bounds checking -- ensure the parallaxed image won't leave its
            // visual container. Is this needed? Probably?

            // Note: using translate3d here to try and get the browsers to use
            // GPU compositing where possible. Straight translateY doesn't seem
            // to be as well handled by Safari...
            parallaxItems[i].style.transform = 'translate3d(0, '+ parallaxPosition +'rem, 0)';
        }
    }

    function throttle (func, delay) {
        let timeout, lastTick = 0;

        // +(new Date) is forcing a number from the Date using unary +
        // Also, yay for fat arrow this context ;)
        return (...args) => {
            let now = +(new Date),
                throttled = (...args) => {
                    lastTick = now;
                    func.apply(this, args);
                };

            clearTimeout(timeout);
            (now >= lastTick + delay) ? throttled() : timeout = setTimeout(throttled, delay);
        }
    }
})();
