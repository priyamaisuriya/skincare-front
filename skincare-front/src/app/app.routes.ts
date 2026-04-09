import { Routes } from '@angular/router';
import { Layout } from './component/layout/layout';
import { ShopComponent } from './component/shop/shop';
import { SingleProductComponent } from './component/single-product/single-product';
import { IndexComponent as Index } from './component/index';
import { About } from './component/about/about';
import { ContactComponent } from './component/contact/contact';
import { BestSeller } from './component/best-seller/best-seller';
import { NewArrivals } from './component/new-arrivals/new-arrivals';
import { FaqComponent } from './component/faq/faq';
import { WishlistComponent } from './component/wishlist/wishlist';
import { AccountComponent } from './component/account/account';
import { CheckoutComponent } from './component/checkout/checkout';
import { ThankYouComponent } from './component/thank-you/thank-you';
import { MyOrdersComponent } from './component/my-orders/my-orders';
import { ProfileComponent } from './component/profile/profile';
import { CartComponent } from './component/cart/cart';
import { OrderDetailsComponent } from './component/order-details/order-details';


export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [

      { path: '', component: Index },

      { path: 'cart', component: CartComponent },

      { path: 'shop/:slug', component: ShopComponent },

      { path: 'product/:slug', component: SingleProductComponent },

      { path: 'about', component: About },

      { path: 'contact', component: ContactComponent },

      { path: 'single-product/:slug', component: SingleProductComponent },

      {path : 'bestseller' , component : BestSeller },

      {path : 'new-arrivals' , component : NewArrivals },

      {path : 'faq', component:FaqComponent},

      {path : 'wishlist', component:WishlistComponent},

      {path : 'account', component:AccountComponent},

      {path : 'checkout', component:CheckoutComponent},

      {path : 'thank-you', component:ThankYouComponent},

      {path : 'my-orders', component:MyOrdersComponent},

      {path : 'order-details/:id', component:OrderDetailsComponent},

      {path : 'profile', component:ProfileComponent}

    ]
  },

  {
    path: '**',
    redirectTo: ''
  }
];