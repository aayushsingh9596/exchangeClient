import { useState } from "react";
import Book from "./Book";
import Trades from "./Trades";

interface Props {
  symbol: string;
}

const DepthAndTrades = ({ symbol }: Props) => {
  const [tab, setTab] = useState<string>("book");

  return (
    <div className="bg-white p-2">
      <div className="flex items-center justify-start gap-6 mb-4">
        <button
          onClick={() => setTab("book")}
          className={`p-2 rounded-sm text-sm font-medium transition-colors ${
            tab === "book"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Book
        </button>
        <button
          onClick={() => setTab("trades")}
          className={`p-2 rounded-sm text-sm font-medium transition-colors ${
            tab === "trades"
              ? "bg-blue-500 text-white"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          Trades
        </button>
      </div>

      {tab === "book" ? <Book symbol={symbol} /> : <Trades symbol={symbol} />}
    </div>
  );
};

export default DepthAndTrades;
