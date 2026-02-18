
/*
 Simple impact model for noise reduction calculations based on intervention type and zone context. 
   To be expanded more to a context based model on incident and hotspot analus
 */

const ZONE_FACTORS = {
    // Variable factor impact based on type
    residential: 1.2,  
    commercial: 0.8,    
    campus: 1.3,        
    event: 0.6,         
    mixed: 1.0          
};

// Effectiveness by intervention type
const INTERVENTION_BASE = {
    barrier: { min: 5, max: 15 },
    signage: { min: 1, max: 3 },
    scheduling: { min: 2, max: 6 },
    green: { min: 2, max: 5 },
    insulation: { min: 10, max: 25 },
    traffic: { min: 3, max: 7 },
    monitoring: { min: 0, max: 0 },
    educational: { min: 1, max: 3 },
    regulatory: { min: 2, max: 8 }
};

/*
  Calculate impact for a single intervention
 */
export const calculateInterventionImpact = (intervention, zoneType = 'mixed') => {
    const type = intervention.type || intervention.category?.toLowerCase() || 'barrier';
    const base = INTERVENTION_BASE[type] || INTERVENTION_BASE.barrier;
    const factor = ZONE_FACTORS[zoneType] || 1.0;
    
    return {
        min: Math.round(base.min * factor * 10) / 10,
        max: Math.round(base.max * factor * 10) / 10,
    };
};

/*
 Calculate combined impact with a diminishing return
 */
export const calculateCombinedImpact = (interventions, zoneType = 'mixed') => {
    if (!interventions?.length) return { min: 0, max: 0, reduction: '0 dB' };
    
    const count = interventions.length;
    const factor = Math.sqrt(count) / count; 
    
    let totalMin = 0, totalMax = 0;
    
    interventions.forEach(i => {
        const impact = calculateInterventionImpact(i, zoneType);
        totalMin += impact.min;
        totalMax += impact.max;
    });
    
    totalMin = Math.round(totalMin * factor * 10) / 10;
    totalMax = Math.round(totalMax * factor * 10) / 10;
    
    return {
        min: totalMin,
        max: totalMax,
        reduction: `${totalMin}-${totalMax} dB`,
        explanation: `${count} interventions: ${totalMin}-${totalMax} db reduction`
    };
};


