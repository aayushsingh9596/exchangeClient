import { useEffect, useState } from "react";

interface Props {
  bids: [string, string][];
}

interface IBidWithTotal {
  bid: number;
  quantity: number;
  cumulativeQuantity: number;
}

const Bids = ({ bids }: Props) => {
  const [bidsWithTotal, setBidsWithTotal] = useState<IBidWithTotal[]>([]);

  useEffect(() => {
    if (bids.length > 0) {
      let totalQuantity = 0;

      const relevantBids = [...bids] 
        // .reverse()
        .slice(0, 20)
        .map(([bidPrice, bidQuantity]) => {
          const quantity = parseFloat(bidQuantity);
          totalQuantity += quantity;

          return {
            bid: Number(parseFloat(bidPrice).toFixed(2)),
            quantity: Number(quantity.toFixed(5)),
            cumulativeQuantity: Number(totalQuantity.toFixed(5)),
          };
        });

      setBidsWithTotal(relevantBids);
    }
  }, [bids]);

  return (
    <div className="flex flex-col space-y-1 text-sm font-mono">
      {bidsWithTotal.map((bidWithTotal, index) => {
        const maxCumulative = bidsWithTotal[bidsWithTotal.length - 1].cumulativeQuantity;
        const bidWidth = `${(bidWithTotal.cumulativeQuantity / maxCumulative) * 100}%`;

        return (
          <div
            key={index}
            className="relative flex items-center gap-6 px-2 py-0.5 rounded-sm overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 h-full bg-green-200/40 transition-all duration-300 ease-in-out"
              style={{ width: bidWidth }}
            ></div>
            <div className="w-16 z-10 text-green-700">{bidWithTotal.bid}</div>
            <div className="w-20 z-10 text-gray-700">{bidWithTotal.quantity}</div>
            <div className="w-24 z-10 text-gray-500">{bidWithTotal.cumulativeQuantity}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Bids;
