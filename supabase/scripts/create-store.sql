INSERT INTO "Store" (
  id,
  name,
  description,
  settings,
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid(),
  'My Store',
  'My first e-commerce store',
  jsonb_build_object(
    'currency', 'USD',
    'timezone', 'UTC',
    'features', jsonb_build_object(
      'reviews', true,
      'wishlist', true
    )
  ),
  NOW(),
  NOW()
) 