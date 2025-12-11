import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LiveChartProps {
  data: { timestamp: number; profit: number; roll: number; balance: number }[];
}

export function LiveChart({ data }: LiveChartProps) {
  // Transform data for chart if needed, but Recharts handles arrays well.
  // We want to show balance growth over time.
  const chartData = [...data].reverse().map((d, i) => ({
      ...d,
      index: i
  }));

  return (
    <Card className="col-span-1 lg:col-span-3 bg-card/50 border-primary/20 backdrop-blur-sm h-full min-h-[300px]">
      <CardHeader>
        <CardTitle className="text-primary font-mono text-sm uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          Live Balance Velocity
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(150 100% 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(150 100% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 15% 25%)" vertical={false} />
            <XAxis 
                dataKey="index" 
                hide 
            />
            <YAxis 
                stroke="hsl(150 40% 50%)" 
                fontSize={12} 
                tickFormatter={(value) => `$${value}`}
                domain={['auto', 'auto']}
                width={60}
            />
            <Tooltip 
                contentStyle={{ 
                    backgroundColor: 'hsl(220 15% 10%)', 
                    borderColor: 'hsl(150 30% 20%)',
                    color: 'hsl(150 100% 50%)',
                    fontFamily: 'JetBrains Mono'
                }}
                itemStyle={{ color: 'hsl(150 100% 50%)' }}
            />
            <Area 
                type="monotone" 
                dataKey="balance" 
                stroke="hsl(150 100% 50%)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorBalance)" 
                isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
