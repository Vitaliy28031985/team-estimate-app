import * as mongoose from 'mongoose';

const { DB_HOST } = process.env;

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async (): Promise<typeof mongoose> => {
      try {
        if (
          !DB_HOST.startsWith('mongodb://') &&
          !DB_HOST.startsWith('mongodb+srv://')
        ) {
          throw new Error(
            "Invalid DB_HOST. It must start with 'mongodb://' or 'mongodb+srv://'.",
          );
        }
        return await mongoose.connect(DB_HOST);
      } catch (error) {
        console.error('Database connection error:', error);
        throw error;
      }
    },
  },
];
