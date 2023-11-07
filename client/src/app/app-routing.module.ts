import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InformationComponent } from './components/information/information.component';
import { PersonsComponent } from './components/persons/persons.component';
import { CarsComponent } from './components/cars/cars.component';

const routes: Routes = [
  { path: 'information', component: InformationComponent },
  { path: 'persons', component: PersonsComponent },
  { path: 'cars', component: CarsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
