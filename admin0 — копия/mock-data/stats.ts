export type StatCard = {
  id: string;
  title: string;
  value: string;
  icon: string;
  trend?: { value: string; isUp: boolean };
  chartData?: { value: number }[];
  color?: string;
};

export const mockStats: StatCard[] = [
  {
    id: "1",
    title: "Количество заказов за день",
    value: "42",
    icon: "clipboard",
    trend: { value: "+12.5%", isUp: true },
    chartData: [{ value: 30 }, { value: 35 }, { value: 32 }, { value: 40 }, { value: 38 }, { value: 45 }, { value: 42 }],
    color: "#f97316"
  },
  {
    id: "2",
    title: "Выручка",
    value: "$2,840",
    icon: "wallet",
    trend: { value: "+8.2%", isUp: true },
    chartData: [{ value: 2100 }, { value: 2400 }, { value: 2200 }, { value: 2800 }, { value: 2600 }, { value: 3000 }, { value: 2840 }],
    color: "#22c55e"
  },
  {
    id: "3",
    title: "Средний чек",
    value: "$68",
    icon: "invoice",
    trend: { value: "-2.4%", isUp: false },
    chartData: [{ value: 70 }, { value: 72 }, { value: 65 }, { value: 68 }, { value: 70 }, { value: 67 }, { value: 68 }],
    color: "#3b82f6"
  },
  {
    id: "4",
    title: "Новые клиенты",
    value: "1,248",
    icon: "users",
    trend: { value: "+24.1%", isUp: true },
    chartData: [{ value: 900 }, { value: 1000 }, { value: 1100 }, { value: 1050 }, { value: 1150 }, { value: 1200 }, { value: 1248 }],
    color: "#8b5cf6"
  },
  {
    id: "5",
    title: "Активные заказы сейчас",
    value: "14",
    icon: "shopping-bag",
    color: "#ec4899"
  },
  {
    id: "6",
    title: "Отмены",
    value: "3",
    icon: "x-circle",
    trend: { value: "-15%", isUp: true }, // Lower is better
    color: "#ef4444"
  },
  {
    id: "7",
    title: "Топ блюда",
    value: "Salmon Set",
    icon: "flame",
    color: "#f59e0b"
  },
  {
    id: "8",
    title: "Загрузка по времени",
    value: "20:00",
    icon: "clock",
    color: "#6366f1"
  },
];

