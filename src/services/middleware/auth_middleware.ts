// import User from "../../database/models/user"
// import { Request, Response, NextFunction } from "express"


// class AuthMiddleware{
//     authActive(req: Request, res: Response, next: NextFunction){
//         let token = req.header("x-auth")
//         if (!token) {
//             token = req.query.xAuth
//         }
//         if (!token) {
//             token = req.session.xAuth
//         }
//         // console.log({"token":token});
//         User.findByToken(token).then((user) => {
//             if (!user) {
//                 return Promise.reject()
//             }
//             req.user = user.toJSON()
//             req.token = token
//             next()
//         }).catch((e) => {
//             // console.log({ 'method': req.method });
//             if (req.method == "GET") {
//                 res.redirect("/login")
//             } else {
//                 res.status(401).send()
//             }
//         })
//     }
// }
// let auth = (req: Request, res: Response, next: NextFunction) => {
//     // console.log('start auth');

   
// }


// let auth_semi = (req: Request, res: Response, next: NextFunction) => {
//     // console.log('start auth');

//     let token = req.header("x-auth")
//     if (!token) {
//         token = req.query.xAuth
//     }
//     if (!token) {
//         token = req.session.xAuth
//     }
//     // console.log({"token":token});
//     User.findByToken(token).then((user) => {
//         if (!user) {
//             return Promise.reject()
//         }

//         req.user = user.toJSON()
//         req.token = token
//         next()
//     }).catch((e) => {
//         // console.log({ 'method': req.method });
//         // if (req.method == 'GET') {
//         //     res.redirect('/login');
//         // } else {
//         //     res.status(401).send();
//         // };
//         req.user = null
//         req.token = null
//         next()
//     })
//     // next();
// }

// let auth_s2 = (req, res, next) => {
//     // console.log('start auth');

//     let token = req.header("x-auth")
//     if (!token) {
//         token = req.query.xAuth
//     }
//     if (!token) {
//         token = req.session.xAuth
//     }
//     // console.log({"token":token});
//     User.findByToken(token).then((user) => {
//         if (!user) {
//             return Promise.reject()
//         }

//         req.user = user.toJSON()
//         req.token = token
//         res.redirect("/me")
//     }).catch((e) => {
//         // console.log({ 'method': req.method });
//         // if (req.method == 'GET') {
//         //     res.redirect('/login');
//         // } else {
//         //     res.status(401).send();
//         // };
//         req.user = null
//         req.token = null
//         next()
//     })
//     // next();
// }
// module.exports = { auth, auth_semi, auth_s2 }
