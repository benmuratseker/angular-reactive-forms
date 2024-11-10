import { Component, forwardRef, Provider } from '@angular/core';
import { profileIconNames } from './profile-icon-names';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const PROFILE_ICON_SELECTOR_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ProfileIconSelectorComponent),
  multi: true,
}

@Component({
  selector: 'con-profile-icon-selector',
  templateUrl: './profile-icon-selector.component.html',
  styleUrls: ['./profile-icon-selector.component.css'],
  providers: [PROFILE_ICON_SELECTOR_ACCESSOR],
})

export class ProfileIconSelectorComponent implements ControlValueAccessor {

  profileIcons = profileIconNames;
  showAllIcons: boolean = true;
  selectedIcon!: string | null;

  private onChange!: Function;
  private onTouched!: Function;

  iconSelected(icon: string) {
    this.showAllIcons = false;
    this.selectedIcon = icon;
    this.onChange(icon);
  }  
  
  //updates the element in html
  writeValue(icon: string | null){
    this.selectedIcon = icon;
    if(icon && icon !== '')
      this.showAllIcons = false;
    else
      this.showAllIcons = true;
  }

  registerOnChange(fn: Function) {
    this.onChange = (icon: string) => { fn(icon); };
  }

  registerOnTouched(fn: Function) {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void { }
}
