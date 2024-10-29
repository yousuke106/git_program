// popup.js
async function updatePromptList() {
    const data = await chrome.storage.sync.get('prompts');
    const prompts = data.prompts || [];
    const promptList = document.getElementById('prompt-list');
    promptList.innerHTML = '';
    prompts.forEach((prompt, index) => {
        const item = createPromptItem(prompt, index, prompts);
        promptList.appendChild(item);
    });
}

function createPromptItem(prompt, index, prompts) {
    const item = document.createElement('div');
    const titleText = createTitleText(prompt, index);
    const deleteIcon = createDeleteIcon(index, prompts);
    item.appendChild(titleText);
    item.appendChild(deleteIcon);
    return item;
}

function createTitleText(prompt, index) {
    const titleText = document.createElement('span');
    titleText.textContent = `${index + 1}. ${prompt.title}`;
    titleText.title = 'promptCopy';  // Tooltip text for title
    titleText.style.cursor = 'pointer';
    titleText.addEventListener('click', function() {
        navigator.clipboard.writeText(prompt.text)
            .then(() => console.log('Prompt copied to clipboard:', prompt.text))
            .catch(err => console.error('Error in copying text: ', err));
    });
    return titleText;
}

function createDeleteIcon(index, prompts) {
    const deleteIcon = document.createElement('img');
    deleteIcon.src = '../image/dustbin.png';
    deleteIcon.title = 'delete';  // Tooltip text for delete icon
    deleteIcon.addEventListener('click', async function() {
        prompts = prompts.filter((_, i) => i !== index);  // Remove the selected prompt
        await chrome.storage.sync.set({ 'prompts': prompts });
        updatePromptList();  // Update the list
    });
    return deleteIcon;
}

// ... (他のイベントリスナーや関数) ...
// popup.js
function getFormattedDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// popup.js
document.getElementById('save-button').addEventListener('click', async function() {
    const titleInput = document.getElementById('title-input');
    const promptInput = document.getElementById('prompt-input');
    const titleText = titleInput.value.trim();
    const promptText = promptInput.value.trim();

    // Reset border colors
    titleInput.style.borderColor = '';
    promptInput.style.borderColor = '';

    // Check if either title or prompt text is empty
    if (!validateInput(titleText, titleInput) || !validateInput(promptText, promptInput)) {
        alert('Both title and prompt text are required.');  // Display error message to user
        return;  // Exit early if either is empty
    }

    const data = await chrome.storage.sync.get('prompts');
    const prompts = data.prompts || [];
    prompts.push({ title: titleText, text: promptText });
    await chrome.storage.sync.set({ 'prompts': prompts });
    console.log('Prompt saved:', titleText, promptText);
    titleInput.value = '';  // Clear the title input
    promptInput.value = '';  // Clear the textarea

    // Re-display the list of prompts
    updatePromptList();
});

function validateInput(text, inputElement) {
    if (!text) {
        inputElement.style.borderColor = 'red';
        return false;
    }
    return true;
}
updatePromptList();

// popup.js
document.getElementById('export-button').addEventListener('click', async function() {
    const data = await chrome.storage.sync.get('prompts');
    const prompts = data.prompts || [];
    const jsonStr = JSON.stringify(prompts, null, 2);
    const blob = new Blob([jsonStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);

    // 現在の日時をファイル名に含める
    const dateTime = getFormattedDateTime();
    const fileName = `prompts_${dateTime}.json`;

    // ダウンロード用の仮リンクを作成
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // 後片付け
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

