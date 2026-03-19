SELECT
  l.Password,
  l.UserId,
  u.Admin
FROM
  LOGIN l
LEFT JOIN
  USERS u ON l.UserId = u.UserId
WHERE
  l.Username = $1;
