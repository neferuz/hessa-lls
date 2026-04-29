"use client";

import { useEffect } from "react";
import { useDashboardDispatch } from "./dashboard-context";

export function usePageHeader({ 
  title, 
  description = "", 
  actions = null 
}: { 
  title: React.ReactNode; 
  description?: string; 
  actions?: React.ReactNode;
}) {
  const { setHeader } = useDashboardDispatch();

  useEffect(() => {
    setHeader({ title, description, actions });
  }, [title, description, actions, setHeader]);
}
