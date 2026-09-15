import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                message: "Token is not found"
            });
        }

        const verifyToken = jwt.verify(
            token,
            process.env.jwtSECTRET
        );

        if (!verifyToken) {
            return res.status(401).json({
                message: "Token is not valid"
            });
        }

        console.log(verifyToken);

        req.userId = verifyToken.id;

        next();

    } catch (error) {
        console.log(`error while verifying token : ${error}`);

        return res.status(501).json({
            message: `error while verifying token : ${error}`
        });
    }
};

export default isAuth;