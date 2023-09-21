const mongooose = require('mongoose');

const connectDatabase = () => {
    console.log("Waiting connection with database...");
    
    mongooose.connect(
        "mongodb+srv://pedrohenriquereisdeoliveira:Mt4h3mHehUCAnsuj@cluster0.ba6ex9t.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp",
        {useNewUrlParser: true, useUnifiedTopology:true}
        ).then(()=> console.log("MongoDB Atlas Connected"))
        .catch((error) => console.log(error));
};

module.exports = connectDatabase;