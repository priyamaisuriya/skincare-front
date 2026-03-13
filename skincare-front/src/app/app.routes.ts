import { Routes } from '@angular/router';
import { Layout } from './component/layout/layout';
import { ShopComponent } from './component/shop/shop';
import { SingleProductComponent } from './component/single-product/single-product';
import { IndexComponent as Index } from './component/index';
import { About } from './component/about/about';
import { ContactComponent } from './component/contact/contact';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [

      { path: '', component: Index },

      { path: 'shop', component: ShopComponent },

      { path: 'shop/:slug', component: ShopComponent },

      { path: 'product/:slug', component: SingleProductComponent },

      { path: 'about', component: About },

      { path: 'contact', component: ContactComponent }

    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];