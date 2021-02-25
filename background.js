const url = chrome.extension.getURL('index.html');

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': url});
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
    chrome.bookmarks.getTree(function(bookmarkArray){
        let bookmarks = bookmarkArray[0].children;
        response([bookmarks[0].children, bookmarks[1].children]);
    });
    return true;
});

chrome.contextMenus.create({
    documentUrlPatterns: ['chrome-extension://*/index.html'],
    title: '删除书签',
    contexts: ['link'],
    onclick: function(info, tab){
        let link = info.linkUrl;
        let id = link.substr(link.lastIndexOf('#') + 1);
        chrome.bookmarks.removeTree(id, ()=>{
            chrome.tabs.sendMessage(tab.id, {x: -1, id: id});
        });
    }
});
