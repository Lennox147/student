async function checkAuth() {
  const r = await fetch("/api/admin/me");
  if (!r.ok) location.href = "/admin";
}

async function loadCourses() {
  const r = await fetch("/api/admin/courses");
  if (!r.ok) return;
  const courses = await r.json();
  const select = document.getElementById("course");
  for (const course of courses) {
    const option = document.createElement("option");
    option.value = course;
    option.textContent = course;
    select.appendChild(option);
  }
}

async function loadStudents() {
  const q = encodeURIComponent(document.getElementById("search").value);
  const course = encodeURIComponent(document.getElementById("course").value);
  const r = await fetch(`/api/admin/students?q=${q}&course=${course}`);

  if (!r.ok) {
    location.href = "/admin";
    return;
  }

  const students = await r.json();
  const rows = document.getElementById("rows");
  rows.textContent = "";

  for (const s of students) {
    const tr = document.createElement("tr");
    const values = [
      `${s.first_name} ${s.middle_name || ""} ${s.last_name}`.replace(/\s+/g, " ").trim(),
      s.admission_number, s.date_of_birth, s.gender, s.email, s.phone,
      s.course, s.year_of_admission, s.institution, s.county, s.created_at
    ];

    for (const value of values) {
      const td = document.createElement("td");
      td.textContent = value ?? "";
      tr.appendChild(td);
    }
    rows.appendChild(tr);
  }
}

document.getElementById("refresh").addEventListener("click", loadStudents);
document.getElementById("search").addEventListener("input", loadStudents);
document.getElementById("course").addEventListener("change", loadStudents);

document.getElementById("export").addEventListener("click", () => {
  window.location.href = "/api/admin/export.csv";
});

document.getElementById("logout").addEventListener("click", async () => {
  await fetch("/api/admin/logout", { method: "POST" });
  location.href = "/admin";
});

(async () => {
  await checkAuth();
  await loadCourses();
  await loadStudents();
})();