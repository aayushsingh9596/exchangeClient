import { useEffect, useRef, useState } from "react";
import { getDepth, getTicker } from "../services/marketServices";
import Asks from "./Asks";
import Bids from "./Bids";
import { SignallingManager } from "../utils/SignallingManager";
import { IDepthUpdate, ITickerUpdate } from "../types/types";

interface Props {
  symbol: string;
}

const Book = ({ symbol }: Props) => {
  const [asks, setAsks] = useState<[string, string][]>([]);
  const [bids, setBids] = useState<[string, string][]>([]);
  const [lastPrice, setLastPrice] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (hasScrolledRef.current<2 && el && asks.length && bids.length) {
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
      hasScrolledRef.current ++;
    }
  }, [asks.length, bids.length]);
  

  useEffect(() => {
    getDepth(symbol).then(result => {
      if (result.success) {
        setAsks(result.depth.asks);
        setBids(result.depth.bids);
      }
    });

    getTicker(symbol).then(result => {
      if (result.success) setLastPrice(result.ticker?.lastPrice);
    });

    SignallingManager.getInstance().registerCallback("ticker", (data: ITickerUpdate) => {
      console.log("ddd",data);
      setLastPrice(data.c);
    }, `ticker.${symbol}.book`);

    SignallingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`ticker.${symbol}`],
    });

    SignallingManager.getInstance().registerCallback("depth", (data: IDepthUpdate) => {

      setAsks((prevAsks) => {
        let updatedAsks: [string, string][] = [...prevAsks];

        data.a.forEach(([price, quantity]) => {
          const index = updatedAsks.findIndex(ask => ask[0] === price);
          if (Number(quantity) === 0) {
            if (index !== -1) updatedAsks.splice(index, 1);
          } else {
            if (index === -1) updatedAsks.push([price, quantity]);
            else updatedAsks[index] = [price, quantity];
          }
        });

        updatedAsks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
        return updatedAsks;
      });

      setBids((prevBids) => {
        let updatedBids: [string, string][] = [...prevBids];

        data.b.forEach(([price, quantity]) => {
          const index = updatedBids.findIndex(bid => bid[0] === price);
          if (Number(quantity) === 0) {
            if (index !== -1) updatedBids.splice(index, 1);
          } else {
            if (index === -1) updatedBids.push([price, quantity]);
            else updatedBids[index] = [price, quantity];
          }
        });

        updatedBids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])); // Highest bid first
        return updatedBids;
      });

    }, `depth.200ms.${symbol}`);

    SignallingManager.getInstance().sendMessage({
      method: "SUBSCRIBE",
      params: [`depth.200ms.${symbol}`],
    });

    return () => {
      SignallingManager.getInstance().deregisterCallback("ticker", `ticker.${symbol}.book`);
      SignallingManager.getInstance().deregisterCallback("depth", `depth.200ms.${symbol}`);
      SignallingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`ticker.${symbol}`],
      });
      SignallingManager.getInstance().sendMessage({
        method: "UNSUBSCRIBE",
        params: [`depth.200ms.${symbol}`],
      });
    };
  }, []);

  return (
    <div className="bg-white rounded-sm h-96 overflow-scroll" ref={scrollRef}>
      <div className="mb-2 text-center text-sm text-gray-600">Order Book</div>
      <Asks asks={asks} />
      <div className="my-3 text-start text-lg font-semibold text-red-600">
        {lastPrice ? `${lastPrice}` : "Fetching price..."}
      </div>
      <Bids bids={bids} />
    </div>
  );
};

export default Book;
