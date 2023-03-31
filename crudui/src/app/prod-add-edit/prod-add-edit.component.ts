import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProductService } from '../services/product.service';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-prod-add-edit',
  templateUrl: './prod-add-edit.component.html',
  styleUrls: ['./prod-add-edit.component.scss']
})
export class ProdAddEditComponent implements OnInit {
  prodForm: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    private _prodService: ProductService,
    private _coreService: CoreService,
    
    private _dialogRef: MatDialogRef<ProdAddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
     
    this.prodForm = this._fb.group({
      productName: new FormControl('',[Validators.required, Validators.minLength(2)]),
      productOwnerName: new FormControl('',[Validators.required, Validators.minLength(2)]),
      developer1: new FormControl('',[Validators.required, Validators.minLength(2)]),
      developer2: new FormControl('',[Validators.required, Validators.minLength(2)]),
      developer3: new FormControl('',[Validators.required, Validators.minLength(2)]),
      developer4: "",
      developer5: "",
      startDate: new FormControl('',[Validators.required]),
      scrumMasterName: new FormControl('',[Validators.required, Validators.minLength(2)]),
      methodology: new FormControl('',[Validators.required]),
    });
  }


  ngOnInit(): void {
    if(this.data) {
      this.data.developer1 = this.data.developers[0]
      this.data.developer2 = this.data.developers[1]
      this.data.developer3 = this.data.developers[2]
      this.data.developer4 = this.data.developers[3]
      this.data.developer5 = this.data.developers[4]
    }
    this.prodForm.patchValue(this.data)
  }

  onFormSubmit(){
    if (this.prodForm.valid){
      if (this.data){
        console.log(this.data)
        this._prodService.updateProduct(this.data.productId, this.prodForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar("Product Updated!")
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        })
      }else{
        this._prodService.addProduct(this.prodForm.value).subscribe({
          next: (val: any) => {
            this._coreService.openSnackBar("Product added successfully!")
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        })
      }
      
    }
  }
}
