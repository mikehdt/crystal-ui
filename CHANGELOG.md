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
    * Tidy up commenting a little, simplify the base file

* **2.0.0β16** Small bugfixes, more tidying up, renamed and simplified a few config options
    * Fix direction of imprecision hack
    * Fix logic generation of default and fallback grid offsets of `none` or `clear`
    * Change ratio name selection to a string (rather than boolean)
    * Add new grid ratio size reset option
    * Allow breakpoints without grid sizings set

* **2.0.0β20** Remove float logic, remove unnecessary options, add customisable gutters
    * Float logic is not longer supported, to keep things sane
    * Some unnecessary configuration options removed
    * Reversible classes made separate to the naming scheme to avoid CSS over-compilation
    * New feature for customisable gutter widths - name them and make as many as you like
    * Name change to Crystal Grids

* **2.0.0β21** New movement modifier, bug fixes and tidy up
    * Change behaviour of unshift/shift to be positive/negative left margin
    * Add behaviours of push/pull to be positive/negative right margin
    * Address issue of embedded grids directly within grids
    * Fix demo file