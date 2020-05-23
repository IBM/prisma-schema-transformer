#!/usr/bin/env node

const fs = require('fs');
const arg = require('arg');
const pkg = require('./package.json');
const {fixPrismaFile} = require('./dist');

const args = arg({
	// Types
	'--help': Boolean,
	'--version': Boolean,
	'--print': Boolean,
	// Aliases
	'-v': '--version'
});

if (args['--version']) {
	console.log(`${pkg.name} ${pkg.version}`);
	process.exit(0);
}

if (args['--help']) {
	console.log(`Usage
  $ prisma-schema-transformer [options] [...args]

Specify a schema:
  $ prisma-schema-transformer ./schema.prisma'

Instead of saving the result to the filesystem, you can also print it
  $ prisma-schema-transformer ./schema.prisma --print'

Options:
  --print   Do not save
  --help    Help
  --version Version info`);
	process.exit(0);
}

if (args._.length !== 1) {
	console.log('Invalid argument. Require one positional argument. Run --help for usage.');
	process.exit(1);
}

const schemaPath = args._[0];
const isPrint = args['--print'] || false;

(async function () {
	const output = await fixPrismaFile(schemaPath);
	if (isPrint) {
		console.log(output);
	} else {
		fs.writeFileSync(schemaPath, output);
	}

	process.exit(0);
})();
