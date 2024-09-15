import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export const passwordMatchValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const first = control.get('password_1');
    const second = control.get('password_2');
  
    return first && second && first.value !== second.value
      ? { passwordMatch: true }
      : null;
  };