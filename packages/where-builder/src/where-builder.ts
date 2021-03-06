/* eslint-disable @typescript-eslint/camelcase */
import { randomBytes } from 'crypto';

import { Brackets, WhereExpression } from 'typeorm';
import { Document } from '@dockite/database';

import { ConstraintArray, ConstraintHandlerFn, ConstraintOperator, QueryBuilder } from './types';
import {
  columnPartsToColumn,
  isAndQuery,
  isOrQuery,
  isBaseConstraint,
  unsafeStringToNativeType,
} from './util';

type DocumentKey = keyof Document;

const reservedKeys: string[] = [
  'id',
  'createdAt',
  'updatedAt',
  'schema',
  'schemaId',
  'publishedAt',
  'deletedAt',
] as DocumentKey[];

const ConstraintHandlerMap: Record<ConstraintOperator, ConstraintHandlerFn> = {
  $eq: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} = :${param}`, { [param]: constraint.value });
  },

  $ne: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name)) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} != :${param}`, { [param]: constraint.value });
  },

  $in: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    const value = unsafeStringToNativeType(constraint.value);

    if (!Array.isArray(value) || value.length === 0) {
      return;
    }

    console.log({ value });

    qb.andWhere(`${name} IN (:...${param})`, {
      [param]: value,
    });
  },

  $gt: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'native');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} > :${param}`, {
      [param]: unsafeStringToNativeType(constraint.value),
    });
  },

  $gte: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'native');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} >= :${param}`, {
      [param]: unsafeStringToNativeType(constraint.value),
    });
  },

  $lt: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'native');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} < :${param}`, {
      [param]: unsafeStringToNativeType(constraint.value),
    });
  },

  $lte: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'native');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} <= :${param}`, {
      [param]: unsafeStringToNativeType(constraint.value),
    });
  },

  $gt_date: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`(${name})::timestamp > (:${param})::timestamp`, {
      [param]: new Date(constraint.value),
    });
  },

  $gte_date: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`(${name})::timestamp >= (:${param})::timestamp`, {
      [param]: new Date(constraint.value),
    });
  },

  $lt_date: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`(${name})::timestamp < (:${param})::timestamp`, {
      [param]: new Date(constraint.value),
    });
  },

  $lte_date: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`(${name})::timestamp <= (:${param})::timestamp`, {
      [param]: new Date(constraint.value),
    });
  },

  $like: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} LIKE :${param}`, { [param]: `%${constraint.value}%` });
  },

  $ilike: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} ILIKE :${param}`, { [param]: `%${constraint.value}%` });
  },

  $array_contains: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'native');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} ? :${param}`, {
      [param]: unsafeStringToNativeType(constraint.value),
    });
  },

  $array_not_contains: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'native');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`NOT ${name} ? :${param}`, {
      [param]: unsafeStringToNativeType(constraint.value),
    });
  },

  $regex: (qb, constraint) => {
    const param = randomBytes(6).toString('hex');
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`${name} ~ :${param}`, { [param]: constraint.value });
  },

  $null: (qb, constraint) => {
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`COALESCE(${name}, '') = ''`);
  },

  $not_null: (qb, constraint) => {
    let name = columnPartsToColumn(['data', ...constraint.name.split('.')], 'text');

    if (reservedKeys.includes(constraint.name) || constraint.name.startsWith('schema.')) {
      name = `document.${constraint.name}`;

      if (constraint.name.startsWith('schema.')) {
        name = constraint.name;
      }
    }

    qb.andWhere(`COALESCE(${name}, '') != ''`);
  },
};

export class WhereBuilder {
  static OrBuilder(qb: WhereExpression, constraints: ConstraintArray): void {
    qb.orWhere(
      new Brackets(q => {
        q.andWhere('1 = 1');

        constraints.forEach(constraint => {
          if (isAndQuery(constraint)) {
            this.Build(q, constraint);
          }

          if (isOrQuery(constraint)) {
            this.Build(q, constraint);
          }

          if (isBaseConstraint(constraint)) {
            ConstraintHandlerMap[constraint.operator](q, constraint);
          }
        });
      }),
    );
  }

  static AndBuilder(qb: WhereExpression, constraints: ConstraintArray): void {
    qb.andWhere(
      new Brackets(q => {
        q.andWhere('1 = 1');

        constraints.forEach(constraint => {
          if (isAndQuery(constraint)) {
            this.Build(q, constraint);
          }

          if (isOrQuery(constraint)) {
            this.Build(q, constraint);
          }

          if (isBaseConstraint(constraint)) {
            ConstraintHandlerMap[constraint.operator](q, constraint);
          }
        });
      }),
    );
  }

  static Build(qb: WhereExpression, query: QueryBuilder): void {
    if (isOrQuery(query)) {
      this.OrBuilder(qb, query.OR);
      return;
    }

    if (isAndQuery(query)) {
      this.AndBuilder(qb, query.AND);
    }
  }
}
