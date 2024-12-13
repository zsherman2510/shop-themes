-- Add in Auth User
  IF NOT EXISTS (SELECT 1 FROM auth.users() WHERE email = 'zsherman2510@hotmail.com') THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      recovery_sent_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      uuid_generate_v4(),
      'authenticated',
      'authenticated',
      'zsherman2510@hotmail.com',
      crypt('IamKingZ1!', gen_salt('bf')),
      NOW(),
      null,
      NOW(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{}'::jsonb,
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END

INSERT INTO "User" (
  id,
  email,
  "firstName",
  "lastName",
  role,
  status,
  "storeId",
  permissions,
  "emailVerified",
  "createdAt",
  "updatedAt"
) VALUES (
  '9a0384c7-f241-4be7-b096-6adb757c570a', 
  'zsherman2510@hotmail.com',
  'Admin',
  'User',
  'ADMIN',
  'ACTIVE',
  'ee199780-8002-45a5-b2ca-7213b8a21843',
  '{"all"}',
  NOW(),
  NOW(),
  NOW()
);