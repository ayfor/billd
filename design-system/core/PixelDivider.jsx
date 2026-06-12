import React from 'react';

/**
 * PixelDivider — the ornamental cross-stitch band. Use ONCE per view as the
 * brand moment. Tiles the divider SVG horizontally, crisp.
 */
export function PixelDivider({
  src = 'assets/pixel-divider.svg',
  height = 16,
  className = '',
  style,
  ...rest
}) {
  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`billd-divider ${className}`}
      style={{
        height,
        width: '100%',
        backgroundImage: `url(${src})`,
        backgroundRepeat: 'repeat-x',
        backgroundPosition: 'center',
        backgroundSize: 'auto 100%',
        imageRendering: 'pixelated',
        opacity: 0.9,
        ...style,
      }}
      {...rest}
    />
  );
}
