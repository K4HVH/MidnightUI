import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { Table, type Column } from '../../src/components/display/Table';
import { createSignal } from 'solid-js';

interface TestData {
  id: string;
  name: string;
  age: number;
}

const testData: TestData[] = [
  { id: '1', name: 'Alice', age: 30 },
  { id: '2', name: 'Bob', age: 25 },
  { id: '3', name: 'Carol', age: 35 },
];

const basicColumns: Column<TestData>[] = [
  { key: 'name', header: 'Name', cell: (row) => row.name },
  { key: 'age', header: 'Age', cell: (row) => row.age },
];

describe('Table', () => {
  it('renders table with data', () => {
    render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
      />
    ));

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Age')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Carol')).toBeInTheDocument();
  });

  it('renders empty state when no data', () => {
    render(() => (
      <Table
        columns={basicColumns}
        data={[]}
        getRowId={(row) => row.id}
        emptyMessage="No users found"
      />
    ));

    expect(screen.getByText('No users found')).toBeInTheDocument();
  });

  it('renders loading skeleton', () => {
    const { container } = render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        loading
      />
    ));

    const skeletonRows = container.querySelectorAll('.table__row--skeleton');
    expect(skeletonRows.length).toBe(5);
  });

  it('applies variant classes', () => {
    const { container } = render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        variant="emphasized"
      />
    ));

    expect(container.querySelector('.table--emphasized')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const { container } = render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        size="compact"
      />
    ));

    expect(container.querySelector('.table--compact')).toBeInTheDocument();
  });

  it('applies sticky header class', () => {
    const { container } = render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        stickyHeader
      />
    ));

    expect(container.querySelector('.table--sticky-header')).toBeInTheDocument();
  });

  it('renders selection checkboxes when selectable', () => {
    render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        selectable
      />
    ));

    const checkboxes = screen.getAllByRole('checkbox');
    // 1 header checkbox + 3 row checkboxes
    expect(checkboxes.length).toBe(4);
  });

  it('handles row selection', () => {
    const [selected, setSelected] = createSignal<Set<string>>(new Set());

    render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        selectable
        selectedRows={selected()}
        onSelectionChange={setSelected}
      />
    ));

    const checkboxes = screen.getAllByRole('checkbox');
    const firstRowCheckbox = checkboxes[1]; // Skip header checkbox

    fireEvent.click(firstRowCheckbox);
    expect(selected().has('1')).toBe(true);

    fireEvent.click(firstRowCheckbox);
    expect(selected().has('1')).toBe(false);
  });

  it('handles select all', () => {
    const [selected, setSelected] = createSignal<Set<string>>(new Set());

    render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        selectable
        selectedRows={selected()}
        onSelectionChange={setSelected}
      />
    ));

    const checkboxes = screen.getAllByRole('checkbox');
    const selectAllCheckbox = checkboxes[0];

    fireEvent.click(selectAllCheckbox);
    expect(selected().size).toBe(3);
    expect(selected().has('1')).toBe(true);
    expect(selected().has('2')).toBe(true);
    expect(selected().has('3')).toBe(true);

    fireEvent.click(selectAllCheckbox);
    expect(selected().size).toBe(0);
  });

  it('handles sorting', () => {
    const [sortKey, setSortKey] = createSignal<string>();
    const [sortDirection, setSortDirection] = createSignal<'asc' | 'desc'>('asc');

    const handleSort = (key: string, direction: 'asc' | 'desc') => {
      setSortKey(key);
      setSortDirection(direction);
    };

    render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        sortKey={sortKey()}
        sortDirection={sortDirection()}
        onSort={handleSort}
      />
    ));

    const nameHeader = screen.getByText('Name').closest('th');
    expect(nameHeader).toBeInTheDocument();

    fireEvent.click(nameHeader!);
    expect(sortKey()).toBe('name');
    expect(sortDirection()).toBe('asc');

    fireEvent.click(nameHeader!);
    expect(sortDirection()).toBe('desc');
  });

  it('respects column sortable property', () => {
    const columnsWithNonSortable: Column<TestData>[] = [
      { key: 'name', header: 'Name', cell: (row) => row.name, sortable: false },
      { key: 'age', header: 'Age', cell: (row) => row.age },
    ];

    const { container } = render(() => (
      <Table
        columns={columnsWithNonSortable}
        data={testData}
        getRowId={(row) => row.id}
        onSort={() => {}}
      />
    ));

    const headers = container.querySelectorAll('.table__header-cell');
    const nameHeader = Array.from(headers).find(h => h.textContent?.includes('Name'));
    const ageHeader = Array.from(headers).find(h => h.textContent?.includes('Age'));

    expect(nameHeader?.classList.contains('table__header-cell--sortable')).toBe(false);
    expect(ageHeader?.classList.contains('table__header-cell--sortable')).toBe(true);
  });

  it('applies custom class', () => {
    const { container } = render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        class="custom-table"
      />
    ));

    expect(container.querySelector('.custom-table')).toBeInTheDocument();
  });

  it('applies column alignment', () => {
    const alignedColumns: Column<TestData>[] = [
      { key: 'name', header: 'Name', cell: (row) => row.name, align: 'left' },
      { key: 'age', header: 'Age', cell: (row) => row.age, align: 'right' },
    ];

    const { container } = render(() => (
      <Table
        columns={alignedColumns}
        data={testData}
        getRowId={(row) => row.id}
      />
    ));

    const cells = container.querySelectorAll('td');
    const firstCell = cells[0];
    const secondCell = cells[1];

    expect(firstCell.style.textAlign).toBe('left');
    expect(secondCell.style.textAlign).toBe('right');
  });

  it('applies column width', () => {
    const widthColumns: Column<TestData>[] = [
      { key: 'name', header: 'Name', cell: (row) => row.name, width: '200px' },
      { key: 'age', header: 'Age', cell: (row) => row.age, width: '100px' },
    ];

    const { container } = render(() => (
      <Table
        columns={widthColumns}
        data={testData}
        getRowId={(row) => row.id}
      />
    ));

    const headerCells = container.querySelectorAll('th');
    // Skip checkbox column if present, find first data column
    const nameHeader = Array.from(headerCells).find(h => h.textContent?.includes('Name'));
    const ageHeader = Array.from(headerCells).find(h => h.textContent?.includes('Age'));

    expect(nameHeader?.style.width).toBe('200px');
    expect(ageHeader?.style.width).toBe('100px');
  });

  it('shows selected row styling', () => {
    const { container } = render(() => (
      <Table
        columns={basicColumns}
        data={testData}
        getRowId={(row) => row.id}
        selectable
        selectedRows={new Set(['1'])}
      />
    ));

    const rows = container.querySelectorAll('.table__row');
    const firstDataRow = rows[0];

    expect(firstDataRow.classList.contains('table__row--selected')).toBe(true);
  });
});
