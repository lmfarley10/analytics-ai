BEGIN
  dbms_rls.drop_policy(
    object_schema => USER,
    object_name   => 'todos',
    policy_name   => 'TODO_OWNER_VPD_POLICY'
  );
EXCEPTION
  WHEN OTHERS THEN
    IF SQLCODE != -28102 THEN
      RAISE;
    END IF;
END;
/

DROP CONTEXT todo_app_ctx;
DROP PACKAGE todo_security_pkg;
DROP PACKAGE todo_dashboard_pkg;
DROP FUNCTION get_todo_dashboard_json;