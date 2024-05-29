import {Router} from 'express';
import { passportCall} from '../utils.js';
import { getUsersAndRender, getProductsAndRender, getProfileUser, getCart, getMockingProducts, getForgotPassword, loggerTester, renderAdminView, addProductsManager} from '../controller/views.controller.js';

const router = Router();

router.get('/', async (req,res)=>{
    res.render('login');
})

router.get('/signup', async (req,res)=>{
    res.render('signup');
})

router.get('/users', getUsersAndRender);

router.get('/products', getProductsAndRender);

router.get('/perfil', passportCall("jwt", {session: false}), getProfileUser);

router.get('/perfilGithub', passportCall("github", {session: false}), getProfileUser);

router.get('/cart', passportCall("jwt"), getCart)

router.get('/mockingproduct', getMockingProducts);

router.get('/loggerTest', loggerTester);

router.get('/forgotPassword', getForgotPassword);

router.get('/admin', passportCall("jwt", {session: false}), renderAdminView)

router.get('/addProduct', passportCall("jwt", {session: false}), addProductsManager)
  

export default router;