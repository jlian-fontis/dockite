import path from 'path';

import { GraphQLModule } from '@graphql-modules/core';
import debug from 'debug';
import { buildTypeDefsAndResolvers } from 'type-graphql';

import { authChecker } from '../../common/authorizers';
import { GlobalContext } from '../../common/types';
import { getModules } from '../../utils';

import * as resolvers from './resolvers';
import { createGraphQLSchemas } from './dockite';

const log = debug('dockite:core:external');

// eslint-disable-next-line
export const getRegisteredExternalModules = (): any[] => {
  return getModules('external');
};

export const ExternalGraphQLModule = async (): Promise<GraphQLModule> => {
  log('building type-definitions and resolvers');
  const resolversAndTypeDefs = await buildTypeDefsAndResolvers({
    resolvers: await Promise.all(Object.values(resolvers).map(r => Promise.resolve(r))),
    authMode: 'null',
    authChecker,
    emitSchemaFile: path.join(__dirname, './schema.gql'),
  });

  log('collecting registered modules');
  const modules = await Promise.all(getRegisteredExternalModules());

  log('creating graphql schemas for content types');
  const schemas = await createGraphQLSchemas();

  log('creating graphql module');
  return new GraphQLModule({
    typeDefs: resolversAndTypeDefs.typeDefs,
    resolvers: resolversAndTypeDefs.resolvers,
    extraSchemas: schemas,
    imports: modules,
    context: (ctx): GlobalContext => ctx,
  });
};
