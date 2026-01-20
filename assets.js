// Asset data organized by category
const ASSET_CATEGORIES = {
    forex: [
        { symbol: 'EUR/USD', name: 'Euro / US Dollar' },
        { symbol: 'GBP/USD', name: 'British Pound / US Dollar' },
        { symbol: 'USD/JPY', name: 'US Dollar / Japanese Yen' },
        { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc' },
        { symbol: 'AUD/USD', name: 'Australian Dollar / US Dollar' },
        { symbol: 'USD/CAD', name: 'US Dollar / Canadian Dollar' },
        { symbol: 'NZD/USD', name: 'New Zealand Dollar / US Dollar' },
        { symbol: 'EUR/GBP', name: 'Euro / British Pound' },
        { symbol: 'EUR/JPY', name: 'Euro / Japanese Yen' },
        { symbol: 'GBP/JPY', name: 'British Pound / Japanese Yen' }
    ],
    metals: [
        { symbol: 'XAU/USD', name: 'Gold' },
        { symbol: 'XAG/USD', name: 'Silver' },
        { symbol: 'XPT/USD', name: 'Platinum' },
        { symbol: 'XPD/USD', name: 'Palladium' },
        { symbol: 'GC', name: 'Gold Futures' },
        { symbol: 'SI', name: 'Silver Futures' },
        { symbol: 'HG', name: 'Copper Futures' },
        { symbol: 'PL', name: 'Platinum Futures' }
    ],
    crypto: [
        { symbol: 'BTC/USD', name: 'Bitcoin' },
        { symbol: 'ETH/USD', name: 'Ethereum' },
        { symbol: 'BNB/USD', name: 'Binance Coin' },
        { symbol: 'XRP/USD', name: 'Ripple' },
        { symbol: 'ADA/USD', name: 'Cardano' },
        { symbol: 'SOL/USD', name: 'Solana' },
        { symbol: 'DOGE/USD', name: 'Dogecoin' },
        { symbol: 'DOT/USD', name: 'Polkadot' },
        { symbol: 'MATIC/USD', name: 'Polygon' },
        { symbol: 'AVAX/USD', name: 'Avalanche' }
    ],
    futures: [
        { symbol: 'ES', name: 'S&P 500 E-mini' },
        { symbol: 'NQ', name: 'Nasdaq 100 E-mini' },
        { symbol: 'YM', name: 'Dow Jones E-mini' },
        { symbol: 'RTY', name: 'Russell 2000 E-mini' },
        { symbol: 'CL', name: 'Crude Oil' },
        { symbol: 'NG', name: 'Natural Gas' },
        { symbol: 'ZB', name: '30-Year T-Bond' },
        { symbol: 'ZN', name: '10-Year T-Note' },
        { symbol: '6E', name: 'Euro FX' },
        { symbol: '6B', name: 'British Pound' }
    ],
    stocks: [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'MSFT', name: 'Microsoft Corp.' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.' },
        { symbol: 'TSLA', name: 'Tesla Inc.' },
        { symbol: 'META', name: 'Meta Platforms' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.' },
        { symbol: 'JPM', name: 'JPMorgan Chase' },
        { symbol: 'V', name: 'Visa Inc.' },
        { symbol: 'WMT', name: 'Walmart Inc.' }
    ],
    nasdaq: [
        { symbol: 'NFLX', name: 'Netflix Inc.' },
        { symbol: 'AMD', name: 'Advanced Micro Devices' },
        { symbol: 'INTC', name: 'Intel Corp.' },
        { symbol: 'CSCO', name: 'Cisco Systems' },
        { symbol: 'ADBE', name: 'Adobe Inc.' },
        { symbol: 'PYPL', name: 'PayPal Holdings' },
        { symbol: 'QCOM', name: 'Qualcomm Inc.' },
        { symbol: 'AVGO', name: 'Broadcom Inc.' },
        { symbol: 'TXN', name: 'Texas Instruments' },
        { symbol: 'COST', name: 'Costco Wholesale' }
    ]
};
