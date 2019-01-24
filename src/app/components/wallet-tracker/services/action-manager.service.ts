import {
  Injectable,
  EventEmitter
} from '@angular/core';

@Injectable()
export class ActionManagerService {

  // TODO: change this to a behavioral subject
  public selected_id: number = 0;
  public addTransaction$ = new EventEmitter<null>();

  constructor() {
  }

}
