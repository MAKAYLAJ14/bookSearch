import User from '../models/User.js'; 
import jwt from 'jsonwebtoken'; // For token generation

const secret = process.env.JWT_SECRET_KEY || ''; 

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: { user: { _id: any; }; }) => {
      if (context.user) {
        return User.findById(context.user._id).populate('savedBooks');
      }
      throw new Error('Not authenticated');
    },
    users: async () => {
      return User.find().populate('savedBooks');
    },
    user: async (_parent: any, { username }: any) => {
      return User.findOne({ username }).populate('savedBooks');
    },
  },
  
  Mutation: {
    login: async (_parent: any, { email, password }: any) => {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new Error('Incorrect credentials');
      }
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '1h' });
      return { token, user };
    },
    addUser: async (_parent: any, { username, email, password }: any) => {
      const user = await User.create({ username, email, password });
      const token = jwt.sign({ _id: user._id }, secret, { expiresIn: '1h' });
      return { token, user };
    },
    saveBook: async (_parent: any, { bookId, authors, description, title, image, link }: any, context: { user: { _id: any; }; }) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $addToSet: { savedBooks: { bookId, authors, description, title, image, link } } },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new Error('Not authenticated');
    },
    removeBook: async (_parent: any, { bookId }: any, context: { user: { _id: any; }; }) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          context.user._id,
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        ).populate('savedBooks');
        return updatedUser;
      }
      throw new Error('Not authenticated');
    },
  },
};