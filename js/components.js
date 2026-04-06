const Components = {
    createTickerItem(coin, duplicates = false) {
        const change = coin.price_change_percentage_24h || 0;
        const changeClass = Utils.getCryptoColor(change);
        
        return `
            <div class="ticker-item" data-coin-id="${coin.id}">
                <img src="${coin.image}" alt="${coin.name}" class="ticker-coin-icon" 
                     onerror="this.style.display='none'">
                <span class="ticker-symbol">${coin.symbol.toUpperCase()}</span>
                <span class="ticker-price">${Utils.formatCurrency(coin.current_price)}</span>
                <span class="ticker-change ${changeClass}">${Utils.formatPercent(change)}</span>
            </div>
            ${duplicates ? '<span class="ticker-separator">|</span>' : ''}
        `;
    },

    createTicker(coins) {
        const tickerContent = coins.map((coin, i) => 
            this.createTickerItem(coin, i < coins.length - 1)
        ).join('');
        
        const duplicated = coins.map((coin, i) => 
            this.createTickerItem(coin, i < coins.length - 1)
        ).join('');

        return tickerContent + '<span class="ticker-separator">|</span>' + duplicated;
    },

    createNewsCard(news, isFeatured = false) {
        const categoryLabel = news.category.charAt(0).toUpperCase() + news.category.slice(1);
        
        return `
            <article class="news-card ${isFeatured ? 'featured' : ''}" data-id="${news.id}">
                <img src="${news.image}" alt="" class="news-image" 
                     onerror="this.src='https://picsum.photos/seed/${news.id}/600/400'">
                <div class="news-content">
                    <span class="news-tag">${categoryLabel}</span>
                    <h3 class="news-title">${Utils.escapeHtml(news.title)}</h3>
                    <div class="news-meta">
                        <span>
                            <i data-lucide="building-2"></i>
                            ${news.source}
                        </span>
                        <span>
                            <i data-lucide="clock"></i>
                            ${Utils.formatTimeAgo(news.publishedAt)}
                        </span>
                    </div>
                </div>
            </article>
        `;
    },

    createTrendingItem(coin, rank) {
        const change = coin.price_change_percentage_24h || 0;
        const changeClass = Utils.getCryptoColor(change);
        
        return `
            <div class="trending-item" data-coin-id="${coin.id}">
                <span class="rank">#${rank}</span>
                <div class="coin-avatar" style="background: ${Utils.getAvatarColor(coin.symbol)}">
                    ${coin.symbol.substring(0, 2).toUpperCase()}
                </div>
                <div class="coin-info">
                    <div class="coin-name">${coin.name}</div>
                    <div class="coin-symbol">${coin.symbol}</div>
                </div>
                <div class="coin-price-info">
                    <div class="coin-price">${Utils.formatCurrency(coin.current_price)}</div>
                    <div class="coin-change ${changeClass}">${Utils.formatPercent(change)}</div>
                </div>
            </div>
        `;
    },

    createListingItem(coin) {
        const change = coin.price_change_percentage_24h || 0;
        const changeClass = Utils.getCryptoColor(change);
        const daysOld = Math.floor((Date.now() - coin.listed_at * 1000) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="listing-item" data-coin-id="${coin.id}">
                <div class="coin-avatar" style="background: ${Utils.getAvatarColor(coin.symbol)}">
                    ${coin.symbol.substring(0, 2).toUpperCase()}
                </div>
                <div class="coin-info">
                    <div class="coin-name">${coin.name}</div>
                    <div class="coin-symbol">
                        ${coin.symbol} 
                        ${daysOld <= 7 ? '<span class="new-badge">NEW</span>' : ''}
                    </div>
                </div>
                <div class="coin-price-info">
                    <div class="coin-price">${Utils.formatCurrency(coin.current_price)}</div>
                    <div class="coin-change ${changeClass}">${Utils.formatPercent(change)}</div>
                </div>
            </div>
        `;
    },

    createCoinCard(coin) {
        const change = coin.price_change_percentage_24h || 0;
        const changeClass = Utils.getCryptoColor(change);
        const daysOld = Math.floor((Date.now() - coin.listed_at * 1000) / (1000 * 60 * 60 * 24));
        
        return `
            <div class="coin-card" data-coin-id="${coin.id}">
                <div class="coin-avatar" style="background: ${Utils.getAvatarColor(coin.symbol)}">
                    ${coin.symbol.substring(0, 2).toUpperCase()}
                </div>
                <div class="coin-name">${coin.name}</div>
                <div class="coin-symbol">
                    ${coin.symbol.toUpperCase()}
                    ${daysOld <= 7 ? '<span class="new-badge">NEW</span>' : ''}
                </div>
                <div class="coin-price">${Utils.formatCurrency(coin.current_price)}</div>
                <div class="coin-change ${changeClass}">${Utils.formatPercent(change)}</div>
            </div>
        `;
    },

    createHeroSection(news) {
        if (!news) {
            return `
                <div class="hero-content">
                    <div class="hero-badge">
                        <i data-lucide="zap"></i>
                        Breaking News
                    </div>
                    <h1 class="hero-title">Stay Ahead of the Crypto Market</h1>
                    <p class="hero-excerpt">Real-time updates on cryptocurrency prices, new listings, and market-moving news.</p>
                    <div class="hero-meta">
                        <span><i data-lucide="activity"></i> Live Updates</span>
                        <span><i data-lucide="clock"></i> ${Utils.formatDate()}</span>
                    </div>
                </div>
            `;
        }

        return `
            <div class="hero-content">
                <div class="hero-badge">
                    <i data-lucide="zap"></i>
                    Featured
                </div>
                <h1 class="hero-title">${Utils.escapeHtml(news.title)}</h1>
                <p class="hero-excerpt">${Utils.escapeHtml(news.excerpt)}</p>
                <div class="hero-meta">
                    <span><i data-lucide="building-2"></i> ${news.source}</span>
                    <span><i data-lucide="clock"></i> ${Utils.formatTimeAgo(news.publishedAt)}</span>
                </div>
            </div>
        `;
    },

    createStatCard(label, value) {
        return `
            <div class="stat-card">
                <span class="stat-label">${label}</span>
                <span class="stat-value">${value}</span>
            </div>
        `;
    },

    createToast(message, type = 'info') {
        const icons = {
            success: 'check-circle',
            error: 'alert-circle',
            warning: 'alert-triangle',
            info: 'info'
        };

        return `
            <div class="toast ${type}">
                <i data-lucide="${icons[type]}" class="toast-icon"></i>
                <span class="toast-message">${message}</span>
            </div>
        `;
    },

    createSkeletonLoader(type) {
        const templates = {
            news: `
                <div class="news-card skeleton">
                    <div class="skeleton-image"></div>
                    <div class="skeleton-content">
                        <div class="skeleton-tag"></div>
                        <div class="skeleton-title"></div>
                        <div class="skeleton-title"></div>
                        <div class="skeleton-meta"></div>
                    </div>
                </div>
            `,
            coin: `
                <div class="coin-card skeleton">
                    <div class="skeleton-avatar lg"></div>
                    <div class="skeleton-info"></div>
                </div>
            `,
            trending: `
                <div class="trending-item skeleton">
                    <div class="skeleton-avatar"></div>
                    <div class="skeleton-info"></div>
                </div>
            `
        };

        return templates[type] || '';
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Components;
}
