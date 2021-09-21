import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-activities-modal',
  templateUrl: './activities-modal.component.html',
  styleUrls: ['./activities-modal.component.scss']
})
export class ActivitiesModalComponent implements OnInit {
  @Input() id_activity: any;
  modal = {} as any;
  required = {} as any;

  constructor(public activeModal: NgbActiveModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  save() {
    console.log("Activitatea are numele ", this.modal.name);
  }

}
