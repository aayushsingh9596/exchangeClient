import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMarket } from "../services/marketServices";
import { IMarket } from "../types/types";
import MarketBar from "../components/MarketBar";
import TradeView from "../components/TradeView";
import DepthAndTrades from "../components/DepthAndTrades";

const Market = () => {
  const { symbol } = useParams<{ symbol: string }>();
  const [market, setMarket] = useState<IMarket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(market);

  useEffect(() => {
    const fetchMarket = async () => {
      if (!symbol) return;

      setLoading(true);
      setError(null);

      try {
        const fetchedMarket = await getMarket(symbol);
        setMarket(fetchedMarket);
      } catch (err) {
        setError("Failed to fetch market data.");
      } finally {
        setLoading(false);
      }
    };

    fetchMarket();
  }, [symbol]);

  if (!symbol)
    return (
      <div className="text-red-500 text-center mt-20 text-lg font-semibold">
        Invalid market symbol.
      </div>
    );

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-500 text-lg animate-pulse">
        Loading market data...
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 text-center mt-20 text-lg font-medium">
        {error}
      </div>
    );

  return (
    <div className="p-4 lg:p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow p-4">
        <MarketBar symbol={symbol} />
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-6 lg:space-y-0">
        <div className="flex-1 bg-white rounded-lg shadow p-4">
          <TradeView symbol={symbol} />
        </div>

        <div className="w-full lg:w-[400px] bg-white rounded-lg shadow p-4">
          <DepthAndTrades symbol={symbol} />
        </div>
      </div>
    </div>
  );
};

export default Market;
