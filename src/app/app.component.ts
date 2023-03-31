import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'loan-calculator';

  loanCalculatorForm = this._formBuilder.group({
    principalAmountUSD: [0, [Validators.min(1), Validators.required]],
    interestPerc: [0, [Validators.min(1), Validators.required]],
    tenureMonths: [0, [Validators.min(1), Validators.required]],
  })

  totalInterest = 0
  emi = 0
  totalPayment = 0

  constructor(
    private _formBuilder: FormBuilder,
  ) {
  }

  getErrorMessage(control: FormControl) {
    if (control.hasError('min')) {
      return "Please input a number greater than 1"
    }
    if (control.hasError('required')) {
      return "Required"
    }
    return
  }

  clearLoanForm() {
    this.loanCalculatorForm.reset();
    this.loanCalculatorForm.controls.principalAmountUSD.setValue(0);
    this.loanCalculatorForm.controls.interestPerc.setValue(0);
    this.loanCalculatorForm.controls.tenureMonths.setValue(0);
    this.totalInterest = 0
    this.emi = 0
    this.totalPayment = 0
  }

  submitLoanForm() {
    this.loanCalculatorForm.markAllAsTouched()
    if(this.loanCalculatorForm.invalid){
      return 
    }

    var principalAmountUSD = 0
    var interestPerc = 0
    var tenureMonths = 0
    if (this.loanCalculatorForm.controls.principalAmountUSD.value){
      principalAmountUSD = this.loanCalculatorForm.controls.principalAmountUSD.value
    }
    if (this.loanCalculatorForm.controls.interestPerc.value){
      interestPerc = this.loanCalculatorForm.controls.interestPerc.value
    }
    if (this.loanCalculatorForm.controls.tenureMonths.value){
      tenureMonths = this.loanCalculatorForm.controls.tenureMonths.value
    }

     this.emi = this.calculateEMI(principalAmountUSD, interestPerc, tenureMonths)
     this.totalPayment = (this.emi * tenureMonths)
     this.totalInterest = this.totalPayment - principalAmountUSD

  }

  calculateEMI(principalAmountUSD =  0, interestPerc = 0, tenureMonths = 0): number {
    const r = (interestPerc / 12) / 100
    const n = tenureMonths * 1.0
    return principalAmountUSD * (r * Math.pow((1.0 + r), n)) / (Math.pow((1.0 + r), n) - 1.0)
  }
}
