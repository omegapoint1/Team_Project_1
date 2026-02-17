SELECT Zone, COUNT(Zone) AS occurrence_count
FROM REPORTS
GROUP BY Zone
ORDER BY occurrence_count DESC;