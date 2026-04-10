// ScoutingPASS.js
// The guts of the ScountingPASS application
// Written by Team 2451 - PWNAGE

document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchend", moveTouch, false);

// Swipe Up / Down / Left / Right
var initialX = null;
var xThreshold = 0.3;
var slide = 0;
var enableGoogleSheets = false;
var pitScouting = false;
var checkboxAs = 'YN';
var ColWidth = '200px';

var teamFuelCapacity = {
  "34": 50, "120": 8, "538": 52, "744": 20, "1308": 0, "1466": 25,
  "1912": 40, "2393": 42, "2481": 40, "2556": 32, "2638": 30, "2783": 35,
  "2973": 0, "3140": 30, "3201": 30, "3260": 50, "3492": 40, "3792": 0,
  "3959": 40, "3966": 20, "3984": 45, "4020": 40, "4107": 48, "4150": 20,
  "4265": 20, "4306": 40, "4504": 20, "5002": 40, "5045": 0, "5125": 30,
  "5492": 12, "5740": 28, "5842": 85, "6107": 20, "6517": 35, "7111": 20,
  "7428": 9, "7515": 60, "7525": 35, "7917": 10, "8624": 40, "8778": 30,
  "9067": 40, "9153": 8, "9401": 0, "10137": 8, "10961": 8, "11037": 8, "11173": 8
};

// Options
var options = {
  correctLevel: QRCode.CorrectLevel.L,
  quietZone: 15,
  quietZoneColor: '#FFFFFF'
};

var requiredFields = []; 

function addTimer(table, idx, name, data) {
  var row = table.insertRow(idx);
  var cell1 = row.insertCell(0);
  cell1.setAttribute("colspan", 2);
  cell1.setAttribute("style", "text-align: center;");
  cell1.classList.add("title");
  cell1.innerHTML = name;

  idx += 1;
  row = table.insertRow(idx);
  cell = row.insertCell(0);
  cell.setAttribute("colspan", 2);
  cell.setAttribute("style", "text-align: center;");

  if (data.type == 'cycle') {
    var ct = document.createElement('input');
    ct.setAttribute("type", "hidden");
    ct.setAttribute("id", "cycletime_" + data.code);
    ct.setAttribute("name", data.code);
    ct.setAttribute("value", "[]");
    cell.appendChild(ct);
    ct = document.createElement('input');
    ct.setAttribute("type", "text");
    ct.setAttribute("id", "display_" + data.code);
    ct.setAttribute("value", "");
    ct.setAttribute("disabled", "");
    cell.appendChild(ct);
    cell.appendChild(document.createElement("br"));
  }
  var button1 = document.createElement("input");
  button1.setAttribute("id", "start_" + data.code);
  button1.setAttribute("type", "button");
  button1.setAttribute("onclick", "timer(this.parentElement)");
  button1.setAttribute("value", "Start");
  cell.appendChild(button1);

  var inp = document.createElement("input");
  inp.classList.add(data.type == 'timer' ? "timer" : "cycle");
  inp.setAttribute("id", "input_" + data.code);
  inp.setAttribute("name", data.code);
  inp.setAttribute("type", "text");
  inp.setAttribute("style", "background-color: black; color: white;border: none; text-align: center;");
  inp.setAttribute("disabled", "");
  inp.setAttribute("value", 0);
  inp.setAttribute("size", 7);
  cell.appendChild(inp);

  var button2 = document.createElement("input");
  button2.setAttribute("id", "clear_" + data.code);
  button2.setAttribute("type", "button");
  button2.setAttribute("onclick", "resetTimer(this.parentElement)");
  button2.setAttribute("value", "Reset");
  cell.appendChild(button2);

  if (data.type == 'cycle') {
    cell.appendChild(document.createElement("br"));
    var button3 = document.createElement("input");
    button3.setAttribute("id", "cycle_" + data.code);
    button3.setAttribute("type", "button");
    button3.setAttribute("onclick", "newCycle(this.parentElement)");
    button3.setAttribute("value", "New Cycle");
    cell.appendChild(button3);
  }

  idx += 1;
  row = table.insertRow(idx);
  row.setAttribute("style", "display:none");
  cell = row.insertCell(0);
  var inpStatus = document.createElement('input');
  inpStatus.setAttribute("type", "hidden");
  inpStatus.setAttribute("id", "status_" + data.code);
  inpStatus.setAttribute("value", "stopped");
  cell.appendChild(inpStatus);
  var inpInt = document.createElement('input');
  inpInt.setAttribute("hidden", "");
  inpInt.setAttribute("id", "intervalId_" + data.code);
  inpInt.setAttribute("value", "");
  cell.appendChild(inpInt);

  return idx + 1;
}

function addCounter(table, idx, name, data) {
  var row = table.insertRow(idx);
  var cell1 = row.insertCell(0);
  cell1.style.width = ColWidth;
  cell1.classList.add("title");
  var cell2 = row.insertCell(1);
  cell2.style.width = ColWidth;
  cell1.innerHTML = name + '&nbsp;';
  cell2.classList.add("field");

  var button1 = document.createElement("input");
  button1.setAttribute("type", "button");
  button1.setAttribute("onclick", "counter(this.parentElement, -1)");
  button1.setAttribute("value", "-");
  cell2.appendChild(button1);

  var inp = document.createElement("input");
  inp.classList.add("counter");
  inp.setAttribute("id", "input_" + data.code);
  inp.setAttribute("name", data.code);
  inp.setAttribute("type", "text");
  inp.setAttribute("style", "background-color: black; color: white;border: none; text-align: center;");
  inp.setAttribute("disabled", "");
  inp.setAttribute("value", 0);
  inp.setAttribute("size", 2);
  cell2.appendChild(inp);

  var button2 = document.createElement("input");
  button2.setAttribute("type", "button");
  button2.setAttribute("onclick", "counter(this.parentElement, 1)");
  button2.setAttribute("value", "+");
  cell2.appendChild(button2);

  if (name.includes("Fuel")) {
    cell2.appendChild(document.createElement("br"));
    var btn5 = document.createElement("input");
    btn5.setAttribute("type", "button");
    btn5.setAttribute("onclick", "counter(this.parentElement, 5)");
    btn5.setAttribute("value", "+5");
    cell2.appendChild(btn5);

    var btnHalf = document.createElement("input");
    btnHalf.setAttribute("type", "button");
    btnHalf.setAttribute("value", "+ 1/2 Hopper");
    btnHalf.onclick = function() {
        var t = document.getElementById("input_t").value;
        var cap = teamFuelCapacity[t] || 0;
        counter(this.parentElement, Math.round(cap / 2));
    };
    cell2.appendChild(btnHalf);
  }
  return idx + 1;
}

function addClickableImage(table, idx, name, data) {
  var row = table.insertRow(idx);
  var cell = row.insertCell(0);
  cell.setAttribute("colspan", 2);
  cell.setAttribute("style", "text-align: center;");
  cell.classList.add("title");
  cell.innerHTML = name;

  idx += 1;
  row = table.insertRow(idx);
  cell = row.insertCell(0);
  cell.setAttribute("colspan", 2);
  cell.setAttribute("style", "text-align: center;");
  var canvas = document.createElement('canvas');
  canvas.setAttribute("onclick", "onFieldClick(event)");
  canvas.setAttribute("id", "canvas_" + data.code);
  cell.appendChild(canvas);

  idx += 1;
  row = table.insertRow(idx);
  row.setAttribute("style", "display:none");
  cell = row.insertCell(0);
  var inpXY = document.createElement('input');
  inpXY.setAttribute("type", "hidden");
  inpXY.setAttribute("id", "XY_" + data.code);
  inpXY.setAttribute("value", "[]");
  cell.appendChild(inpXY);
  var inpInp = document.createElement('input');
  inpInp.setAttribute("id", "input_" + data.code);
  inpInp.setAttribute("name", data.code);
  inpInp.setAttribute("value", "[]");
  cell.appendChild(inpInp);

  idx += 1;
  row = table.insertRow(idx);
  row.setAttribute("style", "display:none");
  cell = row.insertCell(0);
  var img = document.createElement('img');
  img.src = data.filename;
  img.setAttribute("id", "img_" + data.code);
  img.setAttribute("onload", "drawFields()");
  cell.appendChild(img);

  return idx + 1;
}

function addText(table, idx, name, data) {
  var row = table.insertRow(idx);
  var cell1 = row.insertCell(0);
  cell1.classList.add("title");
  var cell2 = row.insertCell(1);
  cell1.innerHTML = name + '&nbsp;';
  var inp = document.createElement("input");
  inp.setAttribute("id", "input_" + data.code);
  inp.setAttribute("name", data.code);
  inp.setAttribute("type", "text");
  inp.setAttribute("value", data.defaultValue || "");
  cell2.appendChild(inp);
  return idx + 1;
}

function addNumber(table, idx, name, data) {
  var row = table.insertRow(idx);
  var cell1 = row.insertCell(0);
  cell1.classList.add("title");
  var cell2 = row.insertCell(1);
  cell1.innerHTML = name + '&nbsp;';
  var inp = document.createElement("input");
  inp.setAttribute("id", "input_" + data.code);
  inp.setAttribute("name", data.code);
  inp.setAttribute("type", "number");
  inp.setAttribute("value", data.defaultValue || "");
  if (data.type == 'team') {
    inp.oninput = updateCapacityDisplay;
  }
  cell2.appendChild(inp);

  if (data.type == 'team') {
    idx += 1;
    row = table.insertRow(idx);
    var teamLabel = row.insertCell(0);
    teamLabel.setAttribute("id", "teamname-label");
    teamLabel.setAttribute("colspan", 2);
    teamLabel.setAttribute("style", "text-align: center;");
  }
  return idx + 1;
}

function addRadio(table, idx, name, data) {
  var row = table.insertRow(idx);
  var cell1 = row.insertCell(0);
  cell1.classList.add("title");
  var cell2 = row.insertCell(1);
  cell1.innerHTML = name + '&nbsp;';
  if (data.choices) {
    Object.keys(data.choices).forEach(c => {
      var inp = document.createElement("input");
      inp.setAttribute("type", "radio");
      inp.setAttribute("name", data.code);
      inp.setAttribute("value", c);
      cell2.appendChild(inp);
      cell2.innerHTML += data.choices[c] + " ";
    });
  }
  var disp = document.createElement("input");
  disp.setAttribute("id", "display_" + data.code);
  disp.setAttribute("hidden", "");
  cell2.appendChild(disp);
  return idx + 1;
}

function addCheckbox(table, idx, name, data) {
  var row = table.insertRow(idx);
  var cell1 = row.insertCell(0);
  cell1.classList.add("title");
  var cell2 = row.insertCell(1);
  cell1.innerHTML = name + '&nbsp;';
  var inp = document.createElement("input");
  inp.setAttribute("id", "input_" + data.code);
  inp.setAttribute("name", data.code);
  inp.setAttribute("type", "checkbox");
  cell2.appendChild(inp);
  return idx + 1;
}

function addElement(table, idx, data) {
  var type = data.type;
  var name = data.name || "";
  if (type == 'counter') return addCounter(table, idx, name, data);
  if (['scouter', 'event', 'text'].includes(type)) return addText(table, idx, name, data);
  if (['level', 'radio', 'robot'].includes(type)) return addRadio(table, idx, name, data);
  if (['match', 'team', 'number'].includes(type)) return addNumber(table, idx, name, data);
  if (type == 'field_image' || type == 'clickable_image') return addClickableImage(table, idx, name, data);
  if (['bool', 'checkbox'].includes(type)) return addCheckbox(table, idx, name, data);
  if (['timer', 'cycle'].includes(type)) return addTimer(table, idx, name, data);
  return idx;
}

function configure() {
  var mydata = JSON.parse(config_data);
  dataFormat = mydata.dataFormat || "kvs";
  
  var pmt = document.getElementById("prematch_table");
  var idx = 0;
  mydata.prematch.forEach(e => { idx = addElement(pmt, idx, e); });

  var at = document.getElementById("auton_table");
  idx = 0;
  var capRow = at.insertRow(idx++);
  var capCell = capRow.insertCell(0);
  capCell.colSpan = 2;
  capCell.id = "auto_capacity_display";
  capCell.style.textAlign = "center";
  capCell.innerHTML = "Team Fuel Capacity: --";

  at.insertRow(idx++).insertCell(0).innerHTML = "<hr><h2>AUTON</h2>";
  mydata.auton.forEach(e => { idx = addElement(at, idx, e); });
  at.insertRow(idx++).insertCell(0).innerHTML = "<hr><h2>TELEOP</h2>";
  mydata.teleop.forEach(e => { idx = addElement(at, idx, e); });
  at.insertRow(idx++).insertCell(0).innerHTML = "<hr><h2>ENDGAME</h2>";
  mydata.endgame.forEach(e => { if(!e.name.toLowerCase().includes("fuel")) idx = addElement(at, idx, e); });

  var postt = document.getElementById("postmatch_table");
  idx = 0;
  mydata.postmatch.forEach(e => { idx = addElement(postt, idx, e); });

  updateCapacityDisplay();
  return 0;
}

function getData(dataFormat) {
  var Form = document.forms.scoutingForm;
  var UniqueFieldNames = [];
  var fd = new FormData();
  var str = [];
  var checkedChar = checkboxAs == 'TF' ? 'T' : 'Y';
  var uncheckedChar = checkboxAs == 'TF' ? 'F' : 'N';

  var fieldnames = Array.from(Form.elements, formElmt => formElmt.name);
  fieldnames.forEach((fieldname) => { if (fieldname != "" && !UniqueFieldNames.includes(fieldname)) { UniqueFieldNames.push(fieldname) } });

  UniqueFieldNames.forEach((fieldname) => {
    var thisField = Form[fieldname];
    var val = "";
    if (thisField.type == 'checkbox') {
      val = thisField.checked ? checkedChar : uncheckedChar;
    } else {
      val = thisField.value ? thisField.value.toString().replace(/"/g, '').replace(/;/g, "-") : "";
    }
    fd.append(fieldname, val);
  });

  if (dataFormat == "kvs") {
    Array.from(fd.keys()).forEach(k => str.push(k + "=" + fd.get(k)));
    return str.join(";");
  } else {
    Array.from(fd.keys()).forEach(k => str.push(fd.get(k)));
    return str.join("\t");
  }
}

function updateQRHeader() {
  var e = document.getElementById("input_e").value;
  var m = document.getElementById("input_m").value;
  var t = document.getElementById("input_t").value;
  document.getElementById("display_qr-info").textContent = "Event: " + e + " Match: " + m + " Team: " + t;
}

function qr_regenerate() {
  try {
    var data = getData(dataFormat);
    if (qr) qr.makeCode(data);
    updateQRHeader();
  } catch (e) { console.error(e); }
  return true;
}

function swipePage(increment) {
  if (qr_regenerate()) {
    var slides = document.getElementById("main-panel-holder").children;
    if (slide + increment < slides.length && slide + increment >= 0) {
      slides[slide].style.display = "none";
      slide += increment;
      window.scrollTo(0, 0);
      slides[slide].style.display = "table";
    }
  }
}

function updateCapacityDisplay() {
  var t = document.getElementById("input_t").value;
  var cap = teamFuelCapacity[t] || "--";
  var disp = document.getElementById("auto_capacity_display");
  if (disp) disp.innerHTML = "Team " + t + " Fuel Capacity: " + cap;
}

function clearForm() {
  if (confirm("Are you sure you want to clear the form?")) {
    var mInp = document.getElementById("input_m");
    var nextMatch = parseInt(mInp.value) + 1;
    var eVal = document.getElementById("input_e").value;
    var sVal = document.getElementById("input_s").value;

    document.getElementById("scoutingForm").reset();

    mInp.value = nextMatch;
    document.getElementById("input_e").value = eVal;
    document.getElementById("input_s").value = sVal;

    slide = 0;
    var panels = document.getElementById("main-panel-holder").children;
    for (var i = 0; i < panels.length; i++) panels[i].style.display = "none";
    panels[0].style.display = "table";

    if (qr) qr.clear();
    updateCapacityDisplay();
    drawFields();
    window.scrollTo(0, 0);
  }
}

function timer(el) {
  var base = el.querySelector(".timer, .cycle").id.substring(6);
  var stat = document.getElementById("status_" + base);
  var btn = document.getElementById("start_" + base);
  if (stat.value == "stopped") {
    stat.value = "started";
    btn.value = "Stop";
    var iv = setInterval(() => {
      var inp = document.getElementById("input_" + base);
      inp.value = (parseFloat(inp.value) + 0.1).toFixed(1);
    }, 100);
    document.getElementById("intervalId_" + base).value = iv;
  } else {
    stat.value = "stopped";
    btn.value = "Start";
    clearInterval(document.getElementById("intervalId_" + base).value);
  }
}

function counter(el, step) {
  var inp = el.querySelector(".counter");
  var res = (parseInt(inp.value) || 0) + step;
  inp.value = res < 0 ? 0 : res;
}

function resetTimer(el) { el.querySelector(".timer, .cycle").value = 0; }

function startTouch(e) { initialX = e.touches[0].screenX; }
function moveTouch(e) {
  if (initialX === null) return;
  var diffX = initialX - e.changedTouches[0].screenX;
  if (Math.abs(diffX/screen.width) > xThreshold) swipePage(diffX > 0 ? 1 : -1);
  initialX = null;
}

function drawFields() {
  var fields = document.querySelectorAll("[id*='canvas_']");
  for (f of fields) {
    var code = f.id.substring(7);
    var img = document.getElementById("img_" + code);
    var ctx = f.getContext("2d");
    f.width = img.width * 0.5; f.height = img.height * 0.5;
    ctx.drawImage(img, 0, 0, f.width, f.height);
  }
}

window.onload = function() {
  configure();
  var qrel = document.getElementById("qrcode");
  if (qrel) qr = new QRCode(qrel, options);
};
