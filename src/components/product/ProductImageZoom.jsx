// Displays a product image with hover-to-zoom (magnifier lens effect).
// Moving the mouse over the image shows a zoomed-in view alongside it -
// no click or separate image is created, purely a hover-based zoom.
import { useState, useRef } from 'react';

function ProductImageZoom({ src, alt }) {
  const [isHovering, setIsHovering] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const ZOOM_LEVEL = 2.5;

  function handleMouseMove(e) {
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPosition({ x, y });
  }

  return (
    <div className="zoom-image-container">
      <div
        className="zoom-image-wrapper"
        ref={imageRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onMouseMove={handleMouseMove}
      >
        <img src={src} alt={alt} className="zoom-image-main" />
        <span className="zoom-image-hint">🔍 Hover to zoom</span>
      </div>

      {/* Zoomed preview appears beside the image only while hovering, never opens separately */}
      {isHovering && (
        <div
          className="zoom-image-side-preview"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: `${lensPosition.x}% ${lensPosition.y}%`,
            backgroundSize: `${ZOOM_LEVEL * 100}%`,
          }}
        />
      )}
    </div>
  );
}

export default ProductImageZoom;