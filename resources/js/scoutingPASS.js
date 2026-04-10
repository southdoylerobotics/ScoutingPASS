// ScoutingPASS.js - Full Integrated Code
// Written by Team 2451 - PWNAGE (Modified for Fuel Capacity & Sticky Form)

document.addEventListener("touchstart", startTouch, false);
document.addEventListener("touchend", moveTouch, false);

var initialX = null;
var xThreshold = 0.3;
var slide = 0;
var enableGoogleSheets = false;
var pitScouting = false;
var checkboxAs = 'YN';
var ColWidth = '200px';
var qr = null;

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

var options = {
  correctLevel: QRCode.CorrectLevel.L,
  quietZone: 15,
  quietZoneColor: '#FFFFFF'
};

var requiredFields = []; 

// --- ELEMENT BUILDERS ---

function addTimer(table, idx, name, data) {
  var row = table.insertRow(idx++);
  var cell1 = row.insertCell(0);
  cell1.setAttribute("colspan", 2);
  cell1.className = "title";
  cell1.innerHTML = name;

  row = table.insertRow(idx++);
  var cell = row.insertCell(0);
  cell.setAttribute("colspan", 2);
  cell.style.textAlign = "center";

  if (data.type == 'cycle') {
    var ct = document.createElement('input');
    ct.type = "hidden";
    ct.id = "cycletime_" + data.code;
    ct.name = data.code;
    ct.value = "[]";
    cell.appendChild(ct);
    
    var disp = document.createElement('input');
    disp.type = "text";
    disp.id = "display_" + data.code;
    disp.disabled = true;
    cell.appendChild(disp);
    cell.appendChild(document.createElement("br"));
  }

  var btnStart = document.createElement("input");
  btnStart.type = "button";
  btnStart.id = "start_" + data.code;
  btnStart.value = "Start";
  btnStart.onclick = function() { timer(this.parentElement); };
  cell.appendChild(btnStart);

  var inp = document.createElement("input");
  inp.id = "input_" + data.code;
  inp.className = (data.type == 'timer') ? "timer" : "cycle";
  inp.style = "background-color: black; color: white; border: none; text-align: center;";
  inp.disabled = true;
  inp.value = 0;
  inp.size = 7;
  cell.appendChild(inp);

  var btnReset = document.createElement("input");
  btnReset.type = "button";
  btnReset.value = "Reset";
  btnReset.onclick = function() { resetTimer(this.parentElement); };
  cell.appendChild(btnReset);

  if (data.type == 'cycle') {
    cell.appendChild(document.createElement("br"));
    var btnCycle = document.createElement("input");
    btnCycle.value = "New Cycle";
    btnCycle.type = "button";
    btnCycle.id = "cycle_" + data.code;
    btnCycle.onclick = function() { newCycle(this.parentElement); };
    cell.appendChild(btnCycle);
  }

  row = table.insertRow(idx++);
  row.style.display = "none";
  var hCell = row.insertCell(0);
  var stat = document.createElement("input");
  stat.type = "hidden";
  stat.id = "status_" + data.code;
  stat.value = "stopped";
  hCell.appendChild(stat);
  
  var iv = document.createElement("input");
  iv.type = "hidden";
  iv.id = "intervalId_" + data.code;
  hCell.appendChild(iv);

  return idx;
}

function addCounter(table, idx, name, data) {
  var row = table.insertRow(idx++);
  var cell1 = row.insertCell(0);
  cell1.className = "title";
  cell1.innerHTML = name;
  var cell2 = row.insertCell(1);
  cell2.className = "field";

  var btnMinus = document.createElement("input");
  btnMinus.type = "button";
  btnMinus.value = "-";
  btnMinus.onclick = function() { counter(this.parentElement, -1); };
  cell2.appendChild(btnMinus);

  var inp = document.createElement("input");
  inp.id = "input_" + data.code;
  inp.name = data.code;
  inp.className = "counter";
  inp.style = "background-color: black; color: white; border: none; text-align: center;";
  inp.value = 0;
  inp.size = 3;
  inp.disabled = true;
  cell2.appendChild(inp);

  var btnPlus = document.createElement("input");
  btnPlus.type = "button";
  btnPlus.value = "+";
  btnPlus.onclick = function() { counter(this.parentElement, 1); };
  cell2.appendChild(btnPlus);

  if (name.includes("Fuel")) {
    cell2.appendChild(document.createElement("br"));
    var btn5 = document.createElement("input");
    btn5.type = "button"; btn5.value = "+5";
    btn5.onclick = function() { counter(this.parentElement, 5); };
    cell2.appendChild(btn5);

    var btnH = document.createElement("input");
    btnH.type = "button"; btnH.value = "1/2 Hopper";
    btnH.onclick = function() {
        var t = document.getElementById("input_t").value;
        var c = teamFuelCapacity[t] || 0;
        counter(this.parentElement, Math.round(c/2));
    };
    cell2.appendChild(btnH);
  }
  return idx;
}

function addNumber(table, idx, name, data) {
  var row = table.insertRow(idx++);
  var c1 = row.insertCell(0); c1.innerHTML = name;
  var c2 = row.insertCell(1);
  var inp = document.createElement("input");
  inp.type = "number";
  inp.id = "input_" + data.code;
  inp.name = data.code;
  inp.value = data.defaultValue || "";
  if (data.type == 'team') {
      inp.oninput = updateCapacityDisplay;
  }
  c2.appendChild(inp);
  
  if (data.type == 'team') {
    row = table.insertRow(idx++);
    var lc = row.insertCell(0);
    lc.id = "teamname-label";
    lc.colSpan = 2;
    lc.style.textAlign = "center";
  }
  return idx;
}

function addText(table, idx, name, data) {
  var row = table.insertRow(idx++);
  var c1 = row.insertCell(0); c1.innerHTML = name;
  var c2 = row.insertCell(1);
  var inp = document.createElement("input");
  inp.type = "text";
  inp.id = "input_" + data.code;
  inp.name = data.code;
  inp.value = data.defaultValue || "";
  c2.appendChild(inp);
  return idx;
}

function addRadio(table, idx, name, data) {
  var row = table.insertRow(idx++);
  var c1 = row.insertCell(0); c1.innerHTML = name;
  var c2 = row.insertCell(1);
  if (data.choices) {
    Object.keys(data.choices).forEach(k => {
      var rb = document.createElement("input");
      rb.type = "radio";
      rb.name = data.code;
      rb.value = k;
      c2.appendChild(rb);
      c2.innerHTML += data.choices[k] + " ";
    });
  }
  var disp = document.createElement("input");
  disp.id = "display_" + data.code;
  disp.hidden = true;
  c2.appendChild(disp);
  return idx;
}

function addCheckbox(table, idx, name, data) {
  var row = table.insertRow(idx++);
  var c1 = row.insertCell(0); c1.innerHTML = name;
  var c2 = row.insertCell(1);
  var cb = document.createElement("input");
  cb.type = "checkbox";
  cb.id = "input_" + data.code;
  cb.name = data.code;
  c2.appendChild(cb);
  return idx;
}

function addElement(table, idx, data) {
  var name = data.name || "";
  if (data.type == 'counter') return addCounter(table, idx, name, data);
  if (['scouter', 'event', 'text'].includes(data.type)) return addText(table, idx, name, data);
  if (['level', 'radio', 'robot'].includes(data.type)) return addRadio(table, idx, name, data);
  if (['match', 'team', 'number'].includes(data.type)) return addNumber(table, idx, name, data);
  if (['bool', 'checkbox'].includes(data.type)) return addCheckbox(table, idx, name, data);
  if (['timer', 'cycle'].includes(data.type)) return addTimer(table, idx, name, data);
  return idx;
}

// --- CORE APP LOGIC ---

function configure() {
  var mydata = JSON.parse(config_data);
  dataFormat = mydata.dataFormat || "kvs";
  
  // Prematch
  var pmt = document.getElementById("prematch_table");
  var pidx = 0;
  mydata.prematch.forEach(e => { pidx = addElement(pmt, pidx, e); });

  // Auton/Tele/End (Merged into Quantitative)
  var at = document.getElementById("auton_table");
  var aidx = 0;
  
  var capRow = at.insertRow(aidx++);
  var capCell = capRow.insertCell(0);
  capCell.colSpan = 2; capCell.id = "auto_capacity_display";
  capCell.style.textAlign = "center";
  capCell.innerHTML = "Team Fuel Capacity: --";

  at.insertRow(aidx++).insertCell(0).innerHTML = "<hr><h2>AUTON</h2>";
  mydata.auton.forEach(e => { aidx = addElement(at, aidx, e); });
  
  at.insertRow(aidx++).insertCell(0).innerHTML = "<hr><h2>TELEOP</h2>";
  mydata.teleop.forEach(e => { aidx = addElement(at, aidx, e); });

  at.insertRow(aidx++).insertCell(0).innerHTML = "<hr><h2>ENDGAME</h2>";
  mydata.endgame.forEach(e => { if(!e.name.toLowerCase().includes("fuel")) aidx = addElement(at, aidx, e); });

  // Postmatch
  var postt = document.getElementById("postmatch_table");
  var postidx = 0;
  mydata.postmatch.forEach(e => { postidx = addElement(postt, postidx, e); });

  return 0;
}

function getData(format) {
  var Form = document.forms.scoutingForm;
  var fd = new FormData(Form);
  var str = [];

  // Manual Checkbox handling for PWNAGE
  document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
    fd.set(cb.name, cb.checked ? "Y" : "N");
  });

  if (format == "kvs") {
    fd.forEach((value, key) => { str.push(key + "=" + value); });
    return str.join(";");
  }
  return "";
}

function qr_regenerate() {
  var data = getData(dataFormat);
  if (qr) qr.makeCode(data);
  
  var info = document.getElementById("display_qr-info");
  if (info) {
      var m = document.getElementById("input_m").value;
      var t = document.getElementById("input_t").value;
      info.textContent = "Match: " + m + " Team: " + t;
  }
  return true;
}

function swipePage(increment) {
  if (qr_regenerate()) {
    var slides = document.getElementsByClassName("main-panel");
    if (slide + increment >= 0 && slide + increment < slides.length) {
      slides[slide].style.display = "none";
      slide += increment;
      slides[slide].style.display = "table";
      window.scrollTo(0,0);
    }
  }
}

function updateCapacityDisplay() {
  var t = document.getElementById("input_t").value;
  var disp = document.getElementById("auto_capacity_display");
  if (disp) {
    var val = teamFuelCapacity[t] || "--";
    disp.innerHTML = "Team " + t + " Fuel Capacity: " + val;
  }
}

function clearForm() {
  if (confirm("Reset for next match?")) {
    var m = document.getElementById("input_m");
    var next = parseInt(m.value) + 1;
    document.getElementById("scoutingForm").reset();
    if (!isNaN(next)) m.value = next;
    
    slide = 0;
    var panels = document.getElementsByClassName("main-panel");
    for (var i=0; i<panels.length; i++) panels[i].style.display = "none";
    if (panels[0]) panels[0].style.display = "table";
    
    updateCapacityDisplay();
    if (qr) qr.clear();
  }
}

// Timer Logic
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

function resetTimer(el) {
    var base = el.querySelector(".timer, .cycle").id.substring(6);
    document.getElementById("input_" + base).value = 0;
}

function counter(el, step) {
    var inp = el.querySelector(".counter");
    var val = parseInt(inp.value) + step;
    inp.value = val < 0 ? 0 : val;
}

function startTouch(e) { initialX = e.touches[0].screenX; }
function moveTouch(e) {
    if (initialX === null) return;
    var diffX = initialX - e.changedTouches[0].screenX;
    if (Math.abs(diffX/screen.width) > xThreshold) {
        swipePage(diffX > 0 ? 1 : -1);
    }
    initialX = null;
}

window.onload = function() {
  configure();
  var qrel = document.getElementById("qrcode");
  if (qrel) qr = new QRCode(qrel, options);
  updateCapacityDisplay();
};
