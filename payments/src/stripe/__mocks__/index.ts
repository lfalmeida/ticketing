export const stripe = {
  charges: {
    create: jest.fn().mockResolvedValue({ id: Math.random().toString(36).substring(8) }),
  }
};