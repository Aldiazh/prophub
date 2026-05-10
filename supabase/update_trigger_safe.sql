-- Update fungsi trigger yang LEBIH AMAN agar tidak menyebabkan Database Error
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone_number, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    CASE 
      WHEN new.raw_user_meta_data->>'role' = 'owner' THEN 'owner'::user_role
      WHEN new.raw_user_meta_data->>'role' = 'admin' THEN 'admin'::user_role
      ELSE 'tenant'::user_role
    END
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
