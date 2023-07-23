const jwt = require("jsonwebtoken");
const prisma = require("../config/db");

//Protect routes
exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token || token == "null") {
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }

  try {
    const decode = await jwt.verify(token, process.env.JWT_SECRET);

    console.log(decode);
    const user = await prisma.user.findFirst({
      where: {
        id: decode.id,
      },
    });
    req.user = user;

    next();
  } catch (err) {
    console.log(err.stack);
    return res
      .status(401)
      .json({ success: false, message: "Not authorize to access this route" });
  }
};
