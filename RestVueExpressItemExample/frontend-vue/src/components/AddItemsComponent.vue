<script setup lang="ts">
  import type { Item } from '@/model/ItemsInterface'
  import {ref, onMounted} from 'vue'

  const items = ref<Item[]>([])
  const urlbe = 'http://localhost:'
  const portbe = 8080

  const newItemName = ref('')

  const loadItems = async () => {
    try{

      const response = await fetch(urlbe + portbe + '/items');

      if(!response.ok)
        throw new Error(`Errore Server: ${response.status}`);

      const res = await response.json();
      console.log('Dati ricevuti dal server:', res);
      items.value = res;
    }
    catch (err)
    {
      console.error('errore nella fetch: ', err);
    }
  }

  const addItem = async () => {
    try{
        const response = await fetch(urlbe+portbe+'/items',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: 0, name: newItemName.value})
      });

      if(!response.ok)
        throw new Error(await response.text());

      const createdItem = await response.json()

      console.log('item Creato:', createdItem);
    }
    catch(err)
    {
      console.error('Errore POST: ', err)
    }

    loadItems();
  }

  onMounted(loadItems)
</script>

<template>
  <button @click="loadItems">Load</button>
  <ul>
    <li v-for="(item, i) in items" :key="i">{{ item.ID }} - {{ item.nome }}</li>
  </ul>

  <form @submit.prevent="addItem">
    <input v-model="newItemName" placeholder="Nuovo nome item"></input>
    <button type="submit">Aggiungi</button>
  </form>
</template>
