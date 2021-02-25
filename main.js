import './style.sass'

function $(select){
  if(select.startsWith('#')){
      return document.getElementById(select.substr(1));
  }
  if(select.startsWith('.')){
      return document.getElementsByClassName(select.substr(1));
  }
}

const bars = $('#bars');
const others = $('#others');
const mark1 = $('#1');
const markList = $('#markList');

chrome.runtime.sendMessage({x: 0}, (res) => {
  let bookmarkBars = res[0];
  let otherBookmarks = res[1];

  if(bookmarkBars.length > 0){
      traversal(0, bookmarkBars);
  }

  if(otherBookmarks.length > 0){
      traversal(1, otherBookmarks);
  }
});

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  let x = request.x;
  if(x == -1){
      removeAll(request.id);
  }
});

bars.addEventListener('click', (e) => {
  const actives = $('.is-active');
  if(actives.length > 0){
      actives[0].classList.remove('is-active');
  }
  e.target.classList.add('is-active');
});

function traversal(type, nodes){
  for (let index = 0,len = nodes.length; index < len; index++) {
      const node = nodes[index];
      const id = node.id;
      let title = node.title;

      const children = node.children;
      if(children){
          folder(type, id, title);
          child(id, title, children);
      }else{
          bookmark(id, title, node.url);
      }
  }
}

function folder(type, id, title){
  var li = document.createElement("li");
  li.id = 'li-' + id;
  li.innerHTML = '<a href="#'+ id +'">'+ title +'</a>';
  if(type == 0){
      bars.append(li);
  }else{
      others.append(li);
  }
}

function child(id, title, children){
  var p = document.createElement('p');
  p.id = id;
  p.innerHTML = '<small>'+ title +'</small>';
  markList.appendChild(p);

  var wrap = document.createElement('div');
  wrap.id = 'wrap-' + id;
  wrap.className = 'mark-wrap';

  for (let index = 0,len = children.length; index < len; index++) {
      const child = children[index];
      const id = child.id;
      let title = child.title;

      wrap.appendChild(newCard(id, title, child.url));
  }

  markList.appendChild(wrap);
}

function bookmark(id, title, url){
  mark1.appendChild(newCard(id, title, url));
}

function newCard(id, title, url){
  title = setString(title, 22);
  const domain = url.split('/')[2];
  url += '#' + id;
  var div = document.createElement("div");
  div.id = id;
  div.className = 'card';
  div.innerHTML = '<div class="card-content"><div class="media"><div class="media-left"><figure class="image is-16x16"><img src="'
  + icon(domain) +'"></figure></div><div class="media-content"><a href="'+ url +'" target="_blank" rel="noopener"><p class="subtitle is-7">'+ title +'</p></a></div></div></div>';
  return div;
}

function icon(domain){
  return 'https://get-ico.herokuapp.com/icon?url='+ domain +'&size=16..32..128';
}

function setString(str, len) {  
  var strlen = 0;  
  var s = "";  
  for (var i = 0; i < str.length; i++) {  
      if (str.charCodeAt(i) > 128) {  
          strlen += 2;  
      } else {  
          strlen++;  
      }  
      s += str.charAt(i);  
      if (strlen >= len) {  
          return s+"...";  
      }  
  }  
  return s;  
}

function removeAll(id){
  remove('#' + id);
  remove('#li-' + id);
  remove('#wrap-' + id);
}

function remove(id){
  let e = $(id);
  if(e){
      e.remove();
  }
}
