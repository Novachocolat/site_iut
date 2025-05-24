<?php
// <!-- filepath: c:\Users\lysan\Documents\personnel\developpement\site_iut\index.php -->
session_start();
$logged_in = isset($_SESSION['user']);
$error = '';

// Connexion à la base de données
$pdo = new PDO('mysql:host=localhost;dbname=portail_iut;charset=utf8mb4', 'user', 'userpass'); // adapte le user/mot de passe

if (isset($_POST['login'])) {
    $user = $_POST['username'] ?? '';
    $pass = $_POST['password'] ?? '';
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
    $stmt->execute([$user]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($row && password_verify($pass, $row['password'])) {
        $_SESSION['user'] = $row['username'];
        $logged_in = true;
    } else {
        $error = "Identifiants incorrects.";
    }
}
if (isset($_POST['logout'])) {
    session_destroy();
    header("Location: index.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Portail IUT</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="css/style_index.css">
  <link rel="icon" href="img/logo_iut.png" type="image/png">
</head>
<body data-theme="light">
  <header>
    <h1><i class="fa-solid fa-graduation-cap"></i><a href="https://www.iut-littoral.fr/" target="_blank">Portail IUTLCO</a></h1>
    <div id="controls">
      <input id="search" type="text" placeholder="Rechercher...">
      <button id="theme-toggle"><i class="fa-regular fa-moon"></i></button>
      <?php if ($logged_in): ?>
        <form method="post" style="display:inline;">
          <button type="submit" name="logout" class="login-btn" style="margin-left:.5rem;">
            <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
          </button>
        </form>
      <?php else: ?>
        <button id="login-btn" class="login-btn" style="margin-left:.5rem;">
          <i class="fa-solid fa-user"></i> Connexion
        </button>
      <?php endif; ?>
    </div>
  </header>
  <?php if (!$logged_in): ?>
    <div id="login-modal" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:1000;align-items:center;justify-content:center;">
      <form method="post" style="background:var(--card-bg);padding:2rem 1.5rem;border-radius:var(--radius);box-shadow:var(--shadow);display:flex;flex-direction:column;gap:1rem;min-width:260px;">
        <div style="font-weight:600;font-size:1.1rem;color:var(--accent);margin-bottom:.5rem;">
          <i class="fa-solid fa-user"></i> Connexion
        </div>
        <?php if ($error): ?>
          <div style="color:#e53935;font-size:.98rem;"><?php echo htmlspecialchars($error); ?></div>
        <?php endif; ?>
        <input type="text" name="username" placeholder="Identifiant" required style="padding:.6rem 1rem;border-radius:var(--radius);border:1px solid #bdbdbd;">
        <input type="password" name="password" placeholder="Mot de passe" required style="padding:.6rem 1rem;border-radius:var(--radius);border:1px solid #bdbdbd;">
        <button type="submit" name="login" style="background:var(--accent);color:#fff;border:none;padding:.7rem 0;border-radius:var(--radius);font-weight:600;cursor:pointer;">
          Se connecter
        </button>
        <button type="button" id="close-login" style="background:none;border:none;color:var(--accent2);font-size:.95rem;cursor:pointer;">Annuler</button>
      </form>
    </div>
  <?php endif; ?>
  <main>
   <section>
      <h2><i class="fa-solid fa-layer-group"></i> Emploi du temps</h2>
      <div class="grid apps">
        <a class="card gea" href="https://edt.univ-littoral.fr/direct/index.jsp?data=6b052c86649c89d6314052e0c2e2410df83de816b8eb8f3bd066c7c3ff96eae0d96b081fc1a619e28edcb5b52c18281858d9e3fb46f326fdf9355e402da57010a9a3c2453eebfdfdb3a09e7f1c48b6784ac7528f840cddad" target="_blank"><i class="fa-solid fa-chart-line"></i> GEA</a>
        <a class="card tc" href="https://edt.univ-littoral.fr/direct/index.jsp?data=6b052c86649c89d6314052e0c2e2410df83de816b8eb8f3b41e9017764513fe4501778c4cc4e5a39aca7048919f9f479f26f6f4abd091a5689dbf61efd053fafb640778efa4cc6c897b4fcde44a75b88ec5cbca184289858" target="_blank"><i class="fa-solid fa-store"></i> TC</a>
        <a class="card info" href="https://edt.univ-littoral.fr/direct/index.jsp?data=6b052c86649c89d6314052e0c2e2410df83de816b8eb8f3b30bcbbeda1e00a2707dd302e5e5e44dba7dd1d493bd139047bbd5a6df9dc5274010fd1cf0671c9ff0a59170d199a10cf4386a3f2eb1f9d2ed9228198d14893f6" target="_blank"><i class="fa-solid fa-laptop-code"></i> INFO</a>
        <a class="card geii" href="https://edt.univ-littoral.fr/direct/index.jsp?data=6b052c86649c89d6314052e0c2e2410df83de816b8eb8f3bcd2570356d1bfad507dd302e5e5e44dba7dd1d493bd139047bbd5a6df9dc5274010fd1cf0671c9ff0a59170d199a10cf4386a3f2eb1f9d2ed9228198d14893f6" target="_blank"><i class="fa-solid fa-bolt"></i> GEII</a>
        <a class="card bio" href="https://edt.univ-littoral.fr/direct/index.jsp?data=6b052c86649c89d6314052e0c2e2410df83de816b8eb8f3b480605f5fbd1a23f501778c4cc4e5a39aca7048919f9f479f26f6f4abd091a5689dbf61efd053fafb640778efa4cc6c897b4fcde44a75b88ec5cbca184289858" target="_blank"><i class="fa-solid fa-dna"></i> BIO</a>
        <a class="card gim" href="https://edt.univ-littoral.fr/direct/index.jsp?data=6b052c86649c89d6314052e0c2e2410df83de816b8eb8f3bcccd7e9e99ffd341d96b081fc1a619e28edcb5b52c18281858d9e3fb46f326fdf9355e402da57010a9a3c2453eebfdfdb3a09e7f1c48b6784ac7528f840cddad" target="_blank"><i class="fa-solid fa-cogs"></i> GIM</a>
        <a class="card gtei" href="https://edt.univ-littoral.fr/direct/index.jsp?data=6b052c86649c89d6314052e0c2e2410df83de816b8eb8f3b8934c50fa3b8da4ad96b081fc1a619e28edcb5b52c18281858d9e3fb46f326fdf9355e402da57010a9a3c2453eebfdfdb3a09e7f1c48b6784ac7528f840cddad" target="_blank"><i class="fa-solid fa-industry"></i> GTE</a>
        <a class="card gaco" href="https://edt.univ-littoral.fr/direct/index.jsp?data=6b052c86649c89d6314052e0c2e2410df83de816b8eb8f3b7bc376237868e87707dd302e5e5e44dba7dd1d493bd139047bbd5a6df9dc5274010fd1cf0671c9ff0a59170d199a10cf4386a3f2eb1f9d2ed9228198d14893f6" target="_blank"><i class="fa-solid fa-briefcase"></i> GACO</a>
      </div>
    </section>
    <section class="tools">
      <h2><i class="fa-solid fa-toolbox"></i> Outils</h2>
      <div class="grid">
        <a class="card webmail" href="https://webmail.univ-littoral.fr" target="_blank"><i class="fa-solid fa-envelope"></i> Webmail Ulco</a>
        <a class="card moodle" href="https://moodle.univ-littoral.fr" target="_blank"><i class="fa-brands fa-moodle"></i> Moodle</a>
        <a class="card" href="https://compte.ulco.fr" target="_blank"><i class="fa-solid fa-user-lock"></i> Compte Ldap</a>
        <a class="card" href="https://jrcan.dev" target="_blank"><i class="fa-solid fa-code"></i> JrCan.dev</a>
        <a class="card" href="http://194.57.179.42/abs/" target="_blank"><i class="fa-solid fa-clipboard-list"></i> Notes</a>
        <a class="card" href="http://wims.univ-littoral.fr/wims/" target="_blank"><i class="fa-solid fa-calculator"></i> WIMS</a>
        <a class="card" href="https://messervices.etudiant.gouv.fr" target="_blank"><i class="fa-solid fa-briefcase"></i> Mes Services Etudiant</a>
        <a class="card" href="notes.html"><i class="fa-solid fa-circle-info"></i> Test - Notes</a>
      </div>
    </section>
    <section>
      <h2><i class="fa-solid fa-calendar-days"></i> Emploi du temps journalier</h2>
      <div class="grid schedule">
        <a class="card info" href="https://extra.jrcan.dev/edt/form_affplusn1.php?dep=2&nbjours=1"><i class="fa-solid fa-laptop-code"></i> INFO</a>
        <a class="card geii" href="https://extra.jrcan.dev/edt/form_affplusn1.php?dep=1&nbjours=1"><i class="fa-solid fa-bolt"></i> GEII</a>
        <a class="card gea" href="https://extra.jrcan.dev/edt/form_affplusn1.php?dep=3&nbjours=1"><i class="fa-solid fa-chart-line"></i> GEA</a>
      </div>
    </section>
    <section>
      <h2><i class="fa-solid fa-file-contract"></i> Règlements et MCCC</h2>
      <ul>
        <li><a href="pdf/reglements/mccc_but_gaco.pdf" target="_blank">MCCC - BUT GACO</a></li>
        <li><a href="pdf/reglements/mccc_but_gb.pdf" target="_blank">MCCC - BUT GB</a></li>
        <li><a href="pdf/reglements/mccc_but_gea.pdf" target="_blank">MCCC - BUT GEA</a></li>
        <li><a href="pdf/reglements/mccc_but_geii.pdf" target="_blank">MCCC - BUT GEII</a></li>
        <li><a href="pdf/reglements/mccc_but_gim.pdf" target="_blank">MCCC - BUT GIM</a></li>
        <li><a href="pdf/reglements/mccc_but_info.pdf" target="_blank">MCCC - BUT INFO</a></li>
        <li><a href="pdf/reglements/mccc_but_mlt.pdf" target="_blank">MCCC - BUT MLT</a></li>
        <li><a href="pdf/reglements/mccc_but_mt2e_app.pdf" target="_blank">MCCC - BUT MT2E APP</a></li>
        <li><a href="pdf/reglements/mccc_but_mt2e_fi.pdf" target="_blank">MCCC - BUT MT2E FI</a></li>
        <li><a href="pdf/reglements/mccc_but_tc_app.pdf" target="_blank">MCCC - BUT TC APP</a></li>
        <li><a href="pdf/reglements/mccc_but_tc_fi.pdf" target="_blank">MCCC - BUT TC FI</a></li>
        <li><a href="pdf/reglements/reglement_but.pdf" target="_blank">Règlement des études BUT</a></li>
        <li><a href="pdf/reglements/reglement_lp.pdf" target="_blank">Règlement des études LP</a></li>
      </ul>
    </section>
    <section>
      <h2><i class="fa-solid fa-file-contract"></i> Rapports Publics Parcoursup </h2>
      <ul>
        <li><a href="pdf/rapports/rapport_gaco.pdf" target="_blank">Rapport GACO</a></li>
        <li><a href="pdf/rapports/rapport_gaco_macast.pdf" target="_blank">Rapport GACO MACAST</a></li>
        <li><a href="pdf/rapports/rapport_gb_sab.pdf" target="_blank">Rapport GB SAB</a></li>
        <li><a href="pdf/rapports/rapport_gb_see.pdf" target="_blank">Rapport GB SEE</a></li>
        <li><a href="pdf/rapports/rapport_gea_app.pdf" target="_blank">Rapport GEA APP</a></li>
        <li><a href="pdf/rapports/rapport_gea_fi.pdf" target="_blank">Rapport GEA FI</a></li>
        <li><a href="pdf/rapports/rapport_geii_app.pdf" target="_blank">Rapport GEII APP</a></li>
        <li><a href="pdf/rapports/rapport_geii_fi.pdf" target="_blank">Rapport GEII FI</a></li>
        <li><a href="pdf/rapports/rapport_gim_app.pdf" target="_blank">Rapport GIM APP</a></li>
        <li><a href="pdf/rapports/rapport_gim_fi.pdf" target="_blank">Rapport GIM FI</a></li>
        <li><a href="pdf/rapports/rapport_info.pdf" target="_blank">Rapport INFO</a></li>
        <li><a href="pdf/rapports/rapport_mlt.pdf" target="_blank">Rapport MLT</a></li>
        <li><a href="pdf/rapports/rapport_mt2e_app.pdf" target="_blank">Rapport MT2E APP</a></li>
        <li><a href="pdf/rapports/rapport_mt2e_fi.pdf" target="_blank">Rapport MT2E FI</a></li>
        <li><a href="pdf/rapports/rapport_tc_app.pdf" target="_blank">Rapport TC APP</a></li>
        <li><a href="pdf/rapports/rapport_tc_fi.pdf" target="_blank">Rapport TC FI</a></li>
      </ul>
    </section>
  </main>
  <footer>
    &copy; 2025 Portail IUT &mdash; Réalisé avec <i class="fa-solid fa-heart"></i> par <a class="github" href="https://github.com/Novachocolat">Lysandre PACE--BOULNOIS</a>
  </footer>
  <script src="js/script_index.js"></script>
</body>
</html>