const authRouter = requrie("express").Router();



authRouter.post("/register", (req,res) => {
        //register logic here
});

authRouter.post("/login", (req,res) => {
    //login logic here
});
module.exports = authRouter;