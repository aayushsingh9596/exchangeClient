import { UTCTimestamp } from "lightweight-charts";

interface IMarketFilters {
  price: {
    minPrice: string;
    maxPrice: string;
    tickSize: string;
    maxMultiplier: string;
    minMultiplier: string;
    maxImpactMultiplier: string;
    minImpactMultiplier: string;
    meanMarkPriceBand: {
      maxMultiplier: string;
      minMultiplier: string;
    };
    meanPremiumBand: {
      tolerancePct: string;
    };
    borrowEntryFeeMaxMultiplier: string;
    borrowEntryFeeMinMultiplier: string;
  };
  quantity: {
    minQuantity: string;
    maxQuantity: string;
    stepSize: string;
  };
  leverage: {
    minLeverage: number;
    maxLeverage: number;
    stepSize: number;
  };
}

interface IFunctionType {
  type: "sqrt";
  base: string;
  factor: string;
}

export interface IMarket {
  symbol: string;
  baseSymbol: string;
  quoteSymbol: string;
  marketType: "SPOT";
  filters: IMarketFilters;
  imfFunction: IFunctionType;
  mmfFunction: IFunctionType;
  fundingInterval: number;
  openInterestLimit: string;
  orderBookState: "Open";
  createdAt: string;
}

export interface ITicker {
  symbol: string;
  firstPrice: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  high: string;
  low: string;
  volume: string;
  quoteVolume: string;
  trades: string;
}

export interface IKlineData {
  start: string;
  end: string;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  quoteVolume: string;
  trades: string;
}

export interface ICandleStickData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface ITrade {
  id: number;
  price: string;
  quantity: string;
  quoteQuantity: string;
  timestamp: number;
  isBuyerMaker: boolean;
}

export interface IDepthUpdate {
  E: number;
  T: number;
  U: number;
  a: [string, string][];
  b: [string, string][];
  e: string;
  s: string;
  u: number;
}

export interface ITickerUpdate {
  E: number;
  V: string;
  c: string;
  e: string;
  h: string;
  l: string;
  n: number;
  o: string;
  s: string;
  v: string;
}

export interface IKlineUpdate {
  e: string;  
  E: number; 
  s: string; 
  t: number;
  T: number;
  o: string; 
  c: string; 
  h: string;  
  l: string;  
  v: string;  
  n: number;  
  X: boolean; 
}

export interface ITradeUpdate {
  e: string;
  E: number;
  s: string;
  p: string;
  q: string;
  b: string;
  a: string;
  t: number;
  T: number;
  m: boolean;
}








