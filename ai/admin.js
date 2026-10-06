const ADMIN_KEY="anayat_admin";
const PRODUCTS_KEY="anayat_products",ORDERS_KEY="anayat_orders";
const products=()=>JSON.parse(localStorage.getItem(PRODUCTS_KEY)||"[]");
const orders=()=>JSON.parse(localStorage.getItem(ORDERS_KEY)||"[]");
document.addEventListener("DOMContentLoaded",()=>{if(localStorage.getItem(ADMIN_KEY)==="yes")showAdmin();adminLoginForm.onsubmit=login});
function login(e){e.preventDefault();if(adminUser.value==="admin"&&adminPass.value==="admin123"){localStorage.setItem(ADMIN_KEY,"yes");showAdmin()}else adminMsg.textContent="Wrong username or password."}
function showAdmin(){adminLogin.classList.add("hidden");adminApp.classList.remove("hidden");showOrders()}
function adminLogout(){localStorage.removeItem(ADMIN_KEY);location.reload()}
function showOrders(){
 const os=orders();adminContent.innerHTML=`<div class="section-head"><div><p class="eyebrow">ADMIN DASHBOARD</p><h2>Customer Orders (${os.length})</h2></div></div>`+
 (os.length?os.map(o=>`<div class="order-card"><h3>#${o.id} <span class="status">${o.status}</span></h3><p><b>${esc(o.customerName)}</b> · ${esc(o.phone)}<br>${esc(o.address)}</p><div class="order-items">${o.items.map(i=>`${esc(i.name)} × ${i.qty} = Rs. ${(i.price*i.qty).toLocaleString()}`).join("<br>")}</div><p><b>Total: Rs. ${o.total.toLocaleString()}</b> · ${o.payment}<br><small>${o.date}</small></p><select onchange="updateStatus('${o.id}',this.value)"><option>Pending</option><option>Confirmed</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select></div>`).join(""):"<p>No orders yet.</p>");
}
function updateStatus(id,status){let os=orders(),o=os.find(x=>x.id===id);if(o)o.status=status;localStorage.setItem(ORDERS_KEY,JSON.stringify(os));showOrders()}
function showProducts(){
 const ps=products();adminContent.innerHTML=`<div class="section-head"><div><p class="eyebrow">CATALOGUE</p><h2>Products</h2></div></div>
 <div class="modal-card" style="width:100%;margin-bottom:25px"><h3>Add Product</h3><form id="productForm" class="auth-form"><input id="pName" placeholder="Product name" required><select id="pCat"><option value="men">Men</option><option value="women">Women</option></select><input id="pPrice" type="number" placeholder="Price" required><input id="pImage" placeholder="Image URL" required><button class="primary-btn">Add Product</button></form></div>
 ${ps.map(p=>`<div class="order-card"><b>${esc(p.name)}</b> — Rs. ${p.price.toLocaleString()} (${p.category}) <button class="logout-btn" onclick="deleteProduct(${p.id})">Delete</button></div>`).join("")}`;
 productForm.onsubmit=e=>{e.preventDefault();let ps=products();ps.push({id:Date.now(),name:pName.value,category:pCat.value,price:Number(pPrice.value),image:pImage.value});localStorage.setItem(PRODUCTS_KEY,JSON.stringify(ps));showProducts()}
}
function deleteProduct(id){localStorage.setItem(PRODUCTS_KEY,JSON.stringify(products().filter(p=>p.id!==id)));showProducts()}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
