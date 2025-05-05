import { useEffect, useState } from "react"
import { getKlines } from "../services/marketServices"
import { ICandleStickData, IKlineData, IKlineUpdate } from "../types/types"
import CandlestickChart from "./CandlestickChart"
import { UTCTimestamp } from "lightweight-charts"
import { SignallingManager } from "../utils/SignallingManager"

interface Props {
  symbol: string
}

const TradeView = ({ symbol }: Props) => {

  const [klinesData, setKlinesData] = useState<IKlineData[]>([]);
  const [candleSticksData, setCandleSticksData] = useState<ICandleStickData[]>([]);
  
  console.log("klinesdata old",klinesData);

  useEffect(() => {
    const start = Math.floor((new Date().getTime() - 1000 * 60 * 60 * 24 * 7) / 1000);
    const end = Math.floor(new Date().getTime() / 1000);
    const interval = "1h";
    getKlines(symbol, interval, start, end).then(result => {
      if (result.success) {
        setKlinesData(result.klineData);
      }
    })

    // {
    //   "e": "kline",           // Event type
    //   "E": 1694687692980000,  // Event time in microseconds
    //   "s": "SOL_USD",         // Symbol
    //   "t": 123400000,         // K-Line start time in seconds
    //   "T": 123460000,         // K-Line close time in seconds
    //   "o": "18.75",           // Open price
    //   "c": "19.25",           // Close price
    //   "h": "19.80",           // High price
    //   "l": "18.50",           // Low price
    //   "v": "32123",           // Base asset volume
    //   "n": 93828,             // Number of trades
    //   "X": false              // Is this k-line closed?
    // }



    SignallingManager.getInstance().registerCallback("kline", (data: IKlineUpdate) => {
      console.log(data);
      setCandleSticksData(prevData => {
        const newTime = Math.floor(new Date(data.E).getTime() / 1000) as UTCTimestamp;
        const updatedCandle = {
          time: newTime,
          open: parseFloat(data.o),
          high: parseFloat(data.h),
          low: parseFloat(data.l),
          close: parseFloat(data.c),
        };
      
        const lastIndex = prevData.length - 1;
        console.log("prevTime",prevData[lastIndex]?.time);
        console.log("new Time",newTime);
        if (newTime-prevData[lastIndex]?.time<3600000) {
          console.log("condition met");
          const newData = [...prevData];
          newData[lastIndex] = updatedCandle;
          return newData;
        }
      
        return [...prevData, updatedCandle];
      });
      
    }, `kline.1h.${symbol}`)
    SignallingManager.getInstance().sendMessage({
      "method": "SUBSCRIBE",
      "params": [`kline.1h.${symbol}`]
    })

    return () => {
      SignallingManager.getInstance().deregisterCallback("kline", `kline.1h.${symbol}`)
      SignallingManager.getInstance().sendMessage({
        "method": "UNSUBSCRIBE",
        "params": [`kline.1h.${symbol}`]
      })
    }
  }, [])

  useEffect(() => {
    if (klinesData.length > 0) {
      const transformedData = klinesData.map((d) => {
        return {
          time: Math.floor(new Date(d.start).getTime() / 1000) as UTCTimestamp,
          open: parseFloat(d.open),
          high: parseFloat(d.high),
          low: parseFloat(d.low),
          close: parseFloat(d.close),
        }
      });
      setCandleSticksData(transformedData)
    }
  }, [klinesData])



  return (
    <CandlestickChart candleSticksData={candleSticksData} />
  )
}

export default TradeView