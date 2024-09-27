import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnChanges {
  @Input() public message: string = '';
  @Input() public isVisible: boolean = false;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && this.isVisible) {
      this.showPopup();
    }
  }

  public showPopup(): void {
    setTimeout(() => {
      this.isVisible = false; //? this.closePopup()?
    }, 3000);
  }

  public closePopup(): void {
    this.isVisible = false;
  }
}
