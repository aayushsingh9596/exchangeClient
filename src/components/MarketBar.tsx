import { useEffect, useState } from "react";
import { ITicker, ITickerUpdate } from "../types/types";
import { getTicker } from "../services/marketServices";
import { SignallingManager } from "../utils/SignallingManager";

interface Props {
  symbol: string;
}

const MarketBar = ({ symbol }: Props) => {
  const [ticker, setTicker] = useState<ITicker | null>(null);

  useEffect(() => {
    getTicker(symbol).then((result) => {
      if (result.success) setTicker(result.ticker);
    });
    SignallingManager.getInstance().registerCallback(
      "ticker",
      (data: Partial<ITickerUpdate>) => {
        setTicker((prevTicker) => {
          if (!prevTicker) return prevTicker;
          if (!data || !data.c || !data.h || !data.l || !data.V) return prevTicker;
          const newTicker={...prevTicker,
            lastPrice: data.c,
            high: data.h,
            low: data.l,
            volume: data.V,}

            console.log('newTicker',newTicker);

          return newTicker;
        });
      },
      `ticker.${symbol}.marketbar`
    );
    SignallingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`ticker.${symbol}`],
    });

    return () => {
      SignallingManager.getInstance().deregisterCallback("ticker", `ticker.${symbol}.marketbar`);
      SignallingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`ticker.${symbol}`],
      });
    };
  }, [symbol]);

  if (!ticker) return null;

  return (
    <div className="flex flex-wrap gap-6 items-center bg-white rounded-lg shadow p-4 text-sm font-medium text-gray-800">
      <div className="text-base font-bold text-black">{ticker.symbol}</div>
      <div className="text-green-600 font-semibold text-base">{ticker.lastPrice}</div>

      <div className="flex flex-col items-center">
        <span className="text-gray-500">24H Change</span>
        <span className="text-blue-600">{(+ticker.priceChangePercent * 100).toFixed(2)}%</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-gray-500">24H High</span>
        <span className="text-green-700">{ticker.high}</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-gray-500">24H Low</span>
        <span className="text-red-600">{ticker.low}</span>
      </div>

      <div className="flex flex-col items-center">
        <span className="text-gray-500">24H Volume (USDC)</span>
        <span className="text-gray-700">{ticker.quoteVolume}</span>
      </div>
    </div>
  );
};

export default MarketBar;
