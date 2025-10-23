import jwt from "jsonwebtoken";

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // check if header exists and starts with Bearer
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // extract token only (remove "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized from backend" });
  }
};

export default protect;
