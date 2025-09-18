import { Component } from '@angular/core';

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
    nombre:['',[ Validators.required, Validators.minLength(1), Validators.maxLength(30)]]
  });
 }

 ngOnInit():void{
this.listarRegiones();
 }
 listarRegiones():void{
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
this.modalText = 'Nueva Region';
  this.isEditMode = false;
  this.selectedHuesped = null;
  this.regionForm.reset();
}

editRegion(region: RegionResponse): void{
this.showForm =  true;
this.modalText = 'Editando region ' + region.nombre;
this.isEditMode = true;
this.selectedRegion = region;
this.regionForm.patchValue({
  ...region
});
}
onSubmit(): void{
if(this.regionForm.valid){
  const regionData = this.regionForm.value;
  if(this.isEditMode){
    this.regionService.putRegion(regionData, regionData.id).subscribe({
      next: region => {
        const index = this.region.findIndex(reg => reg.id === region.id);
        if(index !== -1){
          this.region[index] = region;
        }
        Swal.fire({
          icon:'success',
          title: 'Region Actualizada',
          text: 'La region ha sido actualizada correctamente'
        });
        this.resetForm();
        this.showForm = false;
      }
    });
  }else{
this.regionService.postRegion(regionData).subscribe({
      next: region => {
        this.region.push(region);
        Swal.fire({
          icon:'success',
          title: 'Region Registrada',
          text: 'La region ha sido registrada correctamente'
        });
        this.resetForm();
        this.showForm = false;
      }
    });
  }
}
}
deleteRegion(regionId: number):void{
Swal.fire({
title: 'Estas seguro que deseas eliminar esta región?',
text: 'Eliminar region',
icon: 'question',
showCancelButton: true,
showConfirmButton: true
  }).then(resp => {
    if(resp.isConfirmed){
      this.regionService.deleteRegion(regionId).subscribe({
        next: deletedRegion => {
          this.region = this.region.filter(reg => reg.id !== regionId);
          Swal.fire({
            title: 'Region ' + deletedRegion.nombre + 'eliminada',
            text: 'La region fue eliminada correctamente',
            icon:'success'
          })
        }
      });
    }
  });
}

}
