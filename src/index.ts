import * as fs from 'fs';
import {getDMMF, getConfig} from '@prisma/sdk';
import {datasourcesDeserializer, dmmfModelsdeserializer, dmmfModelTransformer, generatorsDeserializer, Model} from '.';

/**
 *
 * @param schemaPath Path to the Prisma schema file
 * @param deny A comma seperated
 */
export async function fixPrismaFile(schemaPath: string, denyList: readonly string[] = []) {
	const schema = fs.readFileSync(schemaPath, 'utf-8');
	const dmmf = await getDMMF({datamodel: schema});
	const config = await getConfig({datamodel: schema});

	const models = dmmf.datamodel.models as Model[];
	const datasources = config.datasources;
	const generators = config.generators;

	const filteredModels = models.filter(each => !denyList.includes(each.name));
	const transformedModels = dmmfModelTransformer(filteredModels);

	let outputSchema = '';
	outputSchema += await datasourcesDeserializer(datasources);
	outputSchema += await generatorsDeserializer(generators);
	outputSchema += await dmmfModelsdeserializer(transformedModels);
	
	return outputSchema
}

export * from './deserializer';
export * from './transformer';
