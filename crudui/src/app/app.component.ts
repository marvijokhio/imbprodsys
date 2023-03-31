import { Component, OnInit , ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ProdAddEditComponent } from './prod-add-edit/prod-add-edit.component';
import { ProductService } from './services/product.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  displayedColumns: string[] = [
    'productId',
    'productName',
    'productOwnerName',
    'developers',
    'scrumMasterName',
    'startDate',
    'methodology',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(
    private _dialog: MatDialog, 
    private _prodService: ProductService,
    private _coreService: CoreService
    ){}

  ngOnInit(): void {
    this.getProductList();
  }
  openAddEditProductForm(){
    const dialogRef = this._dialog.open(ProdAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getProductList();
        }
      }
    })
  }

  getProductList(){
    // console.log("inside getProductList");
    this._prodService.getProductList().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteProduct(id: any) {
    this._prodService.deleteProduct(id).subscribe({
      next: (res) => {
        this._coreService.openSnackBar("Product deleted!", "Done")
        this.getProductList();
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  openEditProductForm(data: any){
    const dialogRef = this._dialog.open(ProdAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getProductList();
        }
      }
    })
  }
}
