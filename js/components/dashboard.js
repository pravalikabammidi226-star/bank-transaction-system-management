/**
 * Dashboard Component
 * Manages metric cards, quick statistics, and recent activity display.
 */

class DashboardComponent {
    constructor(store, chartsManager) {
        this.store = store;
        this.chartsManager = chartsManager;
    }

    init() {
        this.updateStats();
        this.renderRecentTransactions();
        if (this.chartsManager) {
            this.chartsManager.initOrUpdateAll();
        }
    }

    updateStats() {
        const stats = this.store.getStatistics();

        const elTotalTxns = document.getElementById('statTotalTxns');
        const elTotalReceived = document.getElementById('statTotalReceived');
        const elTotalSent = document.getElementById('statTotalSent');
        const elHighestTxn = document.getElementById('statHighestTxn');
        const elAverageTxn = document.getElementById('statAverageTxn');
        const elMostFreqType = document.getElementById('statMostFreqType');
        const elNetBalance = document.getElementById('statNetBalance');

        if (elTotalTxns) elTotalTxns.textContent = stats.totalCount.toLocaleString();
        if (elTotalReceived) elTotalReceived.textContent = `₹${stats.totalReceived.toLocaleString('en-IN')}`;
        if (elTotalSent) elTotalSent.textContent = `₹${stats.totalSent.toLocaleString('en-IN')}`;
        if (elHighestTxn) elHighestTxn.textContent = `₹${stats.highestTransaction.toLocaleString('en-IN')}`;
        if (elAverageTxn) elAverageTxn.textContent = `₹${stats.averageAmount.toLocaleString('en-IN')}`;
        if (elMostFreqType) elMostFreqType.textContent = stats.mostFrequentType;
        if (elNetBalance) {
            const net = stats.netBalance;
            elNetBalance.textContent = `₹${Math.abs(net).toLocaleString('en-IN')}`;
            elNetBalance.className = net >= 0 ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold';
            const badge = document.getElementById('statNetBadge');
            if (badge) {
                badge.textContent = net >= 0 ? 'Surplus' : 'Deficit';
                badge.className = net >= 0 
                    ? 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
            }
        }
    }

    renderRecentTransactions() {
        const container = document.getElementById('recentTransactionsBody');
        if (!container) return;

        const all = this.store.getAll();
        const recent = all.slice(0, 7);

        if (recent.length === 0) {
            container.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-500">No transactions recorded yet.</td></tr>`;
            return;
        }

        container.innerHTML = recent.map(t => {
            const isCredit = t.type === 'Deposit';
            const badgeColor = isCredit 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-400' 
                : 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-400';
            
            const dateStr = new Date(t.date).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });

            return `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800">
                    <td class="py-3 px-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">${t.id}</td>
                    <td class="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">${t.accountHolder}</td>
                    <td class="py-3 px-4">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${badgeColor}">
                            ${t.type}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-xs text-slate-500 dark:text-slate-400">${dateStr}</td>
                    <td class="py-3 px-4 text-right font-semibold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-800 dark:text-slate-200'}">
                        ${isCredit ? '+' : '-'}₹${Number(t.amount).toLocaleString('en-IN')}
                    </td>
                </tr>
            `;
        }).join('');
    }
}

if (typeof window !== 'undefined') {
    window.DashboardComponent = DashboardComponent;
}
