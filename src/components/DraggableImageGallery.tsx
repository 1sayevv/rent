import { useState, useRef } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, GripVertical, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

interface DraggableImageGalleryProps {
  images: string[] | ImageFile[];
  onImagesChange: (images: string[] | ImageFile[]) => void;
  maxImages?: number;
  onRemoveImage?: (index: number) => void; // Для совместимости со старым интерфейсом
}

export default function DraggableImageGallery({ 
  images, 
  onImagesChange, 
  maxImages = 10,
  onRemoveImage
}: DraggableImageGalleryProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Проверяем, какой тип данных используется
  const isLegacyMode = images.length > 0 && typeof images[0] === 'string';
  const legacyImages = isLegacyMode ? images as string[] : [];
  const modernImages = !isLegacyMode ? images as ImageFile[] : [];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    if (isLegacyMode) {
      const items = Array.from(legacyImages);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      onImagesChange(items);
    } else {
      const items = Array.from(modernImages);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    onImagesChange(items);
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setIsUploading(true);

    try {
      const validFiles: File[] = [];
      const errors: string[] = [];

      // Проверяем ограничение на количество изображений
      const currentCount = isLegacyMode ? legacyImages.length : modernImages.length;
      const availableSlots = maxImages - currentCount;
      
      if (availableSlots <= 0) {
        toast({
          title: "Ошибка",
          description: `Максимальное количество изображений: ${maxImages}`,
          variant: "destructive"
        });
        return;
      }

      Array.from(files).forEach((file, index) => {
        // Проверяем, не превышаем ли лимит
        if (index >= availableSlots) {
          errors.push(`Достигнут лимит изображений (${maxImages})`);
          return;
        }

        // Проверяем тип файла
        if (!file.type.startsWith('image/')) {
          errors.push(`${file.name} - не является изображением`);
          return;
        }

        // Проверяем размер файла (10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          errors.push(`${file.name} - размер превышает 10MB`);
          return;
        }

        validFiles.push(file);
      });

      // Показываем ошибки, если есть
      if (errors.length > 0) {
        errors.forEach(error => {
          toast({
            title: "Ошибка загрузки",
            description: error,
            variant: "destructive"
          });
        });
      }

      if (validFiles.length === 0) return;

      if (isLegacyMode) {
        // Старый режим - конвертируем в base64 строки
        const promises = validFiles.map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                resolve(e.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          });
        });

        const results = await Promise.all(promises);
        onImagesChange([...legacyImages, ...results]);
      } else {
        // Новый режим - используем ImageFile объекты
    const newImages: ImageFile[] = [];
        validFiles.forEach((file, index) => {
        const id = `image-${Date.now()}-${index}`;
        const preview = URL.createObjectURL(file);
        newImages.push({ id, file, preview });
        });
        onImagesChange([...modernImages, ...newImages]);
      }

      if (validFiles.length > 0) {
        toast({
          title: "Успешно",
          description: `Загружено ${validFiles.length} изображений`,
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Произошла ошибка при загрузке файлов",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (imageId: string | number) => {
    if (isLegacyMode) {
      // Старый режим
      if (onRemoveImage && typeof imageId === 'number') {
        onRemoveImage(imageId);
      } else {
        const index = typeof imageId === 'number' ? imageId : parseInt(imageId as string);
        onImagesChange(legacyImages.filter((_, i) => i !== index));
      }
    } else {
      // Новый режим
      const imageToRemove = modernImages.find(img => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
      onImagesChange(modernImages.filter(img => img.id !== imageId));
    }
  };

  // Drag and Drop handlers for file upload
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set drag over to false if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {(isLegacyMode ? legacyImages.length < maxImages : modernImages.length < maxImages) && (
      <div
        className={cn(
            "border-2 border-dashed rounded-lg p-8 sm:p-12 text-center transition-all duration-200 max-w-4xl mx-auto",
            isDragOver 
              ? "border-primary bg-primary/10 scale-105 shadow-lg" 
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            isUploading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          )}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onDragEnter={!isUploading ? handleDragEnter : undefined}
          onDragLeave={!isUploading ? handleDragLeave : undefined}
          onDragOver={!isUploading ? handleDragOver : undefined}
          onDrop={!isUploading ? handleDrop : undefined}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />
        
          <div className={cn(
            "transition-all duration-200",
            isDragOver ? "scale-110" : ""
          )}>
            {isUploading ? (
              <div className="h-16 w-16 mx-auto mb-4 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            ) : (
              <Upload className={cn(
                "h-16 w-16 mx-auto mb-4 transition-colors duration-200",
                isDragOver ? "text-primary" : "text-muted-foreground"
              )} />
            )}
          </div>
          <p className={cn(
            "text-lg font-medium transition-colors duration-200",
            isDragOver ? "text-primary" : "text-foreground"
          )}>
            {isUploading 
              ? "Загрузка..." 
              : isDragOver 
                ? "Отпустите файлы для загрузки" 
                : "Загрузить изображения"
            }
          </p>
          <p className="text-base text-muted-foreground">
            Drag & Drop поддерживается • {isLegacyMode ? legacyImages.length : modernImages.length}/{maxImages}
          </p>
        </div>
      )}

      {/* Limit reached message */}
      {(isLegacyMode ? legacyImages.length >= maxImages : modernImages.length >= maxImages) && (
        <div className="border border-muted rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Достигнут лимит изображений ({maxImages})
          </p>
      </div>
      )}

      {/* Images Grid */}
      {(isLegacyMode ? legacyImages.length > 0 : modernImages.length > 0) && (
        <div className="space-y-4">
          {/* Header with drag instruction and photo count */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">
              Перетащите изображения для изменения порядка
            </h3>
            <span className="text-sm text-muted-foreground">
              {isLegacyMode ? legacyImages.length : modernImages.length} фото
            </span>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="images" direction="vertical">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto"
                >
                  {(isLegacyMode ? legacyImages : modernImages).map((image, index) => (
                    <Draggable 
                      key={isLegacyMode ? index : (image as ImageFile).id} 
                      draggableId={isLegacyMode ? index.toString() : (image as ImageFile).id} 
                      index={index}
                    >
                      {(provided) => (
                        <Card
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="relative group overflow-hidden"
                        >
                          <div className="aspect-[4/3] relative">
                            <img
                              src={isLegacyMode ? image as string : (image as ImageFile).preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            
                            <div
                              {...provided.dragHandleProps}
                              className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <GripVertical className="h-3 w-3" />
                            </div>

                            <Button
                              size="sm"
                              variant="destructive"
                              className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => removeImage(isLegacyMode ? index : (image as ImageFile).id)}
                            >
                              <X className="h-3 w-3" />
                            </Button>

                            {/* Image number */}
                            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm font-bold px-1.5 py-0.5 rounded">
                              {index + 1}
                            </div>
                          </div>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
}