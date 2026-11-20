(function () {
  "use strict";

  const dataApi = window.SchoolData;
  const store = dataApi.createStore(window.localStorage);
  const content = document.getElementById("page-content");
  const modalRoot = document.getElementById("modal-root");
  const toastRoot = document.getElementById("toast-root");
  const today = new Date().toISOString().slice(0, 10);
  let page = "dashboard";
  let filter = "";
  let listFilter = "all";

  const pages = {
    dashboard: "Overview",
    students: "Students",
    teachers: "Teachers",
    classes: "Classes & subjects",
    attendance: "Attendance",
    exams: "Examinations",
    fees: "Fees & payments",
    reports: "Performance reports"
  };
  const configs = {
    students: {
      collection: "students", title: "Students", singular: "student", button: "Register student",
      search: ["name", "id", "className", "guardian", "email"],
      filters: [{ field: "className", label: "All classes" }, { field: "status", label: "All statuses" }],
      columns: [
        { label: "Student", value: function (r) { return personCell(r.name, r.id); } },
        { label: "Class", field: "className" },
        { label: "Guardian", field: "guardian" },
        { label: "Contact", field: "phone" },
        { label: "Status", value: function (r) { return badge(r.status); } }
      ],
      fields: [
        ["name", "Full name", "text", true], ["className", "Class", "class", true],
        ["gender", "Gender", "select", true, ["Female", "Male", "Other"]],
        ["dob", "Date of birth", "date", true], ["guardian", "Guardian name", "text", true],
        ["phone", "Guardian phone", "tel", true], ["email", "Guardian email", "email", false],
        ["address", "Home address", "text", false], ["joined", "Enrollment date", "date", true],
        ["status", "Status", "select", true, ["Active", "Inactive"]]
      ]
    },
    teachers: {
      collection: "teachers", title: "Teachers", singular: "teacher", button: "Add teacher",
      search: ["name", "id", "subject", "email"],
      filters: [{ field: "subject", label: "All subjects" }, { field: "status", label: "All statuses" }],
      columns: [
        { label: "Teacher", value: function (r) { return personCell(r.name, r.id); } },
        { label: "Subject", field: "subject" }, { label: "Classes", field: "classes" },
        { label: "Email", field: "email" }, { label: "Status", value: function (r) { return badge(r.status); } }
      ],
      fields: [
        ["name", "Full name", "text", true], ["subject", "Primary subject", "subject", true],
        ["email", "Email address", "email", true], ["phone", "Phone number", "tel", true],
        ["classes", "Assigned classes", "text", false], ["status", "Status", "select", true, ["Active", "On leave", "Inactive"]]
      ]
    },
    classes: {
      collection: "classes", title: "Classes & subjects", singular: "class", button: "Create class",
      search: ["name", "grade", "room", "teacher", "subjects"],
      filters: [{ field: "grade", label: "All grades" }],
      columns: [
        { label: "Class", value: function (r) { return '<span class="class-dot">' + escapeHtml(r.section) + '</span><span class="class-name">' + escapeHtml(r.name) + '</span>'; } },
        { label: "Room", field: "room" }, { label: "Lead teacher", field: "teacher" },
        { label: "Subjects", field: "subjects" }, { label: "Students", value: function (r) { return '<span class="student-count">' + escapeHtml(r.students || 0) + ' students</span>'; } }
      ],
      fields: [
        ["name", "Class name", "text", true], ["grade", "Grade", "text", true],
        ["section", "Section", "text", true], ["room", "Room", "text", true],
        ["teacher", "Lead teacher", "teacher", true], ["subjects", "Subjects (comma separated)", "text", true],
        ["students", "Student capacity / count", "number", true]
      ]
    },
    exams: {
      collection: "exams", title: "Examinations", singular: "result", button: "Record result",
      search: ["studentName", "studentId", "className", "subject", "examName"],
      filters: [{ field: "className", label: "All classes" }, { field: "subject", label: "All subjects" }],
      columns: [
        { label: "Student", value: function (r) { return personCell(r.studentName, r.studentId); } },
        { label: "Assessment", field: "examName" }, { label: "Subject", field: "subject" },
        { label: "Class", field: "className" }, { label: "Score", value: function (r) { return '<strong class="score">' + escapeHtml(r.score) + '<span> / ' + escapeHtml(r.maxScore) + '</span></strong>'; } },
        { label: "Grade", value: function (r) { return badge(gradeFor(r.score, r.maxScore)); } }
      ],
      fields: [
        ["studentId", "Student", "student", true], ["examName", "Assessment name", "text", true],
        ["subject", "Subject", "subject", true], ["date", "Assessment date", "date", true],
        ["score", "Score earned", "number", true], ["maxScore", "Maximum score", "number", true]
      ]
    },
    fees: {
      collection: "fees", title: "Fees & payments", singular: "fee record", button: "Record payment",
      search: ["studentName", "studentId", "className", "term", "status"],
      filters: [{ field: "className", label: "All classes" }, { field: "status", label: "All statuses" }],
      columns: [
        { label: "Student", value: function (r) { return personCell(r.studentName, r.studentId); } },
        { label: "Fee / term", value: function (r) { return '<span class="class-name">' + escapeHtml(r.term) + '</span><span class="subline">' + escapeHtml(r.className) + '</span>'; } },
        { label: "Due date", field: "dueDate" }, { label: "Amount", value: function (r) { return '<strong>' + money(r.amount) + '</strong>'; } },
        { label: "Status", value: function (r) { return badge(r.status); } },
        { label: "Payment method", field: "method" }
      ],
      fields: [
        ["studentId", "Student", "student", true], ["term", "Term", "text", true],
        ["amount", "Amount", "number", true], ["dueDate", "Due date", "date", true],
        ["status", "Payment status", "select", true, ["Pending", "Paid", "Overdue"]],
        ["method", "Payment method", "select", true, ["Card", "Bank transfer", "Cash", "—"]]
      ]
    }
  };

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char];
    });
  }

  function money(value) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(Number(value) || 0);
  }

  function badge(value) {
    const cls = String(value || "").toLowerCase().replace(/[^a-z]+/g, "-");
    return '<span class="badge badge-' + escapeHtml(cls) + '"><i></i>' + escapeHtml(value) + '</span>';
  }

  function personCell(name, id) {
    return '<div class="person-cell"><span class="avatar avatar-small ' + avatarColor(name) + '">' + escapeHtml(initials(name)) + '</span><span><strong>' + escapeHtml(name) + '</strong><small>' + escapeHtml(id) + '</small></span></div>';
  }

  function initials(name) {
    return String(name || "?").split(/\s+/).slice(0, 2).map(function (part) { return part.charAt(0); }).join("").toUpperCase();
  }

  function avatarColor(name) {
    const colors = ["avatar-blue", "avatar-purple", "avatar-green", "avatar-orange", "avatar-pink"];
    const sum = String(name || "").split("").reduce(function (total, char) { return total + char.charCodeAt(0); }, 0);
    return colors[sum % colors.length];
  }

  function gradeFor(score, max) {
    const percentage = Number(max) ? Number(score) / Number(max) * 100 : 0;
    return percentage >= 90 ? "A" : percentage >= 80 ? "B" : percentage >= 70 ? "C" : percentage >= 60 ? "D" : "Needs support";
  }

  function toast(message, type) {
    const node = document.createElement("div");
    node.className = "toast " + (type || "success");
    node.innerHTML = '<span class="toast-mark">' + (type === "error" ? "!" : "✓") + '</span><span>' + escapeHtml(message) + '</span>';
    toastRoot.appendChild(node);
    window.setTimeout(function () { node.classList.add("toast-out"); window.setTimeout(function () { node.remove(); }, 250); }, 3200);
  }

  function getData() {
    try { return store.getAll(); }
    catch (error) {
      toast(error.message, "error");
      throw error;
    }
  }

  function setPage(nextPage) {
    if (!pages[nextPage]) return;
    page = nextPage;
    filter = "";
    listFilter = "all";
    document.getElementById("global-search").value = "";
    document.getElementById("current-section").textContent = pages[page];
    document.querySelectorAll(".nav-item").forEach(function (item) { item.classList.toggle("active", item.dataset.page === page); });
    document.getElementById("sidebar").classList.remove("sidebar-open");
    render();
  }

  function render() {
    const data = getData();
    document.getElementById("student-nav-count").textContent = data.students.length;
    if (page === "dashboard") renderDashboard(data);
    else if (page === "attendance") renderAttendance(data);
    else if (page === "reports") renderReports(data);
    else renderCollection(data, page);
  }

  function pageHeading(title, description, actionText, action) {
    return '<div class="page-heading"><div><div class="eyebrow">' + escapeHtml(pages[page]) + '</div><h1>' + title + '</h1><p>' + description + '</p></div>' +
      (actionText ? '<button class="button button-primary" data-action="' + action + '"><span class="button-plus">＋</span>' + actionText + '</button>' : "") + '</div>';
  }

  function renderDashboard(data) {
    const activeStudents = data.students.filter(function (student) { return student.status === "Active"; }).length;
    const activeTeachers = data.teachers.filter(function (teacher) { return teacher.status === "Active"; }).length;
    const presentToday = data.attendance.filter(function (row) { return row.date === today && row.status !== "Absent"; }).length;
    const markedToday = data.attendance.filter(function (row) { return row.date === today; }).length;
    const attendanceRate = markedToday ? Math.round(presentToday / markedToday * 100) : 0;
    const collected = data.fees.filter(function (fee) { return fee.status === "Paid"; }).reduce(function (sum, fee) { return sum + Number(fee.amount || 0); }, 0);
    const recent = data.attendance.filter(function (entry) { return entry.date === today; }).slice(0, 5);
    const days = lastSevenDays(data.attendance);
    const chartMax = Math.max.apply(null, days.map(function (item) { return item.total; }).concat([1]));
    content.innerHTML = pageHeading("Good morning, Alexandra <span class=\"wave\">✦</span>", "Here’s what’s happening at your school today.", "Add a student", "add-student") +
      '<div class="stats-grid">' +
      metricCard("Total students", activeStudents, "↗", "+ 8.2% this term", "indigo", "♙") +
      metricCard("Teaching staff", activeTeachers, "↗", "+ 2 new this term", "mint", "♧") +
      metricCard("Attendance today", attendanceRate + "%", "●", presentToday + " of " + markedToday + " students present", "amber", "✓") +
      metricCard("Fees collected", money(collected), "↗", "Across all recorded payments", "rose", "＄") +
      '</div><div class="dashboard-grid"><section class="panel attendance-panel"><div class="panel-heading"><div><h2>Attendance overview</h2><p>Student attendance over the last 7 days</p></div><button class="text-button" data-page="attendance">View report <span>→</span></button></div>' +
      '<div class="chart-legend"><span><i class="legend-present"></i>Present</span><span><i class="legend-absent"></i>Absent / late</span></div>' +
      '<div class="bar-chart">' + days.map(function (day) {
        const presentHeight = Math.max(day.total ? day.present / chartMax * 100 : 0, day.present ? 8 : 0);
        const absentHeight = Math.max(day.total ? (day.total - day.present) / chartMax * 100 : 0, day.total - day.present ? 6 : 0);
        return '<div class="chart-column"><div class="bar-stack"><span class="bar bar-present" style="height:' + presentHeight + '%"></span><span class="bar bar-other" style="height:' + absentHeight + '%"></span></div><span class="chart-day">' + escapeHtml(day.label) + '</span></div>';
      }).join("") + '</div></section><section class="panel quick-panel"><div class="panel-heading"><div><h2>Quick actions</h2><p>Common tasks, one click away</p></div></div>' +
      '<div class="quick-actions"><button data-action="add-student"><span class="quick-icon quick-indigo">＋</span><span><strong>Register a student</strong><small>Add a student to your school</small></span><b>→</b></button>' +
      '<button data-action="mark-attendance"><span class="quick-icon quick-green">✓</span><span><strong>Take attendance</strong><small>Mark today’s class register</small></span><b>→</b></button>' +
      '<button data-action="record-result"><span class="quick-icon quick-orange">▤</span><span><strong>Enter exam results</strong><small>Record student performance</small></span><b>→</b></button>' +
      '<button data-action="record-payment"><span class="quick-icon quick-pink">＄</span><span><strong>Record a payment</strong><small>Update a student fee record</small></span><b>→</b></button></div></section></div>' +
      '<section class="panel recent-panel"><div class="panel-heading"><div><h2>Today’s attendance</h2><p>Latest student check-ins</p></div><button class="text-button" data-page="attendance">View all <span>→</span></button></div>' +
      (recent.length ? '<div class="table-wrap"><table><thead><tr><th>Student</th><th>Class</th><th>Date</th><th>Status</th></tr></thead><tbody>' + recent.map(function (row) {
        return '<tr><td>' + personCell(row.studentName, row.studentId) + '</td><td>' + escapeHtml(row.className) + '</td><td>' + formatDate(row.date) + '</td><td>' + badge(row.status) + '</td></tr>';
      }).join("") + '</tbody></table></div>' : emptyState("No attendance marked today", "Take attendance to see today’s check-ins here.", "Mark attendance", "mark-attendance")) +
      '</section><div class="dashboard-footnote"><span class="pulse-dot"></span> Your school data is saved locally on this device.</div>';
  }

  function metricCard(label, value, trendIcon, trend, color, icon) {
    return '<section class="metric-card"><div class="metric-top"><span>' + label + '</span><span class="metric-icon metric-' + color + '">' + icon + '</span></div>' +
      '<div class="metric-value">' + escapeHtml(value) + '</div><div class="metric-trend"><span class="trend-arrow">' + trendIcon + '</span>' + escapeHtml(trend) + '</div></section>';
  }

  function lastSevenDays(attendance) {
    const result = [];
    for (let offset = 6; offset >= 0; offset--) {
      const date = new Date();
      date.setDate(date.getDate() - offset);
      const key = date.toISOString().slice(0, 10);
      const records = attendance.filter(function (row) { return row.date === key; });
      result.push({
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        total: records.length,
        present: records.filter(function (row) { return row.status !== "Absent"; }).length
      });
    }
    return result;
  }

  function renderCollection(data, section) {
    const config = configs[section];
    if (!config) return;
    let records = data[config.collection];
    records = dataApi.search(records, filter, config.search);
    if (listFilter !== "all") {
      records = records.filter(function (record) { return String(record[listFilter.field]) === listFilter.value; });
    }
    const filters = config.filters.map(function (spec) {
      const values = Array.from(new Set(data[config.collection].map(function (row) { return row[spec.field]; }).filter(Boolean))).sort();
      return '<select class="filter-select" data-filter-field="' + escapeHtml(spec.field) + '" aria-label="' + escapeHtml(spec.label) + '"><option value="all">' + escapeHtml(spec.label) + '</option>' +
        values.map(function (value) { return '<option value="' + escapeHtml(value) + '"' + (listFilter.field === spec.field && listFilter.value === value ? " selected" : "") + '>' + escapeHtml(value) + '</option>'; }).join("") + '</select>';
    }).join("");
    const head = config.columns.map(function (column) { return "<th>" + escapeHtml(column.label) + "</th>"; }).join("");
    const rows = records.map(function (record) {
      const cells = config.columns.map(function (column) {
        return "<td>" + (column.value ? column.value(record) : escapeHtml(record[column.field])) + "</td>";
      }).join("");
      const edit = '<button class="row-action" data-action="edit-record" data-collection="' + section + '" data-id="' + escapeHtml(record.id) + '" aria-label="Edit record">✎</button>';
      const remove = '<button class="row-action row-delete" data-action="delete-record" data-collection="' + section + '" data-id="' + escapeHtml(record.id) + '" aria-label="Delete record">×</button>';
      const report = section === "students" ? '<button class="row-action" data-action="student-report" data-id="' + escapeHtml(record.id) + '" aria-label="View performance report">↗</button>' : "";
      return "<tr>" + cells + '<td><div class="row-actions">' + report + edit + remove + "</div></td></tr>";
    }).join("");
    const helperText = section === "students" ? data.students.length + " registered students" : records.length + " " + config.singular + (records.length === 1 ? "" : "s");
    content.innerHTML = pageHeading(config.title, section === "students" ? "Manage student enrollment, profiles, and guardians." : section === "teachers" ? "Manage your teaching team and class assignments." : section === "classes" ? "Organize grade levels, class groups, and subjects." : section === "exams" ? "Record and review student assessment results." : "Track tuition, due dates, and payment history.", config.button, "add-" + section) +
      '<section class="panel data-panel"><div class="list-toolbar"><div class="list-count"><strong>' + escapeHtml(helperText) + '</strong><span> · Updated just now</span></div><div class="list-controls"><label class="table-search"><span>⌕</span><input id="table-search" type="search" value="' + escapeHtml(filter) + '" placeholder="Search ' + escapeHtml(config.title.toLowerCase()) + '..." aria-label="Search ' + escapeHtml(config.title) + '"></label>' + filters + '</div></div>' +
      (records.length ? '<div class="table-wrap"><table><thead><tr>' + head + '<th></th></tr></thead><tbody>' + rows + '</tbody></table></div><div class="table-footer"><span>Showing <strong>' + records.length + '</strong> of <strong>' + data[config.collection].length + '</strong> records</span><span class="page-number">1</span></div>' :
        emptyState("No " + config.title.toLowerCase() + " found", filter ? "Try a different search or clear the filters." : "Add your first " + config.singular + " to get started.", config.button, "add-" + section)) +
      '</section>';
  }

  function renderAttendance(data) {
    const classValue = listFilter.field === "className" ? listFilter.value : "all";
    const dateValue = document.getElementById("attendance-date") ? document.getElementById("attendance-date").value : today;
    let rows = data.attendance.filter(function (row) { return !dateValue || row.date === dateValue; });
    if (classValue !== "all") rows = rows.filter(function (row) { return row.className === classValue; });
    rows = dataApi.search(rows, filter, ["studentName", "studentId", "className", "status"]);
    const classes = Array.from(new Set(data.classes.map(function (item) { return item.name; })));
    const present = rows.filter(function (row) { return row.status === "Present"; }).length;
    const absent = rows.filter(function (row) { return row.status === "Absent"; }).length;
    const late = rows.filter(function (row) { return row.status === "Late"; }).length;
    content.innerHTML = pageHeading("Attendance", "Daily registers and class attendance records.", "Mark attendance", "mark-attendance") +
      '<div class="mini-stats"><div><span class="mini-dot dot-green"></span><span>Present</span><strong>' + present + '</strong></div><div><span class="mini-dot dot-red"></span><span>Absent</span><strong>' + absent + '</strong></div><div><span class="mini-dot dot-amber"></span><span>Late</span><strong>' + late + '</strong></div></div>' +
      '<section class="panel data-panel"><div class="list-toolbar"><div class="list-count"><strong>Attendance register</strong><span> · ' + formatDate(dateValue) + '</span></div><div class="list-controls"><label class="table-search"><span>⌕</span><input id="table-search" type="search" value="' + escapeHtml(filter) + '" placeholder="Search students..." aria-label="Search attendance"></label>' +
      '<input id="attendance-date" class="filter-select date-filter" type="date" value="' + escapeHtml(dateValue) + '" aria-label="Filter by date"><select id="attendance-class-filter" class="filter-select" aria-label="Filter by class"><option value="all">All classes</option>' + classes.map(function (name) { return '<option value="' + escapeHtml(name) + '"' + (classValue === name ? " selected" : "") + ">" + escapeHtml(name) + "</option>"; }).join("") + "</select></div></div>" +
      (rows.length ? '<div class="table-wrap"><table><thead><tr><th>Student</th><th>Class</th><th>Date</th><th>Status</th><th></th></tr></thead><tbody>' + rows.map(function (row) {
        return '<tr><td>' + personCell(row.studentName, row.studentId) + '</td><td>' + escapeHtml(row.className) + '</td><td>' + formatDate(row.date) + '</td><td>' + badge(row.status) + '</td><td><button class="row-action" data-action="edit-attendance" data-id="' + escapeHtml(row.id) + '" aria-label="Edit attendance">✎</button></td></tr>';
      }).join("") + '</tbody></table></div>' : emptyState("No attendance records", "Choose another date or mark a class register.", "Mark attendance", "mark-attendance")) + '</section>';
  }

  function renderReports(data) {
    const selectedClass = listFilter.field === "className" ? listFilter.value : "all";
    const selectedStudent = listFilter.field === "studentId" ? listFilter.value : "all";
    let students = dataApi.search(data.students, filter, ["name", "id", "className"]);
    if (selectedClass !== "all") students = students.filter(function (student) { return student.className === selectedClass; });
    if (selectedStudent !== "all") students = students.filter(function (student) { return student.id === selectedStudent; });
    const classes = Array.from(new Set(data.students.map(function (student) { return student.className; }))).sort();
    const rows = students.map(function (student) {
      const performance = dataApi.getStudentPerformance(student.id, data);
      const average = performance.average == null ? "—" : Math.round(performance.average) + "%";
      const attendance = performance.attendanceRate == null ? "—" : Math.round(performance.attendanceRate) + "%";
      const resultCount = performance.results.length;
      return '<tr><td>' + personCell(student.name, student.id) + '</td><td>' + escapeHtml(student.className) + '</td><td><strong class="score">' + average + '</strong><span class="subline">' + resultCount + ' assessment' + (resultCount === 1 ? "" : "s") + '</span></td><td>' + (performance.average == null ? '<span class="muted">No results</span>' : badge(gradeFor(performance.average, 100))) + '</td><td>' + attendance + '</td><td><button class="row-action" data-action="student-report" data-id="' + escapeHtml(student.id) + '" aria-label="View full report">↗</button></td></tr>';
    }).join("");
    const measured = students.map(function (student) { return dataApi.getStudentPerformance(student.id, data).average; }).filter(function (value) { return value != null; });
    const averageScore = measured.length ? Math.round(measured.reduce(function (a, b) { return a + b; }, 0) / measured.length) : 0;
    content.innerHTML = pageHeading("Performance reports", "A clear view of academic progress and attendance.", "Print report", "print-report") +
      '<div class="stats-grid report-stats">' + metricCard("Students in view", students.length, "●", "Matching your selected filters", "indigo", "♙") + metricCard("Average assessment score", averageScore + "%", "↗", "Across recorded examinations", "mint", "▤") + metricCard("Assessments recorded", data.exams.length, "●", "Across all classes and subjects", "amber", "✓") + metricCard("Attendance records", data.attendance.length, "●", "All dates in the register", "rose", "▥") + '</div>' +
      '<section class="panel data-panel"><div class="list-toolbar"><div class="list-count"><strong>Student performance</strong><span> · ' + students.length + ' students</span></div><div class="list-controls"><label class="table-search"><span>⌕</span><input id="table-search" type="search" value="' + escapeHtml(filter) + '" placeholder="Search students..." aria-label="Search reports"></label><select id="report-class-filter" class="filter-select" aria-label="Filter by class"><option value="all">All classes</option>' + classes.map(function (name) { return '<option value="' + escapeHtml(name) + '"' + (selectedClass === name ? " selected" : "") + ">" + escapeHtml(name) + "</option>"; }).join("") + '</select></div></div>' +
      (rows ? '<div class="table-wrap"><table><thead><tr><th>Student</th><th>Class</th><th>Average score</th><th>Grade</th><th>Attendance</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>' : "") + '</section>';
  }

  function emptyState(title, message, button, action) {
    return '<div class="empty-state"><span class="empty-icon">⌕</span><h3>' + escapeHtml(title) + '</h3><p>' + escapeHtml(message) + '</p>' + (button ? '<button class="button button-primary" data-action="' + action + '">' + escapeHtml(button) + '</button>' : "") + '</div>';
  }

  function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value + "T00:00:00");
    return Number.isNaN(date.getTime()) ? escapeHtml(value) : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  function openForm(section, record) {
    const data = getData();
    const config = configs[section];
    if (!config) return;
    const editing = Boolean(record);
    let fields = config.fields;
    if (section === "fees" && !editing) {
      fields = [["studentId", "Student", "student", true], ["term", "Term", "text", true], ["amount", "Amount", "number", true], ["dueDate", "Due date", "date", true]];
    }
    const fieldHtml = fields.map(function (field) {
      const key = field[0], label = field[1], type = field[2], required = field[3];
      let value = record && record[key] != null ? record[key] : "";
      if (!record && key === "joined") value = today;
      if (!record && (key === "date" || key === "dueDate")) value = today;
      if (!record && key === "maxScore") value = "100";
      if (!record && key === "status") value = "Active";
      let control;
      if (type === "select") {
        control = '<select id="field-' + key + '" name="' + key + '" ' + (required ? "required" : "") + '>' + field[4].map(function (option) { return '<option value="' + escapeHtml(option) + '"' + (String(value) === option ? " selected" : "") + ">" + escapeHtml(option) + "</option>"; }).join("") + "</select>";
      } else if (type === "student") {
        control = '<select id="field-' + key + '" name="' + key + '" required><option value="">Select a student</option>' + data.students.map(function (student) {
          return '<option value="' + escapeHtml(student.id) + '"' + (value === student.id ? " selected" : "") + ">" + escapeHtml(student.name + " · " + student.className) + "</option>";
        }).join("") + "</select>";
      } else if (type === "class") {
        const options = Array.from(new Set(data.classes.map(function (item) { return item.name; })));
        control = '<select id="field-' + key + '" name="' + key + '" required><option value="">Select a class</option>' + options.map(function (name) { return '<option value="' + escapeHtml(name) + '"' + (value === name ? " selected" : "") + ">" + escapeHtml(name) + "</option>"; }).join("") + "</select>";
      } else if (type === "teacher") {
        const options = data.teachers.map(function (teacher) { return teacher.name; });
        control = '<select id="field-' + key + '" name="' + key + '" required><option value="">Select a teacher</option>' + options.map(function (name) { return '<option value="' + escapeHtml(name) + '"' + (value === name ? " selected" : "") + ">" + escapeHtml(name) + "</option>"; }).join("") + "</select>";
      } else if (type === "subject") {
        const options = Array.from(new Set(data.teachers.map(function (teacher) { return teacher.subject; }))).concat(["Art", "Physical Education", "Technology"]);
        control = '<select id="field-' + key + '" name="' + key + '" required><option value="">Select a subject</option>' + Array.from(new Set(options)).map(function (name) { return '<option value="' + escapeHtml(name) + '"' + (value === name ? " selected" : "") + ">" + escapeHtml(name) + "</option>"; }).join("") + "</select>";
      } else {
        control = '<input id="field-' + key + '" name="' + key + '" type="' + type + '" value="' + escapeHtml(value) + '"' + (required ? " required" : "") +
          (type === "number" ? ' min="0" step="any"' : "") + (type === "email" ? ' autocomplete="email"' : "") + ">";
      }
      return '<label class="form-field" for="field-' + key + '"><span>' + escapeHtml(label) + (required ? ' <i>*</i>' : "") + "</span>" + control + "</label>";
    }).join("");
    modalRoot.innerHTML = '<div class="modal-backdrop" data-action="close-modal"><section class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-header"><div><span class="eyebrow">' + (editing ? "UPDATE RECORD" : "NEW RECORD") + '</span><h2 id="modal-title">' + (editing ? "Edit " + config.singular : config.button) + '</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">×</button></div><form id="record-form" data-section="' + section + '" data-id="' + escapeHtml(record ? record.id : "") + '"><div class="form-grid">' + fieldHtml + '</div><div class="modal-footer"><span class="required-note"><i>*</i> Required fields</span><div><button type="button" class="button button-light" data-action="close-modal">Cancel</button><button type="submit" class="button button-primary">' + (editing ? "Save changes" : "Save " + config.singular) + '</button></div></div></form></section></div>';
    const first = modalRoot.querySelector("input,select");
    if (first) first.focus();
  }

  function openAttendanceForm(editRecord, classOverride, dateOverride) {
    const data = getData();
    const classNames = Array.from(new Set(data.classes.map(function (item) { return item.name; })));
    const selectedClass = editRecord ? editRecord.className : (classOverride || classNames[0] || "");
    const selectedDate = editRecord ? editRecord.date : (dateOverride || today);
    const students = data.students.filter(function (student) { return student.className === selectedClass; });
    modalRoot.innerHTML = '<div class="modal-backdrop" data-action="close-modal"><section class="modal modal-wide" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-header"><div><span class="eyebrow">DAILY REGISTER</span><h2 id="modal-title">' + (editRecord ? "Update attendance" : "Mark attendance") + '</h2></div><button class="modal-close" data-action="close-modal" aria-label="Close">×</button></div><form id="attendance-form"><div class="form-grid form-grid-two"><label class="form-field"><span>Class <i>*</i></span><select name="className" required>' + classNames.map(function (name) { return '<option value="' + escapeHtml(name) + '"' + (name === selectedClass ? " selected" : "") + ">" + escapeHtml(name) + "</option>"; }).join("") + '</select></label><label class="form-field"><span>Date <i>*</i></span><input type="date" name="date" value="' + escapeHtml(selectedDate) + '" required></label></div><div class="roster-head"><span>Student</span><span>Attendance status</span></div><div class="roster-list">' +
      students.map(function (student) {
        const existing = data.attendance.find(function (row) { return row.studentId === student.id && row.date === selectedDate; });
        const status = existing ? existing.status : "Present";
        return '<div class="roster-row"><span class="roster-person">' + personCell(student.name, student.id) + '</span><select name="status-' + escapeHtml(student.id) + '" aria-label="' + escapeHtml(student.name) + ' attendance"><option' + (status === "Present" ? " selected" : "") + '>Present</option><option' + (status === "Absent" ? " selected" : "") + '>Absent</option><option' + (status === "Late" ? " selected" : "") + '>Late</option></select></div>';
      }).join("") + (students.length ? "" : '<p class="roster-empty">No students are enrolled in this class yet.</p>') + '</div><div class="modal-footer"><span class="required-note">Changes are saved on this device.</span><div><button type="button" class="button button-light" data-action="close-modal">Cancel</button><button type="submit" class="button button-primary">' + (editRecord ? "Save changes" : "Save attendance") + '</button></div></div></form></section></div>';
  }

  function openStudentReport(studentId) {
    const data = getData();
    const student = data.students.find(function (item) { return item.id === studentId; });
    if (!student) return;
    const performance = dataApi.getStudentPerformance(studentId, data);
    const average = performance.average == null ? "—" : Math.round(performance.average) + "%";
    const attendance = performance.attendanceRate == null ? "—" : Math.round(performance.attendanceRate) + "%";
    const exams = performance.results.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    modalRoot.innerHTML = '<div class="modal-backdrop" data-action="close-modal"><section class="modal modal-report" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-header"><div><span class="eyebrow">STUDENT REPORT</span><h2 id="modal-title">' + escapeHtml(student.name) + '</h2><p class="modal-subtitle">' + escapeHtml(student.id + " · " + student.className) + '</p></div><button class="modal-close" data-action="close-modal" aria-label="Close">×</button></div><div class="report-summary"><div><span>Average score</span><strong>' + average + '</strong></div><div><span>Attendance rate</span><strong>' + attendance + '</strong></div><div><span>Assessments</span><strong>' + performance.results.length + '</strong></div></div><h3 class="report-section-title">Assessment history</h3>' +
      (exams.length ? '<div class="table-wrap"><table><thead><tr><th>Assessment</th><th>Subject</th><th>Date</th><th>Score</th></tr></thead><tbody>' + exams.map(function (exam) { return '<tr><td>' + escapeHtml(exam.examName) + '</td><td>' + escapeHtml(exam.subject) + '</td><td>' + formatDate(exam.date) + '</td><td><strong>' + escapeHtml(exam.score) + ' / ' + escapeHtml(exam.maxScore) + '</strong></td></tr>'; }).join("") + '</tbody></table></div>' : '<div class="report-empty">No examination results recorded for this student yet.</div>') +
      '<div class="modal-footer"><span></span><button class="button button-light" data-action="close-modal">Close</button></div></section></div>';
  }

  function handleAction(action, target) {
    const data = getData();
    if (action === "close-modal") {
      modalRoot.innerHTML = "";
      return;
    }
    if (action === "add-student") return openForm("students");
    if (action === "add-teachers") return openForm("teachers");
    if (action === "add-classes") return openForm("classes");
    if (action === "add-exams") return openForm("exams");
    if (action === "add-fees") return openForm("fees");
    if (action === "mark-attendance") return openAttendanceForm();
    if (action === "record-result") return openForm("exams");
    if (action === "record-payment") {
      const due = data.fees.filter(function (fee) { return fee.status !== "Paid"; });
      if (!due.length) return toast("There are no unpaid fee records. Add a fee record first.", "error");
      return openForm("fees", Object.assign({}, due[0], { status: "Paid", method: "Card", paidDate: today }));
    }
    if (action === "edit-record") {
      const record = data[target.dataset.collection].find(function (item) { return item.id === target.dataset.id; });
      return openForm(target.dataset.collection, record);
    }
    if (action === "delete-record") {
      const config = configs[target.dataset.collection];
      const record = data[config.collection].find(function (item) { return item.id === target.dataset.id; });
      const deleteMessage = target.dataset.collection === "students"
        ? "Delete this student and their attendance, examination results, and fee records? This cannot be undone."
        : "Delete this " + config.singular + " record? This cannot be undone.";
      if (!record || !window.confirm(deleteMessage)) return;
      try {
        store.remove(config.collection, target.dataset.id);
        toast("Record deleted.");
        render();
      } catch (error) { toast(error.message, "error"); }
      return;
    }
    if (action === "edit-attendance") {
      const record = data.attendance.find(function (item) { return item.id === target.dataset.id; });
      return openAttendanceForm(record);
    }
    if (action === "student-report") return openStudentReport(target.dataset.id);
    if (action === "print-report") return window.print();
  }

  function handleRecordSubmit(form) {
    const section = form.dataset.section;
    const config = configs[section];
    const formData = new FormData(form);
    const record = {};
    config.fields.forEach(function (field) {
      const key = field[0];
      if (formData.has(key)) record[key] = formData.get(key).trim();
    });
    if (section === "students" && !form.dataset.id) {
      record.id = dataApi.makeId("STU", getData().students);
    } else if (section === "teachers" && !form.dataset.id) {
      record.id = dataApi.makeId("TCH", getData().teachers);
    } else if (section === "classes" && !form.dataset.id) {
      record.id = dataApi.makeId("CLS", getData().classes);
    } else if (section === "exams" && !form.dataset.id) {
      record.id = dataApi.makeId("EXM", getData().exams);
    } else if (section === "fees" && !form.dataset.id) {
      record.id = dataApi.makeId("FEE", getData().fees);
    }
    if (section === "exams" || section === "fees") {
      const student = getData().students.find(function (item) { return item.id === record.studentId; });
      if (student) {
        record.studentName = student.name;
        record.className = student.className;
      }
    }
    if (section === "fees") {
      record.status = record.status || "Pending";
      record.method = record.method || "—";
      if (record.status === "Paid") record.paidDate = record.paidDate || today;
      else record.paidDate = "";
    }
    try {
      if (form.dataset.id) store.update(config.collection, form.dataset.id, record);
      else store.add(config.collection, record);
      modalRoot.innerHTML = "";
      toast(config.singular.charAt(0).toUpperCase() + config.singular.slice(1) + (form.dataset.id ? " updated." : " saved."));
      render();
    } catch (error) { toast(error.message, "error"); }
  }

  function handleAttendanceSubmit(form) {
    const formData = new FormData(form);
    const className = formData.get("className");
    const date = formData.get("date");
    const data = getData();
    const students = data.students.filter(function (student) { return student.className === className; });
    try {
      const entries = students.map(function (student) {
          return { studentId: student.id, status: formData.get("status-" + student.id) };
      });
      const savedCount = store.saveAttendance(className, date, entries);
      modalRoot.innerHTML = "";
      toast("Attendance saved for " + savedCount + " students.");
      render();
    } catch (error) { toast(error.message, "error"); }
  }

  document.addEventListener("click", function (event) {
    const nav = event.target.closest("[data-page]");
    if (nav) {
      event.preventDefault();
      setPage(nav.dataset.page);
      return;
    }
    const actionTarget = event.target.closest("[data-action]");
    if (actionTarget) {
      if (actionTarget.dataset.action === "close-modal" && actionTarget.classList.contains("modal-backdrop") && event.target !== actionTarget) return;
      handleAction(actionTarget.dataset.action, actionTarget);
    }
  });

  document.addEventListener("submit", function (event) {
    if (event.target.id === "record-form") {
      event.preventDefault();
      handleRecordSubmit(event.target);
    } else if (event.target.id === "attendance-form") {
      event.preventDefault();
      handleAttendanceSubmit(event.target);
    }
  });

  document.addEventListener("input", function (event) {
    if (event.target.id === "table-search") {
      filter = event.target.value;
      const cursor = event.target.selectionStart;
      render();
      const replacement = document.getElementById("table-search");
      replacement.focus();
      replacement.setSelectionRange(cursor, cursor);
    } else if (event.target.id === "global-search") {
      const query = event.target.value;
      if (page === "dashboard") setPage("students");
      filter = query;
      render();
    }
  });

  document.addEventListener("change", function (event) {
    if (event.target.matches("[data-filter-field]")) {
      listFilter = event.target.value === "all" ? "all" : { field: event.target.dataset.filterField, value: event.target.value };
      render();
    } else if (event.target.id === "attendance-class-filter") {
      listFilter = event.target.value === "all" ? "all" : { field: "className", value: event.target.value };
      render();
    } else if (event.target.id === "attendance-date") {
      render();
    } else if (event.target.id === "report-class-filter") {
      listFilter = event.target.value === "all" ? "all" : { field: "className", value: event.target.value };
      render();
    } else if (event.target.closest("#attendance-form") && (event.target.name === "className" || event.target.name === "date")) {
      const form = event.target.form;
      openAttendanceForm(null, form.elements.className.value, form.elements.date.value);
    }
  });

  document.getElementById("menu-toggle").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("sidebar-open");
  });
  document.addEventListener("keydown", function (event) {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      document.getElementById("global-search").focus();
    } else if (event.key === "Escape" && modalRoot.firstChild) {
      modalRoot.innerHTML = "";
    }
  });

  render();
})();
