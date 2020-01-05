import {NgModule} from '@angular/core';
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCheckboxModule,
	MatDialogModule,
	MatExpansionModule,
	MatIconModule,
	MatInputModule,
	MatListModule,
	MatMenuModule,
	MatProgressSpinnerModule,
	MatRippleModule,
	MatSelectModule,
	MatSidenavModule,
	MatSnackBarModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule,
	MatTreeModule,
	MatRadioModule,
} from '@angular/material';

const MODULES = [
	MatButtonModule,
	MatTooltipModule,
	MatCheckboxModule,
	MatToolbarModule,
	MatRippleModule,
	MatMenuModule,
	MatSidenavModule,
	MatAutocompleteModule,
	MatDialogModule,
	MatTabsModule,
	MatExpansionModule,
	MatInputModule,
	MatSelectModule,
	MatSnackBarModule,
	MatProgressSpinnerModule,
	MatListModule,
	MatIconModule,
	MatTreeModule,
	MatRadioModule,
];

@NgModule({
	imports: MODULES,
	exports: MODULES,
})
export class MaterialModule {
}
