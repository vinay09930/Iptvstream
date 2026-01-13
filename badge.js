/**
 * Standalone Badge Script for Base44
 * Renders the "Edit with Base44" badge on remixable apps
 * No dependencies - pure vanilla JavaScript
 */

(function() {
  'use strict';

  // SVG Icons as strings
  const XIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  const LoaderIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="badge-spinner"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>';

  function createBadgeElement(appId, platformUrl) {
    const badge = document.createElement('div');
    badge.id = 'base44-edit-badge';
    badge.dir = 'ltr';

    // Apply styles
    Object.assign(badge.style, {
      position: 'fixed',
      zIndex: '999999',
      bottom: '16px',
      right: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: '#000000',
      color: '#ffffff',
      padding: '8px 12px',
      borderRadius: '6px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
      transition: 'box-shadow 0.2s',
      border: '1px solid #262626',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      fontSize: '14px',
    });

    badge.innerHTML = `
      <img
        src="${platformUrl}/logo_v3.png"
        alt="base44"
        style="width: 20px; height: 20px;"
      />
      <span style="white-space: nowrap; font-size: 12px;">
        <span id="badge-content">
          <div style="display: flex; align-items: center; gap: 6px; justify-content: center; font-size: 14px;">
            <span>Edit with </span>
            <span style="margin-bottom: 2px;"><img src="${platformUrl}/base44_text.png" alt="Base44" height="18" width="56" /></span>
          </div>
        </span>
      </span>
      <button
        id="badge-close"
        aria-label="Close badge"
        style="
          padding: 2px;
          margin-left: 2px;
          border-radius: 9999px;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        ${XIcon}
      </button>
    `;

    // Add hover effect
    badge.addEventListener('mouseenter', function() {
      badge.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
    });
    badge.addEventListener('mouseleave', function() {
      badge.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
    });

    // Handle close button
    const closeButton = badge.querySelector('#badge-close');
    closeButton.addEventListener('mouseenter', function(e) {
      e.target.style.backgroundColor = '#404040';
    });
    closeButton.addEventListener('mouseleave', function(e) {
      e.target.style.backgroundColor = 'transparent';
    });
    closeButton.addEventListener('click', function(e) {
      e.stopPropagation();
      badge.remove();
    });

    // Handle badge click
    badge.addEventListener('click', function() {
      const contentSpan = badge.querySelector('#badge-content');

      // Show loading state
      contentSpan.innerHTML = `
        <div style="display: flex; align-items: center; gap: 6px;">
          ${LoaderIcon}
          <span>Cloning...</span>
        </div>
      `;

      // Open remix URL
      window.open(platformUrl + '/remix-app/' + appId, '_blank');

      // Reset after a short delay
      setTimeout(function() {
        contentSpan.innerHTML = `
          <div style="display: flex; align-items: center; gap: 6px; justify-content: center; font-size: 14px;">
            <span>Edit with </span>
            <span style="margin-bottom: 2px;"><img src="${platformUrl}/base44_text.png" alt="Base44" height="18" width="56" /></span>
          </div>
        `;
      }, 1000);
    });

    return badge;
  }

  // Capture script tag reference at top level (before any callbacks)
  const scriptTag = document.currentScript;

  function renderBadge() {
    // Use the captured script tag reference
    if (!scriptTag) {
      console.warn('Base44 badge: Could not find script tag with data-app-id');
      return;
    }

    const appId = scriptTag.getAttribute('data-app-id');
    const platformUrl = scriptTag.getAttribute('data-platform-url') || 'https://app.base44.com';

    if (!appId) {
      console.warn('Base44 badge: data-app-id attribute is required');
      return;
    }

    // Create and append badge
    const badge = createBadgeElement(appId, platformUrl);
    document.body.appendChild(badge);

    // Add spinner animation styles
    const style = document.createElement('style');
    style.textContent = `
      @keyframes badge-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .badge-spinner {
        animation: badge-spin 1s linear infinite;
      }
    `;
    document.head.appendChild(style);
  }

  // Initialize badge when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderBadge);
  } else {
    // DOM already loaded
    renderBadge();
  }
})();
