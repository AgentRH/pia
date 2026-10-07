import { instance } from 'src/environments/instance';
import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguagesService } from 'src/app/services/languages.service';
import { CustomValidators } from 'src/app/shared/validators/custom-validators';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: false
})
export class HomeComponent implements OnInit, OnDestroy {
  // AgentRH : nom du client de l'instance
  clientName: string = instance.clientName;
  signUp: UntypedFormGroup;
  logIn: UntypedFormGroup;
  fromValidation: boolean = false;
  stepForm = 'logIn';
  public accountData = null;
  // AgentRH : code reçu par email et transmis par le lien (activation=… ou reset=…)
  prefilledUuid = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: UntypedFormBuilder,
    private renderer: Renderer2,
    public translateService: TranslateService,
    public languagesService: LanguagesService,
    public authService: AuthService
  ) {
    this.authService.currentUser.subscribe({
      complete: () => {
        if (this.authService.state) {
          if (this.authService.currentUserValue) {
            this.router.navigate(['entries']);
          }
        }
      }
    });

    this.renderer.addClass(document.body, 'pia-authentication');

    // AgentRH : lien direct depuis les emails. On ouvre le bon formulaire et on
    // pré-remplit le code, l'utilisateur n'a plus qu'à valider.
    const linkParams = this.route.snapshot.queryParamMap;
    const activationCode = (linkParams.get('activation') || '').trim();
    const resetCode = (linkParams.get('reset') || '').trim();
    if (activationCode) {
      this.stepForm = 'checkUuid';
      this.prefilledUuid = activationCode;
    } else if (resetCode) {
      this.stepForm = 'resetPassword';
      this.prefilledUuid = resetCode;
    }

    // Prepare login form
    this.logIn = this.formBuilder.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

    // Prepare sign up form
    this.signUp = this.formBuilder.group(
      {
        password: [
          '',
          [
            Validators.compose([
              // 1. Password Field is Required
              Validators.required,
              // 2. check whether the entered password has a number
              CustomValidators.patternValidator(/\d/, { hasNumber: true }),
              // 3. check whether the entered password has upper case letter
              CustomValidators.patternValidator(/[A-Z]/, {
                hasCapitalCase: true
              }),
              // 4. check whether the entered password has a lower-case letter
              CustomValidators.patternValidator(/[a-z]/, {
                hasSmallCase: true
              }),
              // 5. check whether the entered password has a special char
              CustomValidators.patternValidator(/[!@#$%^&*(),.?":{}|<>]/, {
                hashSpecialChar: true
              }),
              // 6. Has a minimum length of 8 characters
              Validators.minLength(12)
            ])
          ]
        ],
        confirmPassword: new UntypedFormControl('', [Validators.required])
      },
      {
        // check whether our password and confirm password match
        validator: CustomValidators.passwordMatchValidator
      }
    );
  }

  ngOnInit(): void {
    const displayMessage = document.querySelector(
      '.pia-closeFullScreenModeAlertBlock'
    );
    window.screenTop === 0 && window.screenY === 0
      ? displayMessage.classList.remove('hide')
      : displayMessage.classList.add('hide');
    window.onresize = event => {
      window.screenTop === 0 && window.screenY === 0
        ? displayMessage.classList.remove('hide')
        : displayMessage.classList.add('hide');
    };
  }

  get signUpForm() {
    return this.signUp.controls;
  }

  onSubmited() {
    this.router.navigate(['entries']);
  }

  changeDisplay(step) {
    switch (step) {
      case 'checkUuid':
        this.stepForm = 'checkUuid';
        break;
      case 'signUp':
        this.stepForm = 'signUp';
        break;
      case 'logIn':
        this.stepForm = 'logIn';
        break;
      case 'forgetPassword':
        this.stepForm = 'forgetPassword';
        break;
      case 'resetPassword':
        this.stepForm = 'resetPassword';
        break;
      case 'newPassword':
        this.stepForm = 'newPassword';
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'pia-authentication');
  }
}
