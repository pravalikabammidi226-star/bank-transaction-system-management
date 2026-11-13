/**
 * Merge Sort Implementation for Bank Transaction Sorting and Analysis System
 * 
 * Properties:
 * - Paradigm: Divide and Conquer
 * - Time Complexity: Best O(n log n), Average O(n log n), Worst O(n log n)
 * - Space Complexity: O(n) auxiliary space
 * - Stability: Stable (maintains relative order of records with equal keys)
 * 
 * Strict requirement: NO Array.prototype.sort() used.
 */

class MergeSort {
    /**
     * Sorts an array of transactions or objects using Merge Sort
     * @param {Array} arr - The array to sort
     * @param {Object} options - Sorting options
     * @param {string} options.key - 'amount' | 'date' | 'frequency' | custom comparator
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
            swaps: 0, // In Merge Sort, counts auxiliary writes/movements into the merged array
            maxRecursionDepth: 0,
            executionTimeMs: 0
        };

        if (!Array.isArray(arr) || arr.length <= 1) {
            return {
                sorted: arr ? [...arr] : [],
                metrics
            };
        }

        // Comparator extraction helper
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
         * Compares two elements according to sort key and order
         * Returns true if itemA should come before itemB
         */
        const shouldPrecede = (itemA, itemB) => {
            metrics.comparisons++;
            const valA = getValue(itemA);
            const valB = getValue(itemB);

            if (order === 'asc') {
                // For stability with equal values, left item (< or =) precedes
                return valA <= valB;
            } else {
                // Descending: larger values come first
                return valA >= valB;
            }
        };

        // Recursive Merge Sort
        const divideAndMerge = (list, depth = 1) => {
            if (depth > metrics.maxRecursionDepth) {
                metrics.maxRecursionDepth = depth;
            }

            if (list.length <= 1) {
                return list;
            }

            const mid = Math.floor(list.length / 2);
            // Manual slice to divide
            const left = [];
            for (let i = 0; i < mid; i++) {
                left.push(list[i]);
            }
            const right = [];
            for (let i = mid; i < list.length; i++) {
                right.push(list[i]);
            }

            const sortedLeft = divideAndMerge(left, depth + 1);
            const sortedRight = divideAndMerge(right, depth + 1);

            return merge(sortedLeft, sortedRight);
        };

        /**
         * Merges two sorted subarrays into a single sorted array
         */
        const merge = (left, right) => {
            const result = [];
            let i = 0;
            let j = 0;

            while (i < left.length && j < right.length) {
                if (shouldPrecede(left[i], right[j])) {
                    result.push(left[i]);
                    metrics.swaps++; // data movement
                    i++;
                } else {
                    result.push(right[j]);
                    metrics.swaps++; // data movement
                    j++;
                }
            }

            while (i < left.length) {
                result.push(left[i]);
                metrics.swaps++;
                i++;
            }

            while (j < right.length) {
                result.push(right[j]);
                metrics.swaps++;
                j++;
            }

            return result;
        };

        const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const sorted = divideAndMerge([...arr], 1);
        const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();

        metrics.executionTimeMs = Number((endTime - startTime).toFixed(4));

        return {
            sorted,
            metrics
        };
    }
}

// Export for module/Node.js or browser global
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MergeSort;
}
if (typeof window !== 'undefined') {
    window.MergeSort = MergeSort;
}
