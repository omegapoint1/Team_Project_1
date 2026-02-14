SELECT 
    InterventionPlanId, 
    Name, 
    Status, 
    Zone, 
    Budget, 
    Totalcost, 
    Timeline, 
    Impact, 
    Createdat, 
    interventions, 
    notes, 
    evidence 
FROM inter_plans
WHERE InterventionPlanId = $1;