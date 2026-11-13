/**
 * Reports Component
 * Provides custom filtered financial reports, summary analytics,
 * CSV export generation, and print-ready PDF styling.
 */

class ReportsComponent {
    constructor(store) {
        this.store = store;
        this.reportFilters = {
            startDate: '',
            endDate: '',
            type: 'All',
            category: 'All',
            status: 'All'
        };
    }

    init() {
        this.populateCategoryFilter();
        this.bindEvents();
        this.generateReport();
    }

    populateCategoryFilter() {
        const catSelect = document.getElementById('reportFilterCategory');
        if (!catSelect) return;

        const freq = this.store.getFrequencyMap('category');
        const categories = Object.keys(freq).sort();

        let options = '<option value="All">All Categories</option>';
        categories.forEach(c => {
            options += `<option value="${c}">${c} (${freq[c]})</option>`;
        });
        catSelect.innerHTML = options;
    }

    bindEvents() {
        const btnGenerate = document.getElementById('btnGenerateReport');
        const btnExportCsv = document.getElementById('btnExportCsv');
        const btnPrint = document.getElementById('btnPrintReport');

        if (btnGenerate) {
            btnGenerate.addEventListener('click', () => {
                this.updateFiltersFromUI();
                this.generateReport();
            });
        }

        if (btnExportCsv) {
            btnExportCsv.addEventListener('click', () => {
                this.exportToCsv();
            });
        }

        if (btnPrint) {
            btnPrint.addEventListener('click', () => {
                window.print();
            });
        }
    }

    updateFiltersFromUI() {
        const start = document.getElementById('reportFilterStartDate');
        const end = document.getElementById('reportFilterEndDate');
        const type = document.getElementById('reportFilterType');
        const cat = document.getElementById('reportFilterCategory');
        const status = document.getElementById('reportFilterStatus');

        this.reportFilters = {
            startDate: start ? start.value : '',
            endDate: end ? end.value : '',
            type: type ? type.value : 'All',
            category: cat ? cat.value : 'All',
            status: status ? status.value : 'All'
        };
    }

    getFilteredData() {
        let list = this.store.getAll();

        if (this.reportFilters.startDate) {
            const startMs = new Date(this.reportFilters.startDate).getTime();
            list = list.filter(t => new Date(t.date).getTime() >= startMs);
        }
        if (this.reportFilters.endDate) {
            const endMs = new Date(this.reportFilters.endDate).getTime() + (24 * 60 * 60 * 1000 - 1);
            list = list.filter(t => new Date(t.date).getTime() <= endMs);
        }
        if (this.reportFilters.type !== 'All') {
            list = list.filter(t => t.type === this.reportFilters.type);
        }
        if (this.reportFilters.category !== 'All') {
            list = list.filter(t => t.category === this.reportFilters.category);
        }
        if (this.reportFilters.status !== 'All') {
            list = list.filter(t => t.status === this.reportFilters.status);
        }

        return list;
    }

    generateReport() {
        const data = this.getFilteredData();

        // Calculate aggregates
        let totalIncome = 0;
        let totalExpense = 0;
        let highest = 0;

        data.forEach(t => {
            const amt = Number(t.amount) || 0;
            if (t.type === 'Deposit') {
                totalIncome += amt;
            } else {
                totalExpense += amt;
            }
            if (amt > highest) highest = amt;
        });

        const net = totalIncome - totalExpense;

        // Update Report Summary Cards
        const elCount = document.getElementById('reportMetricCount');
        const elIncome = document.getElementById('reportMetricIncome');
        const elExpense = document.getElementById('reportMetricExpense');
        const elNet = document.getElementById('reportMetricNet');

        if (elCount) elCount.textContent = data.length.toLocaleString();
        if (elIncome) elIncome.textContent = `₹${totalIncome.toLocaleString('en-IN')}`;
        if (elExpense) elExpense.textContent = `₹${totalExpense.toLocaleString('en-IN')}`;
        if (elNet) {
            elNet.textContent = `₹${Math.abs(net).toLocaleString('en-IN')}`;
            elNet.className = net >= 0 ? 'text-lg font-bold text-emerald-600 dark:text-emerald-400' : 'text-lg font-bold text-rose-600 dark:text-rose-400';
        }

        // Render Report Table
        const tbody = document.getElementById('reportTableBody');
        if (!tbody) return;

        if (data.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="text-center py-8 text-slate-400">No transactions match the selected report criteria.</td></tr>`;
            return;
        }

        tbody.innerHTML = data.map(t => {
            const isCredit = t.type === 'Deposit';
            const dateStr = new Date(t.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: '2-digit'
            });

            return `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-xs">
                    <td class="py-2.5 px-3 font-mono text-slate-600 dark:text-slate-400">${t.id}</td>
                    <td class="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">${t.accountHolder}</td>
                    <td class="py-2.5 px-3">${t.type}</td>
                    <td class="py-2.5 px-3 font-mono font-semibold text-right ${isCredit ? 'text-emerald-600' : 'text-slate-800 dark:text-slate-200'}">
                        ₹${Number(t.amount).toLocaleString('en-IN')}
                    </td>
                    <td class="py-2.5 px-3 text-slate-500">${dateStr}</td>
                    <td class="py-2.5 px-3 text-slate-600 dark:text-slate-300">${t.category}</td>
                    <td class="py-2.5 px-3">
                        <span class="px-2 py-0.5 rounded text-[10px] ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}">
                            ${t.status}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
    }

    exportToCsv() {
        const data = this.getFilteredData();
        if (data.length === 0) {
            alert('No transactions available to export with current filters.');
            return;
        }

        const headers = ['Transaction ID', 'Account Holder', 'Type', 'Amount (INR)', 'Date', 'Category', 'Status', 'Description'];

        const rows = data.map(t => [
            `"${t.id || ''}"`,
            `"${(t.accountHolder || '').replace(/"/g, '""')}"`,
            `"${t.type || ''}"`,
            Number(t.amount) || 0,
            `"${t.date || ''}"`,
            `"${t.category || ''}"`,
            `"${t.status || ''}"`,
            `"${(t.description || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        const timestamp = new Date().toISOString().slice(0, 10);
        link.setAttribute('href', url);
        link.setAttribute('download', `Bank_Transactions_Report_${timestamp}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

if (typeof window !== 'undefined') {
    window.ReportsComponent = ReportsComponent;
}
