export type ChartDataPoint = {
  month: string;
  onlineOrders: number;
  dineIn: number;
};

export const mockChartData: ChartDataPoint[] = [
  { month: "Jan", onlineOrders: 600, dineIn: 400 },
  { month: "Feb", onlineOrders: 800, dineIn: 600 },
  { month: "Mar", onlineOrders: 748, dineIn: 512 },
  { month: "Apr", onlineOrders: 900, dineIn: 700 },
  { month: "May", onlineOrders: 500, dineIn: 350 },
  { month: "Jun", onlineOrders: 750, dineIn: 550 },
];

