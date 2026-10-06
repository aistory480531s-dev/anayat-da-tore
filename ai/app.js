const WHATSAPP = "923263440140";
const PRODUCTS_KEY = "anayat_products";
const USERS_KEY = "anayat_users";
const ORDERS_KEY = "anayat_orders";
const SESSION_KEY = "anayat_session";
const CART_KEY = "anayat_cart";

const defaultProducts = [
 {id:1,name:"Classic Black Shirt",category:"men",price:2499,image:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=80"},
 {id:2,name:"Premium Men's Kurta",category:"men",price:2999,image:"https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=900&q=80"},
 {id:3,name:"Elegant Women's Dress",category:"women",price:3999,image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=80"},
 {id:4,name:"Women's Casual Outfit",category:"women",price:3299,image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80"},
 {id:5,name:"Denim Jacket",category:"men",price:4499,image:"https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=80"},
 {id:6,name:"Women's Blazer",category:"women",price:4999,image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=900&q=80"}
];

const get = k => JSON.parse(localStorage.getItem(k) || "null");
const set = (k,v) => localStorage.setItem(k, JSON.stringify(v));
if(!get(PRODUCTS_KEY)) set(PRODUCTS_KEY,defaultProducts);
if(!get(USERS_KEY)) set(USERS_KEY,[]);
if(!get(ORDERS_KEY)) set(ORDERS_KEY,[]);
if(!get(CART_KEY)) set(CART_KEY,[]);

let filter="all";

document.addEventListener("DOMContentLoaded",()=>{
  const session=get(SESSION_KEY);
  if(session) showStore(); else showAuth();
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>switchAuth(b.dataset.auth));
  document.getElementById("loginForm").onsubmit=login;
  document.getElementById("signupForm").onsubmit=signup;
  document.getElementById("logoutBtn").onclick=logout;
  document.getElementById("cartBtn").onclick=openCart;
  document.getElementById("checkoutBtn").onclick=openCheckout;
  document.getElementById("checkoutForm").onsubmit=placeOrder;
  document.getElementById("ordersBtn").onclick=openOrders;
  document.getElementById("searchBox").oninput=renderProducts;
  document.querySelectorAll(".nav-btn[data-filter]").forEach(b=>b.onclick=()=>{filter=b.dataset.filter;renderProducts()});
});

function switchAuth(type){
 document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x.dataset.auth===type));
 document.getElementById("loginForm").classList.toggle("hidden",type!=="login");
 document.getElementById("signupForm").classList.toggle("hidden",type!=="signup");
}
function showAuth(){document.getElementById("authScreen").classList.remove("hidden");document.getElementById("storeApp").classList.add("hidden")}
function showStore(){document.getElementById("authScreen").classList.add("hidden");document.getElementById("storeApp").classList.remove("hidden");renderProducts();updateCart()}
function signup(e){
 e.preventDefault();
 const name=signupName.value.trim(),phone=signupPhone.value.trim(),email=signupEmail.value.trim().toLowerCase(),password=signupPassword.value;
 let users=get(USERS_KEY);
 if(users.some(u=>u.email===email)){signupMsg.textContent="Email already registered.";return}
 users.push({id:Date.now(),name,phone,email,password});set(USERS_KEY,users);
 set(SESSION_KEY,{id:users.at(-1).id,name,phone,email});
 showStore();
}
function login(e){
 e.preventDefault();
 const email=loginEmail.value.trim().toLowerCase(),password=loginPassword.value;
 const u=(get(USERS_KEY)||[]).find(x=>x.email===email&&x.password===password);
 if(!u){loginMsg.textContent="Invalid email or password.";return}
 set(SESSION_KEY,{id:u.id,name:u.name,phone:u.phone,email:u.email});showStore();
}
function logout(){localStorage.removeItem(SESSION_KEY);localStorage.removeItem(CART_KEY);location.reload()}
function renderProducts(){
 const q=(document.getElementById("searchBox").value||"").toLowerCase();
 const ps=get(PRODUCTS_KEY)||[];
 const list=ps.filter(p=>(filter==="all"||p.category===filter)&&p.name.toLowerCase().includes(q));
 productGrid.innerHTML=list.map(p=>`<article class="product">
 <img src="${p.image}" alt="${escapeHtml(p.name)}">
 <div class="product-info"><span class="category">${p.category}</span><h3>${escapeHtml(p.name)}</h3>
 <div class="product-meta"><span class="price">Rs. ${Number(p.price).toLocaleString()}</span></div>
 <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button></div></article>`).join("") || "<p>No products found.</p>";
}
function addToCart(id){
 const c=get(CART_KEY)||[];const item=c.find(x=>x.id===id);
 if(item)item.qty++;else c.push({id,qty:1});
 set(CART_KEY,c);updateCart();openCart();
}
function updateCart(){
 const c=get(CART_KEY)||[],ps=get(PRODUCTS_KEY)||[];
 document.getElementById("cartCount").textContent=c.reduce((a,b)=>a+b.qty,0);
 cartItems.innerHTML=c.length?c.map(x=>{
  const p=ps.find(y=>y.id===x.id);return `<div class="cart-row"><img src="${p.image}"><div><b>${escapeHtml(p.name)}</b><div>Rs. ${Number(p.price).toLocaleString()}</div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button>${x.qty}<button onclick="changeQty(${p.id},1)">+</button></div></div><b>Rs. ${(p.price*x.qty).toLocaleString()}</b></div>`
 }).join(""):"<p class='muted'>Your cart is empty.</p>";
 const total=cartTotalValue();document.getElementById("cartTotal").textContent="Rs. "+total.toLocaleString();document.getElementById("checkoutTotal").textContent="Rs. "+total.toLocaleString();
}
function cartTotalValue(){const c=get(CART_KEY)||[],ps=get(PRODUCTS_KEY)||[];return c.reduce((s,x)=>{const p=ps.find(y=>y.id===x.id);return s+(p?p.price*x.qty:0)},0)}
function changeQty(id,n){let c=get(CART_KEY)||[],x=c.find(y=>y.id===id);if(x)x.qty+=n;c=c.filter(y=>y.qty>0);set(CART_KEY,c);updateCart()}
function openCart(){cartDrawer.classList.remove("hidden");updateCart()}function closeCart(){cartDrawer.classList.add("hidden")}
function openCheckout(){
 if(!(get(CART_KEY)||[]).length){alert("Cart is empty.");return}
 closeCart();checkoutModal.classList.remove("hidden");
 const s=get(SESSION_KEY);customerName.value=s.name||"";customerPhone.value=s.phone||"";customerAddress.value="";
 document.getElementById("orderSuccess").classList.add("hidden");document.getElementById("checkoutForm").classList.remove("hidden");updateCart();
}
function closeCheckout(){checkoutModal.classList.add("hidden")}
function placeOrder(e){
 e.preventDefault();
 const c=get(CART_KEY)||[],ps=get(PRODUCTS_KEY)||[],s=get(SESSION_KEY);
 const items=c.map(x=>{const p=ps.find(y=>y.id===x.id);return {id:p.id,name:p.name,price:p.price,qty:x.qty}}),total=items.reduce((a,x)=>a+x.price*x.qty,0);
 const order={id:"ADS-"+Date.now().toString().slice(-8),date:new Date().toLocaleString(),userId:s.id,customerName:customerName.value.trim(),phone:customerPhone.value.trim(),address:customerAddress.value.trim(),payment:paymentMethod.value,items,total,status:"Pending"};
 const orders=get(ORDERS_KEY)||[];orders.unshift(order);set(ORDERS_KEY,orders);set(CART_KEY,[]);
 const lines=items.map(x=>`• ${x.name} x${x.qty} = Rs. ${x.price*x.qty}`).join("\n");
 const msg=`*ANAYAT DA STORE - NEW ORDER*%0A%0AOrder: ${order.id}%0ACustomer: ${encodeURIComponent(order.customerName)}%0APhone: ${encodeURIComponent(order.phone)}%0AAddress: ${encodeURIComponent(order.address)}%0A%0A${encodeURIComponent(lines)}%0A%0ATotal: Rs. ${total.toLocaleString()}%0APayment: ${encodeURIComponent(order.payment)}`;
 const wa=`https://wa.me/${WHATSAPP}?text=${msg}`;
 checkoutForm.classList.add("hidden");orderSuccess.classList.remove("hidden");
 orderSuccess.innerHTML=`<b>Order placed successfully!</b><br>Order #${order.id}<br><br><a class="primary-btn" target="_blank" href="${wa}">Send Order on WhatsApp</a>`;
 updateCart();
}
function openOrders(){
 const s=get(SESSION_KEY),orders=(get(ORDERS_KEY)||[]).filter(o=>o.userId===s.id);
 ordersList.innerHTML=orders.length?orders.map(o=>`<div class="order-card"><div><b>#${o.id}</b> <span class="status">${o.status}</span></div><small>${o.date}</small><div class="order-items">${o.items.map(i=>`${escapeHtml(i.name)} × ${i.qty}`).join(" · ")}</div><b>Total: Rs. ${o.total.toLocaleString()}</b></div>`).join(""):"<p class='muted'>No orders yet.</p>";
 ordersModal.classList.remove("hidden");
}
function closeOrders(){ordersModal.classList.add("hidden")}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
