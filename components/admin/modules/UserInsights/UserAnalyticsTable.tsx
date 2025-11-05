'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';
import { faIR } from 'date-fns/locale';

interface UserAnalytics {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  test: {
    id: string;
    title: string;
  } | null;
  durationSeconds: number;
  completed: boolean;
  visitedAt: string;
}

interface UserAnalyticsTableProps {
  data: UserAnalytics[];
  onUserClick: (userId: string) => void;
}

export function UserAnalyticsTable({ data, onUserClick }: UserAnalyticsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>کاربر</TableHead>
            <TableHead>تست</TableHead>
            <TableHead>تاریخ</TableHead>
            <TableHead>مدت زمان</TableHead>
            <TableHead>وضعیت</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((insight) => (
            <TableRow
              key={insight.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onUserClick(insight.user.id)}
            >
              <TableCell>
                <div>
                  <div className="font-medium">{insight.user.name || 'کاربر ناشناس'}</div>
                  <div className="text-sm text-gray-500">{insight.user.email}</div>
                </div>
              </TableCell>
              <TableCell>{insight.test?.title || 'بدون عنوان'}</TableCell>
              <TableCell>
                {formatDistanceToNow(new Date(insight.visitedAt), {
                  addSuffix: true,
                  locale: faIR,
                })}
              </TableCell>
              <TableCell>{Math.round(insight.durationSeconds / 60)} دقیقه</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    insight.completed
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {insight.completed ? 'تکمیل شده' : 'ناتمام'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 