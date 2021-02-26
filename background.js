const url = chrome.extension.getURL('index.html');

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': url});
});

chrome.runtime.onMessage.addListener((request, sender, response) => {
    const x = request.x;
    if(x == 0){
        chrome.bookmarks.getTree(function(bookmarkArray){
            let bookmarks = bookmarkArray[0].children;
            response([bookmarks[0].children, bookmarks[1].children]);
        });
    }
    if(x == -1){
        const id = request.id;
        chrome.bookmarks.removeTree(id, ()=>{
            response(0);
        });
    }
    return true;
});
