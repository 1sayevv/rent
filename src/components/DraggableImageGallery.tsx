import React, { useState, useRef, useEffect } from 'react';
import { X, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DraggableImageGalleryProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  onRemoveImage: (index: number) => void;
}

export function DraggableImageGallery({ 
  images, 
  onImagesChange, 
  onRemoveImage 
}: DraggableImageGalleryProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', index.toString());
    
    // Добавляем визуальный эффект для перетаскиваемого элемента
    if (dragRef.current) {
      dragRef.current.style.opacity = '0.5';
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Создаем новый массив с измененным порядком
    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    
    // Удаляем элемент из старой позиции
    newImages.splice(draggedIndex, 1);
    
    // Вставляем элемент в новую позицию
    newImages.splice(dropIndex, 0, draggedImage);
    
    // Обновляем состояние
    onImagesChange(newImages);
    
    // Сбрасываем состояния
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    // Убираем визуальный эффект
    if (dragRef.current) {
      dragRef.current.style.opacity = '1';
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
    
    // Убираем визуальный эффект
    if (dragRef.current) {
      dragRef.current.style.opacity = '1';
    }
  };

  // Touch events for mobile devices
  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    setDraggedIndex(index);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (draggedIndex === null || touchStartY === null) return;
    
    e.preventDefault();
    const touchY = e.touches[0].clientY;
    const deltaY = touchY - touchStartY;
    
    // Определяем, нужно ли переместить элемент
    if (Math.abs(deltaY) > 30) {
      const itemHeight = 80; // Примерная высота элемента
      const newIndex = Math.round(deltaY / itemHeight) + draggedIndex;
      
      if (newIndex >= 0 && newIndex < images.length && newIndex !== draggedIndex) {
        const newImages = [...images];
        const draggedImage = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(newIndex, 0, draggedImage);
        onImagesChange(newImages);
        setDraggedIndex(newIndex);
      }
    }
  };

  const handleTouchEnd = () => {
    setDraggedIndex(null);
    setTouchStartY(null);
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    
    const newImages = [...images];
    const draggedImage = newImages[fromIndex];
    newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, draggedImage);
    onImagesChange(newImages);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          Перетащите изображения для изменения порядка
        </p>
        <p className="text-xs text-muted-foreground">
          {images.length} фото
        </p>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {images.map((image, index) => (
          <div
            key={index}
            ref={index === draggedIndex ? dragRef : null}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onTouchStart={(e) => handleTouchStart(e, index)}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className={`
              relative group cursor-move transition-all duration-200
              ${draggedIndex === index ? 'opacity-50 scale-95' : ''}
              ${dragOverIndex === index && draggedIndex !== index ? 'ring-2 ring-primary ring-opacity-50' : ''}
            `}
          >
            {/* Drag handle */}
            <div className="absolute top-1 left-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 text-white rounded p-1">
                <GripVertical className="h-3 w-3" />
              </div>
            </div>
            
            {/* Move buttons */}
            <div className="absolute top-1 right-6 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
              <button
                onClick={() => moveImage(index, index - 1)}
                disabled={index === 0}
                className="bg-black/50 text-white rounded p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronUp className="h-3 w-3" />
              </button>
              <button
                onClick={() => moveImage(index, index + 1)}
                disabled={index === images.length - 1}
                className="bg-black/50 text-white rounded p-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            
            {/* Image */}
            <img 
              src={image} 
              alt={`Preview ${index + 1}`}
              className="w-full h-20 object-cover rounded-lg"
            />
            
            {/* Remove button */}
            <button
              onClick={() => onRemoveImage(index)}
              className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <X className="h-3 w-3" />
            </button>
            
            {/* Order indicator */}
            <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      {/* Instructions */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
        💡 <strong>Совет:</strong> Первое изображение будет главным фото автомобиля. 
        Используйте drag & drop или кнопки ↑↓ для изменения порядка.
      </div>
    </div>
  );
} 