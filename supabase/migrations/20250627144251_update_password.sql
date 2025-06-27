CREATE OR REPLACE FUNCTION update_password (
  "current_plain_password" TEXT,
  "new_plain_password" TEXT,
  "current_id" UUID
) RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE encpass auth.users.encrypted_password %TYPE;
BEGIN
SELECT encrypted_password
FROM auth.users INTO encpass
WHERE id = current_id
  AND encrypted_password = crypt(
    current_plain_password,
    auth.users.encrypted_password
  );

IF encpass IS NULL THEN RETURN 'incorrect';
ELSE
UPDATE auth.users
SET encrypted_password = crypt(new_plain_password, gen_salt('bf'))
WHERE id = current_id;
RETURN 'success';
END IF;
END;
$$;
