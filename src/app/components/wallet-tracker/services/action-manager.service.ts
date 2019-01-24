import {
  Injectable,
  EventEmitter
} from '@angular/core';

@Injectable()
export class ActionManagerService {

  public addTransaction$ = new EventEmitter<null>();

  constructor() {
  }

}
