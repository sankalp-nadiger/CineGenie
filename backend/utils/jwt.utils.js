import jwt from "jsonwebtoken";

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, "your_secret_key", {
        expiresIn: "1h",
    });
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, "your_secret_key");
    } catch (error) {
        return null;
    }
};