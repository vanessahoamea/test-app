import { Component, OnInit } from '@angular/core';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivitiesModalComponent } from './activities-modal/activities-modal.component';
import { toastr } from 'src/app/components/toastr/toastr.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  faUserPlus = faUserPlus;

  constructor(private modalService: NgbModal, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
  }

  loadData() {
    //Take items from Local/Session Storage
  }

  add() {
    const modalRef = this.modalService.open(ActivitiesModalComponent, {size: 'xl', keyboard: false, backdrop: 'static'});
		modalRef.closed.subscribe(() => {
			this.loadData();
			toastr.success(`Activitatea a fost adăugată cu succes!`);
		})
  }

}
