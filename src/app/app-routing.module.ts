import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivitiesComponent } from './admin/drafts/activities/activities.component';

const routes: Routes = [
  { path: 'activitati', component: ActivitiesComponent, data:{ roles : ['sa', 'admin'] } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
