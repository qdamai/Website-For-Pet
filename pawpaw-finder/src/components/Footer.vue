<script setup>
</script>

<template>
  <footer class="neo-footer">
    <div class="container footer-container">
      <div class="footer-content">
        <div class="brand-section">
          <h2 class="brand-title">Pawpaw Finder</h2>
          <p class="brand-text">Membantu hewan peliharaan menemukan jalan pulang.</p>
        </div>
        <div class="links-section">
          <h3 class="section-heading">Navigasi</h3>
          <div class="links-grid">
            <router-link to="/dashboard" class="footer-link">Dashboard</router-link>
            <router-link to="/explore" class="footer-link">Katalog</router-link>
            <router-link to="/radar" class="footer-link">Peta Radar</router-link>
            <router-link to="/report" class="footer-link">Laporkan</router-link>
            <router-link to="/chat" class="footer-link">Obrolan</router-link>
            <router-link to="/profile" class="footer-link">Profil</router-link>
            <a href="http://localhost:5174" class="footer-link">Portal Adopsi &rarr;</a>
          </div>
        </div>
      </div>
      <div class="copyright-section">
        <p class="copyright-text">
          &copy; {{ new Date().getFullYear() }} Pawpaw Finder. Built by 
          <a href="https://github.com/qdamai" target="_blank" rel="noopener noreferrer" class="creator-link">qdamai</a> 
          and 
          <a href="https://github.com/nazirachrn" target="_blank" rel="noopener noreferrer" class="creator-link">nazirachrn</a>
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.neo-footer {
  background-color: #1a1a1a;
  border-top: var(--border-width) solid var(--color-border);
  padding: 3rem 1rem 1.5rem;
  margin-top: 4rem;
  font-family: 'Nunito', sans-serif;
  color: #a0a0a0;
}

.footer-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px dashed #333333;
}

@media (min-width: 768px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.brand-section {
  max-width: 350px;
}

.brand-title {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.75rem;
  font-weight: 800;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
}

.brand-text {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.5;
  color: #888888;
}

.links-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-heading {
  font-family: 'Fredoka', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: #FFFFFF;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.25rem;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 1.5rem;
}

.footer-link {
  color: #aaaaaa;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #FF8A65;
  transform: translateX(3px);
  text-decoration: underline;
}

.copyright-section {
  text-align: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: #666666;
}

.creator-link {
  color: #888888;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s ease;
}

.creator-link:hover {
  color: #B39DDB;
  text-decoration: underline;
}
</style>
