<template>
  <h3>Aggiungi Nuova Task</h3>
    <form @submit="addTask">
      <input v-model="title" name="title" placeholder="Titolo" required />
      <input v-model="description" name="description" placeholder="Descrizione" required />
      <button type="submit">Aggiungi Task</button>
    </form>
    <div v-if="errorMsg" style="color:red">{{ errorMsg }}</div>
    <ul>
      <li v-for="(task) in tasks">
        {{ task.title }} - {{ task.description }} [{{ task.completed ? 'Completata' : 'Da fare' }}]
      </li>
    </ul>
</template>

<script setup lang="ts">
import type { Task } from '@/model/Task';
import { onMounted, ref } from 'vue';

  let title = ref('');
  let description = ref('');
  let tasks = ref<Task[]>([]);
  let errorMsg = ref('');

  // const addTask = async (event: Event) => {
  //   event.preventDefault();

  //   if (!title.value || !description.value) {
  //     errorMsg.value = 'Tutti i campi sono obbligatori';
  //     return;
  //   }

  //   try {
  //     const newTask = {
  //       title: title.value,
  //       description: description.value,
  //       completed: false
  //     };

  //     const response = await fetch('http://localhost:8080/api/task', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(newTask)
  //     });

  //     if (!response.ok) throw new Error(`Errore server: ${response.status}`);

  //     const addedTask = await response.json();
  //     tasks.value.push(addedTask);

  //     // Reset del form
  //     title.value = '';
  //     description.value = '';
  //     errorMsg.value = '';

  //   } catch (err) {
  //     console.error('Errore nell\'aggiunta della task:', err);
  //     errorMsg.value = 'Errore durante l\'aggiunta della task';
  //   }
  // };

  const loadTasks = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/task');

      if (!response.ok) throw new Error(`Errore server: ${response.status}`);

      tasks.value = await response.json();

      errorMsg.value = '';

    } catch (err) {
      console.error('Errore nella fetch:', err);
      errorMsg.value = 'Errore nel caricamento delle tasks';
    }
  };

  const addTask = async () => {

    if (!title.value || !description.value) {
      errorMsg.value = 'Tutti i campi sono obbligatori';
      return;
    }

    try {
      const newTask: Task = {
        title: title.value,
        description: description.value,
        completed: false,
        id: 0
      };

      const response = await fetch('http://localhost:8080/api/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTask.title, description: newTask.description })
      });

      if (!response.ok) throw new Error(`Errore server: ${response.status}`);

      const addedTask = await response.json();
      tasks.value.push(addedTask);

      // Reset del form
      title.value = '';
      description.value = '';
      errorMsg.value = '';

    } catch (err) {
      console.error('Errore nell\'aggiunta della task:', err);
      errorMsg.value = 'Errore durante l\'aggiunta della task';
    }
  };

  onMounted(loadTasks)
</script>
