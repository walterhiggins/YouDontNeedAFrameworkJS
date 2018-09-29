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

var items = [];
var filter = () => true;
function addItem() {
  items.push({ done: false, text: document.querySelector("#todotext").value });
  update(home, "#view");
}
function removeItem(index) {
  items.splice(index, 1);
  update(home, "#view");
}
function toggleItem(done, index) {
  items[index].done = done;
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

function home() {
  return `
<nav>To Do List</nav>
  <div class="wrapper">
    <h1>Simple To-Do List</h1>
    <form onsubmit="return addItem()">
      <input type="text" id="todotext"/>
      <input type="submit" value="Add Item"/>
    </form>
    <ol>
    ${items.filter(filter).mapj(
      (item, index) => `
	<li>
	<input type="checkbox" onchange="toggleItem(this.checked,${index})" ${item.done
        ? "checked"
        : ""}/>${item.text}
	<button onclick="removeItem(${index})">X</button></li>
`
    )}
    </ol>
    <a href="#all">All</a> <a href="#active">Active</a> <a href="#completed">Completed</a>
  </div>
  `;
}
