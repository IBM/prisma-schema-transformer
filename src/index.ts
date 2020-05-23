import * as fs from 'fs';
import {getDMMF} from '@prisma/sdk';
import {dmmfModelsdeserializer, dmmfModelTransformer, Model} from '.';

export async function fixPrismaFile(schemaPath: string) {
	const schema = fs.readFileSync(schemaPath, 'utf-8');
	const dmmf = await getDMMF({datamodel: schema});
	const models = dmmf.datamodel.models as Model[];

	const transformedModels = dmmfModelTransformer(models);
	const outputSchema = await dmmfModelsdeserializer(transformedModels);

	return outputSchema;
}

export * from './deserializer';
export * from './transformer';
