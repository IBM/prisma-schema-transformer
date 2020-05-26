/**
 * For debugging
 */

import * as fs from 'fs';
import {getDMMF, formatSchema} from '@prisma/sdk';
import {dmmfModelsdeserializer, Model, dmmfModelTransformer} from './src';

const schemaName = 'private';
const outputSchemaName = `${schemaName}.actual`;

const schemaPath = `./fixtures/${schemaName}.prisma`;
const outputSchemaPath = `./fixtures/${outputSchemaName}.prisma`;

(async function () {
	// Format input schema file
	const formatedSchemaString = await formatSchema({schemaPath});
	fs.writeFileSync(schemaPath, formatedSchemaString);
	const schema = fs.readFileSync(schemaPath, 'utf-8');
	const dmmf = await getDMMF({datamodel: schema});
	fs.writeFileSync(`./${schemaName}-dmmf.json`, JSON.stringify(dmmf, null, 2));

	// Transform to camelcase
	const models = dmmf.datamodel.models as Model[];
	const transformedModels = dmmfModelTransformer(models);

	// Deserialize models
	const outputSchema = await dmmfModelsdeserializer(transformedModels);
	fs.writeFileSync(outputSchemaPath, outputSchema);
	const formatedOutputSchema = await formatSchema({schemaPath: outputSchemaPath});
	fs.writeFileSync(outputSchemaPath, formatedOutputSchema);

	// Validate
	const outputDmmf = await getDMMF({datamodel: outputSchema});
	fs.writeFileSync(`./${schemaName}-dmmf.actual.json`, JSON.stringify(outputDmmf, null, 2));
})();
