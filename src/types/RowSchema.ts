import { ColumnType } from './ColumnType';

export interface RowSchema {
    [columnName: string]: ColumnType extends keyof RowSchema ? RowSchema[ColumnType] : unknown;
}
