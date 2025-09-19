//* packgae imports
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

const hashPassword = async (plainPassword: string): Promise<string> => {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

const verifyPassword = async (
    plainPassword: string,
    hashedPassword: string
): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

export { hashPassword, verifyPassword }
