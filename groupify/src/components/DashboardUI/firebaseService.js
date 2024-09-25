// firebaseService.js - this takes care of the todo things in the firebase storage 
import { collection, addDoc, Timestamp, getDocs, query, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../firebase';  

// when a user adds a task 
//takes the collection users and subcollectiin tasks 
//for each task it creates a new doc in subcollection with taskname, completed (bool initially false when created), and time it was created
export const addTaskToUser = async (userId, taskName) => {
  try {
    const taskRef = collection(db, 'users', userId, 'tasks');
    await addDoc(taskRef, {
      taskName: taskName,
      completed: false,
      createdAt: Timestamp.now(),
    });
    //else throw an error if not able to create the doc 
  } catch (e) {
    console.error('Error adding task: ', e);
  }
};

// Function to get all tasks for a user
//try getting the collection users -> tasks 
//gets query 
//get docs for each task/query 
//for each doc/task push data into array tasks and then return it 
export const getTasksForUser = async (userId) => {
  const tasks = [];
  try {
    const taskRef = collection(db, 'users', userId, 'tasks');
    const taskQuery = query(taskRef);
    const querySnapshot = await getDocs(taskQuery);
    querySnapshot.forEach((doc) => {
      tasks.push({ id: doc.id, ...doc.data() });
    });
  } catch (e) {
    console.error('Error fetching tasks: ', e);
  }
  return tasks;
};

// Function to update task status
//takes in userId, taskId, isCompleted
//gets reference and updates document/task to completed
export const toggleTaskComplete = async (userId, taskId, isCompleted) => {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await updateDoc(taskRef, { completed: isCompleted });
  } catch (e) {
    console.error('Error updating task: ', e);
  }
};

// Function to delete a task
//takes parameter userId and taskId and takes the doc and deletes it 
//otherwise throws an error 
export const deleteTask = async (userId, taskId) => {
  try {
    const taskRef = doc(db, 'users', userId, 'tasks', taskId);
    await deleteDoc(taskRef);
  } catch (e) {
    console.error('Error deleting task: ', e);
  }
};
