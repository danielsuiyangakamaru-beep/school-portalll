(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.SchoolData = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const STORAGE_KEY = "northstar-school-data-v1";
  const COLLECTIONS = ["students", "teachers", "classes", "attendance", "exams", "fees"];

  function makeInitialData() {
    return {
      students: [
        { id: "STU-2401", name: "Amara Johnson", className: "Grade 10 · A", gender: "Female", dob: "2010-03-14", guardian: "Olivia Johnson", phone: "(555) 201-4401", email: "olivia.j@example.com", address: "18 Cedar Lane", joined: "2024-08-26", status: "Active" },
        { id: "STU-2402", name: "Ethan Williams", className: "Grade 9 · B", gender: "Male", dob: "2011-07-22", guardian: "Marcus Williams", phone: "(555) 201-4402", email: "marcus.w@example.com", address: "42 Lakeview Dr", joined: "2024-08-26", status: "Active" },
        { id: "STU-2403", name: "Sophia Chen", className: "Grade 11 · A", gender: "Female", dob: "2009-11-02", guardian: "Lily Chen", phone: "(555) 201-4403", email: "lily.chen@example.com", address: "7 Willow Street", joined: "2023-08-28", status: "Active" },
        { id: "STU-2404", name: "Noah Patel", className: "Grade 10 · B", gender: "Male", dob: "2010-01-18", guardian: "Ravi Patel", phone: "(555) 201-4404", email: "ravi.p@example.com", address: "93 Oak Avenue", joined: "2024-08-26", status: "Active" },
        { id: "STU-2405", name: "Isabella Garcia", className: "Grade 12 · A", gender: "Female", dob: "2008-05-30", guardian: "Elena Garcia", phone: "(555) 201-4405", email: "elena.g@example.com", address: "11 Meadow Court", joined: "2022-08-29", status: "Active" },
        { id: "STU-2406", name: "Lucas Brown", className: "Grade 9 · A", gender: "Male", dob: "2011-09-11", guardian: "James Brown", phone: "(555) 201-4406", email: "james.b@example.com", address: "26 Birch Road", joined: "2024-08-26", status: "Active" },
        { id: "STU-2407", name: "Mia Thompson", className: "Grade 11 · B", gender: "Female", dob: "2009-02-08", guardian: "Ava Thompson", phone: "(555) 201-4407", email: "ava.t@example.com", address: "5 Parkside Blvd", joined: "2023-08-28", status: "Active" },
        { id: "STU-2408", name: "James Wilson", className: "Grade 10 · A", gender: "Male", dob: "2010-08-27", guardian: "Grace Wilson", phone: "(555) 201-4408", email: "grace.w@example.com", address: "62 Pine Street", joined: "2024-08-26", status: "Active" }
      ],
      teachers: [
        { id: "TCH-101", name: "Dr. Eleanor Reed", subject: "Mathematics", email: "e.reed@northstar.edu", phone: "(555) 310-1001", classes: "Grade 10 · A, Grade 11 · A", status: "Active" },
        { id: "TCH-102", name: "Daniel Kim", subject: "Science", email: "d.kim@northstar.edu", phone: "(555) 310-1002", classes: "Grade 9 · A, Grade 9 · B", status: "Active" },
        { id: "TCH-103", name: "Priya Sharma", subject: "English", email: "p.sharma@northstar.edu", phone: "(555) 310-1003", classes: "Grade 10 · B, Grade 11 · B", status: "Active" },
        { id: "TCH-104", name: "Oliver Martin", subject: "History", email: "o.martin@northstar.edu", phone: "(555) 310-1004", classes: "Grade 12 · A", status: "Active" }
      ],
      classes: [
        { id: "CLS-01", name: "Grade 9 · A", grade: "Grade 9", section: "A", room: "Room 201", teacher: "Daniel Kim", subjects: "Mathematics, Science, English, History", students: 24 },
        { id: "CLS-02", name: "Grade 9 · B", grade: "Grade 9", section: "B", room: "Room 202", teacher: "Daniel Kim", subjects: "Mathematics, Science, English, History", students: 22 },
        { id: "CLS-03", name: "Grade 10 · A", grade: "Grade 10", section: "A", room: "Room 301", teacher: "Dr. Eleanor Reed", subjects: "Mathematics, Science, English, History", students: 26 },
        { id: "CLS-04", name: "Grade 10 · B", grade: "Grade 10", section: "B", room: "Room 302", teacher: "Priya Sharma", subjects: "Mathematics, Science, English, History", students: 23 },
        { id: "CLS-05", name: "Grade 11 · A", grade: "Grade 11", section: "A", room: "Room 401", teacher: "Dr. Eleanor Reed", subjects: "Mathematics, Science, English, History", students: 21 },
        { id: "CLS-06", name: "Grade 11 · B", grade: "Grade 11", section: "B", room: "Room 402", teacher: "Priya Sharma", subjects: "Mathematics, Science, English, History", students: 20 },
        { id: "CLS-07", name: "Grade 12 · A", grade: "Grade 12", section: "A", room: "Room 501", teacher: "Oliver Martin", subjects: "Mathematics, Science, English, History", students: 19 }
      ],
      attendance: [
        { id: "ATT-101", studentId: "STU-2401", studentName: "Amara Johnson", className: "Grade 10 · A", date: "2026-11-20", status: "Present" },
        { id: "ATT-102", studentId: "STU-2402", studentName: "Ethan Williams", className: "Grade 9 · B", date: "2026-11-20", status: "Present" },
        { id: "ATT-103", studentId: "STU-2403", studentName: "Sophia Chen", className: "Grade 11 · A", date: "2026-11-20", status: "Late" },
        { id: "ATT-104", studentId: "STU-2404", studentName: "Noah Patel", className: "Grade 10 · B", date: "2026-11-20", status: "Absent" },
        { id: "ATT-105", studentId: "STU-2405", studentName: "Isabella Garcia", className: "Grade 12 · A", date: "2026-11-20", status: "Present" },
        { id: "ATT-106", studentId: "STU-2406", studentName: "Lucas Brown", className: "Grade 9 · A", date: "2026-11-20", status: "Present" },
        { id: "ATT-107", studentId: "STU-2407", studentName: "Mia Thompson", className: "Grade 11 · B", date: "2026-11-20", status: "Present" },
        { id: "ATT-108", studentId: "STU-2408", studentName: "James Wilson", className: "Grade 10 · A", date: "2026-11-20", status: "Present" },
        { id: "ATT-109", studentId: "STU-2401", studentName: "Amara Johnson", className: "Grade 10 · A", date: "2026-11-19", status: "Present" },
        { id: "ATT-110", studentId: "STU-2402", studentName: "Ethan Williams", className: "Grade 9 · B", date: "2026-11-19", status: "Absent" }
      ],
      exams: [
        { id: "EXM-301", studentId: "STU-2401", studentName: "Amara Johnson", className: "Grade 10 · A", subject: "Mathematics", examName: "Midterm Assessment", date: "2026-11-12", score: 92, maxScore: 100 },
        { id: "EXM-302", studentId: "STU-2402", studentName: "Ethan Williams", className: "Grade 9 · B", subject: "Science", examName: "Midterm Assessment", date: "2026-11-12", score: 78, maxScore: 100 },
        { id: "EXM-303", studentId: "STU-2403", studentName: "Sophia Chen", className: "Grade 11 · A", subject: "English", examName: "Midterm Assessment", date: "2026-11-11", score: 96, maxScore: 100 },
        { id: "EXM-304", studentId: "STU-2404", studentName: "Noah Patel", className: "Grade 10 · B", subject: "Mathematics", examName: "Midterm Assessment", date: "2026-11-11", score: 71, maxScore: 100 },
        { id: "EXM-305", studentId: "STU-2405", studentName: "Isabella Garcia", className: "Grade 12 · A", subject: "History", examName: "Midterm Assessment", date: "2026-11-10", score: 88, maxScore: 100 },
        { id: "EXM-306", studentId: "STU-2406", studentName: "Lucas Brown", className: "Grade 9 · A", subject: "Science", examName: "Midterm Assessment", date: "2026-11-10", score: 84, maxScore: 100 }
      ],
      fees: [
        { id: "FEE-501", studentId: "STU-2401", studentName: "Amara Johnson", className: "Grade 10 · A", amount: 1250, dueDate: "2026-11-01", paidDate: "2026-10-28", status: "Paid", method: "Card", term: "Autumn 2026" },
        { id: "FEE-502", studentId: "STU-2402", studentName: "Ethan Williams", className: "Grade 9 · B", amount: 1250, dueDate: "2026-11-01", paidDate: "", status: "Pending", method: "—", term: "Autumn 2026" },
        { id: "FEE-503", studentId: "STU-2403", studentName: "Sophia Chen", className: "Grade 11 · A", amount: 1450, dueDate: "2026-11-01", paidDate: "2026-11-03", status: "Paid", method: "Bank transfer", term: "Autumn 2026" },
        { id: "FEE-504", studentId: "STU-2404", studentName: "Noah Patel", className: "Grade 10 · B", amount: 1250, dueDate: "2026-11-01", paidDate: "", status: "Overdue", method: "—", term: "Autumn 2026" },
        { id: "FEE-505", studentId: "STU-2405", studentName: "Isabella Garcia", className: "Grade 12 · A", amount: 1600, dueDate: "2026-11-01", paidDate: "2026-10-25", status: "Paid", method: "Cash", term: "Autumn 2026" },
        { id: "FEE-506", studentId: "STU-2406", studentName: "Lucas Brown", className: "Grade 9 · A", amount: 1250, dueDate: "2026-11-01", paidDate: "", status: "Pending", method: "—", term: "Autumn 2026" }
      ]
    };
  }

  function normalizeData(value) {
    if (!value || typeof value !== "object") return makeInitialData();
    const data = {};
    COLLECTIONS.forEach(function (name) {
      data[name] = Array.isArray(value[name]) ? value[name] : [];
    });
    return data;
  }

  function createStore(storage) {
    if (!storage || typeof storage.getItem !== "function" || typeof storage.setItem !== "function") {
      throw new TypeError("A localStorage-compatible storage object is required.");
    }

    function read() {
      const saved = storage.getItem(STORAGE_KEY);
      if (!saved) {
        const initial = makeInitialData();
        write(initial);
        return initial;
      }
      try {
        return normalizeData(JSON.parse(saved));
      } catch (error) {
        throw new Error("Saved school data could not be read: " + error.message);
      }
    }

    function write(data) {
      storage.setItem(STORAGE_KEY, JSON.stringify(normalizeData(data)));
    }

    return {
      getAll: read,
      add: function (collection, record) {
        if (COLLECTIONS.indexOf(collection) === -1) throw new TypeError("Unknown collection: " + collection);
        const data = read();
        if (!record || !record.id) throw new TypeError("Records must have an id.");
        if (data[collection].some(function (item) { return item.id === record.id; })) {
          throw new Error("A record with this ID already exists.");
        }
        data[collection].unshift(record);
        write(data);
        return record;
      },
      update: function (collection, id, updates) {
        if (COLLECTIONS.indexOf(collection) === -1) throw new TypeError("Unknown collection: " + collection);
        const data = read();
        const index = data[collection].findIndex(function (item) { return item.id === id; });
        if (index === -1) throw new Error("Record not found.");
        data[collection][index] = Object.assign({}, data[collection][index], updates, { id: id });
        write(data);
        return data[collection][index];
      },
      remove: function (collection, id) {
        if (COLLECTIONS.indexOf(collection) === -1) throw new TypeError("Unknown collection: " + collection);
        const data = read();
        const filtered = data[collection].filter(function (item) { return item.id !== id; });
        if (filtered.length === data[collection].length) throw new Error("Record not found.");
        data[collection] = filtered;
        if (collection === "students") {
          ["attendance", "exams", "fees"].forEach(function (relatedCollection) {
            data[relatedCollection] = data[relatedCollection].filter(function (item) { return item.studentId !== id; });
          });
        }
        write(data);
      },
      saveAttendance: function (className, date, entries) {
        if (!className || !date || !Array.isArray(entries)) throw new TypeError("A class, date, and attendance entries are required.");
        const data = read();
        const roster = data.students.filter(function (student) { return student.className === className; });
        if (!roster.length) throw new Error("There are no students enrolled in this class.");
        const allowedStatuses = ["Present", "Absent", "Late"];
        roster.forEach(function (student) {
          const entry = entries.find(function (item) { return item.studentId === student.id; });
          if (!entry || allowedStatuses.indexOf(entry.status) === -1) {
            throw new TypeError("A valid attendance status is required for " + student.name + ".");
          }
        });
        roster.forEach(function (student) {
          const submitted = entries.find(function (item) { return item.studentId === student.id; });
          const existing = data.attendance.find(function (item) { return item.studentId === student.id && item.date === date; });
          const record = {
            studentId: student.id,
            studentName: student.name,
            className: className,
            date: date,
            status: submitted.status
          };
          if (existing) {
            Object.assign(existing, record);
          } else {
            record.id = makeId("ATT", data.attendance);
            data.attendance.unshift(record);
          }
        });
        write(data);
        return roster.length;
      },
      replaceAll: function (data) {
        write(data);
      }
    };
  }

  function search(records, query, fields) {
    const term = String(query || "").trim().toLowerCase();
    if (!term) return records.slice();
    return records.filter(function (record) {
      return fields.some(function (field) {
        return String(record[field] == null ? "" : record[field]).toLowerCase().indexOf(term) !== -1;
      });
    });
  }

  function getStudentPerformance(studentId, data) {
    const results = data.exams.filter(function (exam) { return exam.studentId === studentId; });
    const average = results.length
      ? results.reduce(function (sum, exam) { return sum + (Number(exam.score) / Number(exam.maxScore || 100)) * 100; }, 0) / results.length
      : null;
    const records = data.attendance.filter(function (entry) { return entry.studentId === studentId; });
    const attendanceRate = records.length
      ? records.filter(function (entry) { return entry.status !== "Absent"; }).length / records.length * 100
      : null;
    return { results: results, average: average, attendanceRate: attendanceRate };
  }

  function makeId(prefix, records) {
    const highest = records.reduce(function (max, record) {
      const match = String(record.id || "").match(/(\d+)$/);
      return match ? Math.max(max, Number(match[1])) : max;
    }, 0);
    return prefix + "-" + String(highest + 1).padStart(4, "0");
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    COLLECTIONS: COLLECTIONS.slice(),
    makeInitialData: makeInitialData,
    createStore: createStore,
    search: search,
    getStudentPerformance: getStudentPerformance,
    makeId: makeId
  };
});
