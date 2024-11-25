import mongoose from 'mongoose'
import { DB_NAME } from '../Constants.js'

const ConnectDB = async () => {
  try {
    const connectioninstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`,
    )
    console.log('Mogo connected!!!!!!!!!!')
    // console.log(connectioninstance)
  } catch (error) {
    console.log('Mongodb connection errror', error)
    process.exit(1)
  }
}


export default ConnectDB
