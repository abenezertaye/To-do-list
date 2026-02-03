const mainContainer = document.getElementById('main-container');
const taskData = document.querySelector('.task-data');
const dialog = document.querySelector('dialog');
const popUp = document.querySelector('.pop-up');
const newTaskBtn = document.getElementById('add-task-btn');
const myDialog = document.getElementById('my-dialog');
const filterDialog = document.getElementById('filter-dialog');
const filterIcon = document.getElementById('filter-icon');
const all = document.getElementById('all');
const today = document.getElementById('today');
const upcoming = document.getElementById('upcoming');
const completed = document.getElementById('completed');
const dateFilter = document.getElementById('date-filter');
const errorMessage = document.querySelector('.error-message');
const taskContainer = JSON.parse(localStorage.getItem("taskData")) || [];
const formattedDate = new Date().toISOString().slice(0,10);
let data;
let isFiltered = false;

if(taskContainer.length){
  isFiltered = false;
  taskContainer.forEach(task=>{
    renderTaskUI(task,[task.checked,task.completed]);
  });
};

function addTaskUI() {
  myDialog.showModal();
  dialog.insertAdjacentHTML("beforeend", `
    <div class="container">
      <div class="sub-container">
        <label for="task-name">Task Name:</label>
        <input type="text" class="task-name">
      </div>
      <div class="sub-container">
        <label for="task-date">Task Date:</label>
        <input type="date" class="task-date">
      </div>
      <div>
        <button class="confirm d-buttons">Add Task</button>
        <button class="cancel d-buttons">Close</button>
      </div>
    </div>
  `);

  myDialog.classList.add('dialog-style');
  newTaskBtn.classList.add('hidden');

  return [
    [...dialog.querySelectorAll('.container input')],
    [...dialog.querySelectorAll('.d-buttons')]
  ];
};

const filterDialogUI = () => {
  filterDialog.showModal();
  filterDialog.innerHTML = `
    <div class="date">
      <div class="filter-header">
        <p>Filter</p>
      </div>
      <p class="filter-header">Tasks will be rendered based on the preference and the specified date</p>
      <div class="rads">
        <button class="radio-buttons"  id="before">Before Date</button>
        <button class="radio-buttons" id="after">After Date</button>
        <button class="radio-buttons" id="at">At Date</button>
      </div>
      <div class="input-container">
        <input type="date" id="filter-date">
      </div>
      <div class="dialog-buttons">
        <button class="confirm d-buttons">Confirm</button>
        <button class="cancel d-buttons">Cancel</button>
      </div>
    </div>
  `;  
  
  return [
    [...filterDialog.querySelectorAll('.radio-buttons')],
    filterDialog.querySelector('.input-container input'),
    [...filterDialog.querySelectorAll('.d-buttons')]
  ];
};

function addtask (data){
  let taskObj = {
    id : `task-${Date.now()}`,
    title:`${data[0][0].value}`,
    date: `${data[0][1].value}`,
    checked:'',
    completed:''
  };

  data[0][0].id = taskObj.id;

  taskContainer.push(taskObj);
  localStorage.setItem('taskData',JSON.stringify(taskContainer));
  
  return taskObj;
}

function checkedAdder(checkBox){
  checkBox.classList.toggle('checked');

  checkBox.parentElement.querySelector('h1').classList.toggle('completed'); 

  let taskId = checkBox.parentElement.parentElement.id;

  if(checkBox.classList.contains('checked')){
    taskContainer.find(task=>task.id===taskId).checked = 'checked';
    taskContainer.find(task=>task.id===taskId).completed = 'completed';
    localStorage.setItem('taskData',JSON.stringify(taskContainer));
  }else{
    taskContainer.find(task=>task.id===taskId).checked = '';
    taskContainer.find(task=>task.id===taskId).completed = '';
    localStorage.setItem('taskData',JSON.stringify(taskContainer));
  }
}

function renderTaskUI (roundObj,checked){
  
  taskData.innerHTML += `
  <div class="tasks-container" id="${roundObj.id}">
    <div class="tasks">
      <div class="custom-checkbox ${checked ? checked[0] : ''}"></div>
      <div class="content">
        <h1 class="${checked ? checked[1] : ''}">${roundObj.title}</h1>
        <p>${roundObj.date}</p>
      </div>
    </div>
    <buttton class="delete-icon">
      <img src="../images/close-circle.svg" class="icons">
    </button>
  </div>
  `;
};

function filterTasks(date,check) {
  let filteredTasks;
  switch(check){
    case 'before':
      filteredTasks = taskContainer.filter(task=>task.date < date);
      console.log(filteredTasks);
      break;
    case 'after':
      filteredTasks = taskContainer.filter(task=>task.date > date);
      break;
    case 'at':
      filteredTasks = taskContainer.filter(task=>task.date === date);
      break;
    default:
      taskData.innerHTML = '';
      taskContainer.forEach(task=>renderTaskUI(task,[task.checked,task.completed]));
  }
  if(date){
    taskData.innerHTML = '';
    filteredTasks.forEach(task=>renderTaskUI(task,[task.checked,task.completed])) 
  }
}

function deleteTask (deleteBtn){
  
  taskContainer.splice(taskContainer.findIndex(el=>el.id === deleteBtn.parentElement.id),1);
  localStorage.setItem('taskData',JSON.stringify(taskContainer));
  deleteBtn.parentElement.remove();
}

function addChecked(clickedButton, allButtons) {
  console.log(allButtons)
  allButtons.forEach(btn => btn.classList.remove('checked'));
  
  clickedButton.classList.add('checked');
  
  return clickedButton;
}

function completedTasks(){
  taskData.innerHTML = '';
  taskContainer.forEach(task=>
    task.checked ? renderTaskUI(task,[task.checked,task.completed]) : null
  ) 
}

function removeChecked(checkBox){
  if(checkBox.classList.contains('checked')){
    checkBox.parentElement.parentElement.style = `
    opacity:0;
    transition:0.5s all;
  `;
    setTimeout(()=>{
      checkBox.parentElement.parentElement.remove();
    },500);
  }
}

function closeDialog(){
  dialog.close();
  dialog.classList.remove('dialog-style');
  dialog.innerHTML = '';
  newTaskBtn.classList.remove('hidden');
}

function chooseFilterMode(data) {
  let checked;
  let [radBtns, dateInput, dbuttons] = data; 

  console.log(radBtns)
 
  // Listen for clicks on the radio buttons
  radBtns.forEach(btn => {
    btn.onclick = () => {
      // Update the 'checked' variable immediately on click
      checked = addChecked(btn, radBtns);
    };  
  });
  // Handle the Confirm button
  dbuttons[0].onclick = () => {
     
    if (!checked || !dateInput.value) {
      errorMessages()
    }else{
      filterTasks(dateInput.value, checked.id);
      filterDialog.close();
    }
    
  };
  // Handle the Cancel button
  dbuttons[1].onclick = () => {
    filterDialog.close();
  };
};

function errorMessages(){
  errorMessage.innerHTML = '<p>Please Enter a Date and a Reference!</p>';
  if(errorMessage.classList.contains('hidden')){
    errorMessage.classList.remove('hidden');
    errorMessage.classList.add('error-message-style')
    
  }else{
    errorMessage.classList.remove('error-message-style');
  }
  
  setTimeout(()=>{
    errorMessage.classList.add('hidden')
  },1000);
}

newTaskBtn.addEventListener('click', ()=>{
  data = addTaskUI();
  data[1][0].onclick = ()=>{ 
    let obj = addtask(data);
    renderTaskUI(obj);
  };
  data[1].forEach(btn=>{
    btn.addEventListener('click',()=>{
      closeDialog();
    })
  });
});

if(taskData.childElementCount){
  //mark checked
  [...taskData.querySelectorAll('.tasks-container .custom-checkbox')].forEach(checkBox=>{
    checkBox.addEventListener('click',()=>{
      checkedAdder(checkBox);
      removeChecked(checkBox);
    })
  });

  //delete task
  [...taskData.querySelectorAll('.tasks-container .delete-icon')].forEach(btn=>
    btn.addEventListener('click',()=>{
        deleteTask(btn);
    })
  );
}    

completed.addEventListener('click',completedTasks) 

filterIcon.addEventListener('click', ()=>{
  data = filterDialogUI();
  console.log(data)
  chooseFilterMode(data);
});

dateFilter.addEventListener('click',()=>{
  data = filterDialogUI();
  chooseFilterMode(data);
}) 

today.addEventListener('click',()=>{
  filterTasks(formattedDate,'at');
});

upcoming.addEventListener('click',()=>{
  filterTasks(formattedDate,'after');
})

all.addEventListener('click',()=>{
  filterTasks(null,'all');
  removeChecked(taskContainer);
});