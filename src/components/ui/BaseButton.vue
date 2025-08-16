<template>
  <button class="btn">
    <slot></slot>
  </button>
</template>

<style scoped>
.btn {
  background-color: var(--color-primary);
  color: #000;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-family-body);
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.btn:hover {
  background-color: #EAC54E;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(0,0,0,0.2);
}
</style>