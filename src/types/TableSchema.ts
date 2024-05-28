import { ColumnSchema } from './ColumnSchema';
import { RowSchema } from './RowSchema';

export interface TableSchema {
    name: string;
    columns: ColumnSchema[];
    rows: RowSchema[];
}
