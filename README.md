# Northstar Academy

A responsive school management dashboard built with plain HTML, CSS, and JavaScript. No build step or external packages are required.

## Run

Open `index.html` in a modern browser. The app creates sample school records on first launch and stores changes in that browser's local storage.

## Features

- Student enrollment, teacher directory, and class/subject management
- Daily attendance registers with class and date filters
- Examination results, fee/payment tracking, and student performance summaries
- Search, record editing/deletion, responsive navigation, and printable reports
- Local-only persistence; deleting a student also deletes their linked attendance, examination, and fee records

## Tests

Open `tests/index.html` in a browser to run the data-layer tests, or run `node tests/school.test.js` in an environment with Node.js.
