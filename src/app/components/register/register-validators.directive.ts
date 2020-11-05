/** A hero's name can't match the given regular expression */
import { FormGroup } from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';


let userNames: Array<string> = ["spejson", "walu", "papa słoń", "pietrzykowski"]


export function notUniqueUsernameValidator(userName: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let forbidden = false;
    //   userNames.forEach(element => {
    //       if (element == userName) forbidden = true;
    //   });
      if (userNames.includes(control.value.userName)) {
        forbidden = true;
      }
      return forbidden ? {nonUniqueName: {value: control.value}} : null;
    };
  }


// custom validator to check that two fields match
// export function notUniqueUsernameValidator(userName: string) {
//     return (formGroup: FormGroup) => {
//         const control = formGroup.controls[userName];
//         const allUserNames = userNames;
//         // if (control.errors && !control.errors.notUniqueUsernameValidator) {
//         //     // return if another validator has already found an error on the matchingControl
//         //     return;
//         // }
//         // set error on matchingControl if validation fails
//         if (allUserNames.includes(userName)) {
//             control.setErrors({ nonUniqueName: true });
//         } else {
//             control.setErrors(null);
//         }
//     }
// }

// export function notUniqueUsernameValidator(existingUserNames: string[], userName: string): ValidatorFn {
//     return (control: AbstractControl): {[key: string]: any} | null => {
//       let forbidden = false;
//       existingUserNames.forEach(element => {
//           if (element == userName) forbidden = true;
//       });
//       return forbidden ? {forbiddenName: {value: control.value}} : null;
//     };
//   }
// import { FormGroup } from '@angular/forms';