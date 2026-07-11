const teamMembers = [
  {
    name: 'אילייא רינאוי',
    idNumber: '—',
    github: 'https://github.com/Mohammad-Safadi/exam-system-client',
  },
];

const list = document.getElementById('teamList');
list.innerHTML = teamMembers
  .map(
    (member) => `
      <li>
        <strong>${member.name}</strong><br>
        ת.ז: ${member.idNumber}<br>
        GitHub: <a href="${member.github}" target="_blank" rel="noopener">${member.github}</a>
      </li>
    `,
  )
  .join('');
