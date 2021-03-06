import { DockiteField } from '@dockite/field';
import { FieldContext, FieldIOContext } from '@dockite/types';
import { Document } from '@dockite/database';
import {
  GraphQLEnumType,
  GraphQLFieldConfigArgumentMap,
  GraphQLInputType,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLOutputType,
  GraphQLString,
  GraphQLBoolean,
} from 'graphql';

import { ReferenceOfFieldSettings } from './types';

export class DockiteFieldReferenceOf extends DockiteField {
  public static type = 'reference_of';

  public static title = 'Reference Of';

  public static description =
    'A reference of field. Returns a list of documents that refernence this document.';

  public static defaultOptions: ReferenceOfFieldSettings = {
    required: false,
    schemaId: null,
    fieldName: null,
  };

  private updateSchemaIdPointer() {
    if (this.schemaField.settings.schemaId && this.schemaField.settings.schemaId === 'self') {
      this.schemaField.settings.schemaId = this.schemaField.schemaId;
    }
  }

  public async inputType(): Promise<GraphQLInputType> {
    // A dirty hack but we don't want this field to allow input.
    // Why?
    return (null as any) as GraphQLInputType;
  }

  public async onFieldCreate(): Promise<void> {
    this.updateSchemaIdPointer();
  }

  public async onFieldUpdate(): Promise<void> {
    this.updateSchemaIdPointer();
  }

  public async outputType({
    dockiteSchemas,
    graphqlTypes,
  }: FieldIOContext): Promise<GraphQLOutputType> {
    const schemaId: string = this.schemaField.settings.schemaId ?? this.schemaField.schemaId;
    const schemaName = this.schemaField.schema?.name ?? 'Unknown';

    const [schemaType] = dockiteSchemas
      .filter(schema => schemaId === schema.id)
      .map(schema => graphqlTypes.get(schema.name));

    if (!schemaType) {
      console.error(
        `[ERROR]: No schema found for "${this.schemaField.name}" of "${this.schemaField.schema
          ?.name ?? 'Unknown'}"`,
      );

      // This should handle empty cases
      return GraphQLList(GraphQLBoolean);
    }

    return new GraphQLObjectType({
      name: `${this.schemaField.name}_${schemaName}_${schemaType.name ?? 'Unknown'}_ManyResults`,
      fields: {
        results: { type: GraphQLList(schemaType) },
        totalItems: { type: GraphQLInt },
        currentPage: { type: GraphQLInt },
        totalPages: { type: GraphQLInt },
        hasNextPage: { type: GraphQLBoolean },
      },
    });
  }

  public async outputArgs(): Promise<GraphQLFieldConfigArgumentMap> {
    return {
      page: { type: GraphQLInt, defaultValue: 1 },
      perPage: { type: GraphQLInt, defaultValue: 5 },
      orderBy: { type: GraphQLString, defaultValue: 'updatedAt' },
      orderDirection: {
        type: new GraphQLEnumType({
          name: `OrderDirection_${this.schemaField.name}_${this.schemaField.schema?.name ||
            'Unknown'}`,
          values: { DESC: { value: 'DESC' }, ASC: { value: 'ASC' } },
        }),
        defaultValue: 'DESC',
      },
    } as GraphQLFieldConfigArgumentMap;
  }

  public async processOutputGraphQL<T>({ data, args }: FieldContext): Promise<T> {
    if (!args) {
      throw new Error("Output type wasn't built correctly");
    }

    const { schemaId, fieldName } = this.schemaField.settings;
    const { page, perPage } = args;

    const qb = this.orm
      .getRepository(Document)
      .createQueryBuilder('document')
      .leftJoinAndSelect('document.schema', 'schema')
      .andWhere('schema.id = :schemaId', { schemaId })
      .andWhere("document.data -> :field ->> 'id' = :documentId", {
        field: fieldName,
        documentId: data.id,
      })
      .take(perPage)
      .offset((page - 1) * perPage);

    if (args.orderBy !== 'id' && Object.keys(data).includes(args.orderBy)) {
      qb.addOrderBy(`document.data->>'${args.orderBy}'`, args.orderDirection);
    } else {
      qb.addOrderBy(`document.${args.orderBy}`, args.orderDirection);
    }

    const [documents, totalItems] = await qb.getManyAndCount();

    const totalPages = Math.ceil(totalItems / perPage);

    return ({
      results: documents.map(d => ({ id: d.id, ...d.data })),
      totalPages,
      totalItems,
      currentPage: page,
      hasNextPage: page < totalPages,
    } as any) as T;
  }
}
