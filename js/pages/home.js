/** רשימת מפתחי הפרויקט לדף הראשי – עדכן ת.ז לפני הגשה */
const teamMembers = [
  {
    name: 'אילייא רינאוי',
    idNumber: '—',
    github: 'https://github.com/Mohammad-Safadi/exam-system-client',
    deploy: 'https://mohammad-safadi.github.io/exam-system-client/',
  },
];

const list = document.getElementById('teamList');
list.innerHTML = teamMembers
  .map(
    (member) => `
      <li>
        <strong>${member.name}</strong><br>
        ת.ז: ${member.idNumber}<br>
        GitHub: <a href="${member.github}" target="_blank" rel="noopener">${member.github}</a><br>
        Deploy: <a href="${member.deploy}" target="_blank" rel="noopener">${member.deploy}</a>
      </li>
    `,
  )
  .join('');
