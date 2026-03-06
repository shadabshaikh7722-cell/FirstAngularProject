// import { HttpInterceptorFn } from '@angular/common/http';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {

//   const token=sessionStorage.getItem('token');

//   if(token){
//     const cloneReq=req.clone({
//       setHeaders:{
//         Authorization:`Bearer ${token}`
//       }
//     })

//     return next(cloneReq);
//   }

//   return next(req);
// };


import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

import { Router } from '@angular/router';
import { CommonServicesService } from '../service/common-services.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(CommonServicesService);
  const router = inject(Router);

  const token = sessionStorage.getItem('token');

  let clonedReq = req;

  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(

    catchError((error: HttpErrorResponse) => {

      if (error.status === 401) {

        const refreshToken = sessionStorage.getItem('Refreshtoken');

        if (!refreshToken) {
          router.navigate(['/login']);
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(

          switchMap((res: any) => {

            // Save new access token
            sessionStorage.setItem('token', res.accessToken);

            // Retry original request with new token
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${res.accessToken}`
              }
            });

            return next(retryReq);
          }),

          catchError((refreshError) => {
            // Refresh failed → logout
            sessionStorage.clear();
            router.navigate(['/login']);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
