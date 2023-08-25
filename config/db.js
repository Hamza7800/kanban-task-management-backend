import mongoose from 'mongoose';


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_USERNAME);
    console.log(`MongoDB Connected: ${ conn?.connection?.host }`);
  } catch (err) {
    console.log(`Error: ${ err?.message }`);
    process.exit(1);
  }
};


export default connectDB;