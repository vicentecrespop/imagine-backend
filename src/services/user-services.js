import { ObjectId } from 'mongodb'
import UserModel from '../schema/user-schema.js'

export class UserService {

    async create(user) {
        await UserModel.create(user)
    }

    async findAll() {
        return await UserModel.find()
    }

    async find(id) {
        return await UserModel.findById(ObjectId(id))
    }

    async delete(id) {
        await UserModel.findOneAndDelete({_id: ObjectId(id)})
    }

    async update(id, user) {
        await UserModel.updateOne({_id: ObjectId(id)}, user)
    }

    async findByEmail(email) {
        return await UserModel.findOne({ email: email })
    }

    async login(email, password) {
        if(email, password) {
            const user = await this.findByEmail(email)
            console.log(user)
            if(user) {
                const auth = user.password === password 
                if(auth) {
                    return user
                }
                return null
            }
            return null
        }
        return null
    }
 }