SELECT u.full_name, COUNT(full_name) solved
FROM users as u
    JOIN accounts acc on acc.user_id = u.id
    JOIN sessions sess on sess.account_id = acc.id
    JOIN puzzles puzz on sess.puzzle_id = puzz.id
WHERE sess.completeness = puzz.stages_count
GROUP BY full_name
ORDER BY solved DESC
LIMIT 10;