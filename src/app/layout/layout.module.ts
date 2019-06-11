import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { LayoutPage } from './layout.page';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { MakeTestingComponent } from './make-testing/make-testing.component';
import { HistoryTestingComponent } from './history-testing/history-testing.component';
import { PerformingTestingComponent } from './performing-testing/performing-testing.component';
import { ListAllTestComponent } from './list-all-test/list-all-test.component';
import { TestResultsComponent } from './test-results/test-results.component';
import { EllipisPipe } from '../ellipis.pipe';


const routes: Routes = [
  {
    path: '', component: LayoutPage, children: [
      {
        path: '', redirectTo: 'home', pathMatch: 'full'
      },
      {
        path: 'home', component: HomeComponent
      },
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'test', children: [
          { path: '', pathMatch: 'full', component: PerformingTestingComponent },
          { path: 'history', component: HistoryTestingComponent },
          { path: 'make', component: MakeTestingComponent },
          { path: 'list', component: ListAllTestComponent },
          { path: 'results', component: TestResultsComponent},
        ]
      }
    ]
  },
];

const declarations = [
  LayoutPage,
  ProfileComponent,
  HomeComponent,
  PerformingTestingComponent,
  HistoryTestingComponent,
  ListAllTestComponent,
  MakeTestingComponent,
  TestResultsComponent,
  EllipisPipe
]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    EllipisPipe
  ],
  declarations: declarations
})
export class LayoutPageModule { }
