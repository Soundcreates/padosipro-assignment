//code by shantanav mukherjee written on 30/09/2026

const bcryptService = require("./bcrypt");
const jwtService = require("./jwt");


const register = async (email,password) => {
    
    try{
       const hashedPassword = await bcryptService.hashPassword(password);
        const checkExistingUser = await pool.query("SELECT * FROM users WHERE email = $1" , [email]);
        if( checkExistingUser){
            throw new Error("User already exists");
        
        }
        const newUser = await pool.query("INSERT INTO users (email,password) VALUES ($1,$2) RETURNING *", [email,hashedPassword] );

        return {"user":newUser, "message": "User registered"};
    }catch(error){ 
        throw new Error(error.message);
    }
};

const login = async (email,password) => {
    try{
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if(!user){
            throw new Error("User not found");   
        }
        const isPasswordValid = await bcryptService.comparePassword(password, user.password);
        if(!isPasswordValid){
            throw new Error("Invalid password");
        }

        const token = await jwtService.generateToken(user.id);
        return {"user":user, "token": token, "message": "Login successfull"};
    }catch(error){
        throw new Error(error.message);
    }
};