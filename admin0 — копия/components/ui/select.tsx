"use client"

import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"

const SelectContext = React.createContext<{
  value?: string
  onValueChange: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
  triggerRect: DOMRect | null
  setTriggerRect: (rect: DOMRect | null) => void
} | null>(null)

export function Select({ 
  children, 
  value, 
  onValueChange 
}: { 
  children: React.ReactNode, 
  value?: string, 
  onValueChange: (value: string) => void 
}) {
  const [open, setOpen] = React.useState(false)
  const [triggerRect, setTriggerRect] = React.useState<DOMRect | null>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen, triggerRect, setTriggerRect }}>
      <div className="relative inline-block w-full" ref={containerRef}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export function SelectTrigger({ 
  children, 
  className 
}: { 
  children: React.ReactNode, 
  className?: string 
}) {
  const context = React.useContext(SelectContext)
  const triggerRef = React.useRef<HTMLButtonElement>(null)

  if (!context) return null

  const handleToggle = () => {
    if (triggerRef.current) {
      context.setTriggerRect(triggerRef.current.getBoundingClientRect())
    }
    context.setOpen(!context.open)
  }

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleToggle}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-xl border border-border/40 bg-zinc-50/50 dark:bg-zinc-900 px-4 py-2 text-[14px] font-medium placeholder:text-muted-foreground focus:outline-none transition-all dark:border-zinc-800 dark:text-zinc-200 select-none",
        className
      )}
    >
      {children}
      <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform", context.open && "rotate-180")} />
    </button>
  )
}

export function SelectValue({ 
  placeholder 
}: { 
  placeholder?: string 
}) {
  const context = React.useContext(SelectContext)
  if (!context) return null
  return (
    <span className={cn("select-none", !context.value && "text-muted-foreground/50")}>
      {context.value || placeholder}
    </span>
  )
}

export function SelectContent({ 
  children, 
  className 
}: { 
  children: React.ReactNode, 
  className?: string 
}) {
  const context = React.useContext(SelectContext)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [styles, setStyles] = React.useState<React.CSSProperties>({})

  React.useEffect(() => {
    if (context?.open && context.triggerRect && contentRef.current) {
      const rect = context.triggerRect
      const contentHeight = contentRef.current.offsetHeight
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      
      let top = rect.bottom + 8
      let flip = false

      if (spaceBelow < contentHeight && spaceAbove > contentHeight) {
        top = rect.top - contentHeight - 8
        flip = true
      }

      setStyles({
        position: 'fixed',
        top: `${top}px`,
        left: `${rect.left}px`,
        width: `${rect.width}px`,
        zIndex: 10000,
        opacity: 1,
        transform: flip ? 'translateY(4px)' : 'translateY(-4px)'
      })
    }
  }, [context?.open, context?.triggerRect])

  if (!context || !context.open) return null

  return (
    <div 
      ref={contentRef}
      style={styles}
      className={cn(
        "overflow-hidden rounded-2xl border border-border/80 bg-white p-2 animate-in fade-in duration-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-none pointer-events-auto",
        className
      )}
    >
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto scrollbar-none">
        {children}
      </div>
    </div>
  )
}

export function SelectItem({ 
  value, 
  children, 
  className 
}: { 
  value: string, 
  children: React.ReactNode, 
  className?: string 
}) {
  const context = React.useContext(SelectContext)
  if (!context) return null

  const isSelected = context.value === value

  return (
    <button
      type="button"
      onClick={() => {
        context.onValueChange(value)
        context.setOpen(false)
      }}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-lg py-2.5 pl-3 pr-8 text-[12px] font-medium outline-none transition-all hover:bg-muted dark:hover:bg-zinc-800 dark:text-zinc-300 whitespace-nowrap",
        isSelected && "bg-primary/5 text-primary dark:bg-primary/10",
        className
      )}
    >
      <span>{children}</span>
      {isSelected && (
        <span className="absolute right-3 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-3 w-3" />
        </span>
      )}
    </button>
  )
}
