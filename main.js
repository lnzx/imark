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
const markList = $('#markList');
const wrap1 = $('#wrap-1');
const trash = $('#trash');

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

bars.addEventListener('click', (e) => {
  const actives = $('.is-active');
  if(actives.length > 0){
      actives[0].classList.remove('is-active');
  }
  e.target.classList.add('is-active');
});

function traversal(type, nodes){
  for (let index = 0,len = nodes.length; index < len; index++) {
      let node = nodes[index];
      if(node.dateGroupModified){
          folder(type, node);
      }else{
          bookmark(node);
      }
  }
}

function folder(type, node){
  let menu = document.createElement("li");
  menu.id = 'menu-' + node.id;
  menu.innerHTML = `<a id="s-${node.id}" href="#${node.id}">${node.title}</a>`;
  if(type == 0){
      bars.append(menu);
  }else{
      others.append(menu);
  }

  child(node);
}

function child(node){
  let title = document.createElement('p');
  title.id = node.id;
  title.innerHTML = `<small>${node.title}</small>`;
  markList.appendChild(title);

  var wrap = document.createElement('div');
  wrap.id = 'wrap-' + node.id;
  wrap.className = 'mark-wrap';

  let children = node.children;
  for (let index = 0,len = children.length; index < len; index++) {
      const child = children[index];
      wrap.appendChild(newCard(child));
  }

  markList.appendChild(wrap);
}

function bookmark(mark){
  wrap1.appendChild(newCard(mark));
}

function newCard(mark){
  let card = document.createElement("div");
  card.id = 'card-' + mark.id;
  card.className = 'card';

  mark.title = setString(mark.title, 22);
  mark.icon = icon(mark.url.split('/')[2]);
  
  card.innerHTML = `
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-16x16"><img src="${mark.icon}"></figure>
        </div>
        <div class="media-content">
          <p class="subtitle is-7">
            <a id="${mark.id}" href="${mark.url}" target="_blank" rel="noopener">${mark.title}</a>
          </p>
        </div>
      </div>
    </div>
  `;
  return card;
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
  remove('#menu-' + id);
  remove('#' + id);
  remove('#wrap-' + id);
  remove('#card-' + id);
}

function remove(id){
  let e = $(id);
  if(e){
      e.remove();
  }
}

function dragstart(e){
  let id = e.target.id;
  e.dataTransfer.setData('id', id);
}

function dragstart2(e){
  let id = e.target.id.substr(2);
  e.dataTransfer.setData('id', id);
}

markList.addEventListener('dragstart', (e) => dragstart(e));

bars.addEventListener('dragstart', (e) => dragstart2(e));

others.addEventListener('dragstart', (e) => dragstart2(e));

trash.addEventListener('dragover', (e) => {
  e.preventDefault();
});

trash.addEventListener('dragenter', (e) => {
  e.preventDefault();
  trash.classList.add('enter');
});

trash.addEventListener('dragleave', (e) => {
  e.preventDefault();
  trash.classList.remove('enter');
});

trash.addEventListener('drop', (e) => {
  e.preventDefault();
  trash.classList.remove('enter');

  var id = e.dataTransfer.getData("id");
  if(id){
    console.log('drop id:', id);
    e.dataTransfer.clearData();

    chrome.runtime.sendMessage({x: -1, id: id}, (res) => {
      if(res == 0){
        removeAll(id);
      }
    });
  }
});
