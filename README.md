md2tw
=====

A quick demo of a script to convert a folder full of Markdown files to
Tiddlywiki.

This is nothing more than a proof-of-concept.


Requirements
------------

This is built on [Node][no].  (I'm using version 18, but anything relatively
modern should do.)  You need to have Node install (which will also install the
package manager NPM.)

You need to a folder of Mardown files (with `.md` extensions -- we can expand
that later.)

This is a command-line tool.  You need to be able to use your shell, DOS, Bash,
Terminal, whatever.

You will also need to download this repository.  I use the command line: `git
clone https://github.com/CrossEye/TW5-md2tw.git`, but however you like.  Finally
you need to install it's (single) dependency by calling `npm install` from its
folder:

```shell
TW2-mdwtw> npm install
```


Usage
-----

```shell
> node  path/to/TW5-md2tw  path/to/markdown/folder  path/to/output/folder 
```

This will create a single-file TiddlyWiki `index.html` in
`path/to/output/folder`.



TODO
----

- Make links work -- at least for the majority of cases
 
- Handle other types: images, css etc.

- Deal with nested folders.  (This is not hard, but should come after the links)

- Allow an additional argument (at which point we'd better start naming them!)
  that points to an existing Wiki to serve as the baseline in place of my very
  minimal Node one. 

  [no]: https://nodejs.org/en/