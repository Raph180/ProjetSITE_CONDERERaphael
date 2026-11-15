const formPret = document.getElementById("form-pret");
const montantPret = document.getElementById("montant-pret");
const tauxPret = document.getElementById("taux-pret");
const dureePret = document.getElementById("duree-pret");
const affichageDuree = document.getElementById("affichage-duree"); // Permet de cibler le texte de la durée
const erreurPret = document.getElementById("erreur-pret");
const corpsTableau = document.getElementById("corps-pret");

function euros(nombre) {
  return nombre.toLocaleString("fr-FR", { style: "currency", currency: "EUR" });
}

// 🟢 C'est ici que la magie de la barre opère en direct :
if (dureePret && affichageDuree) {
  dureePret.addEventListener("input", function () {
    affichageDuree.textContent = dureePret.value + " ans";
  });
}

if (formPret) {
  formPret.addEventListener("submit", function (evenement) {
    evenement.preventDefault();
    erreurPret.textContent = "";

    const capital = parseFloat(montantPret.value.replace(",", "."));
    const tauxAnnuel = parseFloat(tauxPret.value.replace(",", "."));
    const nbAnnees = parseInt(dureePret.value, 10);
    const nbMois = nbAnnees * 12;

    if (isNaN(capital) || capital <= 0) {
      erreurPret.textContent = "Le montant doit être un nombre positif.";
      return;
    }
    if (isNaN(tauxAnnuel) || tauxAnnuel < 0 || tauxAnnuel > 100) {
      erreurPret.textContent = "Le taux doit être compris entre 0 et 100 %.";
      return;
    }
    if (isNaN(nbAnnees) || nbAnnees <= 0) {
      erreurPret.textContent = "La durée doit être un nombre d'années valide.";
      return;
    }

    const t = tauxAnnuel / 100 / 12;

    let mensualite;
    if (t === 0) {
      mensualite = capital / nbMois;
    } else {
      mensualite = capital * t / (1 - Math.pow(1 + t, -nbMois));
    }

    corpsTableau.innerHTML = "";
    let restant = capital;
    let totalInterets = 0;

    for (let annee = 1; annee <= nbAnnees; annee++) {
      let interetsAnnee = 0;
      let capitalRembourseAnnee = 0;

      for (let mois = 1; mois <= 12; mois++) {
        const interetsMois = restant * t;
        const capitalMois = mensualite - interetsMois;
        
        interetsAnnee += interetsMois;
        capitalRembourseAnnee += capitalMois;
        restant = Math.max(0, restant - capitalMois);
      }

      totalInterets += interetsAnnee;

      const ligne = document.createElement("tr");
      [
        "Année " + annee,
        euros(mensualite * 12),
        euros(interetsAnnee),
        euros(capitalRembourseAnnee),
        euros(restant)
      ].forEach(function (valeur) {
        const cellule = document.createElement("td");
        cellule.textContent = valeur;
        ligne.appendChild(cellule);
      });
      corpsTableau.appendChild(ligne);
    }

    const total = mensualite * nbMois;
    document.getElementById("res-mensualite").textContent = euros(mensualite);
    document.getElementById("res-interets").textContent = euros(totalInterets);
    document.getElementById("res-total").textContent = euros(total);

    const partCapital = (capital / total) * 100;
    document.getElementById("barre-capital").style.width = partCapital + "%";
  });
}