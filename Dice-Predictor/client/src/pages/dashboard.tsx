import { useEffect, useState, useRef } from "react";
import { BotSimulation, SimulationState } from "@/lib/simulation";
import { StatsCard } from "@/components/stats-card";
import { LiveChart } from "@/components/live-chart";
import { ConsoleLog } from "@/components/console-log";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Square, RefreshCcw, Activity, ShieldAlert, Cpu } from "lucide-react";
import stockImage from '@assets/stock_images/cyberpunk_digital_da_53f02d0b.jpg';

export default function Dashboard() {
  const [isActive, setIsActive] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [isConnected, setIsConnected] = useState(false);
  const botRef = useRef<BotSimulation>(new BotSimulation());
  const [state, setState] = useState<SimulationState>(botRef.current.getState());

  // Check for Chrome Extension environment
  useEffect(() => {
    const checkExtensionConnection = async () => {
      if (typeof chrome !== 'undefined' && chrome.tabs) {
        try {
          const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
          if (tabs[0]?.id) {
            chrome.tabs.sendMessage(
              tabs[0].id, 
              { action: "PING" }, 
              (response: { status: string; url?: string }) => {
                if (chrome.runtime.lastError) {
                  console.log('Not running as extension popup');
                  return;
                }
                if (response?.status === "CONNECTED") {
                  setIsConnected(true);
                  botRef.current.log(`[EXT] Connected to: ${tabs[0].url || 'Active Tab'}`);
                }
              }
            );
          }
        } catch (e) {
          console.log('Running in web mode, not as extension');
        }
      }
    };
    checkExtensionConnection();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        const newState = botRef.current.tick();
        setState({ ...newState });
      }, speed);
    }

    return () => clearInterval(interval);
  }, [isActive, speed]);

  const toggleBot = () => setIsActive(!isActive);
  
  const resetBot = () => {
    setIsActive(false);
    const newState = botRef.current.reset();
    setState({ ...newState });
  };

  const winRate = state.wins + state.losses > 0 
    ? ((state.wins / (state.wins + state.losses)) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url(${stockImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'hue-rotate(120deg) contrast(1.2)'
        }}
      />
      <div className="scanline" />

      {/* Main Layout */}
      <div className="relative z-10 p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Header Section */}
        <header className="col-span-1 lg:col-span-4 flex justify-between items-center border-b border-primary/30 pb-4 mb-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tighter text-glow flex items-center gap-3">
              <Cpu className="w-8 h-8 text-primary" />
              AUTOBET<span className="text-primary">.ML</span>
            </h1>
            <p className="text-muted-foreground font-mono text-sm mt-1">
              NEURAL NETWORK PREDICTION ENGINE V2.4
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isConnected ? 'border-primary bg-primary/10 text-primary' : 'border-muted text-muted-foreground'}`}>
               <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
               <span className="font-mono text-xs font-bold">{isConnected ? 'TAB CONNECTED' : 'SIMULATION MODE'}</span>
            </div>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${isActive ? 'border-primary bg-primary/10 text-primary' : 'border-muted text-muted-foreground'}`}>
              <Activity className={`w-4 h-4 ${isActive && 'animate-pulse'}`} />
              <span className="font-mono text-xs font-bold">{isActive ? 'SYSTEM ONLINE' : 'STANDBY'}</span>
            </div>
          </div>
        </header>

        {/* Stats Row */}
        <div className="col-span-1 lg:col-span-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatsCard 
            title="Current Balance" 
            value={`$${state.balance.toFixed(2)}`} 
            trend={state.balance > 1000 ? 'up' : state.balance < 1000 ? 'down' : 'neutral'}
            subValue="BTC 0.0421"
          />
          <StatsCard 
            title="Session Profit" 
            value={`${(state.balance - 1000).toFixed(2)}`} 
            trend={(state.balance - 1000) > 0 ? 'up' : (state.balance - 1000) < 0 ? 'down' : 'neutral'}
          />
          <StatsCard 
            title="Win Rate" 
            value={`${winRate}%`}
            subValue={`${state.wins}W - ${state.losses}L`}
          />
          <StatsCard 
            title="Next Bet Size" 
            value={`$${state.currentBet.toFixed(2)}`}
            subValue="Calculated Risk"
          />
        </div>

        {/* Main Chart Area */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <LiveChart data={state.history} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-card/50 border border-primary/20 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-primary font-mono text-sm mb-4 uppercase">Prediction Confidence</h3>
                <div className="space-y-4">
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs font-mono text-muted-foreground">
                                <span>MODEL_LAYER_{i+1}</span>
                                <span>{(Math.random() * 100).toFixed(1)}%</span>
                            </div>
                            <div className="h-1 bg-muted rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-primary/50" 
                                    style={{ width: `${Math.random() * 100}%` }} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             <div className="bg-card/50 border border-primary/20 p-4 rounded-lg backdrop-blur-sm">
                <h3 className="text-primary font-mono text-sm mb-4 uppercase">Recent Patterns</h3>
                <div className="flex gap-2 font-mono text-xs">
                    {state.history.slice(0, 10).map((h, i) => (
                        <div 
                            key={i} 
                            className={`w-6 h-8 flex items-center justify-center rounded border ${h.result === 'win' ? 'border-primary text-primary' : 'border-destructive text-destructive'}`}
                        >
                            {h.result === 'win' ? 'W' : 'L'}
                        </div>
                    ))}
                </div>
             </div>
          </div>
        </div>

        {/* Control Panel (Sidebar) */}
        <div className="col-span-1 bg-card border border-primary/20 rounded-lg p-6 space-y-8 h-fit backdrop-blur-md">
          
          <div>
            <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                CONTROLS
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Execution Speed</Label>
                <Slider 
                    value={[1000 - speed]} 
                    max={950} 
                    min={0} 
                    step={50} 
                    onValueChange={(v) => setSpeed(1000 - v[0])}
                    className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground font-mono">
                    <span>SLOW</span>
                    <span>FAST</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Risk Strategy</Label>
                <Select onValueChange={(v: any) => botRef.current.setStrategy(v)} defaultValue="martingale">
                  <SelectTrigger>
                    <SelectValue placeholder="Select Strategy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="martingale">Martingale (Aggressive)</SelectItem>
                    <SelectItem value="kelly">Kelly Criterion (Smart)</SelectItem>
                    <SelectItem value="flat">Flat Bet (Safe)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label>Auto-Stop Loss</Label>
                <Switch />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-6 border-t border-primary/10">
            <Button 
                className={`w-full font-mono font-bold tracking-wider ${isActive ? 'bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90 text-black'}`}
                size="lg"
                onClick={toggleBot}
            >
              {isActive ? (
                <>
                    <Square className="w-4 h-4 mr-2 fill-current" />
                    DEACTIVATE
                </>
              ) : (
                <>
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    ACTIVATE BOT
                </>
              )}
            </Button>
            
            <Button 
                variant="outline" 
                className="w-full font-mono text-xs"
                onClick={resetBot}
            >
              <RefreshCcw className="w-3 h-3 mr-2" />
              RESET SIMULATION
            </Button>
          </div>

          <div className="pt-6 border-t border-primary/10">
            <Label className="text-xs font-mono text-muted-foreground mb-2 block">SYSTEM LOGS</Label>
            <ConsoleLog logs={state.logs} />
          </div>

        </div>

      </div>
    </div>
  );
}
