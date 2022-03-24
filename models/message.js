const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");


const MessageSchema = new Schema(
  {
   title: {type: String, required: true},
   text:{type: String, required: true},
   date:{type:Date,required:true},
   user:{type:Schema.Types.ObjectId,ref:'User',required:true}
  })


  MessageSchema.virtual('url')
  .get(function(){
return '/message/' + this._id
  });

  MessageSchema
.virtual('formatted_date')
.get(function () {
  return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATETIME_MED);
});

module.exports = mongoose.model('Message',MessageSchema);
    

