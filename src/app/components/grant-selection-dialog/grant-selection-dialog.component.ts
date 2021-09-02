import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Grant } from '../../model/dahsboard';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef, MatButtonModule } from '@angular/material';
import { SearchFilterComponent } from 'app/layouts/admin-layout/search-filter/search-filter.component';

@Component({
  selector: 'app-grant-selection-dialog',
  templateUrl: './grant-selection-dialog.component.html',
  styleUrls: ['./grant-selection-dialog.component.scss'],
  styles: [`
    ::ng-deep app-grant-selection-dialog .example-form-field {
        width: 310px !important;
      }
  `]
})

export class GrantSelectionDialogComponent implements OnInit {

  @ViewChild('templateHolder') templateHolder: ElementRef;
  selected: number;
  selectedGrant: Grant;
  searchClosed = true;
  filterReady = false;
  filterCriteria: any;
  filteredGrants: Grant[] = [];
  @ViewChild("appSearchFilter") appSearchFilter: SearchFilterComponent;

  constructor(public dialogRef: MatDialogRef<GrantSelectionDialogComponent>
    , @Inject(MAT_DIALOG_DATA) public grants: Grant[]) {
    this.dialogRef.disableClose = true;
    this.filteredGrants = grants;
  }

  ngOnInit() {
    this.selected = 0;
    //this.selectedGrant = this.grants[0];
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    let selectedGrant;
    for (let grant of this.grants) {
      if (grant.id === Number(this.selected)) {
        selectedGrant = grant;
        break;
      }
    }
    this.dialogRef.close({ result: true, selectedGrant: selectedGrant });
  }

  showDesc() {
    console.log('here');
  }

  setSelectedGrant(id, ev: MatCheckboxChange) {
    if (ev.checked) {
      this.selected = id;
      this.selectedGrant = this.grants.filter(g => g.id === id)[0];
    } else {
      this.selected = 0;
      this.selectedGrant = null;
    }

  }

  startFilter(val) {
    val = val.toLowerCase();
    this.filterCriteria = val;
    this.filteredGrants = this.grants.filter(g => {
      this.filterReady = true;
      return (
        (g.name && g.name.trim() !== '' && g.name.toLowerCase().includes(val)) ||
        //(g.organization && g.organization.name && g.organization.name.toLowerCase().includes(val)) ||
        (g.referenceNo && g.referenceNo.toLowerCase().includes(val))
      )
    });



  }

  resetFilterFlag(val) {
    this.filterReady = val;
  }


  closeSearch(ev: any) {
    this.searchClosed = ev;
  }

  openSearch() {
    if (this.searchClosed) {
      this.searchClosed = false;
    } else {
      this.searchClosed = true;
      this.appSearchFilter.closeSearch();
    }
  }
}
