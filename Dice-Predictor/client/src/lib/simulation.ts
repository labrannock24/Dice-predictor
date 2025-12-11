export interface SimulationState {
  balance: number;
  history: { roll: number; result: 'win' | 'loss'; profit: number; timestamp: number; balance: number }[];
  logs: string[];
  currentBet: number;
  wins: number;
  losses: number;
}

export type Strategy = 'martingale' | 'kelly' | 'flat';

export class BotSimulation {
  private state: SimulationState;
  private baseBet: number;
  private strategy: Strategy;
  private risk: 'low' | 'medium' | 'high';

  constructor(initialBalance: number = 1000, baseBet: number = 1) {
    this.baseBet = baseBet;
    this.strategy = 'martingale';
    this.risk = 'medium';
    this.state = {
      balance: initialBalance,
      history: [],
      logs: ['[SYSTEM] Bot initialized.', '[SYSTEM] Waiting for activation...'],
      currentBet: baseBet,
      wins: 0,
      losses: 0,
    };
  }

  setStrategy(strategy: Strategy) {
    this.strategy = strategy;
    this.log(`[CONFIG] Strategy changed to ${strategy.toUpperCase()}`);
  }

  setRisk(risk: 'low' | 'medium' | 'high') {
    this.risk = risk;
    this.log(`[CONFIG] Risk level set to ${risk.toUpperCase()}`);
  }

  public log(message: string) {
    this.state.logs = [message, ...this.state.logs].slice(0, 50);
  }

  tick(): SimulationState {
    const roll = Math.random() * 100;
    const target = 50; // Standard 50/50 game
    const isWin = roll > target;
    
    // ML "Prediction" Logic (Fake)
    const confidence = Math.random();
    const predictedWin = Math.random() > 0.45; // Slight bias to simulate "smart" bot
    
    let betAmount = this.state.currentBet;

    // Adjust bet based on previous result and strategy
    if (this.state.history.length > 0) {
      const lastResult = this.state.history[0];
      
      if (this.strategy === 'martingale') {
        if (lastResult.result === 'loss') {
          betAmount = lastResult.profit * -1 * 2; // Double down
        } else {
          betAmount = this.baseBet; // Reset
        }
      } else if (this.strategy === 'kelly') {
         // Simplified Kelly
         if (predictedWin && confidence > 0.7) {
            betAmount = this.state.balance * 0.05; // 5% stake on high confidence
         } else {
            betAmount = this.baseBet;
         }
      }
    }

    // Safety caps
    if (betAmount > this.state.balance) betAmount = this.state.balance;
    if (betAmount <= 0) betAmount = this.baseBet;

    const profit = isWin ? betAmount : -betAmount;
    const newBalance = this.state.balance + profit;

    this.state.balance = newBalance;
    this.state.currentBet = betAmount;
    if (isWin) this.state.wins++; else this.state.losses++;

    this.state.history.unshift({
      roll,
      result: isWin ? 'win' : 'loss',
      profit,
      timestamp: Date.now(),
      balance: newBalance // Added balance here
    });
    
    // Keep history manageable
    this.state.history = this.state.history.slice(0, 50);

    const predictionText = predictedWin ? 'HIGHER' : 'LOWER';
    this.log(`[ML-CORE] Confidence: ${(confidence * 100).toFixed(1)}% | Pred: ${predictionText} | Roll: ${roll.toFixed(2)} | ${isWin ? 'WIN' : 'LOSS'} ${profit.toFixed(2)}`);

    return { ...this.state };
  }

  getState(): SimulationState {
    return { ...this.state };
  }
  
  reset() {
      this.state = {
      balance: 1000,
      history: [],
      logs: ['[SYSTEM] Bot reset.', '[SYSTEM] Ready.'],
      currentBet: this.baseBet,
      wins: 0,
      losses: 0,
    };
    return this.state;
  }
}
