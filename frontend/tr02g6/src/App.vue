<template>
  <div id="app">
    <header>
      <img src="@/assets/cesc2.png" alt="Logo" class="logo" />
    </header>

    <router-view></router-view>

    <footer>
      <div class="footer-container">
        <div class="footer-section">
          <h3>El centre</h3>
          <p>Institut públic (08076391) del districte de Les Corts, amb oferta d'ESO, Batxillerat, CF d'Informàtica, i d'Imatge i so, i PFI (Programes de formació i inserció).</p>
          <span class="brand">Be_Pro <span>Barcelona Ensenyaments Professionalitzadors</span></span>
        </div>

        <div class="footer-section">
          <h3>Legal</h3>
          <ul>
            <li><a href="#">Cookies</a></li>
            <li><a href="#">Avís legal</a></li>
            <li><a href="#">Protecció de dades</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Contacte</h3>
          <p><a href="tel:932033332">93 203 33 32</a></p>
          <p><a href="mailto:inspedralbes@xtec.cat">inspedralbes@xtec.cat</a></p>
          <p><a href="#">Web AFA</a></p>
        </div>

        <div class="footer-section">
          <h3>Adreça</h3>
          <p>Av. Esplugues, 36-42. 08034. Barcelona</p>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2972.4669058011426!2d2.109872315334906!3d41.37834277927186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12a4a39c5441dfe7%3A0x4b81365c56162c10!2sAv.%20d'Esplugues%2C%2036-42%2C%2008034%20Barcelona!5e0!3m2!1sen!2ses!4v1673794723355!5m2!1sen!2ses"
            width="100%" height="150" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
header {
  justify-content: center;
  background-color: white;
}

.logo {
  width: 150px;
  height: auto;
  object-fit: contain;
}

footer {
  background-color: #333;
  color: white;
  padding: 30px;
  font-size: 14px;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
}

.footer-section {
  flex: 1;
  min-width: 50px;
}

.footer-section h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 15px;
}

.footer-section p, .footer-section ul {
  margin-bottom: 10px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin: 5px 0;
}

.footer-section a {
  color: #FF8F00;
  text-decoration: none;
}

.footer-section a:hover {
  text-decoration: underline;
}

.brand {
  font-weight: bold;
  font-size: 18px;
  color: #FF8F00;
}

.brand span {
  font-weight: normal;
  color: white;
}
</style>
