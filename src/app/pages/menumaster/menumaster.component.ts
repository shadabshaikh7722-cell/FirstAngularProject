import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { themeQuartz } from 'ag-grid-community';
import { UsermasterService } from '../../service/usermaster.service';
import { MenumasterService } from '../../service/menumaster.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormsModule } from '@angular/forms';


declare var bootstrap: any;
@Component({
  selector: 'app-menumaster',
  imports: [CommonModule, AgGridModule, MatSnackBarModule,FormsModule],
  templateUrl: './menumaster.component.html',
  styleUrl: './menumaster.component.css'
})
export class MenumasterComponent {


  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  rowData: any[] = [];
  searchText: string = '';

  gridApi: any;

  constructor(private menuSer: MenumasterService, private http: HttpClient) {

  }

  public myTheme = themeQuartz;


  columnDefs: ColDef[] = [
    {
      headerName: 'ACTION',
      width: 110,

      cellRenderer: () => {
        return `
          <div class="d-flex  gap-2">
            <i class="bi bi-eye text-primary action-icon" data-action="view" style="cursor:pointer;"></i>
            <i class="bi bi-pencil-square text-warning action-icon" data-action="edit" style="cursor:pointer;"></i>
            <i class="bi bi-trash text-danger action-icon" data-action="delete" style="cursor:pointer;"></i>
          </div>
        `;
      },
      headerClass: 'center-header'
    },
    { headerName: 'CODE', field: 'Code', sortable: true },
    { headerName: 'USER NAME', field: 'Username', sortable: true },
    { headerName: 'FULL NAME', field: 'Fullname', sortable: true },
    { headerName: 'MOBILE NO', field: 'Mobileno', sortable: true }
  ];

  defaultColDef: ColDef = {

    minWidth: 120,
    sortable: true,
    filter: false,
    resizable: true,
    headerClass: 'ag-center-header'

  };


  onGridReady(params: any) {
    console.log("Grid Ready");

    this.gridApi = params.api;


    // params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      params.api.sizeColumnsToFit();
    });
  }

  GetUserList() {
    this.menuSer.NeonAPI().subscribe({
      next: (res: any) => {
        console.log(res.Data);
        this.rowData = res.Data;
        // this.showMessage("SUCCESS");
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  ngOnInit() {
    // this.GetUserList();
    this.loadUsers();
  }

  get totalPages(): number {
    return Math.ceil(this.totalRecords / this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers(); // API Call
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers(); // API Call
    }
  }

  loadUsers() {
    let params = new HttpParams()
      .set('page', this.currentPage)
      .set('pageSize', this.pageSize);

    if (this.searchText && this.searchText.trim() !== '') {
      params = params.set('search', this.searchText.trim());
    }

    this.http.get<any>('https://localhost:7278/api/UserMaster/GetUsers', { params })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.rowData = res.Data;
          this.totalRecords = res.TotalRecords;
        },
        error: (err) => {
          console.log('Status:', err.status);
          console.log('Error Body:', err.error); // VERY IMPORTANT for debugging
        }
      });
  }

  onSearchChange(searchValue: string) {
    console.log(searchValue);
    this.loadUsers();
  }

}
