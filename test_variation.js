async function check() {
  const auth = "Basic " + Buffer.from("ck_9bf278be9d87eb240fd803fa13579d13013bbc03:cs_e9ff8419efab5093b238697a5fbda9edaec4107c").toString("base64");
  
  // Get first variable product
  const pRes = await fetch("https://veloriavault.com/wp-json/wc/v3/products?type=variable&per_page=1", {
    headers: { Authorization: auth }
  });
  const products = await pRes.json();
  if (!products.length) return console.log("No variable products found");
  
  const id = products[0].id;
  console.log("Found Variable Product ID:", id);
  
  // Get variations
  const vRes = await fetch(`https://veloriavault.com/wp-json/wc/v3/products/${id}/variations`, {
    headers: { Authorization: auth }
  });
  const variations = await vRes.json();
  if (!variations.length) return console.log("No variations found");
  
  const v = variations[0];
  console.log("Variation Keys:", Object.keys(v));
  console.log("v.images:", v.images);
  console.log("v.image:", v.image);
}
check();
