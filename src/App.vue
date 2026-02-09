<script setup lang="ts">
import NoteIdentifyExercise from '@/exercises/NoteIdentifyExercise.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <!-- Teste com intervalo -->
    <NoteIdentifyExercise from="C3" to="C5" />
    
    <!-- Ou teste com array específico: -->
    <!-- <NoteIdentifyExercise :notes="['C4','E4']" /> -->
  </div>
</template>
