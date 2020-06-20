import * as fs from 'fs';
import {getDMMF} from '@prisma/sdk';
import {dmmfModelsdeserializer, dmmfModelTransformer, Model} from '.';

/**
 *
 * @param schemaPath Path to the Prisma schema file
 * @param deny A comma seperated
 */
export async function fixPrismaFile(schemaPath: string, denyList: readonly string[] = []) {
	const schema = fs.readFileSync(schemaPath, 'utf-8');
	const dmmf = await getDMMF({datamodel: schema});
	const models = dmmf.datamodel.models as Model[];
	const filteredModels = models.filter(each => !denyList.includes(each.name));

	const transformedModels = dmmfModelTransformer(filteredModels);
	const outputSchema = await dmmfModelsdeserializer(transformedModels);

	return outputSchema;
}

export * from './deserializer';
export * from './transformer';
