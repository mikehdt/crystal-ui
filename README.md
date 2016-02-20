# Crystal Grids 3.0.0α

**A highly configurable, fun, responsive grid system!**

Fully responsive, smallest screen or largest screen first, nestable, reversible grids. Generate any ratios you desire, and only generate ones you need. Designed for people who work on many projects with many different and complex designs.

The goal of this system is to produce clean, reusable, friendly classes, and only those classes you need. It is for those people for whom a simple twelve column grid just isn't going to cut it, whilst at the same time keeping your CSS lean.

## Browser Support

Crystal Grids are compatible with modern desktop browsers and modern mobile browsers which have support for `display: flex;` and CSS *rem* units. Out of the box, the minimum IE supported version is IE10, at a pinch.

Otherwise, all modern browsers, both mobile and desktop, are well supported.

## Demo

Needs some new demos. At the moment, the CSS files are probably the best demos.

## Setup

If you can use Sass, you can use Crystal Grids. For flexibility, it's recommended you copy the configuration options you need out from the main grid file and change them there, rather than editing the grid system's file itself.

## Usage

Crystal Grids is simple to implement and its classes are human-readable. You can also configure it to your preferences. By default, it uses classes of the form `.grid` for a grid container, which can contain any number of rows and columns inside it, and `.col-1-4` for a one quarter width column for example. However you can configure the naming to your liking. There are options for changing the namespacing, and whether you prefer breakpoints to be prefixed or suffixed.

Setting up the breakpoints is probably the most complex part, so check out the main source file and demos to see how they work. Crystal Grids has a logic core that lets you dynamically generate any ratio sets you want. Feel like sevenths? Let it make them for you. Want to use seventeenths for some reason? Nothing stopping you. Only need three fifths? Crystal Grids will only generate those ratios and ratio sets you request.

I find that when developing, using static classes straight in HTML is a fast way to prototype, but I also later might want to consolidate things down using silent classes. Whether static or silent, the tradeoff is either complexity in HTML, or complexity in CSS.

Depending on your working style, Crystal Grids lets you develop with static in HTML, setting up silent `@extend` classes as you go, with both static and silent turned on. Later you can turn off static generation to keep your resulting HTML code clean. It is not recommended to use both options on in a production setting.

Note that certain patterns can result in CSS over-generation when using `@extend`. It is recommended to only use extend with column ratios and modifiers, never the base grid container or columns themselves.

### Patterns

Crystal Grids' classes are based on [a modified BEM
syntax](http://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) with a slight bending of the rules when using numeric fractions, to keep name complexity to a minimum.

Classes include your breakpoint namespaces (e.g. `.col-1-2--s`, `.col-2-3--m` and so on); there are also plain regular classes (`.col-1-10`, `.col-3-4` etc).

### Classes in markup

If you are using traditional classes then an example, basic usage might look like this:

    <div class="grid">

        <div class="col  col-1-2--m  col-1-3--l">
            ...
        </div>

        <div class="col  col-1-2--m  col-2-3--l">
            ...
        </div>

    </div>

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

### Reversed grids `.grid--rev`

Crystal has the option to reverse a set of grids; this means that the order you write your source and the order it renders are total opposites, for example:

    <div class="grid  grid--rev">

        <div class="col  col-2-3">
            I appear first in the markup, but render second in the page.
        </div>

        <div class="col  col-1-3">
            I appear second in the markup, but render first in the page.
        </div>

    </div>

This is handy if you want to lay out your page a certain way visually but it would be advantageous to order the source differently, for example to aid accessibility (getting a screenreader to read more important content first). With flexbox, this is achieved by changing the flex-direction property to row-reverse.

### Grids and Gutters

Gutters are flexible in Crystal Grids. You can have them either on or off by default, and you can optionally generate selective guttering classes. Going even further, you can choose to have gutter modifiers to create wider or thinner gutters on the same page, and generate larger or smaller gutters at different breakpoints. Check out the comments in the grid file for more information.

Note that if you use a custom gutter style at a lower breakpoint and then change the global setting at a higher one, you will need to also generate that custom gutter modifier at the higher setting or it will be overridden.

### Grid alignment

As flexbox has many ways to affect alignment, version 3 of Crystal Grids currently leaves this up to the author to implement outside of the core Crystal logic.

### Credits

Crystal Grids was written by Mike Hopkins, originally based on the amazing work done by Harry Roberts of CSS Wizardry. The core of version 1.0 was originally based on CSS Wizardry Grids. Version 2.0 has been almost entirely rewritten since then, but still retains the principal idea of working with inline blocks. I am grateful for and respect the work that he has released.