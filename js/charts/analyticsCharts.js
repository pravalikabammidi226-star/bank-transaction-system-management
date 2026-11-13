/**
 * Analytics Charts Manager using Chart.js
 * Automatically registers with TransactionStore updates and re-renders
 * 5 responsive charts:
 * 1. Income vs Expense (Doughnut)
 * 2. Monthly Transaction Activity (Bar/Line combo)
 * 3. Transaction Type Distribution (Pie / Polar)
 * 4. Daily Transaction Frequency (Bar by Day of Week)
 * 5. Transaction Amount Distribution (Histogram brackets)
 */

class AnalyticsChartsManager {
    constructor(store) {
        this.store = store;
        this.charts = {};
        this.isDark = document.documentElement.classList.contains('dark');

        // Color palettes
        this.colors = {
            navy: '#0F2744',
            blue: '#2563EB',
            lightBlue: '#60A5FA',
            emerald: '#10B981',
            rose: '#EF4444',
            amber: '#F59E0B',
            purple: '#8B5CF6',
            cyan: '#06B6D4',
            slateDark: '#1E293B',
            slateLight: '#F1F5F9',
            textLight: '#1E293B',
            textDark: '#F8FAFC',
            gridLight: 'rgba(226, 232, 240, 0.8)',
            gridDark: 'rgba(51, 65, 85, 0.4)'
        };
    }

    /**
     * Get theme-aware text & grid colors
     */
    getThemeColors() {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            text: isDark ? '#E2E8F0' : '#334155',
            grid: isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.8)'
        };
    }

    /**
     * Initializes or re-renders all dashboard charts
     */
    initOrUpdateAll() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js library not loaded yet');
            return;
        }

        const txns = this.store.getAll();
        this.renderIncomeExpenseChart(txns);
        this.renderMonthlyActivityChart(txns);
        this.renderTypeDistributionChart(txns);
        this.renderDailyFrequencyChart(txns);
        this.renderAmountDistributionChart(txns);
    }

    /**
     * 1. Income vs Expense Chart
     */
    renderIncomeExpenseChart(txns) {
        const ctx = document.getElementById('chartIncomeExpense');
        if (!ctx) return;

        let totalIncome = 0;
        let totalExpense = 0;

        txns.forEach(t => {
            const amt = Number(t.amount) || 0;
            if (t.type === 'Deposit') {
                totalIncome += amt;
            } else {
                totalExpense += amt;
            }
        });

        const theme = this.getThemeColors();

        if (this.charts.incomeExpense) {
            this.charts.incomeExpense.destroy();
        }

        this.charts.incomeExpense = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Total Received (Income)', 'Total Sent (Expenses)'],
                datasets: [{
                    data: [totalIncome, totalExpense],
                    backgroundColor: ['#10B981', '#EF4444'],
                    hoverBackgroundColor: ['#059669', '#DC2626'],
                    borderWidth: 2,
                    borderColor: document.documentElement.classList.contains('dark') ? '#1E293B' : '#FFFFFF'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: theme.text, font: { family: 'Inter', size: 12 } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return ` ₹${Number(context.raw).toLocaleString('en-IN')}`;
                            }
                        }
                    }
                },
                cutout: '68%'
            }
        });
    }

    /**
     * 2. Monthly Transaction Activity
     */
    renderMonthlyActivityChart(txns) {
        const ctx = document.getElementById('chartMonthlyActivity');
        if (!ctx) return;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const volumePerMonth = new Array(12).fill(0);
        const countPerMonth = new Array(12).fill(0);

        txns.forEach(t => {
            const d = new Date(t.date);
            if (!isNaN(d)) {
                const m = d.getMonth();
                volumePerMonth[m] += Number(t.amount) || 0;
                countPerMonth[m] += 1;
            }
        });

        const theme = this.getThemeColors();

        if (this.charts.monthlyActivity) {
            this.charts.monthlyActivity.destroy();
        }

        this.charts.monthlyActivity = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: months,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Transaction Volume (₹ in 1000s)',
                        data: volumePerMonth.map(v => Math.round(v / 1000)),
                        backgroundColor: 'rgba(37, 99, 235, 0.8)',
                        borderColor: '#2563EB',
                        borderRadius: 6,
                        yAxisID: 'y'
                    },
                    {
                        type: 'line',
                        label: 'Transaction Count',
                        data: countPerMonth,
                        borderColor: '#F59E0B',
                        backgroundColor: '#F59E0B',
                        tension: 0.35,
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                scales: {
                    x: {
                        grid: { color: theme.grid },
                        ticks: { color: theme.text }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: { display: true, text: 'Volume (₹K)', color: theme.text },
                        grid: { color: theme.grid },
                        ticks: { color: theme.text }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: { display: true, text: 'Count', color: theme.text },
                        grid: { drawOnChartArea: false },
                        ticks: { color: theme.text }
                    }
                },
                plugins: {
                    legend: {
                        labels: { color: theme.text }
                    }
                }
            }
        });
    }

    /**
     * 3. Transaction Type Distribution
     */
    renderTypeDistributionChart(txns) {
        const ctx = document.getElementById('chartTypeDistribution');
        if (!ctx) return;

        const types = ['Deposit', 'Withdrawal', 'Transfer', 'Payment'];
        const counts = [0, 0, 0, 0];

        txns.forEach(t => {
            const idx = types.indexOf(t.type);
            if (idx !== -1) counts[idx]++;
        });

        const theme = this.getThemeColors();

        if (this.charts.typeDistribution) {
            this.charts.typeDistribution.destroy();
        }

        this.charts.typeDistribution = new Chart(ctx, {
            type: 'polarArea',
            data: {
                labels: types,
                datasets: [{
                    data: counts,
                    backgroundColor: [
                        'rgba(16, 185, 129, 0.75)', // emerald
                        'rgba(239, 68, 68, 0.75)',  // rose
                        'rgba(59, 130, 246, 0.75)', // blue
                        'rgba(168, 85, 247, 0.75)'  // purple
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        grid: { color: theme.grid },
                        ticks: { backdropColor: 'transparent', color: theme.text }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: { color: theme.text }
                    }
                }
            }
        });
    }

    /**
     * 4. Daily Transaction Frequency (by Day of Week)
     */
    renderDailyFrequencyChart(txns) {
        const ctx = document.getElementById('chartDailyFrequency');
        if (!ctx) return;

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const dayCounts = new Array(7).fill(0);

        txns.forEach(t => {
            const d = new Date(t.date);
            if (!isNaN(d)) {
                dayCounts[d.getDay()]++;
            }
        });

        const theme = this.getThemeColors();

        if (this.charts.dailyFrequency) {
            this.charts.dailyFrequency.destroy();
        }

        this.charts.dailyFrequency = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: days,
                datasets: [{
                    label: 'Transactions on this Day',
                    data: dayCounts,
                    backgroundColor: 'rgba(14, 165, 233, 0.85)',
                    borderColor: '#0284C7',
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: theme.grid },
                        ticks: { color: theme.text }
                    },
                    y: {
                        grid: { color: theme.grid },
                        ticks: { color: theme.text, stepSize: 1 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    /**
     * 5. Transaction Amount Distribution
     */
    renderAmountDistributionChart(txns) {
        const ctx = document.getElementById('chartAmountDistribution');
        if (!ctx) return;

        const brackets = [
            '< ₹1,000',
            '₹1,000 - ₹5,000',
            '₹5,000 - ₹20,000',
            '₹20,000 - ₹50,000',
            '> ₹50,000'
        ];
        const counts = [0, 0, 0, 0, 0];

        txns.forEach(t => {
            const amt = Number(t.amount) || 0;
            if (amt < 1000) counts[0]++;
            else if (amt <= 5000) counts[1]++;
            else if (amt <= 20000) counts[2]++;
            else if (amt <= 50000) counts[3]++;
            else counts[4]++;
        });

        const theme = this.getThemeColors();

        if (this.charts.amountDistribution) {
            this.charts.amountDistribution.destroy();
        }

        this.charts.amountDistribution = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: brackets,
                datasets: [{
                    label: 'Count of Transactions',
                    data: counts,
                    backgroundColor: [
                        'rgba(99, 102, 241, 0.8)',
                        'rgba(59, 130, 246, 0.8)',
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)'
                    ],
                    borderRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: theme.grid },
                        ticks: { color: theme.text }
                    },
                    y: {
                        grid: { color: theme.grid },
                        ticks: { color: theme.text, stepSize: 1 }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsChartsManager;
}
if (typeof window !== 'undefined') {
    window.AnalyticsChartsManager = AnalyticsChartsManager;
}
