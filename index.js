const {writeFile, mkdir, rm, cp, readdir} = require ('fs/promises')
const {join} = require ('path')

const tap = (fn) => (x) => ((fn (x)), x)
const map = (fn) => (xs) => xs .map (x => fn (x))
const filter = (fn) => (xs) => xs .filter (x => fn (x))
const display = msg => tap (() => console .log (msg))
const allPromises = (ps) => Promise .all (ps)
const delay = (ms) => (v) => new Promise ((res) => setTimeout (() => res (v), ms))

const main = (markdownDir, outputFile) =>
  Promise .resolve (join (__dirname, '_workspace'))
    .then (tap (deleteOutputDir))   // ensure there's no detritus from previous runs
    .then (delay (500)) // TODO: this really should not be necessary
    .then (display ('Deleted old workspace'))
    .then (createOutputDir)
    .then (display ('Created new workspace'))
    .then (copyMarkdown (markdownDir))
    .then (display ('Copied markdown tiddlers'))
    .then (map (makeMeta))
    .then (allPromises)
    .then (display ('Added meta files'))
    .then (tap (writeDefaults))
    .then (display ('Wrote $:/DefaultTiddlers.tid'))
    .then (delay (500)) // TODO: this really should not be necessary
    .then (display ('Creating wiki'))
    .then (buildWiki (outputFile))
    .then (display (`Wrote wiki to ${outputFile}`))
    .catch (console .warn)

const deleteOutputDir = (od) => 
  rm (join (__dirname, '_workspace'), {force: true, recursive: true})


const createOutputDir = () =>
  mkdir (join (__dirname, '_workspace', 'tiddlers'), {force: true, recursive: true})
    .then (() => cp (join (__dirname, 'src'), join (__dirname, '_workspace'), {force: true, recursive: true}))
 
const copyMarkdown = (dir) => () =>
  readdir (dir)
    .then (filter (name => name .endsWith ('.md')))
    .then (map (handleFile (dir)))
    .then (allPromises)

const handleFile = (dir) => (file) => 
  cp (join (dir, file), join (__dirname, '_workspace', 'tiddlers', 'imported', file), {force: true})
    .then (() => file)
 
const makeMeta = (file, now = new Date().toISOString().replace(/\D/g, '')) => 
  writeFile (join (__dirname, '_workspace', 'tiddlers', 'imported', file + '.meta'), `
    created: ${now}
    modified: ${now}
    tags: 
    title: ${file .slice (0, -3)}
    type: text/x-markdown
  `) .then (() => file)
   
const writeDefaults = (files, now = new Date().toISOString().replace(/\D/g, '')) => 
  writeFile (join (__dirname, '_workspace', 'tiddlers', '$__DefaultTiddlers.tid'), 
`created: ${now}
modified: ${now}
title: $:/DefaultTiddlers
type: text/vnd.tiddlywiki

${files .map (file => `[[${file .slice (0, -3)}]]`) .join ('\n')}
`)

const buildWiki = (outputFile) => () => {
    const $tw = require("tiddlywiki/boot/boot.js").TiddlyWiki();
    $tw .boot .argv = [join(__dirname, '_workspace'), '--output', outputFile, '--build', 'index']
    $tw .boot .boot ()
}

main (process .argv [2], process .argv [3])
