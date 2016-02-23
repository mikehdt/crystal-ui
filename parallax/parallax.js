// Just a bit of doodling for now... :) Enjoy!

// Known issue: Safari is a bit derpy with performance of this effect

// Use: add attribute data-parallax to any element you would like to apply the
// parallax effect to. Ensure that its parent has overflow: hidden; and you're
// good to go! :)
//
// I'd also like to consider rewriting this into pure JS, not relying on jQ

'use strict';

var Parallax = (function(){
    let parallaxPosition  = 0,
        parallaxHeight    = 0,
        scrollPosition    = 0,
        parallaxRatio     = 0.7,
        parallaxDivision  = 16,
        extraSafetyScroll = 200,
        windowHeight      = 0,
        hasRAF            = window.requestAnimationFrame,
        // Only supports *one* item on the page at a time for now...
        $parallaxItem     = document.querySelector('.parallax'),
        // Throttle at 100ms / 60fps = 16.66666ms - I'm not convinced this is
        // the best approach, but let's just roll with it hey?
        setParallaxProxy = throttle(setParallaxPositionProxy, 16.66666),
        setParallax      = throttle(setParallaxPosition,      16.66666);

    // Only apply if a valid target exists and we support scrollY (modern only)
    if ($parallaxItem && typeof(window.scrollY) !== 'undefined') {
        window.onresize = getParallaxHeight;
        window.onscroll = (hasRAF) ? setParallaxProxy : setParallax;

        getParallaxHeight();

        (hasRAF) ? setParallaxPositionProxy() : setParallaxPosition();
    }

    function getParallaxHeight () {
        // Limitation; this only supports one height per page, but could
        // certainly be easily adapted to support more
        parallaxHeight = $parallaxItem.height;
        windowHeight = window.innerHeight;

        if (window.requestAnimationFrame) {
            setParallaxPositionProxy();
        }
        else {
            setParallaxPosition();
        }
    }

    function setParallaxPositionProxy () {
        window.requestAnimationFrame(setParallaxPosition);
    }

    function setParallaxPosition () {
        let scrollPosition = window.scrollY;

        if (scrollPosition - extraSafetyScroll >= parallaxHeight) {
            // Ignore, it's out of view
            return;
        }

        // Calculate the parallax position ratio
        parallaxPosition = Math.floor(scrollPosition * parallaxRatio) / parallaxDivision;

        // Bounds checking -- ensure the parallaxed image won't leave its
        // visual container. Is this needed? Maybe not, leaving here in case...
        // if (parallaxPosition >= parallaxHeight && parallaxPosition < scrollPosition) {
        //  parallaxPosition = parallaxHeight / parallaxDivision;
        // }
        // else if (parallaxPosition >= scrollPosition) {
        //  parallaxPosition = scrollPosition / parallaxDivision;
        // }

        // Apply
        // We're using translate3d here to try and get the browsers to use GPU
        // compositing where possible. Straight translateY doesn't seem to be
        // as well handled by Safari...
        $parallaxItem.style.transform = 'translate3d(0, '+ parallaxPosition +'rem, 0)';
    }


    // -----
    // Debounce support, ripped straight from Lodash, used to throttle parallax
    // requests so they don't over-tax the page rendering
    // This is a surprisingly important part of the performance, and also
    // happens to be a _huge_ chunk of code. But it's worth it, yeah?
    //
    // What would probably be a good idea, would be to trace the path needed and
    // whittle the code down to just that, rather than the more generalised
    // approach taken...
    var now = Date.now;

    function debounce(func, wait, options) {
      var args,
          maxTimeoutId,
          result,
          stamp,
          thisArg,
          timeoutId,
          trailingCall,
          lastCalled = 0,
          leading = false,
          maxWait = false,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = wait < 0 ? 0 : (+wait || 0);
      if (isObject(options)) {
        leading = !!options.leading;
        maxWait = 'maxWait' in options && Math.max(+options.maxWait || 0, wait);
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }

      function cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (maxTimeoutId) {
          clearTimeout(maxTimeoutId);
        }
        lastCalled = 0;
        maxTimeoutId = timeoutId = trailingCall = undefined;
      }

      function complete(isCalled, id) {
        if (id) {
          clearTimeout(id);
        }
        maxTimeoutId = timeoutId = trailingCall = undefined;
        if (isCalled) {
          lastCalled = now();
          result = func.apply(thisArg, args);
          if (!timeoutId && !maxTimeoutId) {
            args = thisArg = undefined;
          }
        }
      }

      function delayed() {
        var remaining = wait - (now() - stamp);
        if (remaining <= 0 || remaining > wait) {
          complete(trailingCall, maxTimeoutId);
        } else {
          timeoutId = setTimeout(delayed, remaining);
        }
      }

      function maxDelayed() {
        complete(trailing, timeoutId);
      }

      function debounced() {
        args = arguments;
        stamp = now();
        thisArg = this;
        trailingCall = trailing && (timeoutId || !leading);

        if (maxWait === false) {
          var leadingCall = leading && !timeoutId;
        } else {
          if (!maxTimeoutId && !leading) {
            lastCalled = stamp;
          }
          var remaining = maxWait - (stamp - lastCalled),
              isCalled = remaining <= 0 || remaining > maxWait;

          if (isCalled) {
            if (maxTimeoutId) {
              maxTimeoutId = clearTimeout(maxTimeoutId);
            }
            lastCalled = stamp;
            result = func.apply(thisArg, args);
          }
          else if (!maxTimeoutId) {
            maxTimeoutId = setTimeout(maxDelayed, remaining);
          }
        }
        if (isCalled && timeoutId) {
          timeoutId = clearTimeout(timeoutId);
        }
        else if (!timeoutId && wait !== maxWait) {
          timeoutId = setTimeout(delayed, wait);
        }
        if (leadingCall) {
          isCalled = true;
          result = func.apply(thisArg, args);
        }
        if (isCalled && !timeoutId && !maxTimeoutId) {
          args = thisArg = undefined;
        }
        return result;
      }
      debounced.cancel = cancel;
      return debounced;
    }

    function throttle(func, wait, options) {
      var leading = true,
          trailing = true;

      if (typeof func != 'function') {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      if (isObject(options)) {
        leading = 'leading' in options ? !!options.leading : leading;
        trailing = 'trailing' in options ? !!options.trailing : trailing;
      }
      return debounce(func, wait, { 'leading': leading, 'maxWait': +wait, 'trailing': trailing });
    }

    function isObject(value) {
      // Avoid a V8 JIT bug in Chrome 19-20.
      // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
      var type = typeof value;
      return !!value && (type == 'object' || type == 'function');
    }
})();