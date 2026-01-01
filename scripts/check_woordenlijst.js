import fs from 'fs';
const path = 'client/public/woordenlijst.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
let found = false;
for (const dag of data.dagen) {
  for (const blok of dag.blokken) {
    for (const rij of blok.rijtjes) {
      if (!Array.isArray(rij.woorden) || rij.woorden.length !== 5) {
        console.log(`Dag ${dag.dag} Blok ${blok.blok} Rij ${rij.rijtje} count ${Array.isArray(rij.woorden)?rij.woorden.length:'no array'}`);
        found = true;
      }
    }
  }
}
if (!found) console.log('All rows have 5 words');
