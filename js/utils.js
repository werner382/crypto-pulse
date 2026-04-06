const Utils = {
    formatCurrency(value, decimals = 2) {
        if (value === null || value === undefined) return '--';
        
        if (value >= 1e12) {
            return '$' + (value / 1e12).toFixed(2) + 'T';
        }
        if (value >= 1e9) {
            return '$' + (value / 1e9).toFixed(2) + 'B';
        }
        if (value >= 1e6) {
            return '$' + (value / 1e6).toFixed(2) + 'M';
        }
        if (value >= 1e3) {
            return '$' + (value / 1e3).toFixed(2) + 'K';
        }
        
        if (value < 0.01) {
            return '$' + value.toFixed(6);
        }
        if (value < 1) {
            return '$' + value.toFixed(4);
        }
        
        return '$' + value.toFixed(decimals);
    },

    formatPercent(value) {
        if (value === null || value === undefined) return '--';
        const sign = value >= 0 ? '+' : '';
        return sign + value.toFixed(2) + '%';
    },

    formatTimeAgo(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
        if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
        if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
        if (seconds < 2592000) return Math.floor(seconds / 604800) + 'w ago';
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    formatDate() {
        const now = new Date();
        return now.toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZoneName: 'short'
        });
    },

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    generateId() {
        return Math.random().toString(36).substring(2, 11);
    },

    getCryptoColor(value) {
        if (value > 0) return 'positive';
        if (value < 0) return 'negative';
        return '';
    },

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    isMarketOpen() {
        const now = new Date();
        const day = now.getUTCDay();
        const hour = now.getUTCHours();
        
        if (day === 0 || day === 6) return false;
        if (hour < 13 || hour >= 21) return false;
        
        return true;
    },

    getCoinSymbol(name) {
        return name.substring(0, 3).toUpperCase();
    },

    getAvatarColor(symbol) {
        const colors = [
            '#00d4aa', '#f59e0b', '#3b82f6', '#8b5cf6', 
            '#ec4899', '#ef4444', '#10b981', '#6366f1'
        ];
        let hash = 0;
        for (let i = 0; i < symbol.length; i++) {
            hash = symbol.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}
