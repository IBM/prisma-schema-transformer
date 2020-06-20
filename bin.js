#!/usr/bin/env node

const fs = require('fs');
const arg = require('arg');
const {formatSchema} = require('@prisma/sdk');
const pkg = require('./package.json');
const {fixPrismaFile} = require('./dist');

const args = arg({
	// Types
	'--help': Boolean,
	'--version': Boolean,
	'--print': Boolean,
	'--deny': [String],
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
  $ prisma-schema-transformer ./schema.prisma

Instead of saving the result to the filesystem, you can also print it
  $ prisma-schema-transformer ./schema.prisma --print

Exclude some models from the output
  $ prisma-schema-transformer ./schema.prisma --deny knex_migrations --deny knex_migration_lock

Options:
  --print   Do not save
  --deny    Exlucde model from output
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
const denyList = args['--deny'] || [];

(async function () {
	const output = await fixPrismaFile(schemaPath, denyList);
	if (isPrint) {
		console.log(output);
	} else {
		fs.writeFileSync(schemaPath, output);
		const formatedOutput = await formatSchema({schemaPath});
		fs.writeFileSync(schemaPath, formatedOutput);
	}

	process.exit(0);
})();
