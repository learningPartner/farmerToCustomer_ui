import { LowerCasePipe, UpperCasePipe } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

export const CommonImports = {
    FORM_IMPORTS: [FormsModule, ReactiveFormsModule, LowerCasePipe, UpperCasePipe]
}