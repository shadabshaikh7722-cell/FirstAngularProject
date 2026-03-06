import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { OrganizationService } from '../../service/organization.service';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { themeQuartz } from 'ag-grid-community';

declare var bootstrap: any;
@Component({
  selector: 'app-organization',
  imports: [CommonModule, AgGridModule, FormsModule, MatDialogModule, ReactiveFormsModule, MatSnackBarModule],
  templateUrl: './organization.component.html',
  styleUrl: './organization.component.css'
})


export class OrganizationComponent {

  public myTheme = themeQuartz;

  organizationForm!: FormGroup;
  modalInstance: any;
  selectedFileBase64: string | null = null;
  constructor(private OrgSer: OrganizationService, private fb: FormBuilder, private snackBar: MatSnackBar) {

  }

  searchText: string = "";
  columnDefs: ColDef[] = [
    { headerName: 'ID', field: 'orgId', sortable: true, filter: true },
    { headerName: 'Name', field: 'orgName', sortable: true, filter: true },
    { headerName: 'Address', field: 'Address', sortable: true, filter: true }
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    sortable: true,
    filter: true,
    resizable: true
  };



  rowData = [];


  ngOnInit() {
    this.OrgSer.GetOrganization().subscribe({
      next: (res: any) => {
        console.log(res);
        this.rowData = res.data;
        this.showMessage("SUCCESS");
      },
      error: (err: any) => {
        console.log(err);
      }
    });

    this.organizationForm = this.fb.group({
      OrgName: ['', Validators.required],
      Address: ['', Validators.required],
      ContactNo: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Gstnumber: [''],
      LogoUrl: ['']
    });

  }

  onGridReady(params: any) {
    console.log("Grid Ready");
    params.api.sizeColumnsToFit();
  }

  onSearchChange(searchValue: string) {
    console.log(searchValue);
    this.OrgSer.GetSearchedData(searchValue).subscribe({
      next: (res: any) => {
        console.log(res);
        this.rowData = res.data;
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  openModal() {
    const modalElement = document.getElementById('organizationModal');
    this.modalInstance = new bootstrap.Modal(modalElement);
    this.modalInstance.show();
  }

  closeModal() {
    this.modalInstance.hide();
    this.organizationForm.reset();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Convert to string
        this.selectedFileBase64 = reader.result as string;

        // Patch form (optional)
        this.organizationForm.patchValue({
          LogoUrl: this.selectedFileBase64
        });

        console.log('Base64 Ready:', this.selectedFileBase64);
      };
    }
  }

  saveOrganization() {
    if (this.organizationForm.valid) {
      // Ensure Base64 is ready
      if (this.selectedFileBase64) {
        this.organizationForm.patchValue({
          LogoUrl: this.selectedFileBase64
        });
      }

      const finalObj = this.organizationForm.value;
      console.log('Final Object:', finalObj);  // <-- now LogoUrl will be here

      this.OrgSer.SaveOrg(this.organizationForm.value).subscribe({
        next: (res: any) => {
          console.log("A", res);

        },
        error: (err: any) => {
          console.log("B", err);
        }
      })


      // this.closeModal();
    }
  }

  showMessage(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      panelClass: message === 'SUCCESS' ? ['success-snackbar'] : ['error-snackbar'],
      horizontalPosition: 'right',  // start | center | end | left | right
      verticalPosition: 'top'       // top | bottom
    });
  }


  
}
