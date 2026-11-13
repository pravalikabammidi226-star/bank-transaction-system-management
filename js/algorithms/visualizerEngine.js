/**
 * Visualizer Engine for Bank Transaction Sorting
 * 
 * Generates an inspectable, step-by-step trace of Merge Sort and Quick Sort execution.
 * Each step contains:
 * - array: Array of items with state flags (normal, comparing, pivot, swapping, sorted, inactive)
 * - type: Step type ('split', 'compare', 'swap', 'place', 'pivot', 'mark_sorted', 'done')
 * - highlights: Indices involved
 * - message: Educational banking explanation of what the algorithm is doing at this instant
 * - stats: { comparisons, swaps, depth }
 */

class VisualizerEngine {
    /**
     * Extracts comparable value from transaction
     */
    static getValue(item, key, order) {
        if (!item) return 0;
        if (key === 'amount') return Number(item.amount) || 0;
        if (key === 'date') return new Date(item.date).getTime() || 0;
        if (key === 'frequency') return Number(item.frequency || item._freq || 0);
        return item[key] || 0;
    }

    /**
     * Generates steps for Merge Sort
     */
    static generateMergeSortSteps(initialArr, options = {}) {
        const { key = 'amount', order = 'asc' } = options;
        const steps = [];
        let comparisons = 0;
        let swaps = 0;

        // Deep copy of items
        const workingArray = initialArr.map((item, idx) => ({
            ...item,
            _id: item.id || `T-${idx}`,
            _state: 'normal' // normal, comparing, placing, sorted
        }));

        const recordStep = (type, highlights, message) => {
            steps.push({
                type,
                highlights: [...highlights],
                message,
                stats: { comparisons, swaps },
                array: workingArray.map(item => ({ ...item }))
            });
        };

        recordStep('init', [], `Starting Merge Sort on ${workingArray.length} banking transactions.`);

        const shouldPrecede = (valA, valB) => {
            comparisons++;
            if (order === 'asc') {
                return valA <= valB;
            } else {
                return valA >= valB;
            }
        };

        const mergeSortInternal = (start, end) => {
            if (start >= end) return;

            const mid = Math.floor((start + end) / 2);

            // Highlight division
            for (let i = start; i <= end; i++) {
                workingArray[i]._state = i <= mid ? 'div-left' : 'div-right';
            }
            recordStep('split', [start, mid, end], `Dividing transactions [${start}..${end}] into left [${start}..${mid}] and right [${mid + 1}..${end}].`);

            // Reset state
            for (let i = start; i <= end; i++) {
                workingArray[i]._state = 'normal';
            }

            mergeSortInternal(start, mid);
            mergeSortInternal(mid + 1, end);

            // Merge operation
            const leftCopy = [];
            for (let i = start; i <= mid; i++) {
                leftCopy.push({ ...workingArray[i] });
            }
            const rightCopy = [];
            for (let i = mid + 1; i <= end; i++) {
                rightCopy.push({ ...workingArray[i] });
            }

            let i = 0;
            let j = 0;
            let k = start;

            while (i < leftCopy.length && j < rightCopy.length) {
                const valA = VisualizerEngine.getValue(leftCopy[i], key, order);
                const valB = VisualizerEngine.getValue(rightCopy[j], key, order);

                workingArray[k]._state = 'comparing';
                recordStep(
                    'compare',
                    [k],
                    `Comparing ₹${Number(leftCopy[i].amount).toLocaleString('en-IN')} (${leftCopy[i].accountHolder || leftCopy[i].category}) with ₹${Number(rightCopy[j].amount).toLocaleString('en-IN')} (${rightCopy[j].accountHolder || rightCopy[j].category}).`
                );

                if (shouldPrecede(valA, valB)) {
                    workingArray[k] = { ...leftCopy[i], _state: 'placing' };
                    swaps++;
                    recordStep('place', [k], `Merging smaller/priority transaction ₹${Number(leftCopy[i].amount).toLocaleString('en-IN')} into position ${k}.`);
                    workingArray[k]._state = 'normal';
                    i++;
                } else {
                    workingArray[k] = { ...rightCopy[j], _state: 'placing' };
                    swaps++;
                    recordStep('place', [k], `Merging smaller/priority transaction ₹${Number(rightCopy[j].amount).toLocaleString('en-IN')} into position ${k}.`);
                    workingArray[k]._state = 'normal';
                    j++;
                }
                k++;
            }

            while (i < leftCopy.length) {
                workingArray[k] = { ...leftCopy[i], _state: 'placing' };
                swaps++;
                recordStep('place', [k], `Copying remaining left partition item ₹${Number(leftCopy[i].amount).toLocaleString('en-IN')} into position ${k}.`);
                workingArray[k]._state = 'normal';
                i++;
                k++;
            }

            while (j < rightCopy.length) {
                workingArray[k] = { ...rightCopy[j], _state: 'placing' };
                swaps++;
                recordStep('place', [k], `Copying remaining right partition item ₹${Number(rightCopy[j].amount).toLocaleString('en-IN')} into position ${k}.`);
                workingArray[k]._state = 'normal';
                j++;
                k++;
            }

            // Subarray now merged
            for (let idx = start; idx <= end; idx++) {
                workingArray[idx]._state = (start === 0 && end === workingArray.length - 1) ? 'sorted' : 'merged';
            }
            recordStep('merged', [start, end], `Subarray [${start}..${end}] successfully merged in order.`);
        };

        mergeSortInternal(0, workingArray.length - 1);

        // Final step: mark all sorted
        for (let idx = 0; idx < workingArray.length; idx++) {
            workingArray[idx]._state = 'sorted';
        }
        recordStep('done', [], `Merge Sort Complete! Total Comparisons: ${comparisons}, Total Data Movements: ${swaps}.`);

        return steps;
    }

    /**
     * Generates steps for Quick Sort
     */
    static generateQuickSortSteps(initialArr, options = {}) {
        const { key = 'amount', order = 'asc' } = options;
        const steps = [];
        let comparisons = 0;
        let swaps = 0;

        const workingArray = initialArr.map((item, idx) => ({
            ...item,
            _id: item.id || `T-${idx}`,
            _state: 'normal'
        }));

        const recordStep = (type, highlights, message) => {
            steps.push({
                type,
                highlights: [...highlights],
                message,
                stats: { comparisons, swaps },
                array: workingArray.map(item => ({ ...item }))
            });
        };

        recordStep('init', [], `Starting Quick Sort on ${workingArray.length} banking transactions.`);

        const shouldPrecede = (valA, valB) => {
            comparisons++;
            if (order === 'asc') {
                return valA <= valB;
            } else {
                return valA >= valB;
            }
        };

        const swapElements = (idx1, idx2) => {
            if (idx1 === idx2) return;
            const temp = workingArray[idx1];
            workingArray[idx1] = workingArray[idx2];
            workingArray[idx2] = temp;
            swaps++;
        };

        const partition = (low, high) => {
            const pivotIndex = high;
            const pivotItem = workingArray[pivotIndex];
            const pivotVal = VisualizerEngine.getValue(pivotItem, key, order);

            workingArray[pivotIndex]._state = 'pivot';
            recordStep('pivot', [pivotIndex], `Selected Pivot: ₹${Number(pivotItem.amount).toLocaleString('en-IN')} at index ${pivotIndex} (${pivotItem.accountHolder || pivotItem.category}).`);

            let i = low - 1;

            for (let j = low; j < high; j++) {
                workingArray[j]._state = 'comparing';
                const currentVal = VisualizerEngine.getValue(workingArray[j], key, order);

                recordStep('compare', [j, pivotIndex], `Comparing ₹${Number(workingArray[j].amount).toLocaleString('en-IN')} at index ${j} with Pivot ₹${Number(pivotItem.amount).toLocaleString('en-IN')}.`);

                if (shouldPrecede(currentVal, pivotVal)) {
                    i++;
                    workingArray[j]._state = 'normal';
                    if (i !== j) {
                        workingArray[i]._state = 'swapping';
                        workingArray[j]._state = 'swapping';
                        recordStep('swap', [i, j], `Swapping ₹${Number(workingArray[i].amount).toLocaleString('en-IN')} and ₹${Number(workingArray[j].amount).toLocaleString('en-IN')} to move smaller item left.`);
                        swapElements(i, j);
                        workingArray[i]._state = 'normal';
                        workingArray[j]._state = 'normal';
                    }
                } else {
                    workingArray[j]._state = 'normal';
                }
            }

            // Place pivot into correct position
            const finalPivotPos = i + 1;
            if (finalPivotPos !== high) {
                workingArray[finalPivotPos]._state = 'swapping';
                workingArray[high]._state = 'swapping';
                recordStep('swap', [finalPivotPos, high], `Swapping pivot ₹${Number(pivotItem.amount).toLocaleString('en-IN')} into its partition boundary position ${finalPivotPos}.`);
                swapElements(finalPivotPos, high);
            }

            workingArray[finalPivotPos]._state = 'partition_placed';
            recordStep('partition_done', [finalPivotPos], `Pivot ₹${Number(workingArray[finalPivotPos].amount).toLocaleString('en-IN')} is now in its permanently sorted position (${finalPivotPos}).`);

            return finalPivotPos;
        };

        const quickSortInternal = (low, high) => {
            if (low < high) {
                const pi = partition(low, high);
                quickSortInternal(low, pi - 1);
                quickSortInternal(pi + 1, high);
            } else if (low === high) {
                workingArray[low]._state = 'sorted';
            }
        };

        quickSortInternal(0, workingArray.length - 1);

        for (let idx = 0; idx < workingArray.length; idx++) {
            workingArray[idx]._state = 'sorted';
        }
        recordStep('done', [], `Quick Sort Complete! Total Comparisons: ${comparisons}, Total Swaps: ${swaps}.`);

        return steps;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = VisualizerEngine;
}
if (typeof window !== 'undefined') {
    window.VisualizerEngine = VisualizerEngine;
}
