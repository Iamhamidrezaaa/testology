"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export type Option = {
  value: string
  label: string
}

export interface MultiSelectProps {
  options: Option[]
  selectedValues: Option[]
  onChange: (selected: Option[]) => void
  placeholder?: string
  isSingle?: boolean
}

export function MultiSelect({
  options,
  selectedValues,
  onChange,
  placeholder = "انتخاب کنید...",
  isSingle = false
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (option: Option) => {
    if (isSingle) {
      onChange([option])
      setOpen(false)
    } else {
      const isSelected = selectedValues.some(v => v.value === option.value)
      if (isSelected) {
        onChange(selectedValues.filter(v => v.value !== option.value))
      } else {
        onChange([...selectedValues, option])
      }
    }
  }

  const handleRemove = (value: string) => {
    onChange(selectedValues.filter(v => v.value !== value))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <div className="flex gap-1 flex-wrap">
            {selectedValues.length === 0 && placeholder}
            {selectedValues.map((value) => (
              <Badge
                variant="secondary"
                key={value.value}
                className="mr-1"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(value.value)
                }}
              >
                {value.label}
                <X className="mr-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="جستجو..." />
          <CommandEmpty>موردی یافت نشد.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedValues.some(v => v.value === option.value)
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 