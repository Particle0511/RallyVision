<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}
</style>