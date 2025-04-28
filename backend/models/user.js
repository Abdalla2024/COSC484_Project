const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
      },
      password: { 
        type: String, 
        required: true 
      },
      listings: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Listing' 
      }],
      reviews: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Review' 
      }],
      rating: { 
        type: Number, 
        default: 0 
      },
      profileImage: {
        type: String,
        default: 'https://i.imgur.com/3g7nmJC.jpg'
      },
      favorites: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Listing' 
      }],
      messages: [{
        from: { 
          type: Schema.Types.ObjectId, 
          ref: 'User' 
        },
        to: { 
          type: Schema.Types.ObjectId, 
          ref: 'User' 
        },
        content: String,
        timestamp: { 
          type: Date, 
          default: Date.now 
        },
      }],
      createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

