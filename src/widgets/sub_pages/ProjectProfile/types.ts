
export interface TableColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}



  export type Specialist = {
    name: string;
    avatar: string;
    inWork: number;
    inReview: number;
    done: number;
  };
  