import { Component } from '@angular/core';
import { HuespedResponse } from '../../models/Huesped.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { HuespedService } from '../../services/huesped.service';


@Component({
  selector: 'app-huespedes',
  standalone: false,
  templateUrl: './huespedes.component.html',
  styleUrl: './huespedes.component.css'
})
export class HuespedesComponent {
 huesped: HuespedResponse[] = [];
 showForm: boolean = false;
 huespedForm: FormGroup;
 modalText: string = 'Nuevo Huesped';
 selectedHuesped: HuespedResponse | null = null;
 isEditMode: boolean = false;
 showActions: boolean = true;

  constructor(private huespedService: HuespedService, private formBuilder: FormBuilder){
  this.huespedForm = formBuilder.group({
    id: [null],
    nombre:['',[ Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    apellido:['',[ Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    email:['',[ Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    telefono:['',[ Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    documento:['',[ Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
    nacionalidad:['',[ Validators.required, Validators.minLength(1), Validators.maxLength(30)]]
  });
 }
ngOnInit():void{
this.listarHuespedes();
 }
 listarHuespedes():void{
  this.huespedService.getHuesped().subscribe({
    next: hue => {
      this.huesped = hue;
      console.log(this.huesped);
    }
  });
}

toggleForm(): void{
  this.showForm = !this.showForm;
  this.resetForm();
}

resetForm(): void{
this.modalText = 'Nuevo Huesped';
  this.isEditMode = false;
  this.selectedHuesped = null;
  this.huespedForm.reset();
}

editHuesped(huesped: HuespedResponse): void{
this.showForm =  true;
this.modalText = 'Editando huesped ' + huesped.nombre;
this.modalText = 'Editando huesped ' + huesped.apellido;
this.modalText = 'Editando huesped ' + huesped.email;
this.modalText = 'Editando huesped ' + huesped.telefono;
this.modalText = 'Editando huesped ' + huesped.documento;
this.modalText = 'Editando huesped ' + huesped.nacionalidad;
this.isEditMode = true;
this.selectedHuesped = huesped;
this.huespedForm.patchValue({
  ...huesped
});
}

onSubmit(): void{
if(this.huespedForm.valid){
  const huespedData = this.huespedForm.value;
  if(this.isEditMode){
    this.huespedService.putHuesped(huespedData, huespedData.id).subscribe({
      next: huesped => {
        const index = this.huesped.findIndex(hue => hue.id === huesped.id);
        if(index !== -1){
          this.huesped[index] = huesped;
        }
        Swal.fire({
          icon:'success',
          title: 'Huesped Actualizado',
          text: 'El huesped ha sido actualizado correctamente'
        });
        this.resetForm();
        this.showForm = false;
      }
    });
  }else{
this.huespedService.postHuesped(huespedData).subscribe({
      next: huesped => {
        this.huesped.push(huesped);
        Swal.fire({
          icon:'success',
          title: 'Huesped Registrado',
          text: 'El huesped ha sido registrado correctamente'
        });
        this.resetForm();
        this.showForm = false;
      }
    });
  }
}
}
deleteHuesped(huespedId: number):void{
Swal.fire({
title: 'Estas seguro que deseas eliminar este huesped?',
text: 'Eliminar huesped',
icon: 'question',
showCancelButton: true,
showConfirmButton: true
  }).then(hue => {
    if(hue.isConfirmed){
      this.huespedService.deleteHuesped(huespedId).subscribe({
        next: deletedHuesped => {
          this.huesped = this.huesped.filter(hue => hue.id !== huespedId);
          Swal.fire({
            title: 'Huesped ' + deletedHuesped.nombre + 'eliminada',
            text: 'El huesped fue eliminado correctamente',
            icon:'success'
          })
        }
      });
    }
  });
}
}
