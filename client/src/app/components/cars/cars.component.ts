import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { CarsModalComponent } from './cars-modal/cars-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { TaxPipe } from 'src/app/pipes/tax.pipe';
import type { Car } from 'src/app/types/car';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss']
})
export class CarsComponent implements OnInit {

  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  cars: Car[] = [];
  filteredCars: Car[] = [];
  filters: any = {
    brand: '',
    model: '',
    year: '',
    cylinder_capacity: '',
    tax: ''
  };

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private _toastr: ToastrService, private taxPipe: TaxPipe) {
    SET_HEIGHT('view', 20, 'height');
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this._spinner.show();
    axios.get('/api/car').then(({ data }) => {
      this.cars = data;
      this.filteredCars = data;
      this._spinner.hide();
    }).catch(() => this._toastr.error('Eroare la preluarea mașinilor!'));
  }

  addEdit(car_id?: number): void {
    const modalRef = this._modal.open(CarsModalComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.car_id = car_id;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete(car: Car): void {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere mașină`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți mașina <b>${car.brand} ${car.model}</b> (${car.year})?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/car/${car.id}`).then(() => {
        this._toastr.success('Mașina a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this._toastr.error('Eroare la ștergerea mașinii!'));
    });
  }

  filter(): void {
    const validateBrand = (car: Car) => {
      if(!this.filters.brand)
        return true;
      return car.brand.toLowerCase().includes(this.filters.brand.toLowerCase());
    };

    const validateModel = (car: Car) => {
      if(!this.filters.model)
        return true;
      return car.model.toLowerCase().includes(this.filters.model.toLowerCase());
    };

    const validateYear = (car: Car) => {
      if(!this.filters.year)
        return true;
      return car.year.toString().includes(this.filters.year);
    }

    const validateCylinderCapacity = (car: Car) => {
      if(!this.filters.cylinder_capacity)
        return true;
      return car.cylinder_capacity.toString().toLowerCase().includes(this.filters.cylinder_capacity.toLowerCase());
    }

    const validateTax = (car: Car) => {
      if(!this.filters.tax)
        return true;
      return this.taxPipe.transform(car.cylinder_capacity).toString().includes(this.filters.tax);
    }

    this.filteredCars = this.cars.filter((car) => {
      return validateBrand(car) && validateModel(car) && validateYear(car) && validateCylinderCapacity(car) && validateTax(car);
    });
  }

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (document.getElementsByClassName('view-scroll-informations')[0].scrollTop > 500) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-informations', 0);
    this.limit = 70;
  }

}
