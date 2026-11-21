// ImageUploader component — lets managers pick photos from their own device
// instead of only pasting image URLs. Files are read locally, downscaled on a
// canvas and stored as data URLs so they persist in localStorage alongside the
// rest of the site data (this app has no upload server).
//
// Props:
//   value     - array of image sources (data URLs and/or remote URLs)
//   onChange  - (nextImages: string[]) => void
//   maxImages - optional cap on how many images can be attached (default 8)
import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X, Link2 } from 'lucide-react';
import './ImageUploader.css';

const ACCEPTED_TYPES = /^image\/(jpe?g|png|webp|gif|avif|bmp|svg\+xml)$/i;
const MAX_FILE_MB = 10;      // reject files this large outright
const MAX_DIMENSION = 1280;  // longest side in px after compression
const JPEG_QUALITY = 0.78;   // quality keeps data URLs small for localStorage

const readAsDataURL = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('That file does not look like a valid image.'));
    img.src = src;
  });

// Downscale + re-encode a data URL so the stored string stays compact enough
// to live in localStorage. Keeps the original when it is already small.
const compressImage = async (dataUrl) => {
  const img = await loadImage(dataUrl);
  const srcWidth = img.naturalWidth || 1;
  const srcHeight = img.naturalHeight || 1;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(srcWidth, srcHeight));

  if (scale === 1 && dataUrl.length < 200000) return dataUrl;

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(srcWidth * scale));
  canvas.height = Math.max(1, Math.round(srcHeight * scale));
  const ctx = canvas.getContext('2d');
  // Paint a white backdrop first so transparent PNGs don't turn black when
  // re-encoded as JPEG.
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
};


const ImageUploader = ({ value = [], onChange, maxImages = 8 }) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showUrl, setShowUrl] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  const remaining = Math.max(0, maxImages - value.length);

  const handleFiles = async (fileList) => {
    setError('');
    const files = Array.from(fileList || []).filter((f) => f.type);
    if (!files.length) return;

    if (files.length > remaining) {
      setError(`You can add up to ${maxImages} photos. Please remove one first.`);
      return;
    }

    setBusy(true);
    try {
      const added = [];
      for (const file of files) {
        if (!ACCEPTED_TYPES.test(file.type)) {
          setError(`"${file.name}" is not a supported image file.`);
          continue;
        }
        if (file.size > MAX_FILE_MB * 1024 * 1024) {
          setError(`"${file.name}" is larger than ${MAX_FILE_MB} MB. Please pick a smaller photo.`);
          continue;
        }
        const raw = await readAsDataURL(file);
        const compressed = await compressImage(raw);
        added.push(compressed);
      }
      if (added.length) onChange([...value, ...added]);
    } catch (err) {
      setError(err.message || 'Something went wrong while reading that photo.');
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };


  const addUrl = (e) => {
    e.preventDefault();
    const url = urlInput.trim();
    if (!url) return;
    if (value.length >= maxImages) {
      setError(`You can add up to ${maxImages} photos. Please remove one first.`);
      return;
    }
    onChange([...value, url]);
    setUrlInput('');
    setShowUrl(false);
  };

  const removeAt = (index) => {
    setError('');
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={`image-uploader${dragOver ? ' dragover' : ''}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="image-uploader-input"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div
        className="image-uploader-dropzone"
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
      >
        <ImagePlus size={26} />
        <div>
          <strong>Upload photos from your device</strong>
          <span>Click to browse or drag &amp; drop here (JPG, PNG, WebP{value.length ? ` — ${value.length}/${maxImages} added` : ''})</span>
        </div>
      </div>

      {!value.length && (
        <button type="button" className="image-uploader-url-toggle" onClick={() => setShowUrl((s) => !s)}>
          <Link2 size={16} /> Or add an image by URL instead
        </button>
      )}


      {showUrl && (
        <form className="image-uploader-url" onSubmit={addUrl}>
          <input
            type="url"
            placeholder="https://example.com/photo.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
          <button type="submit" className="image-uploader-url-add">Add URL</button>
        </form>
      )}

      {busy && <p className="image-uploader-note"><Loader2 size={14} className="spin" /> Processing photos…</p>}
      {error && <p className="image-uploader-error">{error}</p>}

      {value.length > 0 && (
        <div className="image-uploader-preview">
          {value.map((src, i) => (
            <div className="image-uploader-thumb" key={`${i}-${src.slice(0, 40)}`}>
              <img src={src} alt={`Upload ${i + 1}`} />
              <button
                type="button"
                className="image-uploader-remove"
                onClick={() => removeAt(i)}
                title="Remove image"
                aria-label={`Remove image ${i + 1}`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;

