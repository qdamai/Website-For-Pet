<template>
  <footer class="neo-footer">
    <div class="container">
      <div class="footer-content">
        <div class="brand">
          <h2 class="font-bold text-2xl">Pawpaw Finder</h2>
          <p>Membantu hewan peliharaan menemukan jalan pulang.</p>
        </div>
        <div class="links">
          <router-link to="/">Beranda</router-link>
          <router-link to="/explore">Katalog</router-link>
          <router-link to="/dashboard">Dashboard</router-link>
        </div>
      </div>
      <div class="copyright">
        <p>&copy; {{ new Date().getFullYear() }} Pawpaw Finder. Built by <a href="https://github.com/qdamai" target="_blank">qdamai</a> and <a href="https://github.com/nazirachrn" target="_blank">nazirachrn</a></p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.neo-footer {
  background-color: #f3f4f6;
  border-top: 4px solid #1a1a1a;
  padding: 3rem 1rem 1.5rem;
  margin-top: 4rem;
  font-family: 'Nunito', sans-serif;
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .footer-content {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.brand h2 {
  font-family: 'Fredoka', sans-serif;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}

.brand p {
  color: #555;
  margin: 0;
  font-weight: 700;
}

.links {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.links a {
  color: #1a1a1a;
  text-decoration: none;
  font-weight: 800;
  font-family: 'Fredoka', sans-serif;
  transition: all 0.2s;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 8px;
}

.links a:hover {
  background-color: #FF8A65;
  color: #FFFDF9;
  border-color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 3px 3px 0px 0px #1a1a1a;
}

.copyright {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 2px dashed #1a1a1a;
  font-weight: 700;
  color: #666;
}
</style>
