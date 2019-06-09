import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';

@Injectable()
export class GuestGuard implements CanActivate, CanActivateChild {
    constructor(
        private router: Router
    ) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean {
        return this.checkAnonymous();
    }

    checkAnonymous(): boolean {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (!!currentUser) {
            this.router.navigateByUrl('/');
            return false;
        }
        return true;
    }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.checkAnonymous();
    }
}
