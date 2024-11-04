export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-secret-key', // In production, use environment variable
  expiresIn: '1d',
};

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}
