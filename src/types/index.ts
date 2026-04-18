export interface Tool {
  name: string;
  icon: React.ReactNode;
  subTools: Tool[];
}