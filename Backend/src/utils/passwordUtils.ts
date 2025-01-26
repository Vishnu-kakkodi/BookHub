import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;

export const PasswordUtils = {
    async hashPassword(password: string): Promise<string> {
        try {
            const salt = await bcrypt.genSalt(SALT_ROUNDS);
            const hash = await bcrypt.hash(password, salt);
            return hash;
        } catch (error) {
            throw new Error('Password hashing failed');
        }
    },

    async comparePassword(password: string, hash: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            throw new Error('Password comparison failed');
        }
    }
}