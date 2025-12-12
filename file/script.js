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
const taskContainer = JSON.parse(localStorage.getItem("taskData")) || [];
const formattedDate = new Date().toISOString().slice(0,10);
let isFiltered = false;

const addTaskUI = () => {
  const taskObj = { id:`task-${Date.now()}` }
  dialog.insertAdjacentHTML("beforeend", `
    <div class="container">
      <div class="sub-container">
        <label for="${taskObj.id}">Task Name:</label>
        <input type="text" id="${taskObj.id}" class="task-name">
      </div>
      <div class="sub-container">
        <label for="task-date">Task Date:</label>
        <input type="date" name="dateInput" class="task-date">
      </div>
      <button id="finalize-task">Add Task</button>
    </div>
    <button id="close-dialog" onclick="
      dialog.close(); 
      dialog.classList.remove('dialog-style'); 
      dialog.innerHTML = ''; 
      newTaskBtn.classList.remove('hidden');
    ">
      <img src="../images/close-circle.svg">
    </button>
  `);

  const addTaskBtn = document.getElementById('finalize-task');
  const taskName = document.querySelector('.task-name');
  const taskDate = document.querySelector('.task-date');

  myDialog.classList.add('dialog-style');
  newTaskBtn.classList.add('hidden');

  addTaskBtn.addEventListener('click', ()=>{
    return taskAdder(taskObj, taskName, taskDate);
  });
};

const taskAdder = (roundObj, taskName, taskDate) => {
  if(!roundObj.title && !roundObj.date){
    roundObj['title'] = taskName.value;
    roundObj['date'] = taskDate.value;
  }

  if(roundObj.title === '' && roundObj.date === ''){
    alert('please insert a value');
  } else {
    taskContainer.push(roundObj);
    localStorage.setItem("taskData", JSON.stringify(taskContainer));
    dialog.close();
    dialog.innerHTML = '';
    dialog.classList.remove('dialog-style');
    newTaskBtn.classList.remove('hidden');
    isFiltered = false;
    renderTaskUI(roundObj, isFiltered);
  }
}

const renderTaskUI = (roundObj, isFiltered, task) => {

  if(isFiltered === true){
    taskData.innerHTML = '';
  }
  taskData.innerHTML += `
  <div class="tasks-container" id="${roundObj ? roundObj.id : task.id}">
    <div class="tasks">
      <div class="custom-checkbox"></div>
      <div class="content">
        <h1>${roundObj ? roundObj.title : task.title}</h1>
        <p>${roundObj ? roundObj.date : task.date}</p>
      </div>
    </div>
    <buttton class="delete-icon">
      <img src="../images/close-circle.svg" class="icons">
    </button>
  </div>
  `;

  const deleteBtn = document.querySelectorAll('.delete-icon');
  const checkBox = document.querySelectorAll('.custom-checkbox');
  checkBox.forEach(el=>{
    el.addEventListener('click', ()=>{
      el.classList.toggle('checked');
      el.parentElement.querySelector('h1').classList.toggle('completed');
  });
  });

  deleteBtn.forEach(btn=>{
    btn.addEventListener('click',()=>{
    deleteTask(btn);
  });
  });
};

const deleteTask = (deleteBtn)=>{
  taskContainer.splice(taskContainer.findIndex(el=>el.id === deleteBtn.parentElement.id),1);
  localStorage.setItem('taskData',JSON.stringify(taskContainer));
  return deleteBtn.parentElement.remove();
}

const filterDialogUI = () => {
  filterDialog.showModal();
  filterDialog.innerHTML = `
    <div class="date">
      <div class="filter-header">
        <p>Filter</p>
        <div class="all-choice">
          <label id="all">All</label>
          <input type="checkbox" class="checkbox" id="all">
        </div>
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
        <button id="confirm" class="d-buttons">Confirm</button>
        <button id="cancel" class="d-buttons">Cancel</button>
      </div>
    </div>
  `;
  const radioButtons = document.querySelectorAll('.radio-buttons');
  const filterDate = document.getElementById('filter-date');
  const dButtons = document.querySelectorAll('.d-buttons');
  const allCheckBox = document.querySelector('.checkbox');

  // closeOpenDialog(dButtons, filterDate,allCheckBox);
  addChecked(radioButtons,dButtons,filterDate);
  callFuns(dButtons,radioButtons,filterDate);
};

function addChecked(buttons,dButtons,filterDate){
  // console.log(buttons);
  
  buttons.forEach(button=>{
    button.onclick = ()=>{
      buttons.forEach(button=>{
      button.classList.remove('checked');
    });
      button.classList.add('checked');
  }});

  
}

const callFuns = (buttons,radBtns,filterDate)=>{
  
  buttons[0].onclick = ()=>{
    radBtns.forEach(button=>{
    if(button.classList.contains('checked') ){
      switch(button.id){
        case 'before':
          beforeTasks(filterDate.value);
          break;
        case 'after':
          upcomingTasks(filterDate.value);
          break;
        case 'at':
          todayTask(filterDate.value);
          break;
      }
    };
  });
  };

  buttons.forEach(button=>button.onclick = ()=>{filterDialog.close()});
}

function allTasks(){
  if(taskContainer.length){
    isFiltered = false;
    taskContainer.forEach(task=>{
      taskContainer[0] === task ? isFiltered = true : isFiltered = false;
      renderTaskUI(task,isFiltered,null);
    })
  };
}

function todayTask(filterDate){
  filterDialog.close();
  const todayTasks = taskContainer.filter(task=>task.date === filterDate);
  if(!todayTasks.length){
    alert('there are no tasks for today');
    allTasks();
  }else{
    todayTasks.forEach(task=>{
    todayTasks[0] === task ? isFiltered = true : isFiltered = false;
    renderTaskUI(null,isFiltered,task);
    });
  }
};

function beforeTasks(filterDate){
  const beforeTasks = taskContainer.filter(task=>task.date < filterDate);
  
  beforeTasks.forEach(task=>{
    beforeTasks[0] === task ? isFiltered = true : isFiltered = false;
    renderTaskUI(null,isFiltered,task);
  });
}

function upcomingTasks(filterDate){
  const upcomingTasks = taskContainer.filter(task=>task.date>filterDate);
  upcomingTasks.forEach(task=>{
    upcomingTasks[0] === task ? isFiltered = true:isFiltered = false;
    renderTaskUI(null,isFiltered,task);
  });
  filterDialog.close();
} 

//calling section

newTaskBtn.addEventListener('click', ()=>{
  addTaskUI();
  myDialog.showModal();
});

filterIcon.addEventListener('click', ()=>{
  filterDialogUI();
});

today.addEventListener('click',()=>{
  todayTask(formattedDate);
});

upcoming.addEventListener('click',()=>{
  upcomingTasks(formattedDate);
})

all.addEventListener('click',()=>{
  allTasks();
});

if(taskContainer.length){
  isFiltered = false;
  taskContainer.forEach(task=>{
    renderTaskUI(task,isFiltered,null);
  });
};