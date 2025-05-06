const BASE_URL = import.meta.env.VITE_API_URL;

export const getMarkets = async () => {
    try {
        const response = await fetch(`${BASE_URL}/market/getMarkets`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching markets:", error);
        return null;
    }
};

export const getMarket = async (symbol: string) => {
    try {
        const response = await fetch(`${BASE_URL}/market/getMarket?symbol=${symbol}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching market:", error);
        return null;
    }
};

export const getTicker = async (symbol: string) => {
    try {
        const response = await fetch(`${BASE_URL}/market/getTicker?symbol=${symbol}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching ticker:", error);
        return null;
    }
};

export const getTickers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/market/getTickers`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching tickers:", error);
        return null;
    }
};

export const getDepth = async (symbol: string) => {
    try {
        const response = await fetch(`${BASE_URL}/market/getDepth?symbol=${symbol}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching depth:", error);
        return null;
    }
};

export const getKlines = async (symbol: string, interval: string, start: number, end: number) => {
    try {
        const response = await fetch(`${BASE_URL}/market/getKlines?symbol=${symbol}&interval=${interval}&start=${start}&end=${end}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching klines:", error);
        return null;
    }
};

export const getTrades = async (symbol: string) => {
    console.log(symbol);
    try {
        const response = await fetch(`${BASE_URL}/market/getTrades?symbol=${symbol}`);
        return await response.json();
    } catch (error) {
        console.error("Error fetching trades:", error);
        return null;
    }
};
