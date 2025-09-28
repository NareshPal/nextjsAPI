import {Schema, model, models} from 'mongoose'


const UserSchema = new Schema({
    email:{
        type:String,
        unique:[true, 'Email is already is exists'],
        required:[true, 'Email is required']
    },
    username:{
        type:String,
        required:[true, 'Username is required'],
    },
    password:{
        type:String,
        required:[true, 'Password is required']
    }
},

{
    timestamps:true
})

const User = models.User || model('User', UserSchema)

export default User
