function injectCustomFocusCSS(color, thickness) {
    // We add +1 to the shadow to make sure the contrast ring is always visible
    const shadowSize = parseInt(thickness) + 1;

    const dynamicCSS = `
        *:focus:not(body), a:focus, button:focus, input:focus, select:focus, textarea:focus, [tabindex]:focus {
            outline: ${thickness}px solid ${color} !important; 
            outline-offset: 2px !important; 
            box-shadow: 0 0 0 ${shadowSize}px #000000 !important; 
            z-index: 2147483647 !important; 
            transition: none !important;
        }
    `;
    
    let styleElement = document.getElementById('focus-force-field-style');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'focus-force-field-style';
        document.head.appendChild(styleElement);
    }
    styleElement.textContent = dynamicCSS;
}

// Initial application of settings when page loads
chrome.storage.sync.get(['focusColor', 'focusThickness'], function(data) {
    const color = data.focusColor || '#FF00FF';
    const thickness = data.focusThickness || '5';
    injectCustomFocusCSS(color, thickness);
});

// Listen for messages from popup.js to change styles instantly
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateStyles") {
        injectCustomFocusCSS(request.color, request.thickness);
    }
});