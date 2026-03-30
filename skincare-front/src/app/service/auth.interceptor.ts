import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    
    // Always add these for Laravel API consistency
    const headers: { [name: string]: string } = {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    console.log(`Interceptor adding headers to ${req.url}:`, JSON.stringify(headers, null, 2));

    const cloned = req.clone({
      setHeaders: headers
    });
    return next(cloned);
  }
  return next(req);
};
