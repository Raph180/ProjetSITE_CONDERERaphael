
const formulaire = document.getElementById("formulaire");
const champMontant = document.getElementById("montant");
const champTaux = document.getElementById("taux");
const zoneErreur = document.getElementById("erreur");

function formater(nombre) {
  return nombre.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

if (formulaire) {
  formulaire.addEventListener("submit", function (evenement) {
    evenement.preventDefault();     
    zoneErreur.textContent = "";

    const montant = parseFloat(champMontant.value.replace(",", "."));
    const taux = parseFloat(champTaux.value);
    const mode = document.querySelector('input[name="mode"]:checked').value;

    if (isNaN(montant) || montant < 0) {
      zoneErreur.textContent = "Veuillez saisir un montant valide.";
      return;
    }

    let ht, ttc;
    if (mode === "ht") {
      ht = montant;
      ttc = montant * (1 + taux / 100);
    } else {
      ttc = montant;
      ht = montant / (1 + taux / 100);
    }
    const tva = ttc - ht;

    document.getElementById("res-ht").textContent = formater(ht);
    document.getElementById("res-tva").textContent = formater(tva);
    document.getElementById("res-ttc").textContent = formater(ttc);
  });
}
