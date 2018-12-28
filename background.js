// chrome.browserAction.onClicked.addListener(()=>{
// })

// setting badge value
function updateBadge(){
  chrome.storage.sync.get({arr:[]},(detail)=>{
    let len = detail.arr.length;
    chrome.browserAction.setBadgeText({text: len.toString()});
  });
}

// chrome storage change
chrome.storage.onChanged.addListener((change, namespace)=>{
  updateBadge();  
});
// When installed
chrome.runtime.onInstalled.addListener(()=>{
  updateBadge();
});
// when login another account
chrome.runtime.onStartup.addListener(()=>{
  updateBadge();
});