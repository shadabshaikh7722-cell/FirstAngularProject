import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { themeQuartz } from 'ag-grid-community';
import { UsermasterService } from '../../service/usermaster.service';
import Swal from 'sweetalert2';
import { HttpParams } from '@angular/common/http';



declare var bootstrap: any;

@Component({
  selector: 'app-usermaster',
  imports: [CommonModule, AgGridModule, FormsModule, MatDialogModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './usermaster.component.html',
  styleUrl: './usermaster.component.css'
})

export class UsermasterComponent {

  userForm!: FormGroup;
  modalInstance: any;
  isReadonly = false;
  isEdit = false;
  selectedId: any;
  searchText: string = "";
  gridApi: any;

  currentPage: number = 1;
  pageSize: number = 10;
  totalRecords: number = 0;
  rowData: any[] = [];

  constructor(private userSer: UsermasterService, private fb: FormBuilder, private snackBar: MatSnackBar) {

  }

  public myTheme = themeQuartz;


  columnDefs: ColDef[] = [
    {
      headerName: 'ACTION',
      width: 110,

      cellRenderer: () => {
        return `
        <div class="d-flex  gap-3">
          <i class="bi bi-eye text-primary action-icon" data-action="view" style="cursor:pointer;"></i>
          <i class="bi bi-pencil-square text-warning action-icon" data-action="edit" style="cursor:pointer;"></i>
          <i class="bi bi-trash text-danger action-icon" data-action="delete" style="cursor:pointer;"></i>
        </div>
      `;
      },
      headerClass: 'center-header'
    },
    { headerName: 'CODE', field: 'Code', sortable: true, hide: true },
    { headerName: 'USER NAME', field: 'Username', sortable: true },
    { headerName: 'FULL NAME', field: 'Fullname', sortable: true },
    { headerName: 'MOBILE NO', field: 'Mobileno', sortable: true },
    { headerName: 'DOB', field: 'Dob', sortable: true },
    {
      headerName: 'Gender', field: 'Gender', sortable: true,
      // valueFormatter: (params) => {
      //   if (params.value === 1) return 'Male';
      //   if (params.value === 0) return 'Female';
      //   return '-';
      // }
      cellRenderer: (params: any) => {
        if (params.value === 1) {
          return `
          <span class="d-flex align-items-center gap-1">
            <i class="bi bi-gender-male text-primary"></i>
            Male
          </span>
      `;
        } else if (params.value === 0) {
          return `
        <span class="d-flex align-items-center gap-1">
          <i class="bi bi-gender-female text-danger"></i>
          Female
        </span>
      `;
        } else {
          return `<span class="text-muted">-</span>`;
        }
      }
    }
  ];


  defaultColDef: ColDef = {

    minWidth: 120,
    sortable: true,
    filter: false,
    resizable: true,
    headerClass: 'ag-center-header'

  };

  onSearchChange(searchValue: string) {
    console.log(searchValue);

    // if (!searchValue || searchValue.trim() === '') {
    //   this.GetUserList();
    //   return;
    // }

    this.loadUsers();

    // this.userSer.GetSearchedData(searchValue).subscribe({
    //   next: (res: any) => {
    //     console.log(res);
    //     this.rowData = res.data;
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   }
    // });

  }

  ngOnInit() {
    // this.GetUserList();
    this.loadUsers();
    this.userForm = this.fb.group({
      Code: [null],
      UserName: ['', Validators.required],
      Password: ['', Validators.required],
      Fullname: ['', Validators.required],
      Mobileno: ['', Validators.required]

    });
  }

  onGridReady(params: any) {
    console.log("Grid Ready");

    this.gridApi = params.api;


    // params.api.sizeColumnsToFit();
    window.addEventListener('resize', () => {
      params.api.sizeColumnsToFit();
    });
  }

  onCellClicked(event: any) {
    if (event.colDef.headerName === 'ACTION') {

      const action = event.event.target.getAttribute('data-action');

      if (!action) return;

      if (action === 'view') {
        this.onView(event.data);
      }

      if (action === 'edit') {
        this.onEdit(event.data);
      }

      if (action === 'delete') {
        this.onDelete(event.data);
      }
    }
  }

  onView(data: any) {
    console.log('View user:', data);


    this.userSer.selectUser(data.Code).subscribe({
      next: (res) => {
        console.log('edit user:', res);
        // this.showMessage("Something went wrong","error");

        this.userForm.patchValue({
          Code: res.data[0].Code ?? res.data[0].Code,
          UserName: res.data[0].Username ?? res.data[0].Username,
          Password: res.data[0].Password ?? res.data[0].Password,
          Fullname: res.data[0].Fullname ?? res.data[0].Fullname,
          Mobileno: res.data[0].Mobileno ?? res.data[0].Mobileno
        });

        // this.isReadonly = true;

        this.openModal("V");
      },
      error: (err) => {
        console.log('edit error:', err);
        this.showMessage("Something went wrong", "error");
      }
    })


  }

  onEdit(data: any) {
    // console.log('edit user:', data);



    console.log(this.isEdit);
    this.userSer.selectUser(data.Code).subscribe({
      next: (res) => {
        console.log('edit user:', res);
        // this.showMessage("Something went wrong","error");

        this.userForm.patchValue({
          Code: res.data[0].Code ?? res.data[0].Code,
          UserName: res.data[0].Username ?? res.data[0].Username,
          Password: res.data[0].Password ?? res.data[0].Password,
          Fullname: res.data[0].Fullname ?? res.data[0].Fullname,
          Mobileno: res.data[0].Mobileno ?? res.data[0].Mobileno
        });


        this.openModal("E");
      },
      error: (err) => {
        console.log('edit error:', err);
        this.showMessage("Something went wrong", "error");
      }
    })
  }

  onDelete(data: any) {
    console.log('delete user:', data);
    // this.openDeleteModal(data.Code);
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'rgb(232, 92, 92)',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userSer.deleteUser(data.Code).subscribe({

          next: (res: any) => {
            console.log('Res', res);
            if (res.code == 0) {
              // this.showMessage("SUCCESS");
              // this.GetUserList();
              this.loadUsers();
              Swal.fire('Deleted!', 'Record has been deleted.', 'success');
            }

          },
          error: (err: any) => {
            console.log(err);
          }


        });
      }
    });
  }

  openModal(action: string) {

    this.isEdit = false;
    this.isReadonly = false;

    if (action.toUpperCase() === "A") {
      this.isEdit = false;
      this.isReadonly = false;
    }
    else if (action.toUpperCase() === "E") {
      this.isEdit = true;
      this.isReadonly = false;
    }
    else {
      this.isEdit = false;
      this.isReadonly = true;
    }

    const modalElement = document.getElementById('userModal');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
    this.userForm.reset();
  }

  saveUser() {
    if (this.userForm.valid) {

      const finalObj = this.userForm.value;
      console.log('Final Object:', finalObj);  // <-- now LogoUrl will be here

      this.userSer.SaveOrg(this.userForm.value).subscribe({
        next: (res: any) => {
          console.log("A", res);
          // this.GetUserList();
          this.loadUsers();
          this.showMessage("Record added success", "success");
          this.closeModal();
        },
        error: (err: any) => {
          console.log("B", err);
          this.showMessage("Something went wrong", "error");
        }
      })


    }
  }

  showMessage(message: string, type: 'success' | 'error' | 'warning') {

    let panelClass = '';

    if (type === 'success') {
      panelClass = 'success-snackbar';
    } else if (type === 'error') {
      panelClass = 'error-snackbar';
    } else if (type === 'warning') {
      panelClass = 'warning-snackbar';
    }

    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: [panelClass],
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  openDeleteModal(id: number) {
    this.selectedId = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal')!);
    modal.show();
  }

  GetUserList() {
    this.userSer.NeonAPI().subscribe({
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


  loadUsers() {
    let params = new HttpParams()
      .set('page', this.currentPage)
      .set('pageSize', this.pageSize);

    if (this.searchText && this.searchText.trim() !== '') {
      params = params.set('search', this.searchText.trim());
    }

    this.userSer.GetUser(params)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.rowData = res.Data;
          this.totalRecords = res.TotalRecords;
        },
        error: (err) => {
          console.log('Status:', err.status);
          console.log('Error Body:', err.error);
        }
      });
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

  updateUser() {
    if (this.userForm.valid) {

      const finalObj = this.userForm.value;
      console.log('Final Object:', finalObj);  // <-- now LogoUrl will be here

      this.userSer.updateUser(this.userForm.value).subscribe({
        next: (res: any) => {
          console.log("A", res);
          // this.GetUserList();
          this.loadUsers();
          this.showMessage("Record updated success", "success");
          this.closeModal();
        },
        error: (err: any) => {
          console.log("B", err);
          this.showMessage("Something went wrong", "error");
        }
      })


    }
  }

}
