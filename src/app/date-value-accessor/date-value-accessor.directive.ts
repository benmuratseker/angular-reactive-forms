import { Directive, ElementRef, forwardRef, HostListener, Provider } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

//custom date field accessor

const DATE_VALUE_PROVIDER : Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DateValueAccessorDirective),
  multi: true,
}

@Directive({
  selector: 'input([type=date])[formControlName],input([type=date])[formControl],input([type=date])[ngModel]',
  providers: [DATE_VALUE_PROVIDER]
})

export class DateValueAccessorDirective implements ControlValueAccessor {

  //we show that html element here as ref
  constructor(private element: ElementRef) { }

  //and we need a listener when user changes that value
  @HostListener('input', ['$event.target.valueAsDate'])
  private onChange!: Function //! to tell angular that decleration will be later 

  @HostListener('blur')//when leave the element
  private onTouched!: Function

  writeValue(newValue: any) {
    //it's called when value changed on the html value
    //yyyy-mm-dd
    if(newValue instanceof Date){
      this.element.nativeElement.value = newValue.toISOString().split('T')[0]; // get date part from datetime
    }
    
  }

  //the place what onChange will do
  registerOnChange(fn: Function) {
    this.onChange = () => (valueAsDate: Date) => { fn(valueAsDate); };
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;//the call back function fn from registerOnTouch
  }

  setDisabledState?(isDisabled: boolean): void {
    
  }

}
