import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import type { Person } from 'src/app/types/person';
import type { Car } from 'src/app/types/car';

@Component({
  selector: 'app-persons-modal',
  templateUrl: './persons-modal.component.html',
  styleUrls: ['./persons-modal.component.scss']
})
export class PersonsModalComponent implements OnInit {

  @Input() person_id?: number;
  data: Person = {
    first_name: '',
    last_name: '',
    cnp: '',
    car_list: []
  };
  cars: Car[] = [];
  ownedCars: Car[] = [];
  invalidFields: string[] = [];

  constructor(public activeModal: NgbActiveModal, private _spinner: NgxSpinnerService, private _toastr: ToastrService) { }

  ngOnInit(): void {
    // fetching all the cars in the database to populate the dropdown
    axios.get('/api/car').then(({ data }) => {
      this.cars = data;
    }).catch(() => { });

    // fetching the person's information (if editing)
    if(this.person_id) {
      this._spinner.show();
      axios.get(`/api/person/${this.person_id}`).then(({ data }) => {
        this.data = data;
        this.ownedCars = data.car_list;

        if(data.car_list[0].id === null)
        {
          this.data.car_list = [];
          this.ownedCars = [];
        }
        this._spinner.hide();
      }).catch(() => this._toastr.error('Eroare la preluarea datelor persoanei!'));
    }
  }

  save(): void {
    // validating inputs
    this.invalidFields = [];

    if(!this.data.last_name)
      this.invalidFields.push('Nume');
    if(!this.data.first_name)
      this.invalidFields.push('Prenume');
    if(!this.data.cnp)
        this.invalidFields.push('CNP');

    if(this.invalidFields.length > 0)
      return;

    // make API call if the validation checks pass
    this._spinner.show();

    if(!this.person_id) {
      // adding person to database
      axios.post('/api/person', this.data).then(({ data }) => {
        // adding pairs to junction table
        this.person_id = data.id;
        this.updateCars('Eroare la salvarea persoanei!', 'Persoana a fost salvată cu succes!');
      }).catch(() => this._toastr.error('Eroare la salvarea persoanei!'));
    }
    else {
      // updating person
      axios.put('/api/person', this.data).then(() => {
        // updating pairs in junction table
        this.updateCars('Eroare la modificarea persoanei!', 'Persoana a fost modificată cu succes!');
      }).catch(() => this._toastr.error('Eroare la modificarea persoanei!'));
    }
  }

  updateCars(errorText: string, successText: string): void {
    // checking for errors
    let toDelete = this.ownedCars.length;
    let toAdd = this.data.car_list.length;
    let deleted = 0;
    let added = 0;

    // removing all originally owned cars
    new Promise<void>((resolve, _) => {
      if(toDelete === 0)
        resolve();

      this.ownedCars.forEach((car) => {
        axios.delete(`/api/person/${this.person_id}/removeCar`, { data: {
          car_id: car.id
        }}).then(() => {
          if(++deleted === toDelete)
            resolve();
        }).catch(() => this._toastr.error(errorText));
      });
    }).then(() => {
      // adding the person's updated car list to the database
      new Promise<void>((resolve, _) => {
        if(toAdd === 0)
          resolve();

        this.data.car_list.forEach((car) => {
          axios.post(`/api/person/${this.person_id}/addCar`, {
            car_id: car.id
          }).then(() => {
            if(++added === toAdd)
              resolve();
          }).catch(() => this._toastr.error(errorText));
        });
      }).then(() => {
        // closing modal after everything has been updated
        this._spinner.hide();
        this._toastr.success(successText);
        this.activeModal.close();
      });
    });
  }

}
