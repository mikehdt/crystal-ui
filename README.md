# Crystal Grids 2.0.0β

**A highly configurable, fun, responsive grid system!**

Fully responsive, smallest screen or largest screen first, nestable, reversible / re-orderable grids. Generate any ratios you desire, and only generate ones you need. Designed for people who work on many projects with many different and complex designs.

It may seem like a daunting grid system simply due to its internal code; however the goal is to produce clean, reusable, friendly classes, and only those classes you need. It is for those people for whom a simple twelve column grid just isn't going to cut it, whilst at the same time keeping your CSS lean.

Of course, you should consider using floats, flexbox, grid layout etc. for situations where it would make sense to do so. Always use the best tool for the job.

## Browser Support

Crystal Grids are compatible with all modern desktop browsers and modern mobile browsers which have support for `display: inline-block;` and CSS *rem* units. Out of the box, the minimum IE supported version is IE9. You can hack in earlier support, if absolutely required.

Otherwise, all modern browsers, both mobile and desktop, are well supported. Note that the Android AOSP browser is considered legacy and may have quirks in Android versions prior to 4.4.

## Demo

The demos need some updating :) Check out the demo-1.html file to see what the system is capable of.

## Setup

If you can use Sass, you can use Crystal Grids. For flexibility, it's recommended you copy the configuration options you need out from the main grid file and change them there, rather than editing the grid system's file itself.

Internally I'm using a Grunt build script with grunt-postcss to handle auto-prefixing. However, I don't want to presume that I know how you prefer to build things. If you can build Sass, you can work with this system. I have only tested this with the official Sass compiler. Support for libsass is not tested at present.

## Usage

Crystal Grids is simple to implement and its classes are human-readable. You can also configure it to your preferences. By default, it uses classes of the form `.grid` for a grid container, which can contain any number of rows and columns inside it, and `.col-1-4` for a one quarter width column. However you can configure most of the naming to your liking. There are options for using words instead of numbers, changing the namespacing, and whether you prefer breakpoint names prefixed or suffixed.

Setting up the breakpoints is probably the most complex part, so check out the main source file and demos to see how they work. Crystal Grids has a logic core that lets you dynamically generate any ratio sets you want. Feel like sevenths? Let it make them for you. Want to use seventeenths for some reason? Nothing stopping you. Only need three fifths? Crystal Grids will only generate those ratios and ratio sets you request.

I find that when developing, using static classes straight in HTML is a fast way to prototype, but I also later might want to consolidate things down using silent classes. Whether static or silent, the tradeoff is either complexity in HTML, or complexity in CSS.

Depending on your working style, Crystal Grids lets you develop with static in HTML, setting up silent `@extend` classes as you go, with both static and silent turned on. Later you can turn off static generation to keep your resulting HTML code clean. It is not recommended to use both options on in a production setting.

Note that certain patterns can result in CSS over-generation when using `@extend`. It is recommended to only use extend with column ratios and modifiers, never the base grid container or columns themselves.

### Patterns

Crystal Grids' classes are based on [a modified BEM
syntax](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) with a slight bending of the rules when using numeric fractions, to keep name complexity to a minimum.

Classes include your breakpoint namespaces (e.g. `.col-1-2--s`, `.col-2-3--m` and so on); your push and pull classes (`.push--col-1-3`, `.pull--grid-1-4--m` and so on); your regular classes (`.grid-1-10`, `.grid-3-4` etc).

Code styling can be a controversial topic, but I try to "blend in" with each language I write. That said, I like tabs for indentation, and spaces for alignment.

### Classes in markup

If you are using traditional classes then an example, basic usage might look like this:

    <div class="grid">

        <div class="col  grid-1-2--m  grid-1-3--l">
            ...
        </div>

        <div class="col  grid-1-2--m  grid-2-3--l">
            ...
        </div>

    </div>

---

**No need for empty HTML comments! (With a few caveats)**

I did feel this was an unfortunate shortcoming of using `display: inline-block;` initially, as this is not an issue when using systems that rely on floats. There are some cool things you can do with inline blocks that simply cannot be achieved with floats - vertical alignment of neighbours for example. Or automatically centring a set of grid items that aren't taking up the full width. That means we need to deal with this whitespace problem *somehow*.

Crystal Grids gets around this by using CSS *rem*, or *root em* units. By setting the font size of grid containers to 0, and then resetting grid items to 1rem, whitespace is effectively negated. No need for blank comments littering your code, and no worries about integrating with a CMS that will create code you may not have precise control over.

There are some considerations with *rem* units, so just remember that any relative styling you add to a grid item must use either a fixed unit like *px* - though that isn't recommended - or *rem* units.

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
        @extend %grid;
    }

    .content,
    .sub-content{
        @extend %col;
        @extend %col-1-2;
    }

    .content{
        @extend %col-2-3--m;
    }

    .sub-content{
        @extend %col-1-3--m;
    }

Sass will intelligently generate and combine the definitions of just those classes which you need. Be careful though - the more silent `@extend`s you use, the larger the CSS will be. Crystal Grids attempts to mitigate this by requiring a few more helper-classes for some of the extended features. With gzipping server-side this is less of an issue, but it is one worth considering.

### Reversed grids `.rev`, `.rev-reset`

Crystal has the option to reverse a set of grids; this means that the order you write your source and the order it renders are total opposites, for example:

    <div class="grid  rev">

        <div class="col  col-2-3  rev-reset">
            I appear first in the markup, but render second in the page.
        </div>

        <div class="col  col-1-3  rev-reset">
            I appear second in the markup, but render first in the page.
        </div>

    </div>

This is handy if you want to lay out your page a certain way visually but it would be advantageous to order the source differently, for example to aid accessibility (getting a screenreader to read more important content first).

Note the use of `rev-reset` in the child classes. This was automatic version 1.0, but it caused some pretty severe code bloat if using silent classes. Version 2.0 requires the use of this helper class.

### Grids and Gutters

Gutters are highly flexible in Crystal Grids. You can have them either on or off by default, and you can optionally generate selective guttering classes. Going even further, you can choose to have gutter modifiers to create wider or thinner gutters on the same page. Check out the comments in the grid file for more information.

Note that if you use a custom gutter style at a lower breakpoint and then change the global setting at a higher one, you will need to also generate that custom gutter modifier at the higher setting or it will be overridden.

### Grid alignment `.align--[left|center|right]`

If enabled, you can use these classes to affect grid alignment, for example:

    <div class="grid  align--center">

        <div class="col  col-1-2">
            I’m in the centre!
        </div>

    </div>

    <div class="grid  align--right">

        <div class="col  col-1-4">
            I render first but start in the middle-ish of the page.
        </div>

        <div class="col  col-1-4">
            I render second and appear at the very right edge of the page.
        </div>

    </div>

### Vertically aligned grids `.align--[middle|bottom]`

If enabled, you can vertically align your grids to each other by simply using the `.align--[middle|bottom]` modifiers:

    <div class="grid  align--middle">

        <div class="col  col-1-2">
            I’m in the middle!
        </div>

        <div class="col  col-1-2">
            I’m in the middle!<br>
            Some extra height.
        </div>

    </div>

### Offsets

There are six different type of offsets that you can use. That may seem crazy, but each one is slightly different. `unshift` and `shift` will affect the left margin, positive and negative. `push` and `pull` affect the right margin, positive and negative. `left` and `right` explicitly adjust the left and right properties, allowing a column to move without affecting its neighbours.

### Credits

Crystal Grids was written by Mike Hopkins, originally based on the amazing work done by Harry Roberts of CSS Wizardry. The core of version 1.0 was originally based on CSS Wizardry Grids. Version 2.0 has been almost entirely rewritten since then, but still retains the principal idea of working with inline blocks. I am grateful for and respect the work that he has released.