
const foodForm = document.querySelector('#foodForm');
const foodName = document.querySelector('#foodName');
const calPerServing = document.querySelector('#calPerServing');
const servings = document.querySelector('#servings');
const instantResult = document.querySelector('#instantResult');
const foodList = document.querySelector('#foodList');
const clearBtn = document.querySelector('#clearBtn');
const exportBtn = document.querySelector('#exportBtn');
const resetBtn = document.querySelector('#resetBtn');
const totalCaloriesEl = document.querySelector('#totalCalories');


let items = JSON.parse(localStorage.getItem('calorie_items') || '[]');



function calcInstant() {
  const cal = Number(calPerServing.value);
  const sv = Number(servings.value);

  if (!isNaN(cal) && !isNaN(sv) && cal >= 0 && sv > 0) {
    const t = Math.round(cal * sv * 10) / 10;
    instantResult.textContent = t + ' kcal';
  } else {
    instantResult.textContent = ' kcal';
  }
}

calPerServing.addEventListener('input', calcInstant);
servings.addEventListener('input', calcInstant);



function renderList() {
  foodList.innerHTML = '';
  let total = 0;

  items.forEach((it, idx) => {
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';

    li.innerHTML = `
      <div>
        <div class="fw-semibold">${it.name}</div>
        <small class="text-muted">${it.servings} 份 × ${it.calPerServing} kcal/份</small>
      </div>
      <div class="text-end">
        <span class="badge bg-secondary rounded-pill me-2">${it.total} kcal</span>
        <button class="btn btn-sm btn-outline-danger btn-delete" data-idx="${idx}">刪除</button>
      </div>
    `;

    foodList.appendChild(li);
    total += Number(it.total);
  });

  totalCaloriesEl.textContent = total;
}


-
foodForm.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!foodForm.checkValidity()) {
    foodForm.classList.add('was-validated');
    return;
  }

  const name = foodName.value.trim();
  const cal = Number(calPerServing.value);
  const sv = Number(servings.value);
  const total = Math.round(cal * sv * 10) / 10;

  
  const duplicate = items.some(
    it =>
      it.name === name &&
      Number(it.calPerServing) === cal &&
      Number(it.servings) === sv
  );

  if (duplicate) {
    alert('已存在');
    return;
  }

  
  const item = { name, calPerServing: cal, servings: sv, total };
  items.push(item);
  localStorage.setItem('calorie_items', JSON.stringify(items));

  renderList();

  foodForm.reset();
  foodForm.classList.remove('was-validated');
  instantResult.textContent = '-- kcal';
});



foodList.addEventListener('click', (e) => {
  if (e.target.classList.contains('btn-delete')) {
    const idx = Number(e.target.dataset.idx);
    items.splice(idx, 1);
    localStorage.setItem('calorie_items', JSON.stringify(items));
    renderList();
  }
});



clearBtn.addEventListener('click', () => {
  foodForm.reset();
  foodForm.classList.remove('was-validated');
  instantResult.textContent = '-- kcal';
});



exportBtn.addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(items, null, 2)], {
    type: 'application/json'
  });

  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `calorie_items_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
});



resetBtn.addEventListener('click', () => {
  if (confirm('確定要清除全部資料嗎')) {
    items = [];
    localStorage.removeItem('calorie_items');
    renderList();
  }
});



renderList();
