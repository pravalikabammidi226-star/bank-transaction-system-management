/**
 * Quick Sort Implementation for Bank Transaction Sorting and Analysis System
 * 
 * Properties:
 * - Paradigm: Divide and Conquer (Partitioning)
 * - Time Complexity: Best O(n log n), Average O(n log n), Worst O(n²)
 * - Space Complexity: O(log n) auxiliary stack space
 * - Stability: Unstable
 * 
 * Strict requirement: NO Array.prototype.sort() used.
 */

class QuickSort {
    /**
     * Sorts an array of transactions or objects using Quick Sort
     * @param {Array} arr - The array to sort
     * @param {Object} options - Sorting options
     * @param {string} options.key - 'amount' | 'date' | 'frequency' | custom field
     * @param {string} options.order - 'asc' | 'desc'
     * @param {Object} options.frequencyMap - Optional map for frequency lookups
     * @returns {Object} { sorted: Array, metrics: { comparisons: number, swaps: number, executionTimeMs: number } }
     */
    static sort(arr, options = {}) {
        const {
            key = 'amount',
            order = 'asc',
            frequencyMap = null
        } = options;

        const metrics = {
            comparisons: 0,
            swaps: 0,
            maxRecursionDepth: 0,
            executionTimeMs: 0
        };

        if (!Array.isArray(arr) || arr.length <= 1) {
            return {
                sorted: arr ? [...arr] : [],
                metrics
            };
        }

        // Clone array to prevent mutating caller's original array directly
        const list = new Array(arr.length);
        for (let idx = 0; idx < arr.length; idx++) {
            list[idx] = arr[idx];
        }

        // Value extractor
        const getValue = (item) => {
            if (item === null || item === undefined) return 0;
            if (key === 'amount') {
                return Number(item.amount) || 0;
            }
            if (key === 'date') {
                return new Date(item.date).getTime() || 0;
            }
            if (key === 'frequency') {
                if (item.frequency !== undefined) return Number(item.frequency) || 0;
                if (frequencyMap) {
                    const cat = item.category || item.type;
                    return frequencyMap[cat] || 0;
                }
                return 0;
            }
            return item[key] !== undefined ? item[key] : 0;
        };

        /**
         * Compares itemA and itemB based on order
         * If asc: returns true if itemA <= itemB
         * If desc: returns true if itemA >= itemB
         */
        const compare = (itemA, itemB) => {
            metrics.comparisons++;
            const valA = getValue(itemA);
            const valB = getValue(itemB);

            if (order === 'asc') {
                return valA <= valB;
            } else {
                return valA >= valB;
            }
        };

        /**
         * Manual swap of two indices in array
         */
        const swap = (i, j) => {
            if (i === j) return;
            const temp = list[i];
            list[i] = list[j];
            list[j] = temp;
            metrics.swaps++;
        };

        /**
         * Median-of-three pivot selection to prevent worst-case O(n^2) on sorted/reverse-sorted data
         */
        const choosePivotIndex = (low, high) => {
            const mid = Math.floor((low + high) / 2);
            // Sort low, mid, high among themselves
            if (compare(list[mid], list[low])) {
                swap(low, mid);
            }
            if (compare(list[high], list[low])) {
                swap(low, high);
            }
            if (compare(list[high], list[mid])) {
                swap(mid, high);
            }
            // Pivot is at high
            swap(mid, high);
            return high;
        };

        /**
         * Partition function using Lomuto partitioning with chosen pivot
         */
        const partition = (low, high) => {
            // Median of three pivot selection if segment is large enough
            if (high - low > 3) {
                choosePivotIndex(low, high);
            }

            const pivot = list[high];
            let i = low - 1;

            for (let j = low; j < high; j++) {
                if (compare(list[j], pivot)) {
                    i++;
                    swap(i, j);
                }
            }

            swap(i + 1, high);
            return i + 1;
        };

        /**
         * Recursive quicksort worker
         */
        const quickSortRecursive = (low, high, depth = 1) => {
            if (depth > metrics.maxRecursionDepth) {
                metrics.maxRecursionDepth = depth;
            }

            if (low < high) {
                const pivotIndex = partition(low, high);
                quickSortRecursive(low, pivotIndex - 1, depth + 1);
                quickSortRecursive(pivotIndex + 1, high, depth + 1);
            }
        };

        const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        quickSortRecursive(0, list.length - 1, 1);
        const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

        metrics.executionTimeMs = Number((endTime - startTime).toFixed(4));

        return {
            sorted: list,
            metrics
        };
    }
}

// Export for module/Node.js or browser global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuickSort;
}
if (typeof window !== 'undefined') {
    window.QuickSort = QuickSort;
}
