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
    nombre:['',[   Validators.required,
  Validators.minLength(4),
  Validators.maxLength(30),
  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
    apellido:['',[ Validators.required,
  Validators.minLength(4),
  Validators.maxLength(30),
  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
    email:['',[ Validators.required,Validators.email,Validators.maxLength(30)]],
    telefono:['',[ Validators.required, Validators.pattern('^[0-9]{10}$')]],
    documento:['',[ Validators.required,
  Validators.minLength(3),
  Validators.maxLength(30),
  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]],
    nacionalidad:['',[ Validators.required,
  Validators.minLength(4),
  Validators.maxLength(30),
  Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$')]]
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
this.modalText = 'Editando Huesped: ' + huesped.nombre;
this.isEditMode = true;
this.selectedHuesped = huesped;
this.huespedForm.patchValue({
  ...huesped
});
}

onSubmit(): void {
  // 🔍 Si el formulario es inválido, marcar todos los campos como tocados
  if (this.huespedForm.invalid) {
    this.huespedForm.markAllAsTouched();
    return;
  }

  const huespedData = this.huespedForm.value;

  if (this.isEditMode) {
    // 🛠 Editar huésped existente
    this.huespedService.putHuesped(huespedData, huespedData.id).subscribe({
      next: huesped => {
        const index = this.huesped.findIndex(hue => hue.id === huesped.id);
        if (index !== -1) {
          this.huesped[index] = huesped;
        }
        Swal.fire({
          icon: 'success',
          title: 'Huésped Actualizado',
          text: 'El huésped ha sido actualizado correctamente'
        });
        this.resetForm();
        this.showForm = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al actualizar el huésped.'
        });
      }
    });
  } else {
    // ✅ Registrar nuevo huésped
    this.huespedService.postHuesped(huespedData).subscribe({
      next: huesped => {
        this.huesped.push(huesped);
        Swal.fire({
          icon: 'success',
          title: 'Huésped Registrado',
          text: 'El huésped ha sido registrado correctamente'
        });
        this.resetForm();
        this.showForm = false;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un error al registrar el huésped.'
        });
      }
    });
  }
}

deleteHuesped(huespedId: number):void{
Swal.fire({
title: '¿Estas seguro que deseas eliminar a este huesped?',
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
            title: 'Huesped ' + deletedHuesped.nombre + ' fue eliminado',
            text: 'El huesped fue eliminado correctamente',
            icon:'success'
          })
        }
      });
    }
  });
}

soloNumeros(event: KeyboardEvent) {
  const charCode = event.key.charCodeAt(0);
  if (charCode < 48 || charCode > 57) {
    event.preventDefault(); // bloquea letras
  }
}
}


