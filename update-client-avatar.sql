-- Client avatar alanını nullable yap ve default değer ekle
ALTER TABLE clients ALTER COLUMN avatar DROP NOT NULL;
ALTER TABLE clients ALTER COLUMN avatar SET DEFAULT '/placeholder.svg';

-- Mevcut boş avatar değerlerini güncelle
UPDATE clients SET avatar = '/placeholder.svg' WHERE avatar IS NULL OR avatar = '';
