import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import type { Car } from 'src/app/types/car';

@Component({
  selector: 'app-cars-modal',
  templateUrl: './cars-modal.component.html',
  styleUrls: ['./cars-modal.component.scss']
})
export class CarsModalComponent implements OnInit {

  @Input() car_id?: number;
  data: Car = {
    brand: '',
    model: '',
    year: 0,
    cylinder_capacity: 0
  };
  invalidFields: string[] = [];

  constructor(public activeModal: NgbActiveModal, private _spinner: NgxSpinnerService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    if(this.car_id) {
      this._spinner.show();
      axios.get(`/api/car/${this.car_id}`).then(({ data }) => {
        this.data = data;
        this._spinner.hide();
      }).catch(() => this._toastr.error('Eroare la preluarea datelor mașinii!'));
    }
  }

  save(): void {
    // validating inputs
    this.invalidFields = [];

    if(!this.data.brand)
      this.invalidFields.push('Marcă');
    if(!this.data.model)
      this.invalidFields.push('Model');
    if(!this.data.year || this.data.year < 0 || this.data.year > 9999)
      this.invalidFields.push('Anul fabricației');
    if(!this.data.cylinder_capacity || this.data.cylinder_capacity < 0 || this.data.cylinder_capacity > 9999)
      this.invalidFields.push('Capacitatea cilindrică');

    if(this.invalidFields.length > 0)
      return;

    // make API call if the validation checks pass
    this._spinner.show();

    if(!this.car_id) {
      // adding car to database
      axios.post('/api/car', this.data).then(() => {
        this._spinner.hide();
        this._toastr.success('Mașina a fost salvată cu succes!');
        this.activeModal.close();
      }).catch(() => this._toastr.error('Eroare la salvarea mașinii!'));
    }
    else {
      // updating car
      axios.put('/api/car', this.data).then(() => {
        this._spinner.hide();
        this._toastr.success('Mașina a fost modificată cu succes!');
        this.activeModal.close();
      }).catch(() => this._toastr.error('Eroare la modificarea mașinii!'));
    }
  }

}
