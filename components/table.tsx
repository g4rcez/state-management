import React, { Fragment, useMemo, useRef } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { Flex } from "./flex";
import { Skeleton, SkeletonRectBase } from "./skeleton";

type CellProps<T, V extends T[keyof T]> = {
  row: T;
  value: V;
  index: number;
};

type OmitKeys<T, K extends keyof T> = Omit<T, K>;

type TH = React.DetailedHTMLProps<React.ThHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;

type Col<T, V = never> = {
  props?: TH;
  id: keyof T;
  header: React.ReactNode;
  __label: "TableColLabel";
  Component?: (props: { row: T; index: number; value: V }) => React.ReactNode;
  cell?: React.DetailedHTMLProps<React.TdHTMLAttributes<HTMLTableCellElement>, HTMLTableCellElement>;
};

const DefaultCell = <T, V extends T[keyof T]>(props: CellProps<T, V>) => <Fragment>{props.value}</Fragment>;

const PaginateButton: React.FC<{ disabled: boolean; onClick?: () => void; Icon: React.FC<any>; ariaLabel: string }> = ({
  disabled,
  onClick,
  Icon,
  ariaLabel,
}) => (
  <button aria-label={ariaLabel} disabled={disabled} className={`text-neutral-high ${disabled ? "opacity-20" : ""}`} onClick={onClick}>
    <Icon className="pointer-events-none" />
  </button>
);

const CellHeader: React.FC<TH & { useReorder: boolean }> = ({ useReorder, ...props }) => (
  <th {...props} className={`th-resizer px-4 py-small ${props.className ?? ""}`} data-title={props.title!}>
    <div className="relative items-center flex">{props.children}</div>
  </th>
);

export type Column<T> = Col<T, any>;

export const column =
  <T,>() =>
  <V extends keyof T>(key: V, props: OmitKeys<Col<T, T[V]>, "id" | "__label">): Col<T, T[V]> => ({
    ...props,
    id: key,
    __label: "TableColLabel" as const,
  });

export type TablePaginationProps = {
  changePageSize: (items: number) => void;
  backDisabled: boolean;
  goBackward: () => void;
  goForward: () => void;
  itemsPerPage: number;
  nextDisabled: boolean;
  page: number;
  pageOptions: number[];
  pages: number;
  totalItems: number;
};

type Props<T> = {
  items: T[];
  name: string;
  columns: Col<T>[];
  reference: keyof T;
} & Partial<{
  loading: boolean;
  useResize: boolean;
  useReorder: boolean;
  emptyMessage: string;
  header: React.ReactNode;
  footer: React.ReactNode;
  pagination?: TablePaginationProps;
}>;

export function Table<T>({
  name,
  items,
  footer,
  header,
  columns,
  reference,
  loading = false,
  useResize = true,
  useReorder = false,
  pagination = undefined,
  emptyMessage = "What are you searching for?",
}: Props<T>) {
  const loadingPlaceholder = useMemo(
    () => (loading ? Array.from({ length: pagination?.itemsPerPage ?? 10 }) : []),
    [pagination?.itemsPerPage, loading]
  );
  const ref = useRef<HTMLTableElement>(null);
  const defaultPageOptions = useMemo(
    () =>
      pagination === undefined
        ? []
        : Array.from(new Set<number>([...pagination?.pageOptions, pagination?.itemsPerPage].sort((a, b) => a - b)).values()),
    [pagination]
  );

  return (
    <section className="w-full block overflow-x-auto">
      {header && <header>{header}</header>}
      <table id={name} ref={ref} results={items.length} className={`w-full super-table table text-left border-collapse overflow-x-auto shadow-1`}>
        <thead className="text-default border-b border-slate-50/50 super-table-header">
          <tr aria-rowindex={1}>
            {columns.map((column, index) => (
              <CellHeader
                {...column.props}
                useReorder={useReorder}
                aria-colindex={index + 1}
                title={column.id as string}
                key={`table-header-${column.id}-${index}-${name}`}
              >
                {column.header}
              </CellHeader>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? loadingPlaceholder.map((_, index) => (
                <tr key={`table-loading-item-${index}`} aria-rowindex={index + 2}>
                  {columns.map((col, colIndex) => (
                    <td className="p-4" key={`td-col-loading-${col.id}-${index}-${colIndex}`}>
                      <Skeleton
                        radius={1}
                        height="1.5rem"
                        className="pt-1"
                        width={index % 2 === 0 ? `${85 + Math.random() * 15}%` : `${80 + Math.random() * 10}%`}
                      >
                        <SkeletonRectBase />
                      </Skeleton>
                    </td>
                  ))}
                </tr>
              ))
            : items.map((row, index) => (
                <tr key={`table-row-${index}`} aria-rowindex={index + 2}>
                  {columns.map((column, colIndex) => {
                    const Component = (column.Component as React.FC<CellProps<typeof row, any>>) ?? DefaultCell;
                    return (
                      <td
                        {...column.cell}
                        className={`px-4 py-2 text-sm ${column.cell?.className ?? ""}`}
                        key={`table-cell-${column.id}-${index}-${colIndex}-${row[reference]}`}
                      >
                        <Component index={index} row={row} value={row[column.id]} />
                      </td>
                    );
                  })}
                </tr>
              ))}
        </tbody>
      </table>
      {items.length === 0 && !loading && (
        <Flex className="my-2">
          <p>Nothing to show</p>
        </Flex>
      )}
    </section>
  );
}
