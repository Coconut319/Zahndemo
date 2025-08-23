/**
 * Cost Calculator
 * Handles the interactive cost calculation for dental treatments
 */
class CostCalculator {
    constructor() {
        this.pricingData = {
            prophylaxe: {
                short: { simple: 80, medium: 120, complex: 160 },
                medium: { simple: 100, medium: 150, complex: 200 },
                long: { simple: 120, medium: 180, complex: 240 }
            },
            'fuellungen': {
                short: { simple: 150, medium: 250, complex: 350 },
                medium: { simple: 200, medium: 300, complex: 400 },
                long: { simple: 250, medium: 350, complex: 500 }
            },
            wurzelbehandlung: {
                short: { simple: 300, medium: 450, complex: 600 },
                medium: { simple: 400, medium: 550, complex: 700 },
                long: { simple: 500, medium: 650, complex: 800 }
            },
            kinderzahnheilkunde: {
                short: { simple: 60, medium: 90, complex: 120 },
                medium: { simple: 80, medium: 120, complex: 160 },
                long: { simple: 100, medium: 150, complex: 200 }
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.setupAccessibility();
    }
    
    setupElements() {
        this.treatmentType = document.getElementById('treatment-type');
        this.treatmentDuration = document.getElementById('treatment-duration');
        this.complexity = document.getElementById('complexity');
        this.calculateButton = document.querySelector('.calculator-form .btn');
        this.resultContainer = document.getElementById('calculator-result');
        
        if (!this.treatmentType || !this.treatmentDuration || !this.complexity || !this.calculateButton || !this.resultContainer) {
            console.warn('Cost calculator elements not found');
            return;
        }
    }
    
    setupEventListeners() {
        // Form field changes
        this.treatmentType?.addEventListener('change', () => this.validateForm());
        this.treatmentDuration?.addEventListener('change', () => this.validateForm());
        this.complexity?.addEventListener('change', () => this.validateForm());
        
        // Calculate button
        this.calculateButton?.addEventListener('click', () => this.calculateCost());
        
        // Keyboard support
        this.treatmentType?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.calculateCost();
            }
        });
        
        this.treatmentDuration?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.calculateCost();
            }
        });
        
        this.complexity?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.calculateCost();
            }
        });
    }
    
    setupAccessibility() {
        // Set ARIA attributes
        this.treatmentType?.setAttribute('aria-describedby', 'treatment-type-help');
        this.treatmentDuration?.setAttribute('aria-describedby', 'duration-help');
        this.complexity?.setAttribute('aria-describedby', 'complexity-help');
        
        // Add help text
        this.addHelpText();
        
        // Set up live region for results
        this.liveRegion = document.createElement('div');
        this.liveRegion.setAttribute('aria-live', 'polite');
        this.liveRegion.setAttribute('aria-atomic', 'true');
        this.liveRegion.className = 'sr-only';
        this.resultContainer?.appendChild(this.liveRegion);
    }
    
    addHelpText() {
        const helpTexts = {
            'treatment-type': 'Wählen Sie die Art der kieferorthopädischen Behandlung aus.',
            'treatment-duration': 'Wählen Sie die geschätzte Behandlungsdauer aus.',
            'complexity': 'Wählen Sie die Komplexität Ihrer Zahnfehlstellung aus.'
        };
        
        Object.entries(helpTexts).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                const helpId = `${id}-help`;
                const helpElement = document.createElement('div');
                helpElement.id = helpId;
                helpElement.className = 'form-help';
                helpElement.textContent = text;
                element.parentNode.appendChild(helpElement);
            }
        });
    }
    
    validateForm() {
        const isValid = this.treatmentType?.value && 
                       this.treatmentDuration?.value && 
                       this.complexity?.value;
        
        if (this.calculateButton) {
            this.calculateButton.disabled = !isValid;
            this.calculateButton.setAttribute('aria-disabled', !isValid);
        }
        
        return isValid;
    }
    
    calculateCost() {
        if (!this.validateForm()) {
            this.showError('Bitte füllen Sie alle Felder aus.');
            return;
        }
        
        const treatmentType = this.treatmentType.value;
        const duration = this.treatmentDuration.value;
        const complexity = this.complexity.value;
        
        const basePrice = this.pricingData[treatmentType]?.[duration]?.[complexity];
        
        if (!basePrice) {
            this.showError('Kombination nicht verfügbar. Bitte wählen Sie andere Optionen.');
            return;
        }
        
        const result = this.calculateDetailedCost(basePrice, treatmentType, duration, complexity);
        this.displayResult(result);
    }
    
    calculateDetailedCost(basePrice, treatmentType, duration, complexity) {
        // Calculate additional costs
        const consultationFee = 150;
        const diagnosticFee = 200;
        const retentionFee = 300;
        
        // Calculate total
        const subtotal = basePrice + consultationFee + diagnosticFee + retentionFee;
        
        // Calculate monthly payment (assuming 24 months)
        const monthlyPayment = Math.round(subtotal / 24);
        
        // Calculate insurance coverage (example: 50% for children)
        const insuranceCoverage = Math.round(subtotal * 0.5);
        const patientShare = subtotal - insuranceCoverage;
        
        return {
            treatmentType: this.getTreatmentName(treatmentType),
            duration: this.getDurationName(duration),
            complexity: this.getComplexityName(complexity),
            basePrice,
            consultationFee,
            diagnosticFee,
            retentionFee,
            subtotal,
            monthlyPayment,
            insuranceCoverage,
            patientShare,
            breakdown: {
                basePrice,
                consultationFee,
                diagnosticFee,
                retentionFee
            }
        };
    }
    
    getTreatmentName(type) {
        const names = {
            'invisalign': 'Invisalign',
            'feste-spange': 'Feste Spange',
            'lingual': 'Lingualtechnik',
            'fruehbehandlung': 'Frühbehandlung'
        };
        return names[type] || type;
    }
    
    getDurationName(duration) {
        const names = {
            'short': 'Kurz (6-12 Monate)',
            'medium': 'Mittel (12-18 Monate)',
            'long': 'Lang (18-24 Monate)'
        };
        return names[duration] || duration;
    }
    
    getComplexityName(complexity) {
        const names = {
            'simple': 'Einfach',
            'medium': 'Mittel',
            'complex': 'Komplex'
        };
        return names[complexity] || complexity;
    }
    
    displayResult(result) {
        if (!this.resultContainer) return;
        
        const resultHTML = `
            <div class="calculation-result">
                <div class="result-header">
                    <h3>Ihre Kostenschätzung</h3>
                    <div class="result-summary">
                        <div class="treatment-info">
                            <p><strong>Behandlung:</strong> ${result.treatmentType}</p>
                            <p><strong>Dauer:</strong> ${result.duration}</p>
                            <p><strong>Komplexität:</strong> ${result.complexity}</p>
                        </div>
                    </div>
                </div>
                
                <div class="cost-breakdown">
                    <h4>Kostenaufschlüsselung</h4>
                    <div class="breakdown-item">
                        <span>Behandlung (${result.treatmentType})</span>
                        <span>${result.basePrice.toLocaleString('de-DE')} €</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Erstberatung</span>
                        <span>${result.consultationFee.toLocaleString('de-DE')} €</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Diagnostik</span>
                        <span>${result.diagnosticFee.toLocaleString('de-DE')} €</span>
                    </div>
                    <div class="breakdown-item">
                        <span>Retainer</span>
                        <span>${result.retentionFee.toLocaleString('de-DE')} €</span>
                    </div>
                    <div class="breakdown-total">
                        <span><strong>Gesamtkosten</strong></span>
                        <span><strong>${result.subtotal.toLocaleString('de-DE')} €</strong></span>
                    </div>
                </div>
                
                <div class="payment-options">
                    <h4>Zahlungsoptionen</h4>
                    <div class="payment-option">
                        <div class="option-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <div class="option-details">
                            <h5>Ratenzahlung (24 Monate)</h5>
                            <p class="monthly-payment">${result.monthlyPayment.toLocaleString('de-DE')} € pro Monat</p>
                        </div>
                    </div>
                    
                    <div class="payment-option">
                        <div class="option-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                        </div>
                        <div class="option-details">
                            <h5>Mit Krankenkassenleistung</h5>
                            <p class="insurance-info">Geschätzte Kostenübernahme: ${result.insuranceCoverage.toLocaleString('de-DE')} €</p>
                            <p class="patient-share">Ihr Anteil: ${result.patientShare.toLocaleString('de-DE')} €</p>
                        </div>
                    </div>
                </div>
                
                <div class="result-disclaimer">
                    <p><strong>Hinweis:</strong> Dies ist eine Kostenschätzung. Die tatsächlichen Kosten können abweichen und werden bei der persönlichen Beratung ermittelt.</p>
                </div>
                
                <div class="result-actions">
                    <a href="termin.html" class="btn btn-primary">Termin vereinbaren</a>
                    <a href="kontakt.html" class="btn btn-secondary">Kontakt aufnehmen</a>
                </div>
            </div>
        `;
        
        this.resultContainer.innerHTML = resultHTML;
        
        // Announce to screen readers
        if (this.liveRegion) {
            this.liveRegion.textContent = `Kostenschätzung berechnet: ${result.subtotal.toLocaleString('de-DE')} Euro für ${result.treatmentType}`;
        }
        
        // Add animation
        this.resultContainer.classList.add('result-visible');
    }
    
    showError(message) {
        if (!this.resultContainer) return;
        
        const errorHTML = `
            <div class="calculation-error">
                <div class="error-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </div>
                <h3>Fehler bei der Berechnung</h3>
                <p>${message}</p>
                <p>Bitte überprüfen Sie Ihre Eingaben und versuchen Sie es erneut.</p>
            </div>
        `;
        
        this.resultContainer.innerHTML = errorHTML;
        this.resultContainer.classList.add('result-visible');
        
        // Announce to screen readers
        if (this.liveRegion) {
            this.liveRegion.textContent = `Fehler: ${message}`;
        }
    }
    
    // Public methods for external control
    getPricingData() {
        return this.pricingData;
    }
    
    calculateCustomCost(treatmentType, duration, complexity) {
        const basePrice = this.pricingData[treatmentType]?.[duration]?.[complexity];
        if (!basePrice) return null;
        
        return this.calculateDetailedCost(basePrice, treatmentType, duration, complexity);
    }
    
    resetCalculator() {
        if (this.treatmentType) this.treatmentType.value = '';
        if (this.treatmentDuration) this.treatmentDuration.value = '';
        if (this.complexity) this.complexity.value = '';
        
        this.validateForm();
        
        if (this.resultContainer) {
            this.resultContainer.innerHTML = `
                <div class="result-placeholder">
                    <p>Wählen Sie Ihre Behandlungsoptionen aus, um eine Kostenschätzung zu erhalten.</p>
                </div>
            `;
            this.resultContainer.classList.remove('result-visible');
        }
    }
    
    destroy() {
        // Remove event listeners
        this.treatmentType?.removeEventListener('change', this.validateForm);
        this.treatmentDuration?.removeEventListener('change', this.validateForm);
        this.complexity?.removeEventListener('change', this.validateForm);
        this.calculateButton?.removeEventListener('click', this.calculateCost);
        
        // Remove live region
        this.liveRegion?.remove();
    }
}

// Global function for onclick
function calculateCost() {
    if (window.costCalculator) {
        window.costCalculator.calculateCost();
    }
}

// Initialize the cost calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.costCalculator = new CostCalculator();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CostCalculator;
}

