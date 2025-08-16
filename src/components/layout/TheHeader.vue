<template>
  <header>
    <router-link to="/" class="logo-link">
      <svg width="60" height="60" viewBox="0 0 100 100" class="logo-svg">
        <circle cx="50" cy="50" r="45" fill="none" stroke="var(--color-primary)" stroke-width="5" />
        <path d="M 25 25 C 75 25, 25 75, 75 75" fill="none" stroke="var(--color-text-heading)" stroke-width="5" />
        <path d="M 25 75 C 75 75, 25 25, 75 25" fill="none" stroke="var(--color-text-heading)" stroke-width="5" />
      </svg>
      <h1>RallyVision</h1>
    </router-link>
  </header>
</template>

<style scoped>
header {
  text-align: center;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}
.logo-link {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  text-decoration: none;
}
.logo-svg {
  transition: transform 0.5s ease-in-out;
}
.logo-link:hover .logo-svg {
  transform: rotate(360deg);
}
h1 {
  font-size: 3rem;
  letter-spacing: 1px;
}
</style>