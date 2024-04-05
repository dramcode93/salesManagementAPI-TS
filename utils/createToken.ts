import Jwt from "jsonwebtoken";
const createToken = (payload: string, name: string, role: string, createdAt: Date): string => { return Jwt.sign({ _id: payload, name, role, createdAt }, process.env.JWT_SECRET_KEY!, { expiresIn: process.env.EXPIRED_TIME }); };
const createResetToken = (payload: string): string => { return Jwt.sign({ _id: payload }, process.env.JWT_RESET_SECRET_KEY!, { expiresIn: process.env.EXPIRED_RESET_TIME }); };
export { createToken, createResetToken };