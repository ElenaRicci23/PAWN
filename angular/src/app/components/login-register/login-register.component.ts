import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Student } from "../../model/student";
import { AuthService } from "../../service/auth.service";
import { SanitizationService } from "../../sanitization/sanitization.service";

/**
 * Componente per la gestione della registrazione e dell'accesso degli studenti.
 */
@Component({
  selector: 'app-login-register',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.css'],
})
export class LoginRegisterComponent {
  active: boolean = false;
  newStudent: Student = new Student();
  loginStudent = { email: '', password: '' };
  isLoading: boolean = false;

  /**
   * Costruttore del componente.
   * @param authService Servizio per l'autenticazione degli studenti.
   * @param router Servizio di navigazione per reindirizzare gli utenti.
   * @param sanitizationService Servizio per la sanitizzazione dei dati.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private sanitizationService: SanitizationService
  ) {}

  /**
   * Esegue il login dell'utente.
   */
  login() {
    this.active = true;
    this.isLoading = true;

    this.authService.loginUser(this.loginStudent).subscribe(
      (res: { access: string; refresh: string }) => {
        localStorage.setItem('token', res.access);
        localStorage.setItem('refresh', res.refresh);
        this.router.navigate(['/dashboard']);
        console.log('Accesso riuscito con successo');
      },
      (err: string | undefined) => console.log(err)
    );
  }

  /**
   * Registra un nuovo studente.
   */
  register() {
    this.active = false;
    const studentData: Student = {
      nome: this.sanitizationService.sanitizeInput(this.newStudent.nome),
      cognome: this.sanitizationService.sanitizeInput(this.newStudent.cognome),
      email: this.sanitizationService.sanitizeInput(this.newStudent.email),
      anno_accademico: this.newStudent.anno_accademico,
      gender: this.newStudent.gender,
      password: this.newStudent.password, // Assicurati che la password sia già sanitizzata
    };

    console.log(studentData); // Visualizza i dati sanitizzati dello studente nella console
    this.authService.registerUser(studentData).subscribe(
      (res) => console.log(res),
      (err) => console.log(err)
    );
  }

  /**
   * Abilita la vista di registrazione.
   */
  registerMovimento() {
    this.active = true;
  }

  /**
   * Abilita la vista di accesso.
   */
  loginMovimento() {
    this.active = false;
  }
}
