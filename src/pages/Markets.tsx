import { useEffect, useState } from "react";
import { getMarkets } from "../services/marketServices";
import { IMarket } from "../types/types";
import { useNavigate } from "react-router-dom";

const Markets = () => {
    const [markets, setMarkets] = useState<IMarket[]>();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMarkets = async () => {
            const fetchedMarkets = await getMarkets();
            if (fetchedMarkets) {
                setMarkets(fetchedMarkets);
            }
        };
        fetchMarkets();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Available Markets</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {markets?.map(market => (
                    <div
                        key={market.symbol}
                        onClick={() => navigate(`/trade/${market.symbol}`)}
                        className="cursor-pointer border rounded-xl shadow-sm p-4 hover:shadow-md hover:bg-gray-100 transition duration-200"
                    >
                        <div className="text-lg font-medium text-gray-800">
                            {market.baseSymbol}-{market.quoteSymbol}
                        </div>
                        <div className="text-sm text-gray-500">
                            Symbol: {market.symbol}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Markets;
