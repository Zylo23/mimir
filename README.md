# Mimir

Mimir is a simple in-memory database library for JavaScript/TypeScript applications. It provides a simple API for creating tables, inserting rows, selecting rows, updating rows, and deleting rows.

## Installation

To install Mimir, you can use npm or yarn:

```bash
npm install mimir
```

or

```bash
yarn add mimir
```

## Usage

Here's a simple example of how to use Mimir:

```typescript
import { Database } from 'mimir';

const db = new Database();

const tableName = 'users';
const columns: ColumnSchema[] = [
    { name: 'id', type: 'number' },
    { name: 'name', type: 'string' },
    { name: 'age', type: 'number' },
];

db.createTable(tableName, columns);
db.insertInto(tableName, { id: 1, name: 'Alice', age: 30 });
db.insertInto(tableName, { id: 2, name: 'Bob', age: 25 });

const result = db.selectFrom(tableName, ['name']);
console.log(result); // [{ name: 'Alice' }, { name: 'Bob' }]
```

## API

### `Database`

The `Database` class represents the in-memory database.

#### `createTable(tableName: string, columns: ColumnSchema[]): void`

Creates a new table with the specified name and columns.

#### `insertInto(tableName: string, row: RowSchema): void`

Inserts a new row into the specified table.

#### `selectFrom(tableName: string, columns: string[]): RowSchema[]`

Selects rows from the specified table and returns them as an array of objects. If no columns are specified, all columns are selected.

#### `update(tableName: string, row: RowSchema, condition: (row: RowSchema) => boolean): void`

Updates rows in the specified table based on the specified condition.

#### `deleteFrom(tableName: string, condition: (row: RowSchema) => boolean): void`

Deletes rows from the specified table based on the specified condition.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or submit a pull request.

## License

Mimir is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
