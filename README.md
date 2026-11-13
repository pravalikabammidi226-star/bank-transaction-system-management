# Nexora Financial | Bank Transaction Sorting & Analysis System

A modern, high-performance, fully responsive fintech web application that demonstrates the practical application of **Data Structures and Algorithms (DSA)** in core banking transaction management, automated ledger sorting, and real-time financial frequency analytics.

---

## 🏛️ System Overview

- **Platform Name:** Nexora Financial
- **Core Technology:** Data Structures & Algorithms (DSA) / FinTech Analytics
- **Primary Sorting Engines:** Merge Sort & Quick Sort (Implemented manually from scratch without standard library sort methods)
- **Currency:** Indian Rupee (₹ INR)

---

## 🚀 Active Platform Features

1. **Fintech Analytics Dashboard:**
   - 6 KPI Summary Cards:
     - Total Transactions
     - Total Money Received (₹ Credits)
     - Total Money Sent (₹ Debits)
     - Highest Single Transaction (₹)
     - Average Transaction Value (₹)
     - Most Frequent Transaction Type
   - Net System Liquidity (Surplus / Deficit status badge)
   - 5 Dynamic Chart.js Visualizations:
     - Income vs Expense (Doughnut Chart)
     - Monthly Transaction Activity (Volume & Count combo chart)
     - Transaction Type Distribution (Polar Area Chart)
     - Daily Frequency Distribution (Bar chart across days of the week)
     - Transaction Amount Distribution (Histogram brackets)
   - Real-time reactive updates on all additions, edits, and deletions.

2. **Transaction Management (CRUD & In-Table Sorting):**
   - Full CRUD: Add, Edit, and Delete transactions with modal validation.
   - Keyword search (Transaction ID, Account Holder, Category, Memo).
   - Multi-attribute filters: Type, Status, Custom Date Range, Amount Range.
   - Pagination (10, 25, 50 records per page).
   - In-table manual sorting on **Amount**, **Date**, and **Category Frequency** using either **Merge Sort** or **Quick Sort** with live execution metric badges.

3. **Interactive Sorting Visualizer:**
   - Step-by-step visual animation for both Merge Sort and Quick Sort.
   - Color-coded state indicators: Normal, Comparing, Pivot, Swapping, Subarray Partitioning, and Permanently Placed.
   - Full playback controls: Play, Pause, Resume, Step Forward, Step Backward, Reset, and Speed Slider (50ms - 950ms).
   - Live educational commentary explaining each comparison and partition swap.

4. **Transaction Frequency Analysis:**
   - Automatic frequency count across transaction types and categories.
   - Identification of most and least frequent categories and types.
   - Dynamic sorting of categories based on frequency using manual Merge Sort and Quick Sort.
   - Category frequency bar chart and transaction type share pie chart.

5. **Reports & RFC-4180 CSV Export:**
   - Custom filterable transaction ledger.
   - Instant CSV download with RFC-4180 compliant formatted columns.
   - Print-friendly PDF view with dedicated print stylesheets.

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3, Modern Vanilla ES6+ JavaScript.
- **Styling:** Tailwind CSS (Modern Dark/Light Navy Palette).
- **Charts:** Chart.js 4.x.
- **Icons:** Lucide Icons.
- **Data Persistence:** LocalStorage with pre-loaded 60+ realistic Indian banking records in ₹ (INR).
- **Zero Build Dependencies:** Works immediately by opening `index.html` in any browser.

---

## 📂 Project Structure

```
bank-transaction-system/
├── index.html                  # Single-Page Application with 5 active pages & sidebar
├── .gitignore                  # Gitignore file for clean GitHub Desktop commits
├── README.md                   # Documentation & project manual
├── css/
│   ├── styles.css              # Typography, custom scrollbars, and print layout
│   └── visualizer.css          # Visualizer animation keyframes and glow effects
├── js/
│   ├── algorithms/
│   │   ├── mergeSort.js        # Pure manual Merge Sort implementation
│   │   ├── quickSort.js        # Pure manual Quick Sort with median-of-three pivot
│   │   └── visualizerEngine.js # Step recorder for animated playback
│   ├── data/
│   │   ├── sampleTransactions.js # 60+ realistic banking records in ₹ (INR)
│   │   └── store.js            # Reactive state store, CRUD, and stress-generator
│   ├── charts/
│   │   └── analyticsCharts.js  # Chart.js instances and theme adaptors
│   ├── components/
│   │   ├── dashboard.js        # Metric cards & recent transactions table
│   │   ├── transactionsTable.js# CRUD table, filters, pagination, in-table sorting
│   │   ├── visualizerUI.js     # Step-by-step visual animation controls
│   │   ├── frequencyAnalysis.js# Frequency distribution & category sorting
│   │   └── reports.js          # Filtered financial reports & CSV export
│   └── app.js                  # Main application router and lifecycle
└── tests/
    ├── test_runner.html        # Interactive in-browser automated test suite
    └── test_algorithms.js      # Algorithm validation script
```

---

## 🚦 How to Run the Project

1. **Directly in Browser:**
   - Double-click `index.html` (or right-click → Open with Chrome / Edge / Firefox / Safari).
   - No node_modules, npm install, or build steps required!

2. **Automated Unit Tests:**
   - Open `tests/test_runner.html` in any browser to run the 10 automated test suites.
