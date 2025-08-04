import { describe, it, expect, beforeEach } from 'vitest';

// Mock contract implementation
class CreditPredictionMarket {
  admin: string = 'ADMIN';
  markets = new Map<number, any>();
  balances = new Map<string, bigint>();
  stakes = new Map<string, any>();
  marketCounter = 1;

  createMarket(borrower: string, deadline: number) {
    const id = this.marketCounter++;
    this.markets.set(id, {
      borrower,
      deadline,
      resolved: false,
      outcome: undefined,
    });
    return { success: true, value: id };
  }

  deposit(sender: string, amount: bigint) {
    const current = this.balances.get(sender) || 0n;
    this.balances.set(sender, current + amount);
    return { success: true, value: true };
  }

  stake(sender: string, marketId: number, outcome: boolean, amount: bigint, blockHeight: number) {
    const market = this.markets.get(marketId);
    if (!market || market.resolved || blockHeight >= market.deadline) return { success: false, value: false };

    const key = `${marketId}:${sender}`;
    this.stakes.set(key, { outcome, amount });

    const balance = this.balances.get(sender) || 0n;
    if (balance < amount) return { success: false, value: false };

    this.balances.set(sender, balance - amount);
    return { success: true, value: true };
  }

  resolveMarket(marketId: number, outcome: boolean, blockHeight: number) {
    const market = this.markets.get(marketId);
    if (!market || market.resolved || blockHeight >= market.deadline) return { success: false, value: false };

    market.resolved = true;
    market.outcome = outcome;
    return { success: true, value: true };
  }

  claimReward(sender: string, marketId: number) {
    const market = this.markets.get(marketId);
    if (!market || !market.resolved) return { success: false, value: false };

    const key = `${marketId}:${sender}`;
    const stake = this.stakes.get(key);
    if (!stake) return { success: false, value: false };

    if (stake.outcome === market.outcome) {
      const reward = stake.amount * 2n;
      const current = this.balances.get(sender) || 0n;
      this.balances.set(sender, current + reward);
      return { success: true, value: true };
    }

    return { success: false, value: false };
  }
}

describe('Credit Prediction Market', () => {
  let contract: CreditPredictionMarket;

  beforeEach(() => {
    contract = new CreditPredictionMarket();
  });

  it('should allow admin to create a market', () => {
    const market = contract.createMarket('BORROWER', 2000);
    expect(market.success).toBe(true);
    expect(typeof market.value).toBe('number');
  });

  it('should allow deposit and track balances', () => {
    const result = contract.deposit('STU1', 1000n);
    expect(result.success).toBe(true);
    expect(contract.balances.get('STU1')).toBe(1000n);
  });

  it('should allow staking on a market', () => {
    contract.deposit('STU1', 1000n);
    const market = contract.createMarket('BORROWER', 2000);
    const result = contract.stake('STU1', market.value!, true, 500n, 1500);
    expect(result.value).toBe(true);
    expect(contract.balances.get('STU1')).toBe(500n);
  });

  it('should resolve a market and reward winners', () => {
    contract.deposit('STU1', 1000n);
    const market = contract.createMarket('BORROWER', 2000);
    contract.stake('STU1', market.value!, true, 500n, 1500);

    const resolve = contract.resolveMarket(market.value!, true, 1600);
    expect(resolve.value).toBe(true);

    const result = contract.claimReward('STU1', market.value!);
    expect(result.value).toBe(true);
    expect(contract.balances.get('STU1')).toBe(1500n); // 1000 - 500 + 1000
  });

  it('should resolve a market and deny reward to losers', () => {
    contract.deposit('STU2', 1000n);
    const market = contract.createMarket('BORROWER', 2000);
    contract.stake('STU2', market.value!, false, 1000n, 1500);

    const resolve = contract.resolveMarket(market.value!, true, 1600);
    expect(resolve.value).toBe(true);

    const result = contract.claimReward('STU2', market.value!);
    expect(result.value).toBe(false);
    expect(contract.balances.get('STU2')).toBe(0n); // Lost everything
  });

  it('should not allow staking after market deadline', () => {
    contract.deposit('STU1', 1000n);
    const market = contract.createMarket('BORROWER', 1500);
    const result = contract.stake('STU1', market.value!, true, 500n, 1600);
    expect(result.value).toBe(false);
  });
});
