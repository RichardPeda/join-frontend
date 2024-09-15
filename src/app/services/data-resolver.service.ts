import { Injectable, inject } from '@angular/core';
import { SessiondataService } from './sessiondata.service';
import {
  ActivatedRouteSnapshot,
  Resolve,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class DataResolverService {
  constructor(private service: SessiondataService) {}

  async resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<any> {
    let user = await this.service.getData(route.paramMap.get('id')!);
    return user;
  }
}
