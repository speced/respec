
ReSpec
======

ReSpec is a JS library that makes it easier to write technical specifications, or documents
that tend to be technical in nature in general. It was originally designed for the purpose
of writing W3C specifications, but has since grown to be able to support other outputs as 
well.

What is this version of ReSpec?
===============================

There is the original version of ReSpec that can be found in http://dev.w3.org/2009/dap/ReSpec.js/,
known as v1. That version is the most popular, but is restricted to producing W3C specifications
and the code was organically grown over time in a manner that is not extremely user-friendly or
easy to maintain.

Then there is ReSpec v2 which can be found at http://dvcs.w3.org/hg/respec2/. It is flexible, modular,
and has a number of nice features. But the problem is that it was never completely finished, and
in the meantime v1 has continued to be patched for bugs. This leads to a situation in which v2 is
not a proper superset of v1, and patches to the latter have to be rewritten completely to also apply
to v2. Obviously, that's not a desirable situation.

The version in this repository here is “ReSpec: Evolution”. What I've done is essentially that I've
imported the v1 source here. I am very quickly going to make a few very small changes to it so
as to make it 100% compatible with the existing v1 but to start making use of the flexible loading facility
included in v2. Then I will cease all development on the other two versions, making this the only
canonical option. Since it will start off v1 it will be guaranteed compatible, but it will progressively
be rewritten over time to attain v2's features — without the synchronisation problems.

How to contribute?
==================

It is common for people to contribute to RS, notably to make changes to the biblio references. You
certainly are welcome to submit whatever change you wish to (though if it's a complex feature please
try to coordinate with others first to avoid working long on something that will then be rejected).

If you're familiar with GitHub then contributing is simple: just fork and make pull requests. Please
just be careful to note that the primary branch is `gh-pages` and not `master` (this ensures that the
result gets published on the Web).

If you're not familiar with GitHub, you need to follow the following steps:

* Get a GitHub account. This is done quickly, and the GH people will not bother you at all. Plus, it's
pretty much a requirement for the majority of OSS communities these days.
* If all you want to make is a small, simple change, you can use the Web interface. Navigate to the file
that you want to change, click “Edit this file” in the toolbar, then save your changes — they will get
sent to the project for approval (which ought to be quick).
* If you wish to make more complex changes, you will need to fork the project (click “Fork”), clone the
resulting repository, make the changes there, and push it back. Then click the “Pull Request” button.
This allows you to request that the project integrate your changes. Those should normally get processed
relatively fast (depending on how complex they are).

