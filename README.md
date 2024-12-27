# Goodreads-Wrapped

Like Spotify Wrapped, but for books on Goodreads.

to add:

1. pages read --> percentile of readers in the world

---

Order of stats:

## Summary page

1. Your year at a glance
2. x books read
3. y pages turned
4. z hours spent reading

## NEW animation in new page

1. That puts you in the x percentile of readers in the world

## Fun statistic

1. Did you know?
2. In that time, the international space station...

{/_ Fun Fact _/}
<StatReveal delay={6.5}>

<div className="max-w-xl">
<p className="text-xl md:text-2xl text-gray-200 italic">
In that time, the International Space Station orbited Earth{" "}
{Math.round(179.4)} times
</p>
</div>
</StatReveal>

TO DO:

- add functionality so that when holding a page, the timeout stops (meaning the timer between animations)
- add functionality to show progress bar in specific page item at the top
- maybe add default switches between pages at a certain time ceiling
- for "your favorite month was bla bla" show 1-2 of the books for that month after the animations maybe
- fix the animation lengths in "readingpercentile" page to be consistent with others
- fix spacing between stacked sentences so tat its consistent across pages
- make sure text sizes and bolding consistent and good ui
- refine and add floating book transition animations between some pages
