/* ------------------------------------------------------------------------
   generic 'framework' code starts here 
   ------------------------------------------------------------------------ */
Array.prototype.mapj = function(fn) {
  return this.map(fn).join("");
};
var euc = encodeURIComponent;

function hashrouter(evt) {
  var newURL = evt && evt.newURL ? new URL(evt.newURL) : location;
  var newParts = newURL.hash.split("/");
  if (newParts.length == 0) {
    return;
  }

  var newFn = window[newParts[0].substring(1)];
  if (!newFn) {
    if (evt.constructor == String) {
      newFn = window[evt.substring(1)];
    }
  }
  update("#view", function() {
    return newFn.apply(null, newParts.slice(1).map(decodeURIComponent));
  });
}
/* Function naming for attaching handlers to elements */
(function(exports) {
  var fnCounter = 0;
  exports.__fns = exports.__fns || {};
  function fname(fn) {
    var name = `_${fnCounter++}`;
    exports.__fns[name] = fn;
    return `__fns.${name}`;
  }
  exports.fname = fname;
})(window);

function update(view, fn) {
  document.querySelector(view).innerHTML = fn();
}

window.onhashchange = hashrouter;

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
  hashrouter("#home");
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
