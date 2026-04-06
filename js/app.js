(function() {
    'use strict';

    const App = {
        state: {
            coins: [],
            news: [],
            newCoins: [],
            globalData: null,
            currentFilter: 'all',
            isLoading: false,
            lastUpdate: null,
            updateIntervals: []
        },

        async init() {
            this.initClock();
            this.bindEvents();
            await this.loadInitialData();
            this.startPeriodicUpdates();
            
            lucide.createIcons();
        },

        initClock() {
            const updateClock = () => {
                const clockEl = document.getElementById('clock');
                if (clockEl) {
                    clockEl.textContent = Utils.formatDate();
                }
                
                const statusDot = document.querySelector('.status-dot');
                const statusText = document.querySelector('.status-text');
                if (statusDot && statusText) {
                    const isOpen = Utils.isMarketOpen();
                    statusDot.style.background = isOpen ? 'var(--accent-primary)' : 'var(--accent-negative)';
                    statusText.textContent = isOpen ? 'Markets Open' : 'Markets Closed';
                }
            };

            updateClock();
            setInterval(updateClock, 1000);
        },

        bindEvents() {
            document.querySelectorAll('.filter-chip').forEach(chip => {
                chip.addEventListener('click', (e) => this.handleFilterClick(e));
            });

            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => this.handleNavClick(e));
            });

            const loadMoreBtn = document.getElementById('load-more-news');
            if (loadMoreBtn) {
                loadMoreBtn.addEventListener('click', () => this.loadMoreNews());
            }

            document.getElementById('ticker')?.addEventListener('click', (e) => {
                const tickerItem = e.target.closest('.ticker-item');
                if (tickerItem) {
                    const coinId = tickerItem.dataset.coinId;
                    this.showCoinDetails(coinId);
                }
            });
        },

        async loadInitialData() {
            this.setLoading(true);

            try {
                const [coins, news, globalData] = await Promise.all([
                    CryptoAPI.getMarkets('usd', 50),
                    NewsAPI.fetchNews(),
                    CryptoAPI.getGlobalData()
                ]);

                this.state.coins = coins;
                this.state.news = news;
                this.state.globalData = globalData;
                this.state.newCoins = coins
                    .filter(c => c.listed_at)
                    .sort((a, b) => (b.listed_at || 0) - (a.listed_at || 0))
                    .slice(0, 8);

                this.renderAll();

            } catch (error) {
                console.error('Failed to load initial data:', error);
                this.showToast('Failed to load data. Please refresh the page.', 'error');
            } finally {
                this.setLoading(false);
            }
        },

        renderAll() {
            this.renderTicker();
            this.renderHero();
            this.renderNews();
            this.renderTrending();
            this.renderNewListings();
            this.renderMarketStats();
            this.renderNewCoins();
            this.updateLastUpdated();

            lucide.createIcons();
        },

        renderTicker() {
            const ticker = document.getElementById('ticker');
            if (!ticker || !this.state.coins.length) return;

            ticker.innerHTML = Components.createTicker(this.state.coins.slice(0, 20));
        },

        renderHero() {
            const heroSection = document.getElementById('hero-section');
            if (!heroSection) return;

            const featuredNews = this.state.news[0];
            heroSection.innerHTML = Components.createHeroSection(featuredNews);
            heroSection.classList.add('hero-section');
            lucide.createIcons();
        },

        renderNews() {
            const newsGrid = document.getElementById('news-grid');
            if (!newsGrid) return;

            let filteredNews = this.state.news;
            if (this.state.currentFilter !== 'all') {
                filteredNews = this.state.news.filter(
                    news => news.category === this.state.currentFilter
                );
            }

            newsGrid.innerHTML = filteredNews
                .map((news, index) => Components.createNewsCard(news, index === 0))
                .join('');

            newsGrid.querySelectorAll('.news-card').forEach((card, i) => {
                card.style.animationDelay = `${i * 50}ms`;
            });

            lucide.createIcons();
        },

        renderTrending() {
            const trendingContainer = document.getElementById('trending-coins');
            if (!trendingContainer) return;

            const trending = this.state.coins
                .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
                .slice(0, 5);

            trendingContainer.innerHTML = trending
                .map((coin, i) => Components.createTrendingItem(coin, i + 1))
                .join('');

            lucide.createIcons();
        },

        renderNewListings() {
            const listingsContainer = document.getElementById('new-listings');
            if (!listingsContainer) return;

            const newCoins = this.state.coins
                .filter(c => c.listed_at)
                .sort((a, b) => (b.listed_at || 0) - (a.listed_at || 0))
                .slice(0, 5);

            listingsContainer.innerHTML = newCoins
                .map(coin => Components.createListingItem(coin))
                .join('');

            lucide.createIcons();
        },

        renderMarketStats() {
            const totalMcap = document.getElementById('total-mcap');
            const totalVolume = document.getElementById('total-volume');
            const btcDominance = document.getElementById('btc-dominance');
            const statsGrid = document.getElementById('market-stats');

            if (!statsGrid || !this.state.globalData) return;

            statsGrid.innerHTML = `
                ${Components.createStatCard('Total Market Cap', Utils.formatCurrency(this.state.globalData.total_market_cap?.usd))}
                ${Components.createStatCard('24h Volume', Utils.formatCurrency(this.state.globalData.total_volume?.usd))}
                ${Components.createStatCard('BTC Dominance', this.state.globalData.market_cap_percentage?.btc.toFixed(1) + '%')}
            `;
        },

        renderNewCoins() {
            const newCoinsGrid = document.getElementById('new-coins-grid');
            if (!newCoinsGrid) return;

            newCoinsGrid.innerHTML = this.state.newCoins
                .map(coin => Components.createCoinCard(coin))
                .join('');

            lucide.createIcons();
        },

        updateLastUpdated() {
            const lastUpdatedEl = document.getElementById('last-updated');
            if (lastUpdatedEl) {
                const now = new Date();
                lastUpdatedEl.textContent = now.toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
        },

        handleFilterClick(e) {
            const chip = e.currentTarget;
            const filter = chip.dataset.filter;

            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');

            this.state.currentFilter = filter;
            this.renderNews();
        },

        handleNavClick(e) {
            e.preventDefault();
            const link = e.currentTarget;
            const page = link.dataset.page;

            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const targetId = page === 'home' ? 'hero-section' : 
                              page === 'newcoins' ? 'new-coins-section' : null;
            
            if (targetId) {
                const target = document.getElementById(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        },

        async loadMoreNews() {
            const loadMoreBtn = document.getElementById('load-more-news');
            if (!loadMoreBtn || this.state.isLoading) return;

            loadMoreBtn.innerHTML = '<i data-lucide="loader-2" class="spinning"></i><span>Loading...</span>';
            loadMoreBtn.disabled = true;
            lucide.createIcons();

            await new Promise(resolve => setTimeout(resolve, 1000));

            const newNews = NewsAPI.generateMockNews().slice(0, 6);
            this.state.news = [...this.state.news, ...newNews];
            this.renderNews();

            loadMoreBtn.innerHTML = '<i data-lucide="check"></i><span>Loaded!</span>';
            setTimeout(() => {
                loadMoreBtn.innerHTML = '<i data-lucide="plus"></i><span>Load More News</span>';
                loadMoreBtn.disabled = false;
                lucide.createIcons();
            }, 1500);

            lucide.createIcons();
        },

        showCoinDetails(coinId) {
            const coin = this.state.coins.find(c => c.id === coinId);
            if (coin) {
                this.showToast(`${coin.name} (${coin.symbol.toUpperCase()}): ${Utils.formatCurrency(coin.current_price)}`, 'info');
            }
        },

        showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const toast = document.createElement('div');
            toast.innerHTML = Components.createToast(message, type);
            const toastEl = toast.firstElementChild;
            
            container.appendChild(toastEl);
            lucide.createIcons();

            setTimeout(() => {
                toastEl.style.animation = 'slideIn 0.3s ease reverse';
                setTimeout(() => toastEl.remove(), 300);
            }, 3000);
        },

        setLoading(isLoading) {
            this.state.isLoading = isLoading;
            document.body.classList.toggle('loading', isLoading);
        },

        startPeriodicUpdates() {
            const updatePrices = async () => {
                try {
                    const coins = await CryptoAPI.getMarkets('usd', 50);
                    this.state.coins = coins;
                    this.renderTicker();
                    this.renderTrending();
                    this.renderMarketStats();
                    this.updateLastUpdated();
                } catch (error) {
                    console.error('Price update failed:', error);
                }
            };

            const updateNews = async () => {
                try {
                    const news = await NewsAPI.fetchNews();
                    this.state.news = news;
                    this.renderNews();
                    this.renderHero();
                } catch (error) {
                    console.error('News update failed:', error);
                }
            };

            this.state.updateIntervals.push(setInterval(updatePrices, 60000));
            this.state.updateIntervals.push(setInterval(updateNews, 300000));
        }
    };

    document.addEventListener('DOMContentLoaded', () => App.init());

    window.App = App;

})();
