import mongoose,{Document, Schema} from "mongoose";

// we write schemas for mongodb through mongoose

// here we're defining that schema will be a document of mongoose
export interface Message extends Document{
 
    content : string;
    createdAt : Date;
}

// the below syntax Schema<> is used to define custom schemas
const MessageSchema: Schema<Message> = new Schema({
    content: {
        // so in mongoose we write String with capital S while in typescipt small S
        type: String,
        required : true
    },
    createdAt : {
        type: Date,
        required : true,
        default : Date.now
    }
})


export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry : Date;
    isVerified:  boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}


const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required : [true, 'Username is required'],
        trim : true,
        unique : true
    },
    email : {
        type : String,
        required : [true, "Email is required"],
        unique : true,
        // match : [regular expression, error message]
        match : [/.+\@.+\..+/,'Please use a valid email address'],
    },
    password : {
        type : String,
        required : [true, "Password is required"]
    },
    verifyCode : {
        type : String,
        required : [true, 'Verification code is required']
    },
    verifyCodeExpiry : {
        type : Date,
        required : [true,'Verification code expiry is required']
    },
    isVerified : {
        type : Boolean,
        default : false
    },
    isAcceptingMessage : {
        type: Boolean,
        default : true
    },
    // messages has it's own document of array so in array we'll add the messageSchema as the message array is of it
    messages : [MessageSchema]
})


// Now exporting the model 
// Check if the 'User' model already exists in mongoose.models
// This prevents model duplication errors in development (especially in Next.js)
const userModel = (mongoose.models.User as mongoose.Model<User>) ||
// If 'User' model doesn't exist, create a new one using mongoose.model()
mongoose.model<User>('User',userSchema)

// 'User' is the model name (MongoDB will use 'users' collection)
// 'userSchema' is the schema defining the structure of user documents

// Exporting the userModel to be used across the application

export default userModel;