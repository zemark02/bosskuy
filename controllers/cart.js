const prisma = require("../config/db");

exports.getCart = async (req, res, next) => {
  try {
    const { id } = req.user;
    const cartProducts = await prisma.cartProducts.findMany({
      where: {
        userId: id,
      },
    });

    const result = [];
    await Promise.all(
      cartProducts.map(async (item) => {
        const product = await prisma.product.findFirst({
          where: {
            id: item.product_id,
          },
        });
        const images = await prisma.image.findMany({
          where: {
            product_id: product.id,
          },
        });
        result.push({
          productId: item.product_id,
          quantity: item.quantity,
          productDescription: product.description,
          productPrice: product.price,
          productName: product.product_name,
          images,
        });
      })
    );

    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity < 0) {
      throw new Error("Invalid");
    }
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!product || typeof quantity !== "number") {
      throw new Error("Product not found");
    }

    const productFromCart = await prisma.cartProducts.findFirst({
      where: {
        userId: id,
        product_id: productId,
      },
    });
    const cartUser = await prisma.cart.findFirst({
      where: {
        user_id: id,
      },
    });
    if (productFromCart) {
      await prisma.cartProducts.update({
        where: {
          cart_id_product_id: {
            cart_id: cartUser.id,
            product_id: productId,
          },
        },
        data: {
          quantity,
        },
      });
    } else {
      await prisma.cartProducts.create({
        data: {
          quantity,
          userId: id,
          product: {
            connect: {
              id: productId,
            },
          },
          cart: {
            connect: {
              id: cartUser.id,
            },
          },
          // cart_id: cartUser.cart_id,
        },
      });
    }
    const cartProducts = await prisma.cartProducts.findMany({
      where: {
        userId: id,
      },
    });

    const result = [];
    await Promise.all(
      cartProducts.map(async (item) => {
        const product = await prisma.product.findFirst({
          where: {
            id: item.product_id,
          },
        });
        const images = await prisma.image.findMany({
          where: {
            product_id: product.id,
          },
        });
        result.push({
          productId: item.product_id,
          quantity: item.quantity,
          productDescription: product.description,
          productPrice: product.price,
          productName: product.product_name,
          images,
        });
      })
    );

    console.log(result);
    res.status(200).send(result);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const { id } = req.user;
    await prisma.cartProducts.deleteMany({
      where: {
        userId: id,
      },
    });
    res.status(200).send([]);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};

exports.checkout = async (req, res, next) => {
  try {
    const { id } = req.user;

    const data = await prisma.cartProducts.findMany({
      where: {
        userId: id,
      },
    });

    await Promise.all(
      data.map(async (item) => {
        console.log(item.quantity);
        await prisma.purchase_History.create({
          data: {
            product: {
              connect: {
                id: item.product_id,
              },
            },
            user: {
              connect: {
                id,
              },
            },
            quantity: item.quantity,
          },
        });
      })
    );
    await prisma.cartProducts.deleteMany({
      where: {
        userId: id,
      },
    });
    res.status(200).send([]);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};
