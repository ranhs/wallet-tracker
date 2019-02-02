import {
  Component,
  OnInit
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActionManagerService } from '../../services/action-manager.service';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

export type TButtonState = 'NORMAL' | 'SELECTED' | 'ACTION';

@Component({
             selector: 'actions-buttons',
             templateUrl: './actions-buttons.component.html',
             styleUrls: ['./actions-buttons.component.scss']
           })
export class ActionsButtonsComponent implements OnInit {

  buttonState$: Observable<TButtonState> = this.getButtonStateStream();

  constructor(public actionManager: ActionManagerService) {
  }

  ngOnInit() {
  }

  private getButtonStateStream(): Observable<TButtonState> {
    return combineLatest(
      this.actionManager.selected_id$,
      this.actionManager.isEditorShown$
    )
      .pipe(
        map(([id, isEditorShown]: [number, boolean]): TButtonState => {
          if (isEditorShown) {
            return 'ACTION';
          } else if (id) {
            return 'SELECTED';
          } else {
            return 'NORMAL';
          }
        })
      );
  }
  //
  // async addNew(): Promise<void> {
  //     const newTransaction: WalletTransaction = await this.transactionEditor.getNewTransaction();
  // }
}
