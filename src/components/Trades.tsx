import { useEffect, useState } from "react";
import { getTrades } from "../services/marketServices";
import { ITrade, ITradeUpdate } from "../types/types";
import { SignallingManager } from "../utils/SignallingManager";

interface Props {
  symbol: string;
}

const Trades = ({ symbol }: Props) => {
  const [trades, setTrades] = useState<ITrade[]>([]);

  useEffect(() => {
    getTrades(symbol).then(result => {
      const fetchedTrades = result.trades;
      setTrades(fetchedTrades);
    });

    SignallingManager.getInstance().registerCallback(
      "trade",
      (data: ITradeUpdate) => {
        console.log("Trade update Data inside Trades", data);
      },
      `trade.${symbol}`
    );
    SignallingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`trade.${symbol}`],
    });

    return () => {
      SignallingManager.getInstance().deregisterCallback(
        "trade",
        `trade.${symbol}`
      );
      SignallingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`trade.${symbol}`],
      });
    };
  }, [symbol]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between font-semibold text-gray-700 mb-4">
        <div className="w-1/3 text-center">Price (USDC)</div>
        <div className="w-1/3 text-center">Qty (BTC)</div>
        <div className="w-1/3 text-center">Time</div>
      </div>

      {trades.map((trade) => (
        <div
          key={trade.id}
          className="flex items-center justify-between py-2 px-4 border-t border-gray-200 hover:bg-gray-100"
        >
          <div className="w-1/3 text-center text-gray-800">{trade.price}</div>
          <div className="w-1/3 text-center text-gray-800">{trade.quantity}</div>
          <div className="w-1/3 text-center text-gray-500">
            {new Date(trade.timestamp).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: false,
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Trades;
