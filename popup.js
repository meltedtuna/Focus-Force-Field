document.addEventListener('DOMContentLoaded', function() {
    const colorPicker = document.getElementById('colorPicker');
    const thicknessSlider = document.getElementById('thicknessSlider');
    const thicknessValue = document.getElementById('thicknessValue');
    const saveButton = document.getElementById('saveButton');
    const statusDiv = document.getElementById('status');

    // 1. Load saved settings
    chrome.storage.sync.get(['focusColor', 'focusThickness'], function(data) {
        if (data.focusColor) colorPicker.value = data.focusColor;
        if (data.focusThickness) {
            thicknessSlider.value = data.focusThickness;
            thicknessValue.textContent = data.focusThickness + 'px';
        }
    });

    // Update the number text next to the slider as the user moves it
    thicknessSlider.addEventListener('input', () => {
        thicknessValue.textContent = thicknessSlider.value + 'px';
    });

    // 2. Save settings and message the content script
    saveButton.addEventListener('click', function() {
        const color = colorPicker.value;
        const thickness = thicknessSlider.value;

        chrome.storage.sync.set({ 'focusColor': color, 'focusThickness': thickness }, function() {
            statusDiv.textContent = 'Settings Saved!';
            setTimeout(() => { statusDiv.textContent = ''; }, 2000);
        });

        // Send message to the active tab to update CSS instantly
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const activeTab = tabs[0];
            if (!activeTab || activeTab.url.startsWith('chrome://')) return;

            chrome.tabs.sendMessage(activeTab.id, { 
                action: "updateStyles", 
                color: color,
                thickness: thickness
            }, (response) => {
                if (chrome.runtime.lastError) {
                    statusDiv.textContent = "Refresh the page!";
                }
            });
        });
    });
});