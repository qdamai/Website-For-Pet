<template>
  <a href="http://localhost:5174" class="cross-promo-banner" target="_blank" rel="noopener noreferrer">
    <div class="container banner-content">
      <span class="banner-badge">Pawpaw Adopt</span>
      <span class="banner-text">Mencari teman bulu baru? Temukan dan adopsi hewan kesayangan di Portal Adopsi Pawpaw! &rarr;</span>
    </div>
  </a>
</template>

<style scoped>
.cross-promo-banner {
  display: block;
  background-color: var(--color-primary);
  color: var(--color-text-dark);
  text-decoration: none;
  font-family: 'Fredoka', sans-serif;
  border-bottom: 2px solid var(--color-border);
  transition: opacity 0.2s;
  z-index: 1001;
  position: relative;
}

.cross-promo-banner:hover {
  opacity: 0.9;
}

.banner-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.banner-badge {
  background-color: #1A1A1A;
  color: #FFF;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.75rem;
}

.banner-text {
  font-weight: 600;
}

@media (max-width: 640px) {
  .banner-content {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
    padding: 0.75rem;
  }
}
</style>
