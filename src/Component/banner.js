import React from 'react'

function banner({ text = "Default banner", imageHeight = "auto" }) {
  return (
    <div className="banner">
      <img src="/banner.png" alt="Notes Marketplace" style={{ height: imageHeight }} />
      <div className="banner-text">
        <h1>{text}</h1>
      </div>
      <div className="banner::after"> {/* Gradient overlay (no content needed) */}
        {/* Adjust styles in your main CSS file */}
      </div>
    </div>
  )
}

export default banner