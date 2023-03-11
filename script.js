const input = document.querySelector(".input");
const checkboxes = document.querySelectorAll(".checkbox");
const tasks = document.querySelector(".tasks");
const totalTasks = document.querySelector(".total");
const doneTasks = document.querySelector(".done__todos");
const clearBtn = document.querySelector(".clear-btn");

// hide the btn for now
clearBtn.classList.add("hidden");

// Array task
let tasksArr = [];

// Check if there tasks in the local storage
if (window.localStorage.getItem("tasks")) {
  tasksArr = JSON.parse(window.localStorage.getItem("tasks"));
}

//
let hashesArr = [];
//
if (window.localStorage.getItem("hashes")) {
  hashesArr = JSON.parse(window.localStorage.getItem("hashes"));
}
//
if (window.localStorage.getItem("total")) {
  totalTasks.innerHTML = JSON.parse(window.localStorage.getItem("total"));
}
//
if (window.localStorage.getItem("done")) {
  doneTasks.innerHTML = JSON.parse(window.localStorage.getItem("done"));
}

// Get the data from locale Storage fn
getDataFromStorage();

// Add Task

document.addEventListener("keydown", (e) => {
  // Check
  if (e.key === "Enter" && input.value !== "") {
    addTaskToArray(input.value);

    // Clear input field
    input.value = "";
  }
});

//
function addTaskToArray(taskText) {
  // Task Data Obj
  const task = {
    id: Date.now(),
    title: taskText,
    done: false,
  };


  // Push the task obj to the tasks Array
  tasksArr.push(task);

  //
  window.localStorage.setItem("total", tasksArr.length);

  if (window.localStorage.getItem("total")) {
    totalTasks.innerHTML = window.localStorage.getItem("total");
  }

  // D
  let doneTasksCount = tasksArr.filter((task) => task.done === true).length;
  window.localStorage.setItem("done", doneTasksCount);
  if (window.localStorage.getItem("done")) {
    doneTasks.innerHTML = window.localStorage.getItem("done");
  }

  // Add tasks to the page
  addElement(tasksArr);

  // Add tasks to the local storage
  addDataToStorage(tasksArr);
}

// ^
function addElement(tasksArr) {
  // Clear tasks UL
  tasks.innerHTML = "";

  //
    totalTasks.innerHTML = tasksArr.length;
  doneTasks.innerHTML = tasksArr.filter((task) => task.done === true).length;

  
  // Add task LI
  tasksArr.forEach((task) => {
    let taskLi = document.createElement("li");
    taskLi.classList.add('task') 
    taskLi.setAttribute("data-id", task.id);


    // Check on the task stat
    if(task.done) {
      taskLi.classList.add('done')
    } else {
      taskLi.classList.remove('done')
    }
  

    let hash, word;
    if (task.title.includes("#")) {
      word = task.title.slice(0, task.title.indexOf("#"));
      hash = task.title.slice(task.title.indexOf("#"));
    } else {
      word = task.title;
      hash = false;
    }

    let wordText = document.createTextNode(word);
    let hashText = document.createTextNode(hash || "");

    const hashSpan = document.createElement("span");
    hashSpan.appendChild(hashText);
    hashSpan.className = "hash"; // for the color

    const wordSpan = document.createElement("span");
    wordSpan.appendChild(wordText);

    const text = document.createElement("span");
    text.appendChild(wordSpan);
    text.appendChild(hashSpan);

    // Create checkbox
    let checkbox = document.createElement("div");
    checkbox.classList.add('checkbox') 

    // Append checkbox and text
    taskLi.appendChild(checkbox);
    taskLi.appendChild(text);
    // Add Task taskLi To Tasks Container
    tasks.appendChild(taskLi);
    console.log(taskLi);

    //! WHEN I USED THIS WAY IT SOESN'T WORK CORRECTLY ALWAYS COPY THE ARRAY TWICE
    // const html = `<li class="task" data-id ="${task.id}">
    //                   <input type="checkbox" class="checkbox">
    //                   <p class = 'word'>${task.title}</p>
    //                   </li>`
    // tasks.insertAdjacentHTML('afterend',html)

    const taskElement = document.querySelector(".tasks");
    // Check if task is done
    if (task.done) {
      taskElement.classList.add("done");
    }
  });

  tasks.addEventListener("dblclick", (event) => {
    // Checkbox
    if (event.target.classList.contains("checkbox")) {
      // remove the task element from the page
      event.target.parentElement.remove();
      // remove the task element from local storage
      deleteTaskFromStorage(event.target.parentElement.getAttribute("data-id"));
    }
  });

  tasks.addEventListener("click", (event) => {
    if (event.target.classList.contains("checkbox")) {
      // Toggle completed tasks
      toggleTasks(event.target.parentElement);
      // event.target.parentElement.classList.toggle("done");
    }
    if (event.target.classList.contains("hash")) {
      // remove the task element from the page
      const tasksElements = document.querySelectorAll(".task");
      // remove all task elemente from local storage
      tasksElements.forEach((task) => {
        if (task !== event.target.parentElement.parentElement) task.remove();
      });
      toggleHashList(event.target.textContent);
      clearBtn.classList.remove("hidden");
    }
    //clearBtn.classList.add('hidden')
    if (event.target.classList.contains("clear-btn")) {
      if (event.target.classList.contains("clear-btn")) {
        tasksElements.forEach((task) => (task.style.display = "block"));
        // remove the task element from the page
        event.target.classList.add("hidden");
        // remove all task elemente from local storage
        // toggleClearBtn();
      }
    }
  });
}
  function addDataToStorage(tasksArr) {
    window.localStorage.setItem("tasks", JSON.stringify(tasksArr));

    // count total tasks
    window.localStorage.setItem("total", tasksArr.length);
    if (window.localStorage.getItem("total"))
      totalTasks.innerHTML = window.localStorage.getItem("total");

    // Count the done tasks
    doneTasksCount = tasksArr.filter((task) => task.done === true).length;
    window.localStorage.setItem("done", JSON.stringify(doneTasksCount));
    if (window.localStorage.getItem("done"))
      doneTasks.innerHTML = window.localStorage.getItem("done");

    // tasks.classList.remove("done");
  }

//^
function getDataFromStorage() {
  let data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data); // Array
    addElement(tasks);
  }
}

// ^
function deleteTaskFromStorage(taskId) {
  // Return all tasks EXCEPT of the taskId one
  tasksArr = tasksArr.filter((task) => task.id !== +taskId);

  addDataToStorage(tasksArr);
}

// ^
function toggleTasks(task) {
  for (let i = 0; i < tasksArr.length; i++) {
    if (tasksArr[i].id === +task.getAttribute("data-id"))
      if (tasksArr[i].done === false) {
        tasksArr[i].done = true;
        task.classList.add('done')
      } else {
        tasksArr[i].done = false;
        task.classList.remove('done')
      }
  }

  addDataToStorage(tasksArr);
  // addElement(tasksArr);
}

function toggleHashList(hashText) {
  let hashArr = tasksArr.filter((task) => task.title.includes(hashText));

  addElement(hashArr);
}

function toggleClearBtn() {
  addElement(tasksArr);
}
// window.localStorage.clear()
