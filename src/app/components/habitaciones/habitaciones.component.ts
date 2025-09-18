import { Component } from '@angular/core';
import { HabitacionResponse } from '../../models/Habitacion.model';
import { HabitacionesService } from '../../services/habitaciones.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-habitaciones',
  standalone: false,
  templateUrl: './habitaciones.component.html',
  styleUrl: './habitaciones.component.css'
})
export class HabitacionesComponent {

  habitaciones: HabitacionResponse[] = [];
  showForm: boolean = false;
  habitacionForm: FormGroup;
  modalText: string = 'Nueva Habitacion';
  selectedHabitacion: HabitacionResponse | null = null;
  isEditMode: boolean = false;
  showACtions: boolean = true

  constructor(private habitacionesService: HabitacionesService, private formBuilder: FormBuilder) {
    this.habitacionForm = formBuilder.group({
      id: [null],
      numeroHabitacion: ['', [Validators.required, Validators.pattern('^[0-9]{1,4}$')]],
      tipo: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(100)]],
      precio: ['', [Validators.required, Validators.min(0)]],
      capacidad: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      estado: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.listarHabitaciones();
  }

  listarHabitaciones(): void {
    this.habitacionesService.getHabitaciones().subscribe({
      next: resp => {
        this.habitaciones = resp;
        console.log(this.habitaciones)
      }
    })
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.resetForm
  }

  resetForm(): void {
    this.modalText = 'Nueva Habitacion';
    this.isEditMode = false;
    this.selectedHabitacion = null;
    this.habitacionForm.reset();
  }

  editHabitaciones(habitacion: HabitacionResponse): void {
    this.showForm = true;
    this.modalText = 'Editando habitacion ' + habitacion.numeroHabitacion;
    this.isEditMode = true;
    this.selectedHabitacion = habitacion;
    this.habitacionForm.patchValue({
      ...habitacion
    })
  }

  onSumbmit(): void {
    if (this.habitacionForm.valid) {
      const habitacionData = this.habitacionForm.value;
      if (this.isEditMode) {
        this.habitacionesService.putHabitaciones(habitacionData, habitacionData.id).subscribe({
          next: habitacion => {
            const index = this.habitaciones.findIndex(cat => cat.id === habitacion.id);
            if (index !== -1) {
              this.habitaciones[index] = habitacion;
            }
            Swal.fire({
              icon: 'success',
              title: 'Habitacion Actualizada',
              text: 'La habitacion ha sido actualizada exitozamente '
            });
            this.resetForm();
            this.showForm = false
          }
        })
      } else {
        this.habitacionesService.postHabitaciones(habitacionData).subscribe({
          next: habitacion => {
            this.habitaciones.push(habitacion);
            Swal.fire({
              icon: 'success',
              title: 'Habitacion Registrada',
              text: 'La habitacion ha sido registrada exitozamente '
            });
            this.resetForm();
            this.showForm = false
          }
        })
      }
    }
  }

  
  deleteHabitacion(habitacionId: number): void {
    Swal.fire({
      title: '¿Estás seguro de eliminar la habitacion?',
      text: 'Elimina habitacion',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(resp => {
      if (resp.isConfirmed) {
        this.habitacionesService.deleteHabitaciones(habitacionId).subscribe({
          next: (habitacionEliminada) => {
            this.habitaciones = this.habitaciones.filter(habitacion => habitacion.id !== habitacionId);
            Swal.fire({
              title: `Habitacion ${habitacionEliminada.numeroHabitacion} eliminada`,
              text: 'La habitacion fue eliminada correctamente.',
              icon: 'success'
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al eliminar la habitacion.',
              icon: 'error'
            });
            console.error(err);
          }
        });
      }
    });
  }

}
