#!/usr/bin/env node

const path = require('path');
const program = require('commander');
const { inspect } = require('util');
const packageInfo = require('./package.json');
const generator = require('./lib/generator');

const red = text => `\x1b[31m${text}\x1b[0m`;
const magenta = text => `\x1b[35m${text}\x1b[0m`;
const yellow = text => `\x1b[33m${text}\x1b[0m`;
const green = text => `\x1b[32m${text}\x1b[0m`;

let openapiFile;
let template;

const parseOutput = dir => path.resolve(dir);

program
  .version(packageInfo.version)
  .arguments('<openapiFile> <template>')
  .action((openapiFilePath, tmpl) => {
    openapiFile = path.resolve(openapiFilePath);
    template = tmpl;
  })
  .option('-o, --output <outputDir>', 'directory where to put the generated files (defaults to current directory)', parseOutput, process.cwd())
  .option('-t, --templates <templateDir>', 'directory where templates are located (defaults to internal nodejs templates)')
  .parse(process.argv);

if (!openapiFile) {
  console.error(red('> Path to Swagger file not provided.'));
  program.help(); // This exits the process
}

generator.generate({
  openapi: openapiFile,
  target_dir: program.output,
  templates: program.templates ? path.resolve(process.cwd(), program.templates) : undefined,
  template,
}).then(() => {
  console.log(green('Done! ✨'));
  console.log(yellow('Check out your shiny new API at ') + magenta(program.output) + yellow('.'));
}).catch(err => {
  console.error(red('Aaww 💩. Something went wrong:'));
  console.error(red(err.stack || err.message || inspect(err, { depth: null })));
});

process.on('unhandledRejection', (err) => console.error(err));
