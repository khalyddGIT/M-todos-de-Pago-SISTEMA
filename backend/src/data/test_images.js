const urls = [
  { id: 1, url: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg' },
  { id: 2, url: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg' },
  { id: 3, url: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg' },
  { id: 4, url: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg' },
  { id: 5, url: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg' },
  { id: 6, url: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg' },
  { id: 7, url: 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg' },
  { id: 8, url: 'https://fakestoreapi.com/img/61mtL6538ML._AC_SX679_.jpg' },
  { id: 9, url: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg' }
];

async function check() {
  for (const u of urls) {
    try {
      const r = await fetch(u.url);
      console.log('ID', u.id, 'Status:', r.status, u.url);
    } catch(e) {
      console.log('ID', u.id, 'ERROR:', e.message);
    }
  }
}

check();
