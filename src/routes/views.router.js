import {Router} from 'express';
import { passportCall } from '../utils.js';
import { getUsersAndRender, getProductsAndRender, getProfile, getCart, getMockingProducts, getForgotPassword, loggerTester} from '../controller/views.controller.js';

const router = Router();

router.get('/', async (req,res)=>{
    res.render('login');
})

router.get('/signup', async (req,res)=>{
    res.render('signup');
})

router.get('/users', getUsersAndRender);

router.get('/products', getProductsAndRender);

router.get('/perfil', passportCall("jwt"), getProfile);

router.get('/cart', passportCall("jwt"), getCart)

router.get('/mockingproduct', getMockingProducts);

router.get('/loggerTest', loggerTester);

router.get('/forgotPassword', getForgotPassword);
  

export default router;