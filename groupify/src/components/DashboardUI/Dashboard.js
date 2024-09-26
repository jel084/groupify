import { db } from '../../firebase';
import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { auth } from '../../firebase';
import { getTasksForUser } from './firebaseService'; // Import getTasksForUser function
import './Dashboard.css';
import { onAuthStateChanged } from 'firebase/auth';
export const Dashboard = () => {
  //state hooks - define state variables 
  //tasks holds an arary of current tasks - initally empty array and setTasks function is used to update state
  //newTask holds value of input field for new task - initally empty "" and setNewTask updates this state as user types in new task
  //editingTaskId - holds value of input field for new task - initally empty string "" the setNewTask function updates this state as user types in new task 
  //editingTaskText -  holds text of task that is ebing editing - used to store editied text as user modifies the input 
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTaskText, setEditingTaskText] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchTasks(user.uid); // Fetch tasks once the user is authenticated
      }
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // Function to fetch tasks from Firestore for the logged-in user
  const fetchTasks = async (userId) => {
    const fetchedTasks = await getTasksForUser(userId);
    setTasks(fetchedTasks); // Set tasks in the local state
  };

  //handle adding task 
  //first if statement checks whether newTask is not empty or whitespace - trim removes leading and trailing spaces from the string 
  //adds to fireStore with addDoc - add tasks under specific task collection 
  //updates localstate setTasks - adds new tasks to local tasks array - with exisitng tasks + new one 
  //setNewTask("") clears input field after adding the tasks
  const handleAddTask = async () => {
    const user = auth.currentUser;
    if (newTask.trim() && user) {
      const taskRef = await addDoc(collection(db, "users", user.uid, "tasks"), { text: newTask, completed: false });
      setTasks([...tasks, { id: taskRef.id, text: newTask, completed: false }]);
      setNewTask("");
    }
  };
  //toggle tasks completetion - does the checked and checked portion of box 
  //reference to the specific taskid 
  //update the firestore - updatedDoc by flippings its value from true to false or false to true 
  //update local state - takes local array task with matching id and toggle completed field
  const handleToggleTask = async (id, completed) => {
    const user = auth.currentUser;
    if (user) {
      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await updateDoc(taskRef, { completed: !completed });
      setTasks(tasks.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
    }
  };

  //handles editing a task
  //prepares task for editing - setEditingTaskId - sets editingTaskId to id of task user wants to edit
  //setEditingTaskText sets editingTaskText to current text so users can modify it 
  const handleEditTask = (id, text) => {
    setEditingTaskId(id);
    setEditingTaskText(text);
  };

  // first checks if the edited task is not just whitespace 
  // reference to task being editied
  //updates teh firststore with new editied text 
  //updates local state setTasks -> updates tasks array replaceing text of the task with editingTaskId 
  //clesr editing state and allows user to exit edit mode 
  const handleUpdateTask = async () => {
    const user = auth.currentUser;
    if (editingTaskText.trim() && user) {
      const taskRef = doc(db, "users", user.uid, "tasks", editingTaskId);
      await updateDoc(taskRef, { text: editingTaskText });
      setTasks(tasks.map(task => task.id === editingTaskId ? { ...task, text: editingTaskText } : task));
      setEditingTaskId(null);
      setEditingTaskText("");
    }
  };

  //handles deleting a task -> gets reference to task document 
  //deletes firestore doc 
  //updates local state of tasks array removing task from list displayed
  const handleDeleteTask = async (id) => {
    const user = auth.currentUser;
    if (user) {
      const taskRef = doc(db, "users", user.uid, "tasks", id);
      await deleteDoc(taskRef);
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  return (
    <div>
      <h1 className='introName'>Hello Raul!</h1>

      <div className="container">
        <div className="rectangle" />
        <div className="rectangle2">
          <h2 className='text-xl pl-2.5'>To-Do</h2>
          <input
            className='pl-2.5'
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Enter a new task"
          />
          <button onClick={handleAddTask}>Add Task</button>
          <ul>
            {tasks.map(task => (
              <li key={task.id}>
                <input
                  className=''
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task.id, task.completed)}
                />
                {editingTaskId === task.id ? (
                  <>
                    <input
                      type="text"
                      value={editingTaskText}
                      onChange={(e) => setEditingTaskText(e.target.value)}
                    />
                    <button onClick={handleUpdateTask}>Update</button>
                  </>
                ) : (
                  <span
                    style={{
                      textDecoration: task.completed ? 'line-through' : 'none',
                      marginLeft: '10px',
                    }}
                  >
                    {task.text}
                  </span>
                )}
                <button onClick={() => handleEditTask(task.id, task.text)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
