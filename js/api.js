const CryptoAPI = {
    baseUrl: 'https://api.coingecko.com/api/v3',
    cache: new Map(),
    cacheTimeout: 60000,
    lastRequest: 0,
    minRequestInterval: 1500,
    retryCount: 3,
    retryDelay: 2000,

    async request(endpoint, options = {}) {
        const cacheKey = endpoint;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }

        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequest;
        
        if (timeSinceLastRequest < this.minRequestInterval) {
            await new Promise(resolve => 
                setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
            );
        }

        this.lastRequest = Date.now();

        for (let attempt = 0; attempt < this.retryCount; attempt++) {
            try {
                const response = await fetch(`${this.baseUrl}${endpoint}`, {
                    headers: {
                        'Accept': 'application/json',
                        ...options.headers
                    }
                });

                if (response.status === 429) {
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay * (attempt + 1)));
                    continue;
                }

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }

                const data = await response.json();
                this.cache.set(cacheKey, { data, timestamp: Date.now() });
                return data;

            } catch (error) {
                if (attempt === this.retryCount - 1) throw error;
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }
    },

    async getMarkets(currency = 'usd', perPage = 50) {
        return this.request(
            `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=24h,7d`
        );
    },

    async getTrending() {
        return this.request('/search/trending');
    },

    async getCoinList() {
        return this.request('/coins/list');
    },

    async getNewCoins(perPage = 20) {
        const coins = await this.getMarkets('usd', 250);
        return coins
            .filter(coin => {
                const listedDate = new Date(coin.listed_at * 1000);
                const daysSinceListed = (Date.now() - listedDate) / (1000 * 60 * 60 * 24);
                return daysSinceListed <= 30;
            })
            .sort((a, b) => b.listed_at - a.listed_at)
            .slice(0, perPage);
    },

    async getCoinDetails(id) {
        return this.request(`/coins/${id}`);
    },

    async getMarketChart(id, days = 7) {
        return this.request(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`);
    },

    async searchCoins(query) {
        if (!query || query.length < 2) return [];
        const results = await this.request(`/search?query=${encodeURIComponent(query)}`);
        return results.coins?.slice(0, 10) || [];
    },

    async getGlobalData() {
        const data = await this.request('/global');
        return data.data;
    },

    clearCache() {
        this.cache.clear();
    }
};

const NewsAPI = {
    newsSources: [
        { name: 'CoinDesk', url: 'https://api.coindesk.com/v1/news/latest' },
        { name: 'CryptoPanic', url: 'https://cryptopanic.com/api/free/v1/posts/' }
    ],

    async fetchNews() {
        const mockNews = this.generateMockNews();
        return mockNews;
    },

    generateMockNews() {
        const newsTemplates = [
            {
                title: 'Bitcoin Surges Past Key Resistance Level as Institutional Interest Grows',
                excerpt: 'Major financial institutions are increasing their cryptocurrency allocations as Bitcoin breaks through technical barriers.',
                category: 'bitcoin'
            },
            {
                title: 'Ethereum Layer 2 Solutions See Record Adoption Rates',
                excerpt: 'Arbitrum and Optimism networks hit all-time highs in daily transactions as scalability solutions gain mainstream traction.',
                category: 'defi'
            },
            {
                title: 'New DeFi Protocol Launches with $50M TVL in First Week',
                excerpt: 'A new decentralized finance protocol has attracted significant capital, signaling continued innovation in the space.',
                category: 'defi'
            },
            {
                title: 'NFT Market Shows Signs of Recovery with Blue Chip Collections Leading',
                excerpt: 'Trading volumes for established NFT projects are climbing as market sentiment improves.',
                category: 'nft'
            },
            {
                title: 'Major Layer 1 Blockchain Announces Major Upgrade for Q2',
                excerpt: 'The upcoming upgrade promises improved throughput and reduced transaction costs.',
                category: 'layer1'
            },
            {
                title: 'Memecoin Rally Continues as Community-Driven Projects Gain Momentum',
                excerpt: 'Retail investors are driving significant price action in select memecoin categories.',
                category: 'memecoin'
            },
            {
                title: 'Stablecoin Issuer Announces New Compliance Measures',
                excerpt: 'Leading stablecoin provider implements enhanced transparency features in response to regulatory scrutiny.',
                category: 'stablecoin'
            },
            {
                title: 'Solana Network Experiences Surge in Daily Active Addresses',
                excerpt: 'The high-performance blockchain sees increased developer activity and user engagement.',
                category: 'layer1'
            },
            {
                title: 'Central Bank Digital Currency Pilot Expands to New Regions',
                excerpt: 'Government-backed digital currency initiatives continue to advance globally.',
                category: 'blockchain'
            },
            {
                title: 'Decentralized Exchange Volume Reaches Monthly High',
                excerpt: 'DEX platforms are capturing increasing market share from centralized exchanges.',
                category: 'defi'
            },
            {
                title: 'Crypto Gaming Sector Attracts $1B in New Investments',
                excerpt: 'Play-to-earn and blockchain gaming projects continue to draw significant venture capital.',
                category: 'nft'
            },
            {
                title: 'Major Tech Company Integrates Cryptocurrency Payment Options',
                excerpt: 'Fortune 500 company expands payment infrastructure to include digital assets.',
                category: 'crypto'
            }
        ];

        const sources = ['CryptoNews', 'CoinDesk', 'The Block', 'Decrypt', 'CoinTelegraph'];
        const categories = ['bitcoin', 'defi', 'nft', 'layer1', 'memecoin', 'stablecoin'];
        
        return newsTemplates.map((template, index) => {
            const hoursAgo = Math.floor(Math.random() * 48) + 1;
            const date = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
            
            return {
                id: Utils.generateId(),
                title: template.title,
                excerpt: template.excerpt,
                category: template.category,
                source: sources[Math.floor(Math.random() * sources.length)],
                publishedAt: date.toISOString(),
                image: `https://picsum.photos/seed/${index + 100}/600/400`,
                url: '#'
            };
        }).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CryptoAPI, NewsAPI };
}
