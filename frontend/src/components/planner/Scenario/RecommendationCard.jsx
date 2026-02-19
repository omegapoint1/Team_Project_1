import React from 'react';
import './RecommendationCard.css';

const RecommendationCard = ({ scenarios }) => {
  // Find best scenario (highest total score)
  const bestScenario = scenarios.reduce((best, current) => 
    current.scores.total > best.scores.total ? current : best
  );

  return (
    <div className="recommendation-card">
      <h3>Recommendation</h3>
      
      <div className="recommendation-content">
        <div className="best-scenario">
          <h4>Best Option: {bestScenario.name}</h4>
          <span className="score">Score: {bestScenario.scores.total.toFixed(1)}/10</span>
        </div>
        
        <p className="reason">
          {bestScenario.scores.total > 8 ? 
            "Excellent balance of cost and impact. Highly recommended for the implementation." :
            bestScenario.scores.total > 7 ?
            "Good value overall. Recommended for consideration." :
            "Acceptable scenario. Recommended to review this option carefully before proceeding."}
        </p>
      </div>
    </div>
  );
};

export default RecommendationCard;