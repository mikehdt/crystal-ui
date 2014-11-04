* **1.0.0** Initial release

* **1.0.1** Minor type update (no impact on functionality)

* **1.1.0** New options
    * Enable an Android fix for whitespace
    * Use floats instead of inline blocks

* **1.2.0** Code tidying, new options, media query helper
    * New logic choice `$use-logic` (replaces the `$use-float` option) to generate tables
    * Reorganised the config
    * Tidied up the demo file naming and added a demo with tables
    * Added a new mixin `media-query` to let you easily use the grid system breakpoints in your SCSS

* **2.0.0β12** Logic rewrite, split logic into separate partials, lots of fixes and new features
    * Tidied up the core, rewrote a fair bit of logic, split logic into partials
    * Can now generate individual ratios e.g., "3-7" instead of having to generate all sevenths
    * Reversible modifier now uses a helper class for child elements to avoid CSS bloat with silent classes
    * Can have the breakpoint name as a prefix or a suffix
    * Greater configurability of naming of classes
    * Lots of little tweaks and under-the-hood improvements

* **2.0.0β13** Bug fix, commenting tidy
    * Fix generation of single ratios where the numerator or denominator were greater than 9
    * Tidy up commenting a little, simplify the base Sorcery file example