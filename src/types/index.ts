export interface Task {
  id: number;
  title: string;
  start_date: Date | undefined;
  end_date: Date | undefined;
  boards: Board[];
  created_at: string;
}

export interface Board {
  id: string;
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
  content: string;
  isCompleted: boolean;
}
