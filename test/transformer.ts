import test from 'ava';
import * as fs from 'fs';
import {getDMMF} from '@prisma/sdk';

import {dmmfModelsdeserializer, Model} from '../src';

test('transform model name from snake_case to camelCase from simple schema', async t => {
	const schemaPath = './fixtures/simple.prisma';

	const schema = fs.readFileSync(schemaPath, 'utf-8');
	const dmmf = await getDMMF({datamodel: schema});
	const models = dmmf.datamodel.models as Model[];

	const outputSchema = await dmmfModelsdeserializer(models);
	const outpuDmmf = await getDMMF({datamodel: outputSchema});

	t.deepEqual(outpuDmmf.datamodel, dmmf.datamodel);
});

test('transform model name from snake_case to camelCase from blog schema', async t => {
	const schemaPath = './fixtures/blog.prisma';

	const schema = fs.readFileSync(schemaPath, 'utf-8');
	const dmmf = await getDMMF({datamodel: schema});
	const models = dmmf.datamodel.models as Model[];

	const outputSchema = await dmmfModelsdeserializer(models);
	const outpuDmmf = await getDMMF({datamodel: outputSchema});

	t.deepEqual(outpuDmmf.datamodel, dmmf.datamodel);
});
