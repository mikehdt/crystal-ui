# Sorcery Grids

**A highly configurable, Sass-based, responsive grid system based on [CSS Wizardry Grids](http://csswizardry.com/csswizardry-grids/)**

* Fully responsive
* Mobile first option
* Infinitely nestable
* Reversible / re-orderable grids
* With / without gutters
* Focus on clean, quick, readable code
* Endless possible combinations -- literally!
* Generate any ratios you desire, and only generate ones you need
* Can use Sass @extend-friendly classes to keep your HTML simple
* No need for `.clear` or `.last` classes

## Browser Support

Sorcery Grids are compatible with all modern desktop browsers and modern mobile browsers which have support for `display: inline-block;` and CSS *rem* units. Out of the box, the minimum IE supported version is IE9, however it is absolutely possible to bake in IE7/8 support, with use of appropriate polyfills as needed.

Note that at the moment, Android 4.2 and below have issues with the use of white space and REM units. There are some possible workarounds being considered.

## Demo

Some demo files are included with the system. These are fairly simple for the time being, but it's anticipated they'll grow over time.

## Setup

If you can use Sass, you can use Sorcery Grids. There's only one file to include. For flexibility, it's recommended you override the configuration in your own Sass files. You can see the demo files for an example of this.

## Usage

Sorcery Grids is simple to implement and its classes are human-readable. You can also configure it to your preferences. By default, it uses classes of the form `.sg-1-4` for a one quarter width grid. However you can certainly configure it to generate more CSS Wizardry Grids-like names. If you really like CSS Wizardry Grids naming, change `$namespace` to "grid", set `$use-grid-namespace` to false and set `$use-ratio-names` to true -- that will instead generate names like `.one-quarter`. There are limits with this setup, as name classes only exist up to twelfths. Just in case.

Setting up the breakpoints is probably the most complex part, so check out the demos to see how they work. Unlike CSS Wizardry Grids where the available ratios are halves, thirds, quarters, fifths, sixths, eighths, tenths and twelfths, Sorcery Grids has a logic core that lets you dynamically generate any ratio sets you want. Feel like sevenths? Let it make them for you. Want to use seventeenths for some reason? Nothing stopping you. Also unlike CSS Wizardry Grids, Sorcery Grids will only generate those ratio sets you request. Keeps things neat.

I find that when developing, using static classes straight in HTML is a fast way to prototype, but I also later might want to consolidate things down using silent classes. Whether static or silent, the tradeoff is either complexity in HTML, or complexity in CSS. However when you want to swap, if it's either static OR silent, you have to change all your `.names` to `%names`, a tedious process. Sorcery Grids lets you get around this by developing initially with static, having both static and silent turned on as you go, and then later you can just turn off static generation to keep your resulting code clean.

An area where the grid system does differ in behaviour from CSS Wizardry Grids is in the push and pull classes. In CSS Wizardry Grids, push and pull use CSS left and right, whereas in Sorcery that results in margin-left and margin-right. If you need left and right offsetting, the shift and unshift modifiers will be what you're after (That seemed the most appropriate name for them).

There are also some differences in how nesting is approached, as well as guttering.

### Patterns

Sorcery Grid classes are based on [a modified BEM
syntax](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) with a slight bending of the rules when using numeric fractions, to keep name complexity to a minimum.

* `.sg` is a **B**lock
* `.sg__item` is an **E**lement
* `.sg--rev` is a **M**odifier

Classes include your breakpoint namespaces (e.g. `.palm--sg-1-2`,
`.lap--sg-2-3` and so on); your push and pull classes (`.push--sg-1-3`,
`.pull--lap--sg-1-4` and so on); your regular classes (`.sg-1-10`,
`.sg-3-4` etc).

Knowing these patterns will allow you to create hundreds of different
combinations. A few examples:

    /**
     * Sets an item to be one half across all breakpoints.
     */
    .sg-1-2-half {}

    /**
     * Pushes an item one third of the way to the right across all breakpoints.
     */
    .push--sg-1-3 {}

    /**
     * Sets an item to be ten twelfths wide only at the desk breakpoint.
     */
    .lap--sg-10-12 {}

    /**
     * Pulls an item one half of the way to the left only at the palm breakpoint.
     */
    .pull--palm--sg-1-2 {}

Code styling can be a controversial topic, but I try to "blend in" with each language I write. That said, I like tabs for indentation, and spaces for alignment. Normally I like Allman-style bracing too - I find the extra space helps readability, but here I've kept things within a more CSS-like behaviour. You may have different preferences. That's fine too. Feel free to change things for yourself if you prefer.

### Classes in markup

If you are using traditional classes then an example, basic usage might look like this:

    <div class="sg">

        <div class="sg__item  sg-2-3  lap--sg-1-2  palm--sg-1">
            ...
        </div>

        <div class="sg__item  sg-1-3  lap--sg-1-2  palm--sg-1">
            ...
        </div>

    </div>

It’s as simple as that!

---

**No need for empty HTML comments!** 

I did feel this was an unfortunate shortcoming of the CSS Wizardry Grids, stemming from the way browsers treat whitespace when using `display: inline-block;`, which is not an issue when using systems that rely on floats. But there are some amazing things you can do with inline blocks that simply cannot be achieved with floats -- vertical alignment of neighbours for example. Or automaitcally centring a set of grid items that aren't taking up the full width.

Sorcery Grids gets around this by using CSS *rem*, or *root em* units. By setting the font size of grid containers to 0, and then resetting grid items to 1rem, white space is effectively negated. No need for blank comments littering your code, and no worries about integrating with a CMS that will create code you may not have precise control over.

There are some considerations with *rem* units, so just remember that any relative styling you add to a grid item must use either a fixed unit like *px* -- though that isn't recommended -- or *rem* units.

If you are supporting IE8, you can swap to em units and the negative letter spacing fix, and that is then fairly reliable. Add any polyfills like media query support or even *rem* unit support as needed.

---

### Sass’ silent classes

If you are using silent classes (`$use-silent-classes: true;`) then your HTML
might look like this:

    <div class="page">

        <div class="content">
            ...
        </div>

        <div class="sub-content">
            ...
        </div>

    </div>

…and your Sass, something like this:

    .page{
        @extend %sg;
    }
    
        .content,
        .sub-content{
            @extend %sg__item;
            @extend %lap--sg-1-2;
            @extend %palm--sg-1;
        }
    
        .content{
            @extend %sg-2-3;
        }
    
        .sub-content{
            @extend %sg-1-3;
        }

### Reversed grids (`.sg--rev{}`)

Sorcery, like CSS Wizardy Grids, has the option to reverse a set of grids; this means that the order you write your source and the order it renders are total opposites, for example:

    <div class="sg  sg--rev">

        <div class="main-content  sg__item  sg-2-3">
            I appear first in the markup, but render second in the page.
        </div>

        <div class="sub-content  sg__item  sg-1-3">
            I appear second in the markup, but render first in the page.
        </div>

    </div>

This is handy if you want to lay out your page a certain way visually but it would be advantageous to order the source differently, for example to aid accessibility (getting a screenreader to read more important content first).

### Grids and Gutters

Gutters are highly flexible in Sorcery Grids. You can have them either on or off by default, and you can optionally generate selective guttering classes. Going even further, you can choose to have gutter modifiers to create wider or thinner gutters on the same page. Check out the comments in the grid file for more information.

### Right-aligned grids (`.sg--right{}`)

If enabled, keep grids in their correct order, but have them flush right instead of left:

    <div class="sg  sg--right">

        <div class="sg__item  sg-1-4">
            I render first but start in the middle of the page.
        </div>

        <div class="sg__item  sg-1-4">
            I render second and appear at the very right edge of the page.
        </div>

    </div>

### Centred grids (`.sg--center{}`)

If enabled, you can centrally align your grids by simply using the `.sg--center` modifier:

    <div class="sg  sg--center">

        <div class="sg__item  sg-1-2">
            I’m in the middle!
        </div>

    </div>

### Vertically aligned grids (`.sg--[middle|bottom]{}`)

If enabled, you can vertically align your grids to each other by simply using the
`.sg--[middle|bottom]` modifiers:

    <div class="sg  sg--middle">

        <div class="sg__item  sg-1-2">
            I’m in the middle!
        </div>

        <div class="sg__item  sg-1-2">
            I’m in the middle!
        </div>

    </div>

### Credits

Sorcery Grids was written by Mike Hopkins, and based on the amazing work done by Harry Roberts of CSS Wizardry. I greatly respect the work that he has released, and many of the core logic ideas of Sorcery Grids come straight from the CSS Wizardry Grids code.

However, Sorcery Grids is by no means the perfect grid system. Feel free to take it and modify it, use bits from it, and learn from it. But most of all, have fun with it!