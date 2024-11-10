import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactsService } from '../contacts/contacts.service';
import { addressTypeValues, phoneTypeValues } from '../contacts/contact.model';
import { restrictedWordsValidator } from '../validators/restricted-words.validators';

@Component({
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  //#region Before form builder decleration
  // contactForm = new FormGroup({
  //   id : new FormControl(),
  //   firstName : new FormControl(),
  //   lastName : new FormControl(),
  //   dateOfBirth : new FormControl(),
  //   favoritesRanking : new FormControl(),
  //   phone : new FormGroup({
  //     phoneNumber :  new FormControl(),
  //     phoneType :  new FormControl(),
  //   }),
  //   address : new FormGroup({
  //     streetAddress :  new FormControl(),
  //     city :  new FormControl(),
  //     state :  new FormControl(),
  //     postalCode :  new FormControl(),
  //     addressType :  new FormControl(),
  //   })
  // });
  //#endregion

  phoneTypes = phoneTypeValues;
  addressTypes = addressTypeValues;
  contactForm = this.fb.nonNullable.group({
      id : '',
      icon: '',
      personal : false,
      // firstName : new FormControl('', Validators.required), // it it's out of the fb group
      // firstName : ['', Validators.required], // for single validation type
      firstName : ['', [Validators.required, Validators.minLength(3)]],
      lastName : '',
      dateOfBirth : <Date | null> null,
      //dateOfBirth : '', //to use dateofbirth as string
      favoritesRanking : <number | null> null,
      phones : this.fb.array([this.createPhoneGroup()]),
      address : this.fb.nonNullable.group({
        streetAddress :  ['',  Validators.required],
        city :  ['', Validators.required],
        state :  ['', Validators.required],
        postalCode :  ['', Validators.required],
        addressType :  ['', Validators.required],
      }),
      // notes: ['', restrictedWordsValidator],
      notes: ['', restrictedWordsValidator(['foo', 'boo'])],
    });

  // // firstName = new FormControl('Murat'); initial value
  // firstName = new FormControl();
  // lastName = new FormControl();
  // dateOfBirth = new FormControl();
  // favoritesRanking = new FormControl();

  constructor(
    private route: ActivatedRoute, 
    private contactsService: ContactsService, 
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    const contactId = this.route.snapshot.params['id'];//add contact id to route
    if (!contactId) return

    this.contactsService.getContact(contactId).subscribe((contact) => {
      if (!contact) return;
      // this.firstName.setValue(contact?.firstName);
      // this.lastName.setValue(contact?.lastName);
      // this.dateOfBirth.setValue(contact?.dateOfBirth);
      // this.favoritesRanking.setValue(contact?.favoritesRanking);

      for(let i = 1; i < contact.phones.length; i++) {
        this.addPhone();
      }

      this.contactForm.setValue(contact);
      //does everything belove in single-line
      // this.contactForm.controls.id.setValue(contact?.id);
      // this.contactForm.controls.firstName.setValue(contact?.firstName);
      // this.contactForm.controls.lastName.setValue(contact?.lastName);
      // this.contactForm.controls.dateOfBirth.setValue(contact?.dateOfBirth);
      // this.contactForm.controls.favoritesRanking.setValue(contact?.favoritesRanking);
      // this.contactForm.controls.phone.controls.phoneNumber.setValue(contact?.phone.phoneNumber);
      // this.contactForm.controls.phone.controls.phoneType.setValue(contact?.phone.phoneType);
      // this.contactForm.controls.address.controls.streetAddress.setValue(contact?.address.streetAddress);
      // this.contactForm.controls.address.controls.city.setValue(contact?.address.city);
      // this.contactForm.controls.address.controls.state.setValue(contact?.address.state);
      // this.contactForm.controls.address.controls.postalCode.setValue(contact?.address.postalCode);
      // this.contactForm.controls.address.controls.addressType.setValue(contact?.address.addressType);

      //if we're setting only some fields we can patch instead of setValue
      // const names = {firstName : contact.firstName, lastName: contact.lastName};
      // this.contactForm.patchValue(names);
    });
  }

  createPhoneGroup() {
    return this.fb.nonNullable.group({
      phoneNumber :  '',
      phoneType :  '',
    })
  }

  addPhone() {
    this.contactForm.controls.phones.push(this.createPhoneGroup());
  }

  saveContact() {
    //console.log(this.contactForm.value.favoritesRanking, typeof this.contactForm.value.favoritesRanking);
    //console.log(this.contactForm.value);//gets all info as json object
    //this.contactsService.saveContact(this.contactForm.value); if all contact field is optional like id?, firstName? etc. or we need to assign Contact as partial in the services like Partial<Contact>
    // this.contactsService.saveContact(this.contactForm.value).subscribe({
    this.contactsService.saveContact(this.contactForm.getRawValue()).subscribe({ // after making phone and address as FormGroup
        //added nonnullable to fb to prevent error
      next: () => this.router.navigate(['/contacts'])
    });

    // console.log(this.contactForm.controls.firstName.value);
    // console.log(this.contactForm.controls.lastName.value);
    // console.log(this.contactForm.controls.dateOfBirth.value);
    // console.log(this.contactForm.controls.favoritesRanking.value);
  }

  //instead of using contactForm.controls.firstName in the template
  get firstName() {
    return this.contactForm.controls.firstName;
  }

  get notes(){
    return this.contactForm.controls.notes;
  }
}
