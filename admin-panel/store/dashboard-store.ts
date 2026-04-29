import { create } from "zustand";

export interface Person {
  id: string;
  name: string;
  email: string;
  jobTitle: string;
  status: string;
  avatar: string;
  tags: string[];
  lastActive: string;
}

export interface Document {
  id: string;
  title: string;
  type: string;
  date: string;
  size: string;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface StatCard {
  title: string;
  value: string;
  trend: string;
  icon: string;
}

interface DashboardState {
  people: Person[];
  documents: Document[];
  chartData: ChartDataPoint[];
  stats: StatCard[];
  recentOrders: any[];
  recentAnalysis: any[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setChartData: (data: ChartDataPoint[]) => void;
  setRecentOrders: (data: any[]) => void;
  setRecentAnalysis: (data: any[]) => void;
  setPeople: (data: any[]) => void;
  getFilteredPeople: () => Person[];
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  people: [],
  documents: [],
  chartData: [],
  stats: [],
  recentOrders: [],
  recentAnalysis: [],
  searchQuery: "",
  setSearchQuery: (query) => {
    set({ searchQuery: query });
  },
  setChartData: (data) => {
    set({ chartData: data });
  },
  setRecentOrders: (data) => {
    set({ recentOrders: data });
  },
  setRecentAnalysis: (data) => {
    set({ recentAnalysis: data });
  },
  setPeople: (data) => {
    set({ people: data as any });
  },
  getFilteredPeople: () => {
    const { people, searchQuery } = get();
    if (!searchQuery) return people;
    const query = searchQuery.toLowerCase();
    return people.filter(
      (person) =>
        person.name.toLowerCase().includes(query) ||
        person.email.toLowerCase().includes(query) ||
        person.jobTitle.toLowerCase().includes(query) ||
        person.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  },
}));
