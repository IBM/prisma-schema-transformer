import test from 'ava';
import * as fs from 'fs';
import {getDMMF} from '@prisma/sdk';

import {dmmfModelsdeserializer, Model, fixPrismaFile} from '../src';

test('deserialized model is identical with the input from simple schema', async t => {
	const schemaPath = './fixtures/simple.prisma';

	const outputSchema = await fixPrismaFile(schemaPath);
	t.snapshot(outputSchema);
});

test('deserialized model is identical with the input from blog schema', async t => {
	const schemaPath = './fixtures/blog.prisma';

	const outputSchema = await fixPrismaFile(schemaPath);
	t.snapshot(outputSchema);
});

test('deserialized model is excluding users model', async t => {
	const schemaPath = './fixtures/simple.prisma';

	const outputSchema = await fixPrismaFile(schemaPath, ['users']);
	t.snapshot(outputSchema);
});
