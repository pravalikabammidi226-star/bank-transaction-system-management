/**
 * Transaction Data Store
 * Handles state management, LocalStorage synchronization, CRUD operations,
 * synthetic transaction generation for stress-testing, and dynamic financial aggregates.
 */

class TransactionStore {
    constructor() {
        this.STORAGE_KEY = 'bank_transactions_dsa_db';
        this.listeners = [];
        this.transactions = this.loadInitialData();
    }

    /**
     * Load transactions from LocalStorage or fallback to sampleTransactions
     */
    loadInitialData() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                const stored = window.localStorage.getItem(this.STORAGE_KEY);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed;
                    }
                }
            }
        } catch (e) {
            console.warn('Could not read from localStorage, using in-memory sample dataset', e);
        }

        // Return copy of sampleTransactions
        return (typeof sampleTransactions !== 'undefined') 
            ? JSON.parse(JSON.stringify(sampleTransactions))
            : [];
    }

    /**
     * Persist to LocalStorage
     */
    save() {
        try {
            if (typeof window !== 'undefined' && window.localStorage) {
                window.localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.transactions));
            }
        } catch (e) {
            console.error('Error saving to localStorage', e);
        }
        this.notifyListeners();
    }

    /**
     * Subscribe to state updates
     */
    subscribe(callback) {
        if (typeof callback === 'function') {
            this.listeners.push(callback);
        }
        return () => {
            this.listeners = this.listeners.filter(cb => cb !== callback);
        };
    }

    notifyListeners() {
        this.listeners.forEach(cb => {
            try {
                cb(this.transactions);
            } catch (err) {
                console.error('Listener callback error', err);
            }
        });
    }

    /**
     * Get all transactions
     */
    getAll() {
        return [...this.transactions];
    }

    /**
     * Get single transaction by ID
     */
    getById(id) {
        return this.transactions.find(t => t.id === id) || null;
    }

    /**
     * Add a new transaction
     */
    add(transaction) {
        const newTxn = {
            id: transaction.id || `TXN-2026-${String(Date.now()).slice(-4)}`,
            accountHolder: transaction.accountHolder || 'Standard Account Holder',
            type: transaction.type || 'Payment',
            amount: Number(transaction.amount) || 0,
            date: transaction.date || new Date().toISOString(),
            category: transaction.category || 'General',
            status: transaction.status || 'Completed',
            description: transaction.description || 'Manual entry'
        };

        this.transactions.unshift(newTxn);
        this.save();
        return newTxn;
    }

    /**
     * Update an existing transaction
     */
    update(id, updatedFields) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index === -1) return null;

        this.transactions[index] = {
            ...this.transactions[index],
            ...updatedFields,
            amount: updatedFields.amount !== undefined ? Number(updatedFields.amount) : this.transactions[index].amount
        };

        this.save();
        return this.transactions[index];
    }

    /**
     * Delete a transaction
     */
    delete(id) {
        const initialLen = this.transactions.length;
        this.transactions = this.transactions.filter(t => t.id !== id);
        if (this.transactions.length !== initialLen) {
            this.save();
            return true;
        }
        return false;
    }

    /**
     * Reset database back to default sample dataset
     */
    resetToSample() {
        if (typeof sampleTransactions !== 'undefined') {
            this.transactions = JSON.parse(JSON.stringify(sampleTransactions));
            this.save();
            return true;
        }
        return false;
    }

    /**
     * Generates N random transactions for algorithm benchmarking / stress testing
     */
    generateRandomDataset(count = 100) {
        const names = [
            "Aarav Mehta", "Saanvi Iyer", "Kabir Sen", "Ananya Deshmukh",
            "Reyansh Patel", "Ishaan Roy", "Aadhya Sharma", "Vihaan Rao",
            "Diya Singhal", "Advik Malhotra", "Rhea Joshi", "Devendra Kapoor",
            "Tarun Nambiar", "Meenakshi Pillai", "Gautam Sethi"
        ];
        const types = ["Deposit", "Withdrawal", "Transfer", "Payment"];
        const categories = ["Salary", "Groceries", "Rent", "Utilities", "Shopping", "Investment", "Healthcare", "Dining", "Entertainment", "Freelance", "Cash"];
        const statuses = ["Completed", "Completed", "Completed", "Pending", "Failed"];

        const generated = [];
        const startTimestamp = new Date("2026-01-01T00:00:00").getTime();
        const endTimestamp = new Date("2026-12-31T23:59:59").getTime();

        for (let i = 1; i <= count; i++) {
            const randomType = types[Math.floor(Math.random() * types.length)];
            let randomAmount = 0;

            if (randomType === 'Deposit') {
                randomAmount = Math.floor(Math.random() * 120000) + 15000;
            } else if (randomType === 'Withdrawal') {
                randomAmount = (Math.floor(Math.random() * 20) + 1) * 500;
            } else {
                randomAmount = Math.floor(Math.random() * 45000) + 150;
            }

            const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
            const dateStr = new Date(randomTimestamp).toISOString();

            generated.push({
                id: `TXN-GEN-${String(i).padStart(5, '0')}`,
                accountHolder: names[Math.floor(Math.random() * names.length)],
                type: randomType,
                amount: randomAmount,
                date: dateStr,
                category: categories[Math.floor(Math.random() * categories.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                description: `Synthetic transaction #${i}`
            });
        }

        return generated;
    }

    /**
     * Sets current database to a new set of transactions
     */
    setTransactions(newTxns) {
        this.transactions = [...newTxns];
        this.save();
    }

    /**
     * Compute Frequency Map for a field ('category' or 'type')
     */
    getFrequencyMap(field = 'category') {
        const freq = {};
        this.transactions.forEach(t => {
            const key = t[field] || 'Unknown';
            freq[key] = (freq[key] || 0) + 1;
        });
        return freq;
    }

    /**
     * Get aggregate financial metrics
     */
    getStatistics() {
        const total = this.transactions.length;
        if (total === 0) {
            return {
                totalCount: 0,
                totalReceived: 0,
                totalSent: 0,
                netBalance: 0,
                highestTransaction: 0,
                averageAmount: 0,
                mostFrequentType: 'N/A',
                leastFrequentType: 'N/A',
                typeDistribution: {},
                categoryDistribution: {},
                statusDistribution: {}
            };
        }

        let totalReceived = 0;
        let totalSent = 0;
        let highest = 0;
        let sum = 0;
        const typeFreq = {};
        const catFreq = {};
        const statusFreq = {};

        this.transactions.forEach(t => {
            const amt = Number(t.amount) || 0;
            sum += amt;
            if (amt > highest) highest = amt;

            if (t.type === 'Deposit') {
                totalReceived += amt;
            } else {
                totalSent += amt;
            }

            typeFreq[t.type] = (typeFreq[t.type] || 0) + 1;
            catFreq[t.category] = (catFreq[t.category] || 0) + 1;
            statusFreq[t.status] = (statusFreq[t.status] || 0) + 1;
        });

        // Most and least frequent type
        let mostFreqType = 'Deposit';
        let maxCount = -1;
        let leastFreqType = 'Deposit';
        let minCount = Infinity;

        Object.entries(typeFreq).forEach(([t, count]) => {
            if (count > maxCount) {
                maxCount = count;
                mostFreqType = t;
            }
            if (count < minCount) {
                minCount = count;
                leastFreqType = t;
            }
        });

        return {
            totalCount: total,
            totalReceived,
            totalSent,
            netBalance: totalReceived - totalSent,
            highestTransaction: highest,
            averageAmount: Math.round(sum / total),
            mostFrequentType: `${mostFreqType} (${maxCount})`,
            leastFrequentType: `${leastFreqType} (${minCount === Infinity ? 0 : minCount})`,
            typeDistribution: typeFreq,
            categoryDistribution: catFreq,
            statusDistribution: statusFreq
        };
    }
}

// Global instance
if (typeof window !== 'undefined') {
    window.transactionStore = new TransactionStore();
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TransactionStore;
}
