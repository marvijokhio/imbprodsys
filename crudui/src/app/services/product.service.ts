import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private _http: HttpClient) { }
  addProduct(data : any): Observable<any> {
    return this._http.post('http://localhost:3000/api/add-product', data)
  }

  getProductList(): Observable<any> {
    return this._http.get('http://localhost:3000/api/products')
  }

  deleteProduct(id: any): Observable<any> {
    return this._http.delete(`http://localhost:3000/api/products/${id}`);
  }

  updateProduct(id: any, data: any): Observable<any> {
    return this._http.put(`http://localhost:3000/api/products/${id}`, data);
  }

}
