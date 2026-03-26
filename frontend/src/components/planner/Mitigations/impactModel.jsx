/*
 * Simplified impact model
 * Uses intervention's own impact values with diminishing returns for combinations
 */

/**
 * Calculate impact for a single intervention
 * Simply returns the intervention's own impact values
 */
export const calculateInterventionImpact = (intervention) => {
    // Handle different possible impact formats
    let min = 0, max = 0;
    
    if (Array.isArray(intervention.impact)) {
        // Format: [min, max]
        min = intervention.impact[0] || 0;
        max = intervention.impact[1] || min;
    } else if (intervention.impactRange) {
        // Format: { min, max }
        min = intervention.impactRange.min || 0;
        max = intervention.impactRange.max || min;
    } else if (intervention.impactMin !== undefined) {
        // Format: separate fields
        min = intervention.impactMin || 0;
        max = intervention.impactMax || min;
    } else if (typeof intervention.impact === 'number') {
        // Format: single number
        min = intervention.impact;
        max = intervention.impact;
    }
    
    return {
        min,
        max,
        reduction: `${min}-${max} dB`,
        confidence: min > 0 ? 'high' : 'low'
    };
};

/**
 * Calculate combined impact for multiple interventions
 * Uses diminishing returns: each additional intervention contributes less
 */
export const calculateCombinedImpact = (interventions) => {
    if (!interventions?.length) {
        return { 
            min: 0, 
            max: 0, 
            reduction: '0 dB',
            explanation: 'No interventions selected'
        };
    }
    
    const count = interventions.length;
    
    // Diminishing returns factor: sqrt(n)/n
    const diminishingFactor = Math.sqrt(count) / count;
    
    // Calculate individual impacts
    const individualImpacts = interventions.map(intervention => 
        calculateInterventionImpact(intervention)
    );
    
    // Sum impacts
    let totalMin = 0;
    let totalMax = 0;
    
    individualImpacts.forEach(impact => {
        totalMin += impact.min;
        totalMax += impact.max;
    });
    
    // Apply diminishing returns
    totalMin = Math.round(totalMin * diminishingFactor * 10) / 10;
    totalMax = Math.round(totalMax * diminishingFactor * 10) / 10;
    
    // Generate explanation
    const explanation = {
        summary: `${count} interventions combined with diminishing returns`,
        factor: diminishingFactor.toFixed(2),
        calculation: `Total (${totalMin}-${totalMax} dB) = Sum of individual impacts × ${diminishingFactor.toFixed(2)}`,
        note: 'Multiple interventions have diminishing returns. First intervention has highest impact.'
    };
    
    return {
        min: totalMin,
        max: totalMax,
        reduction: `${totalMin}-${totalMax} dB`,
        individualImpacts,
        count,
        diminishingFactor,
        explanation
    };
};

/**
 * Format impact for display
 */
export const formatImpact = (impact) => {
    if (!impact) return 'No impact data';
    if (impact.min === impact.max) return `${impact.min} dB`;
    return `${impact.min}-${impact.max} dB`;
};