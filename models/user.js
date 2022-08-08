const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
  const cartItems = this.cart.items;
  const targetProductIndex = cartItems.findIndex(
    (item) => item.productId.toString() === product._id.toString()
  );
  if (targetProductIndex >= 0) {
    cartItems[targetProductIndex].quantity += 1;
  } else {
    cartItems.push({
      product: product._id,
      quantity: 1,
    });
  }
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter(
    (item) => item.product.toString() !== productId.toString()
  );
  this.cart.items = updatedCartItems;
  return this.save();
};

module.exports = model("User", userSchema);

// const { ObjectId } = require("mongodb");

// class User {
//   constructor(name, email, cart, _id) {
//     this.name = name;
//     this.email = email;
//     this.cart = cart; // { items: [] }
//     this._id = new ObjectId(_id);
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: this._id,
//             name: this.name,
//           },
//         };
//         return db.collection("orders").insertOne(order);
//       })
//       .then((result) => {
//         this.cart = { items: [] }; // optional??
//         return db
//           .collection("users")
//           .updateOne({ _id: this._id }, { $set: { cart: { items: [] } } });
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db.collection("orders").find({ "user._id": this._id }).toArray();
//   }

//   static findById(userId) {
//     const db = getDb();
//     return db.collection("users").findOne({ _id: new ObjectId(userId) });
//   }
// }

// module.exports = User;
