import { Field } from '@dockite/database';
import { TreeData } from 'element-ui/types/tree';

export type UnpersistedField = Omit<
  Field,
  'id' | 'schemaId' | 'dockiteField' | 'schema' | 'setDockiteField'
>;

export interface FieldTreeData extends TreeData {
  dockite: Omit<Field, 'id' | 'schemaId' | 'dockiteField' | 'schema' | 'setDockiteField'>;
  children?: FieldTreeData[];
}
