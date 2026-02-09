<script setup lang="ts">
import NoteIdentifyExercise from '@/exercises/NoteIdentifyExercise.vue'
import GuitarWithSound from '@/components/GuitarWithSound.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col items-center gap-12 py-12 px-6 bg-gray-50">
    <section class="flex flex-col items-center gap-6">
      <h1 class="text-2xl font-semibold text-gray-800">Identificar nota</h1>
      <NoteIdentifyExercise from="C3" to="C5" />
    </section>

    <section class="flex flex-col items-center gap-6">
      <h1 class="text-2xl font-semibold text-gray-800">Identificar nota</h1>
      <NoteIdentifyExercise from="C3" to="C5" instrument="guitar" />
    </section>
  </div>
</template>
