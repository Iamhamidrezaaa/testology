import { ColumnDef } from '@tanstack/react-table'
import { format } from 'date-fns-jalali'
import { faIR } from 'date-fns-jalali/locale'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, CheckCircle, Clock, PlayCircle } from 'lucide-react'

export type Task = {
  id: string
  title: string
  description: string
  status: 'pending' | 'in-progress' | 'done'
  dueDate: Date
  startedAt: Date | null
  category: string
  estimatedTime: number
}

export const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="font-vazir"
        >
          عنوان
          <ArrowUpDown className="mr-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'category',
    header: 'دسته‌بندی',
    cell: ({ row }) => {
      const category = row.getValue('category') as string
      return <Badge variant="secondary">{category}</Badge>
    },
  },
  {
    accessorKey: 'status',
    header: 'وضعیت',
    cell: ({ row }) => {
      const status = row.getValue('status') as string
      return (
        <div className="flex items-center gap-2">
          {status === 'done' ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-green-500">انجام شده</span>
            </>
          ) : status === 'in-progress' ? (
            <>
              <PlayCircle className="h-4 w-4 text-blue-500" />
              <span className="text-blue-500">در حال انجام</span>
            </>
          ) : (
            <>
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-orange-500">در انتظار</span>
            </>
          )}
        </div>
      )
    },
  },
  {
    accessorKey: 'dueDate',
    header: 'موعد انجام',
    cell: ({ row }) => {
      const date = row.getValue('dueDate') as Date
      return format(date, 'yyyy/MM/dd', { locale: faIR })
    },
  },
  {
    accessorKey: 'estimatedTime',
    header: 'زمان تخمینی',
    cell: ({ row }) => {
      const time = row.getValue('estimatedTime') as number
      return `${time} دقیقه`
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const task = row.original
      return (
        <div className="flex gap-2">
          {task.status === 'pending' && (
            <Button size="sm" variant="outline">
              شروع تمرین
            </Button>
          )}
          {task.status === 'in-progress' && (
            <Button size="sm" variant="outline" className="bg-green-500 text-white hover:bg-green-600">
              تکمیل تمرین
            </Button>
          )}
        </div>
      )
    },
  },
] 