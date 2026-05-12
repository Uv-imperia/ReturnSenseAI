REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, app_role) FROM PUBLIC, anon;
DROP POLICY IF EXISTS "return media public read" ON storage.objects;
CREATE POLICY "return media owner/admin list" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'returns' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(),'admin')));