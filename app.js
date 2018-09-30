/* ------------------------------------------------------------------------
   generic 'framework' code starts here 
   ------------------------------------------------------------------------ */
Array.prototype.mapj = function(fn) {
  return this.map(fn).join("");
};
var euc = encodeURIComponent;

function route(defaultFn) {
  if (defaultFn && defaultFn.constructor == Function) {
    this.defaultFn = defaultFn;
  }
  var parts = location.hash.split("/");
  var fn = window[parts[0].substring(1)];
  var html = null;
  if (fn) {
    update(() => fn.apply(null, parts.slice(1)), "#view");
  } else {
    update(() => this.defaultFn.apply(null, parts.slice(1)), "#view");
  }
}
function update(fn, selector) {
  var html = fn();
  document.querySelector(selector).innerHTML = html;
}

window.onhashchange = route;

/* ------------------------------------------------------------------------
   Application code starts here
   ------------------------------------------------------------------------ */

function load() {
  var raw = localStorage.getItem("items");
  if (raw) {
    return JSON.parse(raw);
  }
}
function save(items) {
  localStorage.setItem("items", JSON.stringify(items));
}
var items = load() || [];
var filter = () => true;
function addItem() {
  let uid = new Date().getTime();
  items.push({
    done: false,
    text: document.querySelector("#todotext").value,
    uid: uid
  });
  save(items);
  update(home, "#view");
}
function removeItem(uid) {
  let index = items.findIndex(item => item.uid == uid);
  items.splice(index, 1);
  save(items);
  update(home, "#view");
}
function toggleItem(done, uid) {
  let index = items.findIndex(item => item.uid == uid);
  items[index].done = done;
  save(items);
  update(home, "#view");
}
function all() {
  filter = item => true;
  return home();
}
function active() {
  filter = item => !item.done;
  return home();
}
function completed() {
  filter = item => item.done;
  return home();
}
window.onload = function() {
  route(home);
};

const home = () => `
<nav>To Do List</nav>
<div class="wrapper">
  <h1>Simple To-Do List</h1>
  <form onsubmit="return addItem()">
    <input type="text" id="todotext"/>
    <input type="submit" value="Add Item"/>
  </form>
  <ol>
  ${items.filter(filter).mapj(
    item => `
    <li>
      <input type="checkbox" onchange="toggleItem(this.checked,${item.uid})" ${item.done
      ? "checked"
      : ""}/>${item.text}
      <button onclick="removeItem(${item.uid})">X</button>
    </li>
`
  )}
  </ol>
  <a href="#all">All</a> <a href="#active">Active</a> <a href="#completed">Completed</a>
</div>
  `;
