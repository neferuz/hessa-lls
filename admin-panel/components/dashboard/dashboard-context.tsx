"use client";

import React, { createContext, useContext, useState, useCallback, useSyncExternalStore } from "react";

interface HeaderData {
  title: React.ReactNode;
  description: string;
  actions: React.ReactNode;
}

class HeaderStore {
  private data: HeaderData = { title: "", description: "", actions: null };
  private listeners: Set<() => void> = new Set();

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  };

  getSnapshot = () => this.data;

  setData = (newData: Partial<HeaderData>) => {
    this.data = { ...this.data, ...newData };
    this.listeners.forEach((l) => l());
  };
}

const headerStore = new HeaderStore();

interface DashboardDispatch {
  setHeader: (data: Partial<HeaderData>) => void;
}

const DashboardDispatchContext = createContext<DashboardDispatch | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const setHeader = useCallback((data: Partial<HeaderData>) => {
    headerStore.setData(data);
  }, []);

  return (
    <DashboardDispatchContext.Provider value={{ setHeader }}>
      {children}
    </DashboardDispatchContext.Provider>
  );
}

export function useDashboard() {
  // Added third argument for SSR compatibility in Next.js
  return useSyncExternalStore(
    headerStore.subscribe, 
    headerStore.getSnapshot,
    headerStore.getSnapshot
  );
}

export function useDashboardDispatch() {
  const context = useContext(DashboardDispatchContext);
  if (context === undefined) {
    throw new Error("useDashboardDispatch must be used within a DashboardProvider");
  }
  return context;
}
