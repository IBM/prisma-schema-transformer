# prisma-schema-transformer

> **EXPERIMENTAL**

This project utilizes the [getDMMF](https://github.com/prisma/prisma/blob/023249752380976d797518e1350199895246d099/src/packages/sdk/src/engineCommands.ts#L45) method from `@prisma/sdk` to perform some post-processing work on generated Prisma schema, including the following.

- Transform `snake_case` to `camelCase`, 
- Properly singularize or pluralize model and field name.
- Add `@updatedAt` attribute to field in the event of column name is `updated_at`

__TODO__

- [ ] Auto generate the `generator` and `datasource` nodes.

## Install

```bash
$ yarn global add prisma-schema-transformer
```

## Usage

```bash
$ prisma-schema-transformer prisma/schema.prisma
```

```
Usage
  $ prisma-schema-transformer [options] [...args]

Specify a schema:
  $ prisma-schema-transformer ./schema.prisma'

Instead of saving the result to the filesystem, you can also print it
  $ prisma-schema-transformer ./schema.prisma --print'

Options:
  --print   Do not save
  --help    Help
  --version Version info
```

## Motivation

Using `snake_case` in database and automatically transform generated Prisma schema to `camelCase` with `@map` and `@@map` as needed to map the new name back to the database.

There is a [snippet](https://github.com/prisma/prisma/issues/1934#issuecomment-618063631) provided by @TLadd, but I found regex a bit unreliable.

## How does it work

`getDMMF` parses the Prisma schema file into dmmf(datamodel meta format), which we can use to do some post-processing on the Prisma internal data structure.

### Deserializer

There does not seem to be a printer or a deserializer for `DMMF`, [source](https://github.com/prisma/prisma/issues/515#issuecomment-619999178). You can learn more about the implementation at [deserializer.ts](./src/deserializer.ts). It is responsible for converting a serialized Prisma schema, DMMF, back to plain text file.

It's hacky, but it works. Some test fixtures are taken from the `@prisma/sdk` repository for testing. We use the `getDMMF` method to compare the serialized structure of original and transformed Prisma schema, make sure they are identical.

### Transformer

Manipulate the naming of Model and Field to follow the `camelCase` naming convention.

- Model name is always singular.
- Field name is singular by default with the execption of `many-to-many` relation.

## License

This project is [MIT licensed](./LICENSE).

