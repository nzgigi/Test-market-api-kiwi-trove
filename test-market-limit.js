const BASE_URL = "https://kiwiapi.aallyn.xyz/v1/market/daily";
const ITEM_NAME = "Carpet Talisman"; // item à mettre
const STEP = 1;
const MAX_TEST_DAYS = 365;

// Node 18+ has fetch built in
if (typeof fetch !== "function") {
  console.error("❌ fetch non disponible. Utilise Node 18+");
  process.exit(1);
}

(async () => {
  console.log("🔍 Recherche de la limite API...");
  console.log(`➡️  Item: ${ITEM_NAME}`);
  console.log("──────────────────────────────");

  let lastValidDays = null;

  for (let days = STEP; days <= MAX_TEST_DAYS; days += STEP) {
    try {
      const url = new URL(BASE_URL);
      url.searchParams.set("item", ITEM_NAME);
      url.searchParams.set("days", days.toString());

      const res = await fetch(url.toString());

      if (!res.ok) {
        console.log(`⛔ Rejet à ${days} jours (HTTP ${res.status})`);
        break;
      }

      const json = await res.json();

      if (!Array.isArray(json) || json.length === 0) {
        console.log(`⚠️ Données vides à ${days} jours`);
        break;
      }

      lastValidDays = days;
      process.stdout.write(`✅ OK ${days}j (${json.length} jours reçus)\r`);
    } catch (err) {
      console.log(`🔥 Erreur à ${days} jours:`, err.message);
      break;
    }
  }

  console.log("\n──────────────────────────────");

  if (lastValidDays !== null) {
    console.log(
      `🎯 LIMITE DÉTECTÉE : ${lastValidDays} jours maximum`
    );
  } else {
    console.log("❌ Aucune valeur valide trouvée");
  }
})();
