export interface TableColumn<T> {
    header: string;
    accessor: keyof T | ((row: T) => React.ReactNode);
}