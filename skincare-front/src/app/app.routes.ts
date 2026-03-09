import { Routes } from '@angular/router';
import { Layout } from './component/layout/layout';
import {Footer} from './component/layout/footer/footer';    
import {Header} from './component/layout/header/header';
import { ShopComponent } from './component/shop/shop';
import { SingleProduct } from './component/single-product/single-product';
import { Index } from './component/index/index';

export const routes: Routes = [
    {
        path: '',
        component: Layout,
        children: [
            { path : '' , component : Index },  
            { path : 'shop' , component : ShopComponent },
            { path  : 'single-product', component: SingleProduct},
        ]
    },

];
