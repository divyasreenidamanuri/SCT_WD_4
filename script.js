/*====================================
        NEXTASK 2.0
        PART - 1
====================================*/


// ==============================
// LOCAL STORAGE
// ==============================

let tasks =
JSON.parse(localStorage.getItem("nextask_tasks")) || [];

let currentFilter = "all";


// ==============================
// DOM ELEMENTS
// ==============================

const taskInput =
document.getElementById("taskInput");

const taskDate =
document.getElementById("taskDate");

const priority =
document.getElementById("priority");

const category =
document.getElementById("category");

const addBtn =
document.getElementById("addBtn");

const taskList =
document.getElementById("taskList");

const searchTask =
document.getElementById("searchTask");

const themeToggle =
document.getElementById("themeToggle");

const toast =
document.getElementById("toast");

const progressBar =
document.getElementById("progressBar");

const progressText =
document.getElementById("progressText");

const totalTasks =
document.getElementById("totalTasks");

const pendingTasks =
document.getElementById("pendingTasks");

const completedTasks =
document.getElementById("completedTasks");

const progressPercent =
document.getElementById("progressPercent");

const todayDate =
document.getElementById("todayDate");


// ==============================
// EVENT LISTENERS
// ==============================

addBtn.addEventListener(
    "click",
    addTask
);

searchTask.addEventListener(
    "keyup",
    renderTasks
);

themeToggle.addEventListener(
    "click",
    toggleTheme
);

taskInput.addEventListener(
    "keypress",
    function(e){

        if(e.key==="Enter"){

            addTask();

        }

    }
);


// ==============================
// SAVE TASKS
// ==============================

function saveTasks(){

    localStorage.setItem(

        "nextask_tasks",

        JSON.stringify(tasks)

    );

}


// ==============================
// TOAST MESSAGE
// ==============================

function showToast(message){

    toast.innerHTML = message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}


// ==============================
// LIVE DATE
// ==============================

function updateDate(){

    const now = new Date();

    const options={

        weekday:"long",

        day:"numeric",

        month:"long",

        year:"numeric"

    };

    todayDate.innerHTML =
    now.toLocaleDateString(
        "en-US",
        options
    );

}

updateDate();


// ==============================
// THEME
// ==============================

if(

    localStorage.getItem("theme")

    ===

    "light"

){

    document.body.classList.add(

        "light-mode"

    );

    themeToggle.innerHTML=

    '<i class="fas fa-sun"></i>';

}

function toggleTheme(){

    document.body.classList.toggle(

        "light-mode"

    );

    if(

        document.body.classList.contains(

            "light-mode"

        )

    ){

        localStorage.setItem(

            "theme",

            "light"

        );

        themeToggle.innerHTML=

        '<i class="fas fa-sun"></i>';

    }

    else{

        localStorage.setItem(

            "theme",

            "dark"

        );

        themeToggle.innerHTML=

        '<i class="fas fa-moon"></i>';

    }

}


// ==============================
// ADD TASK
// ==============================

function addTask(){

    const text=

    taskInput.value.trim();

    if(text===""){

        showToast(

            "⚠ Please enter a task."

        );

        return;

    }

    const task={

        id:Date.now(),

        text:text,

        date:taskDate.value,

        priority:priority.value,

        category:category.value,

        completed:false,

        created:new Date()

        .toISOString()

    };

    tasks.push(task);

    saveTasks();

    renderTasks();

    taskInput.value="";

    taskDate.value="";

    priority.selectedIndex=0;

    category.selectedIndex=0;

    showToast(

        "✅ Task Added Successfully"

    );

}
/*====================================
        NEXTASK 2.0
        PART - 2
====================================*/


// ==============================
// RENDER TASKS
// ==============================

function renderTasks(){

    taskList.innerHTML="";

    let filteredTasks=[...tasks];

    if(currentFilter==="active"){

        filteredTasks=filteredTasks.filter(

            task=>!task.completed

        );

    }

    if(currentFilter==="completed"){

        filteredTasks=filteredTasks.filter(

            task=>task.completed

        );

    }

    const keyword=

    searchTask.value

    .toLowerCase()

    .trim();

    filteredTasks=

    filteredTasks.filter(task=>

        task.text

        .toLowerCase()

        .includes(keyword)

    );

    if(filteredTasks.length===0){

        taskList.innerHTML=

        `

        <div class="empty">

            <i class="fas fa-clipboard-list"></i>

            <h3>No Tasks Found</h3>

            <p>Add a task to get started.</p>

        </div>

        `;

        updateStats();

        return;

    }

    filteredTasks.forEach(task=>{

        createTask(task);

    });

    updateStats();

}


// ==============================
// CREATE TASK CARD
// ==============================

function createTask(task){

    const li=

    document.createElement("li");

    li.className=

    task.completed

    ?

    "task completed"

    :

    "task";



    let dueLabel="";



    if(task.date){

        const due=

        new Date(task.date);

        const now=

        new Date();

        const diff=

        due-now;

        const hours=

        diff/(1000*60*60);



        if(hours<0 && !task.completed){

            dueLabel=

            `<span class="overdue">

                ❌ Overdue

            </span>`;

        }

        else if(

            hours<=24

            &&

            !task.completed

        ){

            dueLabel=

            `<span class="due-soon">

                ⚠ Due Soon

            </span>`;

        }

    }



    li.innerHTML=`

    <div class="task-info">

        <div class="task-title">

            ${task.text}

        </div>

        <div class="task-meta">

            <span class="priority ${task.priority.toLowerCase()}">

                ${task.priority}

            </span>

            <span>

                ${task.category}

            </span>

            <span>

                📅

                ${task.date || "No Due Date"}

            </span>

            ${dueLabel}

        </div>

    </div>



    <div class="actions">

        <button

        class="complete"

        onclick="toggleTask(${task.id})">

        <i class="fas fa-check"></i>

        </button>



        <button

        class="edit"

        onclick="editTask(${task.id})">

        <i class="fas fa-pen"></i>

        </button>



        <button

        class="delete"

        onclick="deleteTask(${task.id})">

        <i class="fas fa-trash"></i>

        </button>

    </div>

    `;

    taskList.appendChild(li);

}


// ==============================
// FILTER TASKS
// ==============================

function filterTasks(type){

    currentFilter=type;

    renderTasks();

}


// ==============================
// UPDATE DASHBOARD
// ==============================

function updateStats(){

    const total=

    tasks.length;

    const completed=

    tasks.filter(

        task=>task.completed

    ).length;

    const pending=

    total-completed;



    totalTasks.innerHTML=

    total;

    pendingTasks.innerHTML=

    pending;

    completedTasks.innerHTML=

    completed;



    let percent=0;



    if(total!==0){

        percent=

        Math.round(

            (completed/total)*100

        );

    }



    progressBar.style.width=

    percent+"%";



    progressText.innerHTML=

    percent+

    "% Completed";



    progressPercent.innerHTML=

    percent+"%";

}


// ==============================
// SEARCH
// ==============================

searchTask.addEventListener(

    "input",

    renderTasks

);
/*====================================
        NEXTASK 2.0
        PART - 3
====================================*/


// ==============================
// TOGGLE COMPLETE
// ==============================

function toggleTask(id){

    const task = tasks.find(t => t.id === id);

    if(!task) return;

    task.completed = !task.completed;

    saveTasks();

    renderTasks();

    if(task.completed){

        confetti({

            particleCount:120,

            spread:80,

            origin:{y:0.7}

        });

        showToast("🎉 Task Completed");

    }

    else{

        showToast("↩ Task Marked Active");

    }

}


// ==============================
// EDIT TASK
// ==============================

function editTask(id){

    const task = tasks.find(

        t => t.id === id

    );

    if(!task) return;

    const updated = prompt(

        "Edit Task",

        task.text

    );

    if(

        updated === null ||

        updated.trim() === ""

    ){

        return;

    }

    task.text = updated.trim();

    saveTasks();

    renderTasks();

    showToast("✏ Task Updated");

}


// ==============================
// DELETE TASK
// ==============================

function deleteTask(id){

    const confirmDelete = confirm(

        "Delete this task?"

    );

    if(!confirmDelete) return;

    tasks = tasks.filter(

        task => task.id !== id

    );

    saveTasks();

    renderTasks();

    showToast("🗑 Task Deleted");

}


// ==============================
// SORTABLE DRAG & DROP
// ==============================

new Sortable(taskList,{

    animation:250,

    ghostClass:"sortable-ghost",

    chosenClass:"sortable-chosen",

    dragClass:"sortable-drag",

    onEnd:function(evt){

        if(evt.oldIndex === evt.newIndex){

            return;

        }

        const visibleTasks = [...tasks];

        const movedItem = visibleTasks.splice(

            evt.oldIndex,

            1

        )[0];

        visibleTasks.splice(

            evt.newIndex,

            0,

            movedItem

        );

        tasks = visibleTasks;

        saveTasks();

        renderTasks();

    }

});


// ==============================
// AUTO CHECK DUE TASKS
// ==============================

setInterval(function(){

    renderTasks();

},60000);


// ==============================
// INITIAL LOAD
// ==============================

renderTasks();


// ==============================
// WELCOME TOAST
// ==============================

setTimeout(function(){

    showToast(

        "🚀 Welcome to NexTask"

    );

},800);