import { ColumnSchema, RowSchema, TableSchema } from '../types';

type Tables = Record<string, TableSchema>;

interface DatabaseType {
    tables: Tables;
    createTable(tableName: string, columns: ColumnSchema[]): void;
    insertInto(tableName: string, row: RowSchema): void;
    selectFrom(tableName: string, columns: string[]): RowSchema[];
    update(tableName: string, updates: Partial<RowSchema>, condition: (row: RowSchema) => boolean): void;
    deleteFrom(tableName: string, condition: (row: RowSchema) => boolean): void;
}

export class Database implements DatabaseType {
    public tables: Tables;

    private static errors = {
        tableExists: (tableName: string) => `Table ${tableName} already exists.`,
        tableDoesNotExist: (tableName: string) => `Table ${tableName} does not exist.`,
        columnDoesNotExist: (columnName: string, tableName: string) =>
            `Column ${columnName} does not exist in table ${tableName}.`,
        typeMismatch: (columnName: string, tableName: string, expectedType: string) =>
            `Type mismatch for column ${columnName} in table ${tableName}. Expected ${expectedType}.`,
    };

    constructor() {
        this.tables = {};
    }

    createTable(tableName: string, columns: ColumnSchema[]): void {
        if (this.tables[tableName]) {
            throw new Error(Database.errors.tableExists(tableName));
        }
        this.tables[tableName] = {
            name: tableName,
            columns,
            rows: [],
        };
    }

    insertInto(tableName: string, row: RowSchema): void {
        const table = this.tables[tableName];
        if (!table) {
            throw new Error(Database.errors.tableDoesNotExist(tableName));
        }
        this.validateRow(table, row);
        table.rows.push(row);
    }

    selectFrom(tableName: string, columns: string[]): RowSchema[] {
        const table = this.tables[tableName];
        if (!table) {
            throw new Error(Database.errors.tableDoesNotExist(tableName));
        }
        if (columns.length === 0) {
            columns = table.columns.map(column => column.name);
        }
        return table.rows.map(row => this.selectColumns(row, columns));
    }

    update(tableName: string, updates: Partial<RowSchema>, condition: (row: RowSchema) => boolean): void {
        const table = this.tables[tableName];
        if (!table) {
            throw new Error(Database.errors.tableDoesNotExist(tableName));
        }
        table.rows.forEach(row => {
            if (condition(row)) {
                Object.assign(row, updates);
            }
        });
    }

    deleteFrom(tableName: string, condition: (row: RowSchema) => boolean): void {
        const table = this.tables[tableName];
        if (!table) {
            throw new Error(Database.errors.tableDoesNotExist(tableName));
        }
        table.rows = table.rows.filter(row => !condition(row));
    }

    private validateRow(table: TableSchema, row: RowSchema): void {
        const columnNames = table.columns.map(column => column.name);
        for (const columnName in row) {
            if (!columnNames.includes(columnName)) {
                throw new Error(Database.errors.columnDoesNotExist(columnName, table.name));
            }
        }
        for (const column of table.columns) {
            const value = row[column.name];
            if (value !== undefined && typeof value !== column.type) {
                throw new Error(Database.errors.typeMismatch(column.name, table.name, column.type));
            }
        }
    }

    private selectColumns(row: RowSchema, columns: string[]): RowSchema {
        return Object.fromEntries(columns.map(column => [column, row[column]!]));
    }
}
