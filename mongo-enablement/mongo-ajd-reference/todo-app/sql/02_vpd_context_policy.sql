CREATE OR REPLACE PACKAGE todo_security_pkg AS
  PROCEDURE set_user_id(p_user_id IN VARCHAR2);
  FUNCTION todo_vpd_predicate(schema_name IN VARCHAR2, object_name IN VARCHAR2) RETURN VARCHAR2;
END todo_security_pkg;
/

CREATE OR REPLACE PACKAGE BODY todo_security_pkg AS
  PROCEDURE set_user_id(p_user_id IN VARCHAR2) IS
  BEGIN
    dbms_session.set_identifier(p_user_id);
  END set_user_id;

  FUNCTION todo_vpd_predicate(schema_name IN VARCHAR2, object_name IN VARCHAR2) RETURN VARCHAR2
  IS
  BEGIN
    RETURN q'[
      LOWER(TRIM(json_value(data, '$.ownerId'))) = LOWER(TRIM(sys_context('USERENV', 'CLIENT_IDENTIFIER')))
    ]';
  END todo_vpd_predicate;
END todo_security_pkg;
/

BEGIN
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

  dbms_rls.add_policy(
    object_schema   => USER,
    object_name     => 'todos',
    policy_name     => 'TODO_OWNER_VPD_POLICY',
    function_schema => USER,
    policy_function => 'TODO_SECURITY_PKG.TODO_VPD_PREDICATE',
    statement_types => 'SELECT',
    update_check    => FALSE
  );
END;
/
