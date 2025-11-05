import { format } from 'date-fns';
// import { fa } from 'date-fns/locale'; // Commented out as fa locale is not available
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart as ReLineChart, Line } from 'recharts';

export function TotalCard({ title, value, icon }: { title: string; value: number; icon?: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value.toLocaleString()}</div>
      </CardContent>
    </Card>
  );
}

export function BarChart({ data, xKey, yKey, title }: { data: any[]; xKey: string; yKey: string; title?: string }) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xKey} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={yKey} fill="#8884d8" />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function LineChart({ data, xKey, yKey, title }: { data: any[]; xKey: string; yKey: string; title?: string }) {
  return (
    <Card>
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ReLineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xKey} 
                tickFormatter={(date) => format(new Date(date), 'MM/dd')}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => format(new Date(date), 'yyyy/MM/dd')}
              />
              <Legend />
              <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
            </ReLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function DateRangePicker({ 
  value, 
  onChange 
}: { 
  value: { from: Date; to: Date }; 
  onChange: (range: { from: Date; to: Date }) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value.from ? (
            value.to ? (
              <>
                {format(value.from, 'yyyy/MM/dd')} - {format(value.to, 'yyyy/MM/dd')}
              </>
            ) : (
              format(value.from, 'yyyy/MM/dd')
            )
          ) : (
            <span>انتخاب بازه زمانی</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={value.from}
          selected={value}
          onSelect={(range: any) => onChange(range)}
          numberOfMonths={2}
          // locale={fa} // Commented out as fa locale is not available
        />
      </PopoverContent>
    </Popover>
  );
}

export function TestTypeFilter({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="نوع تست" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">همه تست‌ها</SelectItem>
        <SelectItem value="personality">شخصیت‌شناسی</SelectItem>
        <SelectItem value="psychology">روانشناسی</SelectItem>
        <SelectItem value="iq">هوش</SelectItem>
      </SelectContent>
    </Select>
  );
} 