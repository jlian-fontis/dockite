import { BaseField } from '@dockite/database';
import { FieldSettings } from '@dockite/types';

export interface SlugFieldSettings extends FieldSettings {
  fieldsToSlugify: string[] | null;
  unique: boolean;
  autoIncrement: boolean;
  parent: string | null;
}

export interface DockiteFieldSlugEntity extends BaseField {
  type: 'slug';
  settings: SlugFieldSettings & BaseField['settings'];
}
