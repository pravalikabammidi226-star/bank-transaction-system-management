const MergeSort = require('../js/algorithms/mergeSort.js');
const QuickSort = require('../js/algorithms/quickSort.js');

const sampleTransactions = [
    { id: 'TXN-101', amount: 5000, date: '2026-03-01T10:00:00Z', category: 'Salary' },
    { id: 'TXN-102', amount: 150.5, date: '2026-01-15T08:30:00Z', category: 'Groceries' },
    { id: 'TXN-103', amount: 12000, date: '2026-03-10T14:20:00Z', category: 'Rent' },
    { id: 'TXN-104', amount: 450, date: '2026-02-20T11:00:00Z', category: 'Utilities' },
    { id: 'TXN-105', amount: 2500, date: '2026-01-05T19:45:00Z', category: 'Shopping' },
    { id: 'TXN-106', amount: 150.5, date: '2026-03-05T12:00:00Z', category: 'Groceries' },
    { id: 'TXN-107', amount: 89000, date: '2026-02-14T09:15:00Z', category: 'Investment' }
];

const freqMap = {
    'Salary': 1,
    'Groceries': 15,
    'Rent': 2,
    'Utilities': 8,
    'Shopping': 10,
    'Investment': 3
};

function testAlgorithm(name, Sorter) {
    console.log(`\n=================== Testing ${name} ===================`);

    // 1. Amount Ascending
    const resAmountAsc = Sorter.sort(sampleTransactions, { key: 'amount', order: 'asc' });
    const amountsAsc = resAmountAsc.sorted.map(t => t.amount);
    console.log('Amount ASC:', amountsAsc);
    for (let i = 0; i < amountsAsc.length - 1; i++) {
        if (amountsAsc[i] > amountsAsc[i + 1]) {
            throw new Error(`${name} failed Amount ASC check at index ${i}`);
        }
    }
    console.log(`✓ Amount ASC passed. Comparisons: ${resAmountAsc.metrics.comparisons}, Swaps: ${resAmountAsc.metrics.swaps}, Time: ${resAmountAsc.metrics.executionTimeMs}ms`);

    // 2. Amount Descending
    const resAmountDesc = Sorter.sort(sampleTransactions, { key: 'amount', order: 'desc' });
    const amountsDesc = resAmountDesc.sorted.map(t => t.amount);
    console.log('Amount DESC:', amountsDesc);
    for (let i = 0; i < amountsDesc.length - 1; i++) {
        if (amountsDesc[i] < amountsDesc[i + 1]) {
            throw new Error(`${name} failed Amount DESC check at index ${i}`);
        }
    }
    console.log(`✓ Amount DESC passed. Comparisons: ${resAmountDesc.metrics.comparisons}, Swaps: ${resAmountDesc.metrics.swaps}`);

    // 3. Date Ascending (Oldest to Newest)
    const resDateAsc = Sorter.sort(sampleTransactions, { key: 'date', order: 'asc' });
    const datesAsc = resDateAsc.sorted.map(t => t.date);
    console.log('Date ASC:', datesAsc);
    for (let i = 0; i < datesAsc.length - 1; i++) {
        if (new Date(datesAsc[i]).getTime() > new Date(datesAsc[i + 1]).getTime()) {
            throw new Error(`${name} failed Date ASC check at index ${i}`);
        }
    }
    console.log('✓ Date ASC passed.');

    // 4. Date Descending (Newest to Oldest)
    const resDateDesc = Sorter.sort(sampleTransactions, { key: 'date', order: 'desc' });
    const datesDesc = resDateDesc.sorted.map(t => t.date);
    console.log('Date DESC:', datesDesc);
    for (let i = 0; i < datesDesc.length - 1; i++) {
        if (new Date(datesDesc[i]).getTime() < new Date(datesDesc[i + 1]).getTime()) {
            throw new Error(`${name} failed Date DESC check at index ${i}`);
        }
    }
    console.log('✓ Date DESC passed.');

    // 5. Frequency Descending (Most frequent category first)
    const resFreqDesc = Sorter.sort(sampleTransactions, { key: 'frequency', order: 'desc', frequencyMap: freqMap });
    const freqDesc = resFreqDesc.sorted.map(t => freqMap[t.category]);
    console.log('Frequency DESC:', freqDesc);
    for (let i = 0; i < freqDesc.length - 1; i++) {
        if (freqDesc[i] < freqDesc[i + 1]) {
            throw new Error(`${name} failed Frequency DESC check at index ${i}`);
        }
    }
    console.log('✓ Frequency DESC passed.');

    // 6. Edge cases: Empty array, single item
    const emptyRes = Sorter.sort([], { key: 'amount' });
    if (emptyRes.sorted.length !== 0) throw new Error(`${name} failed empty array`);
    const singleRes = Sorter.sort([sampleTransactions[0]], { key: 'amount' });
    if (singleRes.sorted.length !== 1) throw new Error(`${name} failed single item`);
    console.log('✓ Edge cases (empty, single) passed.');
}

try {
    testAlgorithm('MergeSort', MergeSort);
    testAlgorithm('QuickSort', QuickSort);
    console.log('\n>>> ALL ALGORITHM UNIT TESTS PASSED SUCCESSFULLY! <<<\n');
} catch (err) {
    console.error('Test error:', err);
    process.exit(1);
}
