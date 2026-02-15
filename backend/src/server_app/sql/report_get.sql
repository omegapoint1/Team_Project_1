SELECT 
  r.Noisetype,
  r.Datetime,
  r.Severity,
  r.Description,
  r.Locationofnoise,
  r.Zone,
  r.Approved,
  ARRAY_AGG(t.Name) AS tag_list
FROM REPORTS r
LEFT JOIN REPORT_TAGS rt ON r.Reportid = rt.Report_id
LEFT JOIN TAGS t ON rt.Tag_id = t.Tagid
WHERE r.Reportid = $1
GROUP BY r.Reportid;