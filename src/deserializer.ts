import {DMMF} from '@prisma/generator-helper/dist';

export interface Field {
	kind: DMMF.DatamodelFieldKind | DMMF.FieldKind;
	name: string;
	isRequired: boolean;
	isList: boolean;
	isUnique: boolean;
	isId: boolean;
	type: string;
	dbNames: string[] | null;
	isGenerated: boolean;
	relationFromFields?: any[];
	relationToFields?: any[];
	relationOnDelete?: string;
	relationName?: string;
	default: boolean | any;
	isUpdatedAt: boolean;
	isReadOnly: string;
	columnName?: string;
}

export interface Attribute {
	isUnique: boolean;
	isId: boolean;
	dbNames: string[] | null;
	relationFromFields?: any[];
	relationToFields?: any[];
	relationOnDelete?: string;
	relationName?: string;
	isReadOnly: string;
	default?: boolean | any;
	isGenerated: boolean;
	isUpdatedAt: boolean;
	columnName?: string;
}

export interface Model extends DMMF.Model {
	uniqueFields: string[][];
}

const handlers = type => {
	return {
		default: value => {
			if (type === 'Boolean') {
				return `@default(${value})`;
			}

			if (!value) {
				return '';
			}

			if (typeof (value) === 'object') {
				return `@default(${value.name}(${value.args}))`;
			}

			if (typeof (value) === 'number') {
				return `@default(${value})`;
			}

			throw new Error(`Unsupporter field attribute ${value}`);
		},
		isId: value => value ? '@id' : '',
		isUnique: value => value ? '@unique' : '',
		dbNames: value => {},
		relationToFields: value => {},
		relationOnDelete: value => {},
		relationName: value => {},
		isReadOnly: value => {},
		isGenerated: value => {},
		isUpdatedAt: value => value ? '@updatedAt' : '',
		columnName: value => value ? `@map("${value}")` : ''
	};
};

// Handler for Attributes
// https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-schema/data-model#attributes
function handleAttributes(attributes: Attribute, kind: DMMF.DatamodelFieldKind | DMMF.FieldKind, type: string) {
	const {relationFromFields, relationToFields, relationName} = attributes;
	if (kind === 'scalar') {
		return `${Object.keys(attributes).map(each => handlers(type)[each](attributes[each])).join(' ')}`;
	}

	if (kind === 'object' && relationFromFields) {
		return relationFromFields.length > 0 ?
			`@relation(name: "${relationName}", fields: [${relationFromFields}], references: [${relationToFields}])` :
			`@relation(name: "${relationName}")`;
	}

	return '';
}

function handleFields(fields: Field[]) {
	return fields
		.map(fields => {
			const {name, kind, type, isRequired, isList, ...attributes} = fields;
			if (kind === 'scalar') {
				return `  ${name} ${type}${isRequired ? '' : '?'} ${handleAttributes(attributes, kind, type)}`;
			}

			if (kind === 'object') {
				return `  ${name} ${type}${isList ? '[]' : (isRequired ? '' : '?')} ${handleAttributes(attributes, kind, type)}`;
			}

			throw new Error(`Unsupported field kind "${kind}"`);
		}).join('\n');
}

function handleUniqueFieds(uniqueFields: string[][]) {
	return uniqueFields.length > 0 ? uniqueFields.map(eachUniqueField => `@@unique([${eachUniqueField.join(', ')}])`).join('\n') : '';
}

function handleDbName(dbName: string | null) {
	return dbName ? `@@map("${dbName}")` : '';
}

function deserializeModel(model: Model) {
	const {name, uniqueFields, dbName} = model;
	const fields = model.fields as Field[];

	const output = `
model ${name} {
${handleFields(fields)}
${handleUniqueFieds(uniqueFields)}
${handleDbName(dbName)}
}`;
	return output;
}

/**
 * Deserialize DMMF.Model[] into prisma schema file
 */
export async function dmmfModelsdeserializer(models: Model[]) {
	return models.map(model => deserializeModel(model)).join('\n');
}
