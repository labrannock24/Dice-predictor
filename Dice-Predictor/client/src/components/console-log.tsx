import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

interface ConsoleLogProps {
  logs: string[];
}

export function ConsoleLog({ logs }: ConsoleLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="bg-black/80 border border-primary/30 rounded-md font-mono text-xs p-4 h-[200px] flex flex-col font-mono relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />
      <ScrollArea className="flex-1 pr-4">
        <div className="flex flex-col gap-1">
          {logs.slice().reverse().map((log, i) => (
            <div key={i} className="text-primary/80 break-all">
              <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
              {log}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none z-10" />
    </div>
  );
}
