import { Component } from '@angular/core';
import { ReservaResponse } from '../../models/Reserva.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReservacionesServices } from '../../services/reservaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reservas',
  standalone: false,
  
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.css'
})
export class ReservasComponent {

  reservaciones: ReservaResponse[] = [];
  showForm: boolean = false;
  reservaForm: FormGroup;
  modalText: string = 'Nueva Reserva';
  selectedReserva: ReservaResponse | null = null;
  isEditMode: boolean = false;
  showACtions: boolean = true

  constructor(private reservacionesService: ReservacionesServices, private formBuilder: FormBuilder) {
    this.reservaForm = formBuilder.group({
      id: [null],
      huesped: ['', [Validators.required, Validators.minLength(3)]],
      habitacion: ['',  [Validators.required]],
      fechaEntrada: ['',  [Validators.required]],
      fechaSalida: ['', [Validators.required]],
      noche: ['',  [Validators.required, Validators.min(1)]],
      total: ['', [Validators.required, Validators.min(0)]],
      estado: ['',  [Validators.required]],
    })

  }

  ngOnInit(): void {
    this.listarreservaciones();
  }

  listarreservaciones(): void {
    this.reservacionesService.getReservaciones().subscribe({
      next: resp => {
        this.reservaciones = resp;
        console.log(this.reservaciones)
      }
    })
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    this.resetForm
  }

  resetForm(): void {
    this.modalText = 'Nueva Reservacion';
    this.isEditMode = false;
    this.selectedReserva = null;
    this.reservaForm.reset();
  }

  editReservaciones(reservacion: ReservaResponse): void {
      this.showForm = true;
      this.modalText = 'Editando reservacion ' + reservacion.huesped;
      this.isEditMode = true;
      this.selectedReserva = reservacion;
      this.reservaForm.patchValue({
        ...reservacion
      })
    }

    onSumbmit(): void {
        if (this.reservaForm.valid) {
          const reservaData = this.reservaForm.value;
          if (this.isEditMode) {
            this.reservacionesService.putReservaciones(reservaData, reservaData.id).subscribe({
              next: reserva => {
                const index = this.reservaciones.findIndex(cat => cat.id === reserva.id);
                if (index !== -1) {
                  this.reservaciones[index] = reserva;
                }
                Swal.fire({
                  icon: 'success',
                  title: 'reservacion Actualizada',
                  text: 'La reservacion ha sido actualizada exitozamente '
                });
                this.resetForm();
                this.showForm = false
              }
            })
          } else {
            this.reservacionesService.postReservaciones(reservaData).subscribe({
              next: reserva => {
                this.reservaciones.push(reserva);
                Swal.fire({
                  icon: 'success',
                  title: 'Reservacion Registrada',
                  text: 'La reservacion ha sido registrada exitozamente '
                });
                this.resetForm();
                this.showForm = false
              }
            })
          }
        }
      }

      
        deleteReservaciones(reservaId: number): void {
          Swal.fire({
            title: '¿Estás seguro de eliminar la reservacion?',
            text: 'Elimina reservacion',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
          }).then(resp => {
            if (resp.isConfirmed) {
              this.reservacionesService.deleteResevaciones(reservaId).subscribe({
                next: (reservacionEliminada) => {
                  this.reservaciones = this.reservaciones.filter(reserva => reserva.id !== reservaId);
                  Swal.fire({
                    title: `Reservacion ${reservacionEliminada.huesped} eliminado`,
                    text: 'La rervacion fue eliminada correctamente.',
                    icon: 'success'
                  });
                },
                error: (err) => {
                  Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error al eliminar la reservacion.',
                    icon: 'error'
                  });
                  console.error(err);
                }
              });
            }
          });
        }

}
