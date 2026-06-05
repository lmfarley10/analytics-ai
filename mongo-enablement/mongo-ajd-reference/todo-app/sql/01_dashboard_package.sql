BEGIN
  EXECUTE IMMEDIATE 'DROP PACKAGE todo_dashboard_pkg';
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -4043 THEN
      RAISE;
    END IF;
END;
/

CREATE OR REPLACE FUNCTION get_todo_dashboard_json RETURN CLOB
IS
  l_json CLOB;
BEGIN
  SELECT json_object(
    'totalTasks' VALUE COUNT(*),
    'completedTasks' VALUE COALESCE(SUM(CASE WHEN json_value(data, '$.completed') = 'true' THEN 1 ELSE 0 END), 0),
    'pendingTasks' VALUE COALESCE(SUM(CASE WHEN json_value(data, '$.completed') = 'false' THEN 1 ELSE 0 END), 0),
    'completionPercentage' VALUE CASE
      WHEN COUNT(*) = 0 THEN 0
      ELSE ROUND(COALESCE(SUM(CASE WHEN json_value(data, '$.completed') = 'true' THEN 1 ELSE 0 END), 0) / COUNT(*) * 100, 2)
    END
    RETURNING CLOB
  )
  INTO l_json
  FROM "todos";

  RETURN l_json;
END get_todo_dashboard_json;
/