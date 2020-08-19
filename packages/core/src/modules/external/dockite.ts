import fs from 'fs';
import path from 'path';

import { Schema } from '@dockite/database';
import { FieldManager, registerScopeResourceId, registerScopes } from '@dockite/manager';
import { createSchema } from '@dockite/transformer';
import { GraphQLSchema } from 'graphql';
import * as typeorm from 'typeorm';

import { getConfig } from '../../config';

const config = getConfig();

const getExternalAuthPackage = (): string => {
  if (config.externalAuthPackage) {
    if (fs.existsSync(path.join(process.cwd(), config.externalAuthPackage))) {
      return path.join(process.cwd(), config.externalAuthPackage);
    }

    return config.externalAuthPackage;
  }

  return './dummy-auth';
};

// TODO: Tidy this area, createSchema likely does not need access to all the items it currently does.
export const createExtraGraphQLSchema = async (): Promise<GraphQLSchema> => {
  const externalAuth = await import(getExternalAuthPackage());

  const dockiteSchemas = await typeorm.getRepository(Schema).find({
    relations: ['fields', 'fields.schema'],
  });

  dockiteSchemas.forEach(schema => {
    const schemaName = schema.name.toLowerCase();

    registerScopes(
      `schema:${schemaName}:create`,
      `schema:${schemaName}:read`,
      `schema:${schemaName}:update`,
      `schema:${schemaName}:delete`,
    );

    registerScopeResourceId(schema.id, schemaName);
  });

  const dockiteSchemasFiltered = dockiteSchemas.filter(schema => schema.fields.length > 0);

  const schema = await createSchema(typeorm, dockiteSchemasFiltered, FieldManager, externalAuth);

  return schema;
};
