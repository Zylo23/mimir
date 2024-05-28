import { ColumnSchema, Database, RowSchema, TableSchema } from '../dist';

describe('Database', () => {
    let db: Database;

    beforeEach(() => {
        db = new Database();
    });

    describe('createTable', () => {
        test('should create a new table', () => {
            const tableName = 'users';
            const columns: ColumnSchema[] = [
                { name: 'id', type: 'number' },
                { name: 'name', type: 'string' },
                { name: 'age', type: 'number' },
            ];

            db.createTable(tableName, columns);

            expect(db['tables'][tableName]).toEqual({
                name: tableName,
                columns,
                rows: [],
            });
        });

        test('should throw error if table already exists', () => {
            const tableName = 'users';
            const columns: ColumnSchema[] = [
                { name: 'id', type: 'number' },
                { name: 'name', type: 'string' },
                { name: 'age', type: 'number' },
            ];

            db.createTable(tableName, columns);

            expect(() => db.createTable(tableName, columns)).toThrowError(`Table ${tableName} already exists.`);
        });
    });

    describe('insertInto', () => {
        beforeEach(() => {
            const tableName = 'users';
            const columns: ColumnSchema[] = [
                { name: 'id', type: 'number' },
                { name: 'name', type: 'string' },
                { name: 'age', type: 'number' },
            ];

            db.createTable(tableName, columns);
        });

        test('should insert a row into the table', () => {
            const tableName = 'users';
            const row: RowSchema = {
                id: 1,
                name: 'Alice',
                age: 30,
            };

            db.insertInto(tableName, row);

            const table = db['tables'][tableName] as TableSchema;
            expect(table.rows).toHaveLength(1);
            expect(table.rows[0]).toEqual(row);
        });

        test('should throw error if table does not exist', () => {
            const tableName = 'non_existing_table';
            const row: RowSchema = {
                id: 1,
                name: 'Alice',
                age: 30,
            };

            expect(() => db.insertInto(tableName, row)).toThrowError(`Table ${tableName} does not exist.`);
        });

        test('should throw error if row has invalid column', () => {
            const tableName = 'users';
            const row: RowSchema = {
                id: 1,
                name: 'Alice',
                age: 30,
                invalidColumn: 'invalid',
            };

            expect(() => db.insertInto(tableName, row)).toThrowError(
                `Column invalidColumn does not exist in table ${tableName}.`,
            );
        });

        test('should throw error if row has type mismatch', () => {
            const tableName = 'users';
            const row: RowSchema = {
                id: 1,
                name: 'Alice',
                age: 'thirty', // should be a number
            };

            expect(() => db.insertInto(tableName, row)).toThrowError(
                `Type mismatch for column age in table ${tableName}. Expected number.`,
            );
        });
    });

    describe('selectFrom', () => {
        beforeEach(() => {
            const tableName = 'users';
            const columns: ColumnSchema[] = [
                { name: 'id', type: 'number' },
                { name: 'name', type: 'string' },
                { name: 'age', type: 'number' },
            ];

            db.createTable(tableName, columns);
            db.insertInto(tableName, { id: 1, name: 'Alice', age: 30 });
            db.insertInto(tableName, { id: 2, name: 'Bob', age: 25 });
        });

        test('should select specific columns from the table', () => {
            const tableName = 'users';
            const columns = ['name'];

            const result = db.selectFrom(tableName, columns);

            expect(result).toEqual([{ name: 'Alice' }, { name: 'Bob' }]);
        });

        test('should select all columns if none are specified', () => {
            const tableName = 'users';

            const result = db.selectFrom(tableName, []);

            expect(result).toEqual([
                { id: 1, name: 'Alice', age: 30 },
                { id: 2, name: 'Bob', age: 25 },
            ]);
        });

        test('should throw error if table does not exist', () => {
            const tableName = 'non_existing_table';

            expect(() => db.selectFrom(tableName, [])).toThrowError(`Table ${tableName} does not exist.`);
        });
    });

    describe('update', () => {
        beforeEach(() => {
            const tableName = 'users';
            const columns: ColumnSchema[] = [
                { name: 'id', type: 'number' },
                { name: 'name', type: 'string' },
                { name: 'age', type: 'number' },
            ];

            db.createTable(tableName, columns);
            db.insertInto(tableName, { id: 1, name: 'Alice', age: 30 });
            db.insertInto(tableName, { id: 2, name: 'Bob', age: 25 });
        });

        test('should update rows based on condition', () => {
            const tableName = 'users';

            db.update(tableName, { age: 31 }, row => row.name === 'Alice');

            const result = db.selectFrom(tableName, []);

            expect(result).toEqual([
                { id: 1, name: 'Alice', age: 31 },
                { id: 2, name: 'Bob', age: 25 },
            ]);
        });

        test('should throw error if table does not exist', () => {
            const tableName = 'non_existing_table';

            expect(() => db.update(tableName, { age: 31 }, row => row.name === 'Alice')).toThrowError(
                `Table ${tableName} does not exist.`,
            );
        });
    });

    describe('deleteFrom', () => {
        beforeEach(() => {
            const tableName = 'users';
            const columns: ColumnSchema[] = [
                { name: 'id', type: 'number' },
                { name: 'name', type: 'string' },
                { name: 'age', type: 'number' },
            ];

            db.createTable(tableName, columns);
            db.insertInto(tableName, { id: 1, name: 'Alice', age: 30 });
            db.insertInto(tableName, { id: 2, name: 'Bob', age: 25 });
        });

        test('should delete rows based on condition', () => {
            const tableName = 'users';

            db.deleteFrom(tableName, row => row.name === 'Alice');

            const result = db.selectFrom(tableName, []);

            expect(result).toEqual([{ id: 2, name: 'Bob', age: 25 }]);
        });

        test('should throw error if table does not exist', () => {
            const tableName = 'non_existing_table';

            expect(() => db.deleteFrom(tableName, row => row.name === 'Alice')).toThrowError(
                `Table ${tableName} does not exist.`,
            );
        });
    });
});
