const monthBackgrounds = [
    "url('january.jpg')", "url('february.jpg')", "url('march.jpg')",
    "url('april.jpg')", "url('may.jpg')", "url('june.jpg')",
    "url('july.jpg')", "url('august.jpg')", "url('september.jpg')",
    "url('october.jpg')", "url('november.jpg')", "url('december.jpg')"
  ];
  
  const monthOrder = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const savingsData = JSON.parse(localStorage.getItem('savingsData')) || {};
  const calendar = document.getElementById('calendar');
  const expenseModal = document.getElementById('expenseModal');
  const closeModal = document.querySelector('.close-btn');
  const expenseForm = document.getElementById('expenseForm');
  const expenseDateInput = document.getElementById('expenseDate');
  const amountInput = document.getElementById('amount');
  const savingsTable = document.getElementById('savingsTable').querySelector('tbody');
  const popupMessage = document.getElementById('popupMessage');
  
  function generateCalendar() {
    const today = new Date();
    const year = today.getFullYear();
  
    monthBackgrounds.forEach((bg, index) => {
      const monthDiv = document.createElement('div');
      monthDiv.classList.add('month');
      monthDiv.style.backgroundImage = bg;
  
      const header = document.createElement('div');
      header.classList.add('month-header');
      header.textContent = new Date(year, index).toLocaleString('default', { month: 'long' });
      monthDiv.appendChild(header);
  
      const daysInMonth = new Date(year, index + 1, 0).getDate();
  
      for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('day');
        dayDiv.textContent = day;
        dayDiv.addEventListener('click', () => {
          expenseDateInput.value = `${day} ${header.textContent} ${year}`;
          expenseModal.style.display = 'flex';
        });
        monthDiv.appendChild(dayDiv);
      }
  
      calendar.appendChild(monthDiv);
    });
  }
  
  function updateSavingsTable() {
    savingsTable.innerHTML = '';
  
    monthOrder.forEach(month => {
      const monthlyEntries = Object.keys(savingsData)
        .filter(date => date.includes(month))
        .sort((a, b) => new Date(a) - new Date(b));
  
      if (monthlyEntries.length > 0) {
        const monthRow = document.createElement('tr');
        monthRow.classList.add('month-section');
        monthRow.innerHTML = `<td colspan="3">${month}</td>`;
        savingsTable.appendChild(monthRow);
  
        monthlyEntries.forEach(date => {
          savingsData[date].forEach(entry => {
            const time = new Date().toLocaleTimeString();
            const row = document.createElement('tr');
            row.innerHTML = `
              <td>${entry.date}</td>
              <td>${time}</td>
              <td>₹${entry.amount}</td>
            `;
            savingsTable.appendChild(row);
          });
        });
      }
    });
  }
  
  expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = expenseDateInput.value;
    const amount = parseFloat(amountInput.value);
  
    if (!savingsData[date]) savingsData[date] = [];
    savingsData[date].push({ date, amount });
  
    localStorage.setItem('savingsData', JSON.stringify(savingsData));
    updateSavingsTable();
    expenseModal.style.display = 'none';
    amountInput.value = '';
  
    popupMessage.style.display = 'block';
    setTimeout(() => {
      popupMessage.style.display = 'none';
    }, 3000);
  });
  
  closeModal.addEventListener('click', () => {
    expenseModal.style.display = 'none';
  });
  
  window.addEventListener('click', (e) => {
    if (e.target === expenseModal) {
      expenseModal.style.display = 'none';
    }
  });
  
  generateCalendar();
  updateSavingsTable();
  