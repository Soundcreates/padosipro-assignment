const bcrypt = require("bcrypt");

const hashPassword = async (pasword) => {
    if(password == null || password == undefined || password == ""){
        throw new Error("Password is required");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
};

const comparePassword = async (password, hashedPassword) => {
    try{

    if(password == null || password == undefined || password == ""){
        throw new Error("Password is required");
    }
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if(!isMatch){
            throw new Error("Invalid password");
        }
        return isMatch;
    }catch(error){
        throw new Error(error.message);
    }
};

module.exports = { hashPassword, comparePassword };