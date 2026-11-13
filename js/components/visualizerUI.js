/**
 * Sorting Visualizer UI Component
 * Provides interactive animation of Merge Sort and Quick Sort algorithms.
 * Includes Start, Pause, Resume, Step Forward, Step Backward, Reset,
 * adjustable speed, and live educational annotations.
 */

class VisualizerUIComponent {
    constructor(store) {
        this.store = store;
        this.steps = [];
        this.currentStepIndex = 0;
        this.isPlaying = false;
        this.playTimer = null;
        this.speedMs = 300; // milliseconds per step
        this.activeAlgorithm = 'MergeSort';
        this.activeKey = 'amount';
        this.activeOrder = 'asc';
        this.datasetSize = 14;
    }

    init() {
        this.bindEvents();
        this.generateDatasetAndSteps();
    }

    bindEvents() {
        // Controls
        const btnPlay = document.getElementById('visBtnPlay');
        const btnPause = document.getElementById('visBtnPause');
        const btnStepForward = document.getElementById('visBtnStepForward');
        const btnStepBack = document.getElementById('visBtnStepBack');
        const btnReset = document.getElementById('visBtnReset');
        const speedSlider = document.getElementById('visSpeedSlider');
        const speedLabel = document.getElementById('visSpeedLabel');

        const algoSelect = document.getElementById('visAlgoSelect');
        const keySelect = document.getElementById('visKeySelect');
        const orderSelect = document.getElementById('visOrderSelect');
        const sizeSelect = document.getElementById('visSizeSelect');

        if (btnPlay) btnPlay.addEventListener('click', () => this.play());
        if (btnPause) btnPause.addEventListener('click', () => this.pause());
        if (btnStepForward) btnStepForward.addEventListener('click', () => this.stepForward());
        if (btnStepBack) btnStepBack.addEventListener('click', () => this.stepBackward());
        if (btnReset) btnReset.addEventListener('click', () => this.reset());

        if (speedSlider) {
            speedSlider.addEventListener('input', (e) => {
                // slider from 1 (fast: 50ms) to 10 (slow: 900ms)
                const val = parseInt(e.target.value, 10);
                this.speedMs = 950 - (val * 90);
                if (speedLabel) speedLabel.textContent = `${this.speedMs}ms / step`;
                if (this.isPlaying) {
                    this.pause();
                    this.play();
                }
            });
        }

        if (algoSelect) {
            algoSelect.addEventListener('change', (e) => {
                this.activeAlgorithm = e.target.value;
                this.generateDatasetAndSteps();
            });
        }

        if (keySelect) {
            keySelect.addEventListener('change', (e) => {
                this.activeKey = e.target.value;
                this.generateDatasetAndSteps();
            });
        }

        if (orderSelect) {
            orderSelect.addEventListener('change', (e) => {
                this.activeOrder = e.target.value;
                this.generateDatasetAndSteps();
            });
        }

        if (sizeSelect) {
            sizeSelect.addEventListener('change', (e) => {
                this.datasetSize = parseInt(e.target.value, 10);
                this.generateDatasetAndSteps();
            });
        }
    }

    generateDatasetAndSteps() {
        this.pause();

        // Get subset from store or synthetic
        const all = this.store.getAll();
        let items = [];
        if (all.length >= this.datasetSize) {
            items = all.slice(0, this.datasetSize);
        } else {
            items = this.store.generateRandomDataset(this.datasetSize);
        }

        // Add category frequency property for frequency sorting
        const freqMap = this.store.getFrequencyMap('category');
        items = items.map(it => ({
            ...it,
            _freq: freqMap[it.category] || 1
        }));

        if (this.activeAlgorithm === 'MergeSort') {
            this.steps = window.VisualizerEngine.generateMergeSortSteps(items, {
                key: this.activeKey,
                order: this.activeOrder
            });
        } else {
            this.steps = window.VisualizerEngine.generateQuickSortSteps(items, {
                key: this.activeKey,
                order: this.activeOrder
            });
        }

        this.currentStepIndex = 0;
        this.renderCurrentStep();
    }

    play() {
        if (this.isPlaying) return;
        if (this.currentStepIndex >= this.steps.length - 1) {
            this.currentStepIndex = 0;
        }

        this.isPlaying = true;
        this.updatePlayStateUI();

        this.playTimer = setInterval(() => {
            if (this.currentStepIndex < this.steps.length - 1) {
                this.currentStepIndex++;
                this.renderCurrentStep();
            } else {
                this.pause();
            }
        }, this.speedMs);
    }

    pause() {
        this.isPlaying = false;
        if (this.playTimer) {
            clearInterval(this.playTimer);
            this.playTimer = null;
        }
        this.updatePlayStateUI();
    }

    stepForward() {
        this.pause();
        if (this.currentStepIndex < this.steps.length - 1) {
            this.currentStepIndex++;
            this.renderCurrentStep();
        }
    }

    stepBackward() {
        this.pause();
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
            this.renderCurrentStep();
        }
    }

    reset() {
        this.pause();
        this.currentStepIndex = 0;
        this.renderCurrentStep();
    }

    updatePlayStateUI() {
        const btnPlay = document.getElementById('visBtnPlay');
        const btnPause = document.getElementById('visBtnPause');
        if (btnPlay && btnPause) {
            if (this.isPlaying) {
                btnPlay.classList.add('hidden');
                btnPause.classList.remove('hidden');
            } else {
                btnPlay.classList.remove('hidden');
                btnPause.classList.add('hidden');
            }
        }
    }

    renderCurrentStep() {
        const step = this.steps[this.currentStepIndex];
        if (!step) return;

        // Update step counter & stats
        const stepCounter = document.getElementById('visStepCounter');
        const comparisonsEl = document.getElementById('visComparisonsCount');
        const swapsEl = document.getElementById('visSwapsCount');
        const messageEl = document.getElementById('visCurrentMessage');
        const phaseEl = document.getElementById('visCurrentPhase');

        if (stepCounter) stepCounter.textContent = `Step ${this.currentStepIndex + 1} of ${this.steps.length}`;
        if (comparisonsEl) comparisonsEl.textContent = step.stats.comparisons.toLocaleString();
        if (swapsEl) swapsEl.textContent = step.stats.swaps.toLocaleString();
        if (messageEl) messageEl.textContent = step.message;
        if (phaseEl) {
            let phaseLabel = 'Executing';
            if (step.type === 'init') phaseLabel = 'Initialization';
            else if (step.type === 'split') phaseLabel = 'Division / Halving';
            else if (step.type === 'compare') phaseLabel = 'Key Comparison';
            else if (step.type === 'place') phaseLabel = 'Auxiliary Array Merge';
            else if (step.type === 'pivot') phaseLabel = 'Pivot Selection';
            else if (step.type === 'swap') phaseLabel = 'Partition Swap';
            else if (step.type === 'partition_done') phaseLabel = 'Partition Boundary Established';
            else if (step.type === 'merged') phaseLabel = 'Merged Subarray';
            else if (step.type === 'done') phaseLabel = 'Sorted & Complete';

            phaseEl.textContent = phaseLabel;
        }

        // Render Bars & Cards
        const container = document.getElementById('visualizerBarsContainer');
        if (!container) return;

        // Find max value in step for scaling bar height
        let maxVal = 1;
        step.array.forEach(item => {
            const v = window.VisualizerEngine.getValue(item, this.activeKey, this.activeOrder);
            if (v > maxVal) maxVal = v;
        });

        container.innerHTML = step.array.map((item, index) => {
            const val = window.VisualizerEngine.getValue(item, this.activeKey, this.activeOrder);
            // Minimum height 20%, maximum 95%
            const heightPercent = Math.max(18, Math.round((val / maxVal) * 88));

            let stateClass = 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600';
            let labelBadge = '';

            if (item._state === 'comparing') {
                stateClass = 'bg-amber-400 dark:bg-amber-500 text-slate-900 border-amber-600 shadow-md ring-2 ring-amber-400/50 scale-105';
                labelBadge = '<span class="text-[9px] font-bold bg-amber-600 text-white px-1 rounded">CMP</span>';
            } else if (item._state === 'pivot') {
                stateClass = 'bg-purple-500 dark:bg-purple-600 text-white border-purple-700 shadow-lg ring-2 ring-purple-400 scale-105';
                labelBadge = '<span class="text-[9px] font-bold bg-purple-800 text-white px-1 rounded">PIVOT</span>';
            } else if (item._state === 'swapping' || item._state === 'placing') {
                stateClass = 'bg-rose-500 dark:bg-rose-600 text-white border-rose-700 shadow-lg ring-2 ring-rose-400 scale-105';
                labelBadge = '<span class="text-[9px] font-bold bg-rose-800 text-white px-1 rounded">SWAP</span>';
            } else if (item._state === 'div-left') {
                stateClass = 'bg-blue-400/80 dark:bg-blue-600/80 text-white border-blue-500';
                labelBadge = '<span class="text-[9px] bg-blue-800 text-white px-1 rounded">L</span>';
            } else if (item._state === 'div-right') {
                stateClass = 'bg-cyan-400/80 dark:bg-cyan-600/80 text-white border-cyan-500';
                labelBadge = '<span class="text-[9px] bg-cyan-800 text-white px-1 rounded">R</span>';
            } else if (item._state === 'partition_placed' || item._state === 'merged') {
                stateClass = 'bg-emerald-400/80 dark:bg-emerald-600/80 text-white border-emerald-500';
                labelBadge = '<span class="text-[9px] bg-emerald-800 text-white px-1 rounded">FIX</span>';
            } else if (item._state === 'sorted') {
                stateClass = 'bg-emerald-500 dark:bg-emerald-600 text-white border-emerald-600 shadow-sm';
                labelBadge = '<span class="text-[9px] bg-emerald-800 text-white px-1 rounded">✓</span>';
            }

            // Display value format
            let displayVal = `₹${Number(item.amount).toLocaleString('en-IN')}`;
            if (this.activeKey === 'date') {
                displayVal = new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
            } else if (this.activeKey === 'frequency') {
                displayVal = `${item._freq}×`;
            }

            return `
                <div class="flex-1 flex flex-col items-center justify-end h-full min-w-[36px] max-w-[80px] transition-all duration-200">
                    <div class="w-full flex flex-col items-center justify-between p-1.5 rounded-t-lg border-t-2 border-x-2 transition-all duration-150 ${stateClass}" style="height: ${heightPercent}%;">
                        <div class="w-full text-center">
                            ${labelBadge}
                        </div>
                        <div class="w-full text-center">
                            <span class="text-[10px] md:text-xs font-mono font-bold leading-none break-all block">
                                ${displayVal}
                            </span>
                        </div>
                    </div>
                    <div class="w-full py-1.5 text-center bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 truncate" title="${item.accountHolder} (${item.id})">
                        ${item.accountHolder.split(' ')[0]}
                    </div>
                    <div class="text-[9px] text-slate-400 font-mono mt-0.5">
                        #${index}
                    </div>
                </div>
            `;
        }).join('');
    }
}

if (typeof window !== 'undefined') {
    window.VisualizerUIComponent = VisualizerUIComponent;
}
