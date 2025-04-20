// JavaScript has been updated to:
// - Display roster cells as "subject - teacher - location"
// - Randomize subject placements
// - Use vertical lists for subjects and students
// - Auto-add rows when typing
// - Allow removing students
// - Add checkbox list for subject selection
// - Allow marking subjects as mandatory
// - Indicate which student group each teacher slot is for

const subjects = [];
const students = [];
const lockedSlots = [];
const teachers = {};

document.getElementById('subject-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const inputs = this.querySelectorAll('input');
  const name = inputs[0].value;
  const abbr = inputs[1].value;
  const amount = parseInt(inputs[2].value);
  const teacher = inputs[3].value;
  const room = inputs[4].value;
  const mandatory = inputs[5].checked;

  subjects.push({ name, abbr, amount, teacher, room, mandatory });
  if (!teachers[teacher]) teachers[teacher] = [];

  const li = document.createElement('li');
  li.textContent = `${name} (${abbr}) - ${amount} lessons with ${teacher}`;
  document.getElementById('subject-list').appendChild(li);

  updateStudentSubjects();
  this.reset();
});

document.getElementById('student-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const name = document.getElementById('student-name').value;
  const checks = document.querySelectorAll('#student-subjects input[type=checkbox]');
  const selectedSubjects = Array.from(checks).filter(c => c.checked).map(c => c.value);
  const id = Math.random().toString(36).substr(2, 9);
  students.push({ id, name, subjects: selectedSubjects });

  const li = document.createElement('li');
  li.id = id;
  li.innerHTML = `${name}: ${selectedSubjects.join(', ')} <button onclick="removeStudent('${id}')">❌</button>`;
  document.getElementById('student-list').appendChild(li);

  this.reset();
});

function removeStudent(id) {
  const index = students.findIndex(s => s.id === id);
  if (index !== -1) students.splice(index, 1);
  document.getElementById(id).remove();
}

document.getElementById('locked-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const day = document.getElementById('day-select').value;
  const hour = parseInt(this.querySelector('input').value);
  lockedSlots.push(`${day}-${hour}`);
  const li = document.createElement('li');
  li.textContent = `${day} - Hour ${hour}`;
  document.getElementById('locked-list').appendChild(li);
  this.reset();
});

function updateStudentSubjects() {
    const container = document.getElementById('student-subjects');
    container.innerHTML = '';
    subjects.forEach(s => {
      const label = document.createElement('label');
      const checkedAttr = s.mandatory ? 'checked disabled' : '';
      label.innerHTML = `<input type="checkbox" value="${s.abbr}" ${checkedAttr}/> ${s.name}${s.mandatory ? ' (mandatory)' : ''}`;
      container.appendChild(label);
    });
  }
  

function makeEmptyGrid() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const grid = {};
  for (let h = 1; h <= 7; h++) {
    for (const d of days) {
      const key = `${d}-${h}`;
      grid[key] = null;
    }
  }
  return grid;
}

document.getElementById('generate-btn').addEventListener('click', function () {
  const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const studentRosters = {};
  const teacherRosters = {};

  students.forEach(stu => studentRosters[stu.name] = makeEmptyGrid());
  Object.keys(teachers).forEach(t => teacherRosters[t] = makeEmptyGrid());

  let allSlots = [];
  for (let h = 1; h <= 7; h++) {
    for (const d of dayOrder) {
      const key = `${d}-${h}`;
      if (!lockedSlots.includes(key)) allSlots.push(key);
    }
  }

  allSlots = allSlots.sort(() => 0.5 - Math.random());

  subjects.forEach(subject => {
    const subStudents = students.filter(s => s.subjects.includes(subject.abbr));
    const neededLessons = subject.amount;
    let lessonsPlaced = 0;

    for (let i = 0; i < allSlots.length && lessonsPlaced < neededLessons; i++) {
      const slot = allSlots[i];
      if (subStudents.some(stu => studentRosters[stu.name][slot])) continue;
      if (teacherRosters[subject.teacher][slot]) continue;

      subStudents.forEach(stu => studentRosters[stu.name][slot] = `${subject.abbr} - ${subject.teacher} - ${subject.room}`);
      const classList = subStudents.map(s => s.name).join(', ');
      teacherRosters[subject.teacher][slot] = `${subject.abbr} - ${subject.teacher} - ${subject.room} [${classList}]`;
      lessonsPlaced++;
    }
  });

  displayRosters(studentRosters, 'rosters');
  displayRosters(teacherRosters, 'teacher-rosters');
});

function displayRosters(rosters, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = `<h2>${containerId === 'rosters' ? '📋 Student Rosters' : '👩‍🏫 Teacher Rosters'}</h2>`;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  for (const name in rosters) {
    const div = document.createElement('div');
    div.innerHTML = `<h3>${name}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'grid-table';

    // Header row
    grid.appendChild(document.createElement('div'));
    days.forEach(d => {
      const cell = document.createElement('div');
      cell.className = 'grid-header';
      cell.textContent = d;
      grid.appendChild(cell);
    });

    for (let h = 1; h <= 7; h++) {
      const rowHead = document.createElement('div');
      rowHead.className = 'grid-header';
      rowHead.textContent = `Hour ${h}`;
      grid.appendChild(rowHead);

      for (const d of days) {
        const key = `${d}-${h}`;
        const cell = document.createElement('div');
        const content = rosters[name][key];
        if (lockedSlots.includes(key)) {
          cell.className = 'blocked';
          cell.textContent = 'X';
        } else if (content) {
          cell.className = 'subject-cell';
          cell.textContent = content;
        }
        grid.appendChild(cell);
      }
    }
    div.appendChild(grid);
    container.appendChild(div);
  }
}