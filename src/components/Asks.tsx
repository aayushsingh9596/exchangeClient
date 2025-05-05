import { useEffect, useState } from "react";

interface Props {
  asks: [string, string][];
}

interface IAskWithTotal {
  ask: number;
  quantity: number;
  cumulativeQuantity: number;
}

const Asks = ({ asks }: Props) => {
  const [asksWithTotal, setAsksWithTotal] = useState<IAskWithTotal[]>([]);

  useEffect(() => {
    if (asks.length > 0) {
      let totalQuantity = 0;

      const relevantAsks = asks.slice(0, 20).map(([askPrice, askQuantity]) => {
        const quantity = parseFloat(askQuantity);
        totalQuantity += quantity;

        return {
          ask: Number(parseFloat(askPrice).toFixed(2)),
          quantity: Number(quantity.toFixed(5)),
          cumulativeQuantity: Number(totalQuantity.toFixed(5)),
        };
      });

      setAsksWithTotal(relevantAsks.reverse());
    }
  }, [asks]);

  return (
    <div className="flex flex-col space-y-1 text-sm font-mono">
      {asksWithTotal.map((askWithTotal, index) => {
        const askWidth = `${(askWithTotal.cumulativeQuantity / asksWithTotal[0].cumulativeQuantity) * 100}%`;

        return (
          <div
            key={index}
            className="relative flex items-center gap-6 px-2 py-0.5 rounded-sm overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 h-full bg-red-100/50 transition-all duration-300 ease-in-out"
              style={{ width: askWidth }}
            ></div>
            <div className="w-16 z-10 text-red-600">{askWithTotal.ask}</div>
            <div className="w-20 z-10 text-gray-700">{askWithTotal.quantity}</div>
            <div className="w-24 z-10 text-gray-500">{askWithTotal.cumulativeQuantity}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Asks;
