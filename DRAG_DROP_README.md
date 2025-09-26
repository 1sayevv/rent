# DraggableImageGallery - Image Upload Component

## Updates

The `DraggableImageGallery` component has been significantly improved and now supports full drag and drop functionality for image uploads.

## New Features

### ✅ Drag and Drop Upload
- Drag files from explorer to upload area
- Visual feedback when dragging
- Support for multiple file uploads

### ✅ File Validation
- File type checking (images only)
- File size limitation (up to 10MB)
- Image count limitation (default 10)

### ✅ Enhanced UX
- Upload indicator
- Toast notifications for errors and successful uploads
- Image counter
- Animations and transitions
- Automatic upload area hiding when limit is reached

### ✅ Compatibility
- Support for old interface (string[])
- Support for new interface (ImageFile[])
- Backward compatibility with existing code

## Usage

### Basic Usage (old interface)
```tsx
import DraggableImageGallery from '@/components/DraggableImageGallery';

const [images, setImages] = useState<string[]>([]);

<DraggableImageGallery
  images={images}
  onImagesChange={setImages}
  maxImages={10}
/>
```

### Advanced Usage (new interface)
```tsx
interface ImageFile {
  id: string;
  file: File;
  preview: string;
}

const [images, setImages] = useState<ImageFile[]>([]);

<DraggableImageGallery
  images={images}
  onImagesChange={setImages}
  maxImages={15}
/>
```

## Events

### onImagesChange
Called when the image list changes (add, remove, reorder).

### onRemoveImage (optional)
For compatibility with old interface - called when removing image by index.

## Validation

The component automatically checks:
- **File type**: images only (image/*)
- **File size**: maximum 10MB
- **File count**: maximum specified in `maxImages`

## Feedback

### Toast Notifications
- ✅ Successful upload
- ❌ Validation errors
- ❌ Limit exceeded

### Visual Indicators
- Upload spinner
- Style changes on drag over
- Image counter
- Limit reached message

## Styling

The component uses Tailwind CSS and supports:
- Dark/light theme
- Responsive design
- Smooth animations
- Hover effects

## Error Examples

```
"file.jpg - is not an image"
"large-image.png - size exceeds 10MB"
"Image limit reached (10)"
```

## Technical Details

- Uses `@hello-pangea/dnd` for drag and drop functionality
- Supports FileReader API for base64 conversion
- Uses URL.createObjectURL for preview
- Automatically cleans up object URLs when removing images 