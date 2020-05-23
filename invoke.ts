import * as fs from 'fs';
import {getDMMF, formatSchema} from '@prisma/sdk';
import {dmmfModelsdeserializer} from './src';

const schemaPath = './fixtures/simple-schema.prisma';

(async function () {
	// Format input schema file
	const formatedSchemaString = await formatSchema({schemaPath});
	fs.writeFileSync(schemaPath, formatedSchemaString);
	const schema = fs.readFileSync(schemaPath, 'utf-8');
	const dmmf = await getDMMF({datamodel: schema});

	// Deserialize models
	const outputSchema = await dmmfModelsdeserializer(dmmf.datamodel.models);

	// Validate
	await getDMMF({datamodel: outputSchema});

	// TODO
	// - Validate two objects are identical using deep compare
})();
