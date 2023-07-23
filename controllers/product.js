const prisma = require("../config/db");

exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      select: {
        images: true,
        category: true,
        comments: true,
        price: true,
        product_name: true,
        rating: true,
      },
    });
    res.status(200).send(products);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const { id } = req.body;

    const product = await prisma.product.findFirst({
      where: {
        id,
      },
      select: {
        images: true,
        category: true,
        comments: true,
        description: true,
        price: true,
        product_name: true,
        rating: true,
        id: true,
      },
    });

    const comments = await prisma.comment.findMany({
      where: {
        product_id: product.id,
      },
    });

    const sumRating = comments.reduce((acc, data) => {
      return (acc += data.rating);
    }, 0);

    const rating = comments.length === 0 ? 0 : sumRating / comments.length;
    res
      .status(200)
      .send({ product, comments, rating, numCustomerReviews: comments.length });
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};

exports.getPurchaseHistory = async (req, res, next) => {
  try {
    const { id } = req.user;
    const purchaseHistory = await prisma.purchase_History.findMany({
      where: {
        user_id: id,
      },
      include: {
        comment: true,
      },
    });

    const result = [];

    await Promise.all(
      purchaseHistory.map(async (item) => {
        const product = await prisma.product.findFirst({
          where: {
            id: item.product_id,
          },
        });

        result.push({
          purchaseHistory: item.id,
          productId: product.id,
          productName: product.product_name,
          productPrice: product.price,
          productDescription: product.description,
          quantity: item.quantity,
          comment: item.comment
            ? {
                comment: item.comment.description,
                rating: item.comment.rating,
              }
            : null,
        });
      })
    );
    res.status(200).send(result);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { id, username } = req.user;
    const { description, rating, purchaseHistoryId } = req.body;

    if (
      !description ||
      !rating ||
      typeof rating !== "number" ||
      rating < 0 ||
      typeof description !== "string"
    ) {
      throw new Error("Invalid");
    }

    const data = await prisma.purchase_History.findFirst({
      where: {
        id: purchaseHistoryId,
      },
      select: {
        comment: true,
        created_at: true,
        id: true,
        product: true,
        user: true,
        product_id: true,
      },
    });
    const product = await prisma.product.findFirst({
      where: {
        id: data.product_id,
      },
    });

    if (!data || data.comment) {
      throw new Error("Invalid");
    }
    console.log(data);
    await prisma.comment.create({
      data: {
        description,
        username,
        rating,
        product: {
          connect: {
            id: data.product_id,
          },
        },
        purchase_history: {
          connect: {
            id: purchaseHistoryId,
          },
        },
      },
    });

    const purchaseHistory = await prisma.purchase_History.findMany({
      where: {
        user_id: id,
      },
      include: {
        comment: true,
      },
    });

    const purchase_History = await prisma.comment.findMany({
      where: {
        product_id: product.id,
      },
    });
    await prisma.product.update({
      where: {
        id: product.id,
      },
      data: {
        rating:
          (product.rating + purchaseHistory.length) /
          (purchaseHistory.length + 1),
      },
    });

    const result = [];

    await Promise.all(
      purchaseHistory.map(async (item) => {
        const product = await prisma.product.findFirst({
          where: {
            id: item.product_id,
          },
        });

        result.push({
          purchaseHistory: item.id,
          productId: product.product_id,
          productName: product.product_name,
          productPrice: product.price,
          productDescription: product.description,
          comment: item.comment
            ? {
                comment: item.comment.description,
                rating: item.comment.rating,
              }
            : null,
        });
      })
    );
    res.status(200).send(result);
  } catch (err) {
    console.log(err.stack);
    res.status(400).json({ success: false });
  }
};
