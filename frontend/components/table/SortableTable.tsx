import React from 'react';
import { Table } from 'react-bootstrap';

export type ComputedRow<T> = {
  computed: true;
  label: string;
  content: (rowData: T) => React.JSX.Element | string;
};

export type DataRow<T> = {
  label: string;
  key: keyof T;
  displayAs?: (data: any) => React.JSX.Element | string;
};

export type SortableTableHeader<T> = ComputedRow<T> | DataRow<T>;

interface SortableTableProps<T> {
  headers: SortableTableHeader<T>[];
  data: T[];
}

//retrieves data sorted as a table
const SortableTable = <T,>({ headers, data }: SortableTableProps<T>) => (
  <Table className="md-5">
    <thead>
      <tr>
        {headers.map((header, j) => (
          <th key={'key' in header ? header.key.toString() : 'computed' + j}>
            {header.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody data-testid="data-table-body">
      {data.map((row, i) => (
        <tr key={i}>
          {headers.map((header, j) =>
            'computed' in header ? (
              <td key={'computed' + j}>{header.content(row)}</td>
            ) : (
              <td key={header.key.toString()}>
                {header.displayAs ? (
                  header.displayAs(row[header.key])
                ) : (
                  <span>{row[header.key]}</span>
                )}
              </td>
            ),
          )}
        </tr>
      ))}
    </tbody>
  </Table>
);

export default SortableTable;