-- SA-05: Fehlende Storage UPDATE-Policy fuer pet-documents
create policy "Users can update own documents"
on storage.objects for update
using (
  bucket_id = 'pet-documents'
  and auth.uid()::text = (storage.foldername(name))[1]
)
with check (
  bucket_id = 'pet-documents'
  and auth.uid()::text = (storage.foldername(name))[1]
);
