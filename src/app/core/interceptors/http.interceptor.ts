import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    //private preloader: PreloaderService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const config = JSON.parse(request.params.get('_config') ?? '{}');
    return next.handle(this.setRequestHeaders(request, config))
      .pipe(tap(
      (err: any) => {
        if (request.url === 'auth/secret')
        return;
        if (err instanceof HttpErrorResponse) {
          if (err.status !== 401)
            return;
          this.router.navigate(['/login']);
        }
      }
      ));
  }

  private setRequestHeaders(req: HttpRequest<unknown>, config: any) {
    req = req.clone({ params: req.params.delete('_config') });
    req = req.clone({ url: `http://localhost:3000/${req.url}` });
    req = req.clone({ withCredentials: true });

    return req;
  }

  // private stopPreloaderForResponse(event: HttpEvent<any>, config: any): void {
  //   if (event instanceof HttpResponse) {
  //     this.preloader.stop();
  //   }
  // }
}
