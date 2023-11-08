import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { faPlus, faEdit, faTrashAlt, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { PersonsModalComponent } from './persons-modal/persons-modal.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AgePipe } from 'src/app/pipes/age.pipe';
import type { Person } from 'src/app/types/person';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {

  faTrashAlt = faTrashAlt; faEdit = faEdit; faChevronUp = faChevronUp; faPlus = faPlus;
  limit: number = 70; showBackTop: string = '';
  persons: Person[] = [];
  filteredPersons: Person[] = [];
  filters: any = {
    name: '',
    cnp: '',
    age: '',
    cars: ''
  };

  constructor(private _modal: NgbModal, private _spinner: NgxSpinnerService, private _toastr: ToastrService, private agePipe: AgePipe) {
    SET_HEIGHT('view', 20, 'height');
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this._spinner.show();
    axios.get('/api/person').then(({ data }) => {
      this.persons = data;
      this.filteredPersons = data;
      this._spinner.hide();
    }).catch(() => this._toastr.error('Eroare la preluarea persoanelor!'));
  }

  addEdit(person_id?: number): void {
    const modalRef = this._modal.open(PersonsModalComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    modalRef.componentInstance.person_id = person_id;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  }

  delete(person: Person): void {
    const modalRef = this._modal.open(ConfirmDialogComponent, {size: 'lg', keyboard: false, backdrop: 'static'});
    modalRef.componentInstance.title = `Ștergere persoană`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana cu numele <b>${person.first_name} ${person.last_name}</b> și CNP-ul <b>${person.cnp}</b>?`;
    modalRef.closed.subscribe(() => {
      axios.delete(`/api/person/${person.id}`).then(() => {
        this._toastr.success('Persoana a fost ștearsă cu succes!');
        this.loadData();
      }).catch(() => this._toastr.error('Eroare la ștergerea persoanei!'));
    });
  }

  filter(): void {
    const validateName = (person: Person) => {
      if(!this.filters.name)
        return true;
      return person.first_name.toLowerCase().includes(this.filters.name.toLowerCase()) || 
        person.last_name.toLowerCase().includes(this.filters.name.toLowerCase());
    };

    const validateCnp = (person: Person) => {
      if(!this.filters.cnp)
        return true;
      return person.cnp.toLowerCase().includes(this.filters.cnp.toLowerCase());
    }

    const validateAge = (person: Person) => {
      if(!this.filters.age)
        return true;
      return this.agePipe.transform(person.cnp).toString().includes(this.filters.age);
    }

    const validateCars = (person: Person) => {
      if(!this.filters.cars)
        return true;
      return JSON.stringify(person.car_list).toLowerCase().includes(this.filters.cars.toLowerCase());
    }

    this.filteredPersons = this.persons.filter((person) => {
      return validateName(person) && validateCnp(person) && validateAge(person) && validateCars(person);
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
