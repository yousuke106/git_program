// background.js
chrome.action.onClicked.addListener((tab) => {
    // Your background logic here...
});

// background.js
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
      id: "savePrompt",
      title: "プロンプトへ保存",
      contexts: ["selection"]
    });
  });
  
  chrome.contextMenus.onClicked.addListener(function(info, tab) {
    if (info.menuItemId === "savePrompt") {
      const selectedText = info.selectionText;
      const title = selectedText.length > 10 ? selectedText.substring(0, 10) + '...' : selectedText;
      // 選択したテキストを拡張機能のストレージに保存
      chrome.storage.sync.get('prompts', function(data) {
        var prompts = data.prompts || [];
        prompts.push({ title: title, text: selectedText });
        chrome.storage.sync.set({ 'prompts': prompts });
      });
    }
  });
  