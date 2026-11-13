/**
 * Frequency Analysis Component
 * Analyzes transaction counts across types and categories.
 * Sorts frequency tables using manual Merge Sort & Quick Sort.
 * Renders Frequency Bar Chart and Breakdown Pie Chart.
 */

class FrequencyAnalysisComponent {
    constructor(store) {
        this.store = store;
        this.charts = {};
        this.currentAlgo = 'MergeSort';
        this.currentOrder = 'desc'; // highest frequency first by default
    }

    init() {
        this.bindEvents();
        this.renderAll();
    }

    bindEvents() {
        const btnSortFreq = document.getElementById('btnSortFreqTable');
        const algoSelect = document.getElementById('freqAlgoSelect');
        const orderSelect = document.getElementById('freqOrderSelect');

        if (btnSortFreq) {
            btnSortFreq.addEventListener('click', () => {
                this.currentAlgo = algoSelect ? algoSelect.value : 'MergeSort';
                this.currentOrder = orderSelect ? orderSelect.value : 'desc';
                this.renderFrequencyTables();
            });
        }
    }

    renderAll() {
        this.renderSummaryBadges();
        this.renderFrequencyTables();
        this.renderCharts();
    }

    renderSummaryBadges() {
        const catFreq = this.store.getFrequencyMap('category');
        const typeFreq = this.store.getFrequencyMap('type');

        const catEntries = Object.entries(catFreq);
        if (catEntries.length === 0) return;

        // Find most & least frequent categories
        let mostFreqCat = catEntries[0];
        let leastFreqCat = catEntries[0];

        catEntries.forEach(([cat, count]) => {
            if (count > mostFreqCat[1]) mostFreqCat = [cat, count];
            if (count < leastFreqCat[1]) leastFreqCat = [cat, count];
        });

        const mostCatEl = document.getElementById('freqMostCategory');
        const leastCatEl = document.getElementById('freqLeastCategory');
        const mostTypeEl = document.getElementById('freqMostType');
        const leastTypeEl = document.getElementById('freqLeastType');

        if (mostCatEl) mostCatEl.textContent = `${mostFreqCat[0]} (${mostFreqCat[1]} txns)`;
        if (leastCatEl) leastCatEl.textContent = `${leastFreqCat[0]} (${leastFreqCat[1]} txns)`;

        // Type most & least
        const typeEntries = Object.entries(typeFreq);
        let mostFreqType = typeEntries[0] || ['N/A', 0];
        let leastFreqType = typeEntries[0] || ['N/A', 0];

        typeEntries.forEach(([t, count]) => {
            if (count > mostFreqType[1]) mostFreqType = [t, count];
            if (count < leastFreqType[1]) leastFreqType = [t, count];
        });

        if (mostTypeEl) mostTypeEl.textContent = `${mostFreqType[0]} (${mostFreqType[1]} txns)`;
        if (leastTypeEl) leastTypeEl.textContent = `${leastFreqType[0]} (${leastFreqType[1]} txns)`;
    }

    renderFrequencyTables() {
        const typeFreq = this.store.getFrequencyMap('type');
        const catFreq = this.store.getFrequencyMap('category');

        // Prepare arrays of objects { name, frequency, percentage, totalAmount }
        const txns = this.store.getAll();
        const totalTxns = txns.length || 1;

        const typeList = Object.entries(typeFreq).map(([name, count]) => {
            const sumAmt = txns.filter(t => t.type === name).reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
            return {
                name,
                frequency: count,
                percentage: ((count / totalTxns) * 100).toFixed(1),
                totalAmount: sumAmt
            };
        });

        const catList = Object.entries(catFreq).map(([name, count]) => {
            const sumAmt = txns.filter(t => t.category === name).reduce((acc, t) => acc + (Number(t.amount) || 0), 0);
            return {
                name,
                frequency: count,
                percentage: ((count / totalTxns) * 100).toFixed(1),
                totalAmount: sumAmt
            };
        });

        // SORT CATEGORIES & TYPES USING MANUAL MERGE SORT OR QUICK SORT!
        const Sorter = (this.currentAlgo === 'QuickSort') ? window.QuickSort : window.MergeSort;
        
        let sortedTypes = typeList;
        let sortedCategories = catList;
        let metricsCat = null;

        if (Sorter) {
            const resCat = Sorter.sort(catList, { key: 'frequency', order: this.currentOrder });
            sortedCategories = resCat.sorted;
            metricsCat = resCat.metrics;

            const resTypes = Sorter.sort(typeList, { key: 'frequency', order: this.currentOrder });
            sortedTypes = resTypes.sorted;
        }

        // Render Sort Notice
        const noticeEl = document.getElementById('freqSortNotice');
        if (noticeEl && metricsCat) {
            noticeEl.innerHTML = `
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <span class="font-bold">${this.currentAlgo}</span> sorted ${sortedCategories.length} categories by frequency (${this.currentOrder.toUpperCase()}) in 
                    <span class="text-emerald-600 dark:text-emerald-400 font-bold">${metricsCat.executionTimeMs}ms</span> 
                    (${metricsCat.comparisons} comparisons, ${metricsCat.swaps} movements).
                </div>
            `;
        }

        // Render Type Table
        const typeTbody = document.getElementById('freqTypeTableBody');
        if (typeTbody) {
            typeTbody.innerHTML = sortedTypes.map(item => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <td class="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">${item.name}</td>
                    <td class="py-3 px-4 text-right font-mono font-bold text-blue-600 dark:text-blue-400">${item.frequency}</td>
                    <td class="py-3 px-4 text-right font-mono text-slate-500">${item.percentage}%</td>
                    <td class="py-3 px-4 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">₹${item.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
            `).join('');
        }

        // Render Category Table
        const catTbody = document.getElementById('freqCategoryTableBody');
        if (catTbody) {
            catTbody.innerHTML = sortedCategories.map((item, idx) => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <td class="py-2.5 px-3 font-mono text-slate-400">${idx + 1}</td>
                    <td class="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">${item.name}</td>
                    <td class="py-2.5 px-3 text-right font-mono font-bold text-purple-600 dark:text-purple-400">${item.frequency}</td>
                    <td class="py-2.5 px-3 text-right font-mono text-slate-500">${item.percentage}%</td>
                    <td class="py-2.5 px-3 text-right font-mono font-semibold text-slate-700 dark:text-slate-300">₹${item.totalAmount.toLocaleString('en-IN')}</td>
                </tr>
            `).join('');
        }
    }

    renderCharts() {
        if (typeof Chart === 'undefined') return;

        const isDark = document.documentElement.classList.contains('dark');
        const textColor = isDark ? '#E2E8F0' : '#334155';
        const gridColor = isDark ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.8)';

        // 1. Category Bar Chart
        const catCtx = document.getElementById('chartCategoryFrequency');
        if (catCtx) {
            const catFreq = this.store.getFrequencyMap('category');
            const sortedEntries = Object.entries(catFreq).sort((a, b) => b[1] - a[1]);

            if (this.charts.catBar) this.charts.catBar.destroy();

            this.charts.catBar = new Chart(catCtx, {
                type: 'bar',
                data: {
                    labels: sortedEntries.map(e => e[0]),
                    datasets: [{
                        label: 'Transactions Count',
                        data: sortedEntries.map(e => e[1]),
                        backgroundColor: 'rgba(99, 102, 241, 0.8)',
                        borderColor: '#6366F1',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        x: {
                            grid: { color: gridColor },
                            ticks: { color: textColor, font: { size: 11 } }
                        },
                        y: {
                            grid: { color: gridColor },
                            ticks: { color: textColor, stepSize: 1 }
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }

        // 2. Type Pie Chart
        const typeCtx = document.getElementById('chartTypePie');
        if (typeCtx) {
            const typeFreq = this.store.getFrequencyMap('type');
            const labels = Object.keys(typeFreq);
            const data = Object.values(typeFreq);

            if (this.charts.typePie) this.charts.typePie.destroy();

            this.charts.typePie = new Chart(typeCtx, {
                type: 'pie',
                data: {
                    labels,
                    datasets: [{
                        data,
                        backgroundColor: ['#10B981', '#EF4444', '#3B82F6', '#8B5CF6'],
                        borderWidth: 2,
                        borderColor: isDark ? '#1E293B' : '#FFFFFF'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: textColor }
                        }
                    }
                }
            });
        }
    }
}

if (typeof window !== 'undefined') {
    window.FrequencyAnalysisComponent = FrequencyAnalysisComponent;
}
