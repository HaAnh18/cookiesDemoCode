let products = require('../products');

exports.getProducts = (req, res) => {
  res.render("index", {products: products})
}

exports.addToCart = (req, res) => {
  const product = products.find(product => product.id == req.params.id);
  const cartCookie = req.cookies.cart || '[]';
  let cartItems = JSON.parse(decodeURIComponent(cartCookie));
  const checkedProductIndex = cartItems.findIndex(item => item.product.id == req.params.id);
  if (checkedProductIndex === -1) {
    cartItems.push({product: product, quantity: 1})
  } else {
    cartItems[checkedProductIndex].quantity += 1;
  }
  const updatedCartString = JSON.stringify(cartItems);
  res.cookie('cart', updatedCartString, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) , path: '/' });
  res.redirect("/cart");
}

exports.getCart = (req, res) => {
  const cartCookie = req.cookies.cart || '[]';
  const cartItems = JSON.parse(decodeURIComponent(cartCookie));
  const totalQuantity = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  const totalPrice = cartItems.reduce((total, cartItem) => total + (cartItem.quantity * cartItem.product.price), 0).toFixed(2);
  for (var i = 0; i < cartItems.length; i++) {
    cartItems[i].totalPrice = cartItems[i].product.price * cartItems[i].quantity;
  }
  res.render("cart", {carts: cartItems, totalQuantity: totalQuantity, totalPrice: totalPrice})
}

exports.removeProduct = (req, res) => {
  const cartCookie = req.cookies.cart || '[]';
  let cartItems = JSON.parse(decodeURIComponent(cartCookie));
  cartItems = cartItems.filter(item => item.product.id != req.params.id);
  const updatedCartString = JSON.stringify(cartItems);
  res.cookie('cart', updatedCartString, { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) , path: '/' });
  res.redirect("/cart")
}