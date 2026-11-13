/**
 * Main Application Orchestrator - Nexora Financial Analytics
 * Handles single-page routing between active pages, theme switching,
 * responsive sidebar toggle, modal controls, and component lifecycle.
 */

class BankApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.theme = localStorage.getItem('nexora_theme') || 'dark'; // modern dark fintech theme default
    }

    init() {
        this.applyTheme(this.theme);
        this.setupNavigation();
        this.setupGlobalControls();

        // Instantiate components
        this.store = window.transactionStore;
        this.chartsManager = new window.AnalyticsChartsManager(this.store);
        this.dashboard = new window.DashboardComponent(this.store, this.chartsManager);
        this.txnTable = new window.TransactionsTableComponent(this.store);
        window.txnTable = this.txnTable; // global reference for inline handlers

        this.visualizerUI = new window.VisualizerUIComponent(this.store);
        this.frequencyAnalysis = new window.FrequencyAnalysisComponent(this.store);
        this.reports = new window.ReportsComponent(this.store);

        // Subscribe store changes to update dashboard and charts
        this.store.subscribe(() => {
            this.dashboard.updateStats();
            this.dashboard.renderRecentTransactions();
            if (this.currentPage === 'dashboard') {
                this.chartsManager.initOrUpdateAll();
            } else if (this.currentPage === 'frequency-analysis') {
                this.frequencyAnalysis.renderAll();
            } else if (this.currentPage === 'reports') {
                this.reports.generateReport();
            }
        });

        // Initialize default page
        this.navigateTo('dashboard');

        // Create icons
        if (window.lucide) window.lucide.createIcons();
    }

    applyTheme(theme) {
        this.theme = theme;
        localStorage.setItem('nexora_theme', theme);
        const root = document.documentElement;
        const iconMoon = document.getElementById('iconThemeMoon');
        const iconSun = document.getElementById('iconThemeSun');

        if (theme === 'dark') {
            root.classList.add('dark');
            if (iconMoon) iconMoon.classList.add('hidden');
            if (iconSun) iconSun.classList.remove('hidden');
        } else {
            root.classList.remove('dark');
            if (iconMoon) iconMoon.classList.remove('hidden');
            if (iconSun) iconSun.classList.add('hidden');
        }

        // Re-render active charts with updated theme colors
        if (this.chartsManager && this.currentPage === 'dashboard') {
            setTimeout(() => this.chartsManager.initOrUpdateAll(), 50);
        }
    }

    toggleTheme() {
        this.applyTheme(this.theme === 'dark' ? 'light' : 'dark');
    }

    setupNavigation() {
        const navLinks = document.querySelectorAll('[data-page-target]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page-target');
                this.navigateTo(targetPage);

                // Close mobile sidebar if open
                const sidebar = document.getElementById('appSidebar');
                if (sidebar && window.innerWidth < 1024) {
                    sidebar.classList.add('-translate-x-full');
                }
            });
        });

        // Mobile sidebar toggle
        const btnToggleSidebar = document.getElementById('btnToggleSidebar');
        const sidebar = document.getElementById('appSidebar');
        const sidebarBackdrop = document.getElementById('sidebarBackdrop');

        if (btnToggleSidebar && sidebar) {
            btnToggleSidebar.addEventListener('click', () => {
                sidebar.classList.toggle('-translate-x-full');
                if (sidebarBackdrop) sidebarBackdrop.classList.toggle('hidden');
            });
        }

        if (sidebarBackdrop && sidebar) {
            sidebarBackdrop.addEventListener('click', () => {
                sidebar.classList.add('-translate-x-full');
                sidebarBackdrop.classList.add('hidden');
            });
        }
    }

    navigateTo(pageId) {
        this.currentPage = pageId;

        // Hide all page sections
        const pageSections = document.querySelectorAll('.page-view');
        pageSections.forEach(sec => sec.classList.add('hidden'));

        // Show target page
        const targetSection = document.getElementById(`page-${pageId}`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }

        // Update nav active classes
        const navLinks = document.querySelectorAll('[data-page-target]');
        navLinks.forEach(link => {
            const page = link.getAttribute('data-page-target');
            if (page === pageId) {
                link.classList.add('bg-blue-600', 'text-white', 'shadow-sm');
                link.classList.remove('text-slate-600', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
            } else {
                link.classList.remove('bg-blue-600', 'text-white', 'shadow-sm');
                link.classList.add('text-slate-600', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
            }
        });

        // Update Topbar page title
        const topbarTitle = document.getElementById('topbarPageTitle');
        const pageTitles = {
            'dashboard': 'Financial Analytics Dashboard',
            'transactions': 'Transaction Management',
            'sorting-visualizer': 'Interactive Algorithm Visualizer',
            'frequency-analysis': 'Transaction Frequency Analysis',
            'reports': 'Transaction Reports & CSV Export'
        };
        if (topbarTitle) {
            topbarTitle.textContent = pageTitles[pageId] || 'Nexora Financial';
        }

        // Lifecycle calls for specific pages
        if (pageId === 'dashboard') {
            this.dashboard.init();
        } else if (pageId === 'transactions') {
            this.txnTable.init();
        } else if (pageId === 'sorting-visualizer') {
            this.visualizerUI.init();
        } else if (pageId === 'frequency-analysis') {
            this.frequencyAnalysis.init();
        } else if (pageId === 'reports') {
            this.reports.init();
        }

        if (window.lucide) window.lucide.createIcons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setupGlobalControls() {
        // Theme toggle button
        const btnTheme = document.getElementById('btnToggleTheme');
        if (btnTheme) {
            btnTheme.addEventListener('click', () => this.toggleTheme());
        }

        // Global Add Transaction button
        const btnAddGlobal = document.getElementById('btnGlobalAddTxn');
        if (btnAddGlobal) {
            btnAddGlobal.addEventListener('click', () => {
                this.txnTable.openAddModal();
            });
        }

        // Reset to initial dataset button
        const btnResetSample = document.getElementById('btnResetSampleData');
        if (btnResetSample) {
            btnResetSample.addEventListener('click', () => {
                if (confirm('Reset database to the initial 60 banking transactions? Any custom additions will be cleared.')) {
                    this.store.resetToSample();
                    this.txnTable.sortedDataset = null;
                    this.txnTable.render();
                    alert('Database successfully restored to original sample transactions.');
                }
            });
        }

        // Generate synthetic test data button
        const btnGenData = document.getElementById('btnGenerateRandomData');
        if (btnGenData) {
            btnGenData.addEventListener('click', () => {
                const countStr = prompt('Enter number of random transactions to generate for stress-testing (10 - 2000):', '250');
                if (countStr) {
                    const count = parseInt(countStr, 10);
                    if (count > 0 && count <= 5000) {
                        const newTxns = this.store.generateRandomDataset(count);
                        this.store.setTransactions(newTxns);
                        this.txnTable.sortedDataset = null;
                        this.txnTable.render();
                        alert(`Successfully generated and loaded ${count} random transactions!`);
                    } else {
                        alert('Please enter a valid count between 10 and 5000.');
                    }
                }
            });
        }

        // Close modal on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.txnTable.closeModal();
            }
        });
    }
}

// Instantiate on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BankApp();
    window.app.init();
});
