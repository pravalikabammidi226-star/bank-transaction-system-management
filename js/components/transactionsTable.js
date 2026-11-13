/**
 * Transactions Table Component
 * Supports CRUD, search, comprehensive multi-attribute filtering,
 * pagination, and in-table sorting using MergeSort and QuickSort.
 */

class TransactionsTableComponent {
    constructor(store) {
        this.store = store;
        this.currentPage = 1;
        this.pageSize = 10;
        this.currentSort = {
            algorithm: 'MergeSort', // 'MergeSort' or 'QuickSort'
            key: 'date',            // 'date', 'amount', 'frequency'
            order: 'desc'           // 'asc' or 'desc'
        };
        this.filters = {
            search: '',
            type: 'All',
            status: 'All',
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: ''
        };
        this.editingTxnId = null;
        this.lastSortMetrics = null;
    }

    init() {
        this.bindEvents();
        this.render();
    }

    bindEvents() {
        // Search input
        const searchInput = document.getElementById('txnSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filters.search = e.target.value.trim().toLowerCase();
                this.currentPage = 1;
                this.render();
            });
        }

        // Type filter
        const typeFilter = document.getElementById('txnFilterType');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filters.type = e.target.value;
                this.currentPage = 1;
                this.render();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('txnFilterStatus');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filters.status = e.target.value;
                this.currentPage = 1;
                this.render();
            });
        }

        // Date range
        const startDate = document.getElementById('txnFilterStartDate');
        const endDate = document.getElementById('txnFilterEndDate');
        if (startDate) {
            startDate.addEventListener('change', (e) => {
                this.filters.startDate = e.target.value;
                this.currentPage = 1;
                this.render();
            });
        }
        if (endDate) {
            endDate.addEventListener('change', (e) => {
                this.filters.endDate = e.target.value;
                this.currentPage = 1;
                this.render();
            });
        }

        // Amount range
        const minAmt = document.getElementById('txnFilterMinAmount');
        const maxAmt = document.getElementById('txnFilterMaxAmount');
        if (minAmt) {
            minAmt.addEventListener('input', (e) => {
                this.filters.minAmount = e.target.value;
                this.currentPage = 1;
                this.render();
            });
        }
        if (maxAmt) {
            maxAmt.addEventListener('input', (e) => {
                this.filters.maxAmount = e.target.value;
                this.currentPage = 1;
                this.render();
            });
        }

        // Reset Filters Button
        const btnResetFilters = document.getElementById('btnResetFilters');
        if (btnResetFilters) {
            btnResetFilters.addEventListener('click', () => {
                this.resetFilters();
            });
        }

        // Algorithm selector in table controls
        const algoSelector = document.getElementById('tableAlgoSelector');
        if (algoSelector) {
            algoSelector.addEventListener('change', (e) => {
                this.currentSort.algorithm = e.target.value;
                this.triggerSort(this.currentSort.key, this.currentSort.order);
            });
        }

        // Page size selector
        const pageSizeSelect = document.getElementById('txnPageSize');
        if (pageSizeSelect) {
            pageSizeSelect.addEventListener('change', (e) => {
                this.pageSize = parseInt(e.target.value, 10);
                this.currentPage = 1;
                this.render();
            });
        }

        // Modal Form submission (Add / Edit)
        const txnForm = document.getElementById('txnModalForm');
        if (txnForm) {
            txnForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }

        // Table Header Click Sorts
        const sortHeaders = document.querySelectorAll('[data-sort-key]');
        sortHeaders.forEach(th => {
            th.addEventListener('click', () => {
                const key = th.getAttribute('data-sort-key');
                const order = (this.currentSort.key === key && this.currentSort.order === 'asc') ? 'desc' : 'asc';
                this.triggerSort(key, order);
            });
        });
    }

    resetFilters() {
        this.filters = {
            search: '',
            type: 'All',
            status: 'All',
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: ''
        };

        const inputs = [
            'txnSearchInput', 'txnFilterType', 'txnFilterStatus', 
            'txnFilterStartDate', 'txnFilterEndDate', 'txnFilterMinAmount', 'txnFilterMaxAmount'
        ];
        inputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (el.tagName === 'SELECT') el.value = 'All';
                else el.value = '';
            }
        });

        this.currentPage = 1;
        this.render();
    }

    getFilteredTransactions() {
        let list = this.store.getAll();

        // 1. Text Search
        if (this.filters.search) {
            const q = this.filters.search;
            list = list.filter(t => 
                (t.id && t.id.toLowerCase().includes(q)) ||
                (t.accountHolder && t.accountHolder.toLowerCase().includes(q)) ||
                (t.category && t.category.toLowerCase().includes(q)) ||
                (t.description && t.description.toLowerCase().includes(q))
            );
        }

        // 2. Type Filter
        if (this.filters.type && this.filters.type !== 'All') {
            list = list.filter(t => t.type === this.filters.type);
        }

        // 3. Status Filter
        if (this.filters.status && this.filters.status !== 'All') {
            list = list.filter(t => t.status === this.filters.status);
        }

        // 4. Date Range
        if (this.filters.startDate) {
            const start = new Date(this.filters.startDate).getTime();
            list = list.filter(t => new Date(t.date).getTime() >= start);
        }
        if (this.filters.endDate) {
            const end = new Date(this.filters.endDate).getTime() + (24 * 60 * 60 * 1000 - 1);
            list = list.filter(t => new Date(t.date).getTime() <= end);
        }

        // 5. Amount Range
        if (this.filters.minAmount !== '') {
            const min = parseFloat(this.filters.minAmount);
            if (!isNaN(min)) list = list.filter(t => t.amount >= min);
        }
        if (this.filters.maxAmount !== '') {
            const max = parseFloat(this.filters.maxAmount);
            if (!isNaN(max)) list = list.filter(t => t.amount <= max);
        }

        return list;
    }

    /**
     * Triggers manual sorting via Merge Sort or Quick Sort
     */
    triggerSort(key, order) {
        this.currentSort.key = key;
        this.currentSort.order = order;

        const algo = this.currentSort.algorithm;
        const Sorter = (algo === 'QuickSort') ? window.QuickSort : window.MergeSort;

        const freqMap = this.store.getFrequencyMap('category');
        const filtered = this.getFilteredTransactions();

        if (Sorter && typeof Sorter.sort === 'function') {
            const result = Sorter.sort(filtered, {
                key,
                order,
                frequencyMap: freqMap
            });

            this.sortedDataset = result.sorted;
            this.lastSortMetrics = {
                algorithm: algo,
                key,
                order,
                metrics: result.metrics,
                count: result.sorted.length
            };
        } else {
            console.error('Manual sorter not found for', algo);
        }

        this.render();
    }

    render() {
        const tableBody = document.getElementById('txnTableBody');
        const countBadge = document.getElementById('txnCountBadge');
        const sortBadge = document.getElementById('txnSortMetricsBadge');

        if (!tableBody) return;

        // If user actively sorted or filtered
        let dataset = this.sortedDataset;
        if (!dataset) {
            // Apply current sort order by default
            const filtered = this.getFilteredTransactions();
            const Sorter = (this.currentSort.algorithm === 'QuickSort') ? window.QuickSort : window.MergeSort;
            if (Sorter) {
                const res = Sorter.sort(filtered, {
                    key: this.currentSort.key,
                    order: this.currentSort.order,
                    frequencyMap: this.store.getFrequencyMap('category')
                });
                dataset = res.sorted;
                this.lastSortMetrics = {
                    algorithm: this.currentSort.algorithm,
                    key: this.currentSort.key,
                    order: this.currentSort.order,
                    metrics: res.metrics,
                    count: res.sorted.length
                };
            } else {
                dataset = filtered;
            }
        }

        if (countBadge) {
            countBadge.textContent = `${dataset.length} transactions`;
        }

        // Render Sort Metrics notification
        if (sortBadge && this.lastSortMetrics) {
            const m = this.lastSortMetrics.metrics;
            const sortLabel = this.lastSortMetrics.key === 'amount' 
                ? 'Amount' 
                : this.lastSortMetrics.key === 'date' 
                    ? 'Date' 
                    : 'Category Frequency';
            const orderLabel = this.lastSortMetrics.order === 'asc' ? 'Ascending' : 'Descending';

            sortBadge.innerHTML = `
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    <span class="font-bold flex items-center gap-1">
                        <i data-lucide="zap" class="w-3.5 h-3.5 text-blue-600"></i> ${this.lastSortMetrics.algorithm}
                    </span>
                    <span>•</span>
                    <span>${sortLabel} (${orderLabel})</span>
                    <span>•</span>
                    <span class="text-emerald-600 dark:text-emerald-400 font-semibold">${m.executionTimeMs}ms</span>
                    <span>•</span>
                    <span>${m.comparisons.toLocaleString()} comparisons</span>
                    <span>•</span>
                    <span>${m.swaps.toLocaleString()} data moves/swaps</span>
                </div>
            `;
            if (window.lucide) window.lucide.createIcons();
        }

        // Pagination slicing
        const totalItems = dataset.length;
        const totalPages = Math.ceil(totalItems / this.pageSize) || 1;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        if (this.currentPage < 1) this.currentPage = 1;

        const startIndex = (this.currentPage - 1) * this.pageSize;
        const pageItems = dataset.slice(startIndex, startIndex + this.pageSize);

        if (pageItems.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-12 text-slate-400">
                        <div class="flex flex-col items-center justify-center">
                            <i data-lucide="inbox" class="w-10 h-10 mb-2 opacity-40"></i>
                            <p class="font-medium">No matching transactions found.</p>
                            <p class="text-xs text-slate-400 mt-1">Try adjusting your filters or search keywords.</p>
                        </div>
                    </td>
                </tr>
            `;
            if (window.lucide) window.lucide.createIcons();
            this.renderPagination(0, 0, 0);
            return;
        }

        // Frequency map to display category frequency tags
        const freqMap = this.store.getFrequencyMap('category');

        tableBody.innerHTML = pageItems.map(t => {
            const isCredit = t.type === 'Deposit';
            const typeBadge = isCredit 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' 
                : t.type === 'Withdrawal'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                    : t.type === 'Transfer'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                        : 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';

            const statusBadge = t.status === 'Completed'
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : t.status === 'Pending'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400';

            const dateStr = new Date(t.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'short',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            const catFreq = freqMap[t.category] || 1;

            return `
                <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/80 transition-colors">
                    <td class="py-3 px-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">
                        ${t.id}
                    </td>
                    <td class="py-3 px-4">
                        <div class="font-medium text-slate-800 dark:text-slate-100">${t.accountHolder}</div>
                        <div class="text-[11px] text-slate-400 truncate max-w-[180px]">${t.description || ''}</div>
                    </td>
                    <td class="py-3 px-4">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${typeBadge}">
                            ${t.type}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-right font-mono font-semibold ${isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}">
                        ₹${Number(t.amount).toLocaleString('en-IN')}
                    </td>
                    <td class="py-3 px-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                        ${dateStr}
                    </td>
                    <td class="py-3 px-4">
                        <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs">
                            ${t.category}
                            <span class="text-[10px] bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-500 dark:text-slate-400 font-mono" title="Category frequency count">
                                ${catFreq}×
                            </span>
                        </span>
                    </td>
                    <td class="py-3 px-4">
                        <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusBadge}">
                            ${t.status}
                        </span>
                    </td>
                    <td class="py-3 px-4 text-right whitespace-nowrap">
                        <button onclick="window.txnTable.openEditModal('${t.id}')" class="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit Transaction">
                            <i data-lucide="edit-3" class="w-4 h-4"></i>
                        </button>
                        <button onclick="window.txnTable.confirmDelete('${t.id}')" class="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors" title="Delete Transaction">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        if (window.lucide) window.lucide.createIcons();
        this.renderPagination(startIndex + 1, Math.min(startIndex + this.pageSize, totalItems), totalItems);
    }

    renderPagination(start, end, total) {
        const pagInfo = document.getElementById('txnPaginationInfo');
        const pagControls = document.getElementById('txnPaginationControls');

        if (pagInfo) {
            pagInfo.textContent = total > 0 ? `Showing ${start} to ${end} of ${total} entries` : 'No entries to display';
        }

        if (!pagControls) return;

        const totalPages = Math.ceil(total / this.pageSize) || 1;
        let html = '';

        // Previous button
        html += `
            <button 
                onclick="window.txnTable.goToPage(${this.currentPage - 1})" 
                ${this.currentPage <= 1 ? 'disabled' : ''} 
                class="px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                Prev
            </button>
        `;

        // Page buttons (window of 5 pages)
        const startP = Math.max(1, this.currentPage - 2);
        const endP = Math.min(totalPages, startP + 4);

        for (let p = startP; p <= endP; p++) {
            const isActive = p === this.currentPage;
            html += `
                <button 
                    onclick="window.txnTable.goToPage(${p})" 
                    class="px-2.5 py-1 text-xs rounded font-medium transition ${isActive 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}">
                    ${p}
                </button>
            `;
        }

        // Next button
        html += `
            <button 
                onclick="window.txnTable.goToPage(${this.currentPage + 1})" 
                ${this.currentPage >= totalPages ? 'disabled' : ''} 
                class="px-2.5 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition">
                Next
            </button>
        `;

        pagControls.innerHTML = html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.render();
    }

    // Modal Operations
    openAddModal() {
        this.editingTxnId = null;
        const modal = document.getElementById('txnModal');
        const modalTitle = document.getElementById('txnModalTitle');
        const form = document.getElementById('txnModalForm');

        if (!modal || !form) return;

        modalTitle.textContent = 'Add New Banking Transaction';
        form.reset();

        // Default date to now
        const now = new Date();
        const dateInput = document.getElementById('txnFormDate');
        if (dateInput) {
            dateInput.value = now.toISOString().slice(0, 16);
        }

        modal.classList.remove('hidden');
    }

    openEditModal(id) {
        const txn = this.store.getById(id);
        if (!txn) return;

        this.editingTxnId = id;
        const modal = document.getElementById('txnModal');
        const modalTitle = document.getElementById('txnModalTitle');

        if (!modal) return;
        modalTitle.textContent = `Edit Transaction (${txn.id})`;

        document.getElementById('txnFormAccountHolder').value = txn.accountHolder || '';
        document.getElementById('txnFormType').value = txn.type || 'Payment';
        document.getElementById('txnFormAmount').value = txn.amount || '';
        document.getElementById('txnFormCategory').value = txn.category || 'General';
        document.getElementById('txnFormStatus').value = txn.status || 'Completed';
        document.getElementById('txnFormDescription').value = txn.description || '';

        const dateInput = document.getElementById('txnFormDate');
        if (dateInput && txn.date) {
            const d = new Date(txn.date);
            dateInput.value = isNaN(d) ? '' : d.toISOString().slice(0, 16);
        }

        modal.classList.remove('hidden');
    }

    closeModal() {
        const modal = document.getElementById('txnModal');
        if (modal) modal.classList.add('hidden');
        this.editingTxnId = null;
    }

    handleFormSubmit() {
        const accountHolder = document.getElementById('txnFormAccountHolder').value.trim();
        const type = document.getElementById('txnFormType').value;
        const amount = parseFloat(document.getElementById('txnFormAmount').value);
        const dateVal = document.getElementById('txnFormDate').value;
        const category = document.getElementById('txnFormCategory').value.trim();
        const status = document.getElementById('txnFormStatus').value;
        const description = document.getElementById('txnFormDescription').value.trim();

        // Validation
        if (!accountHolder) {
            alert('Please enter an account holder name.');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid transaction amount greater than ₹0.');
            return;
        }
        if (!category) {
            alert('Please select or specify a transaction category.');
            return;
        }

        const dateIso = dateVal ? new Date(dateVal).toISOString() : new Date().toISOString();

        if (this.editingTxnId) {
            // Update
            this.store.update(this.editingTxnId, {
                accountHolder,
                type,
                amount,
                date: dateIso,
                category,
                status,
                description
            });
        } else {
            // Add
            this.store.add({
                accountHolder,
                type,
                amount,
                date: dateIso,
                category,
                status,
                description
            });
        }

        this.closeModal();
        this.sortedDataset = null; // refresh view with updated dataset
        this.render();
    }

    confirmDelete(id) {
        const txn = this.store.getById(id);
        if (!txn) return;

        if (confirm(`Are you sure you want to delete transaction ${txn.id} (₹${txn.amount.toLocaleString('en-IN')}) for ${txn.accountHolder}?`)) {
            this.store.delete(id);
            this.sortedDataset = null;
            this.render();
        }
    }
}

if (typeof window !== 'undefined') {
    window.TransactionsTableComponent = TransactionsTableComponent;
}
