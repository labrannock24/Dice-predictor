import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subValue?: string;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

export function StatsCard({ title, value, subValue, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("bg-card/50 border-primary/20 backdrop-blur-sm", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono text-foreground flex items-baseline gap-2">
          {value}
          {trend && (
            <span
              className={cn(
                "text-xs font-normal",
                trend === "up" ? "text-primary" : trend === "down" ? "text-destructive" : "text-muted-foreground"
              )}
            >
              {trend === "up" ? "▲" : trend === "down" ? "▼" : "•"}
            </span>
          )}
        </div>
        {subValue && <p className="text-xs text-muted-foreground mt-1 font-mono">{subValue}</p>}
      </CardContent>
    </Card>
  );
}
