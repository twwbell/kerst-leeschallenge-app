#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const file = path.resolve(process.cwd(), 'client', 'public', 'woordenlijst.json');
console.log('Reading', file);
const raw = fs.readFileSync(file, 'utf8');
const data = JSON.parse(raw);

const globalPool = [];
for (const dag of data.dagen) {
  for (const blok of dag.blokken || []) {
    for (const rij of blok.rijtjes || []) {
      for (const w of rij.woorden || []) globalPool.push(w);
    }
  }
}

function normalizeDay(dag) {
  const dayPool = [];
  for (const blok of dag.blokken || []) {
    for (const rij of blok.rijtjes || []) {
      for (const w of rij.woorden || []) dayPool.push(w);
    }
  }
  // fallback to global pool if day pool is empty
  const pool = dayPool.length ? dayPool : globalPool;
  let poolIdx = 0;
  const nextWord = () => {
    if (!pool.length) return 'leeg';
    const w = pool[poolIdx % pool.length];
    poolIdx += 1;
    return w;
  };

  dag.blokken = Array.isArray(dag.blokken) ? dag.blokken.slice(0, 10) : [];

  // ensure exactly 10 blocks
  for (let bi = 0; bi < 10; bi++) {
    let block = dag.blokken[bi];
    if (!block) {
      block = { blok: bi + 1, rijtjes: [] };
      dag.blokken[bi] = block;
    } else {
      block.blok = bi + 1;
    }

    block.rijtjes = Array.isArray(block.rijtjes) ? block.rijtjes.slice(0, 4) : [];

    // ensure exactly 4 rows per block
    for (let ri = 0; ri < 4; ri++) {
      let row = block.rijtjes[ri];
      if (!row) {
        row = { rijtje: ri + 1, woorden: [] };
        block.rijtjes[ri] = row;
      } else {
        row.rijtje = ri + 1;
        row.woorden = Array.isArray(row.woorden) ? row.woorden : [];
      }

      // trim or pad to 5 words
      if (row.woorden.length > 5) row.woorden = row.woorden.slice(0, 5);
      while (row.woorden.length < 5) {
        row.woorden.push(nextWord());
      }
    }
  }
}

for (const dag of data.dagen) {
  normalizeDay(dag);
}

fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Normalized woordenlijst.json');
