import {NgModule} from '@angular/core';
import {
	MatAutocompleteModule,
	MatButtonModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule,
	MatProgressSpinnerModule, MatSelectModule,
	MatSidenavModule,
	MatSnackBarModule, MatTabsModule,
	MatToolbarModule, MatTooltipModule
} from '@angular/material';

const MODULES = [
	MatButtonModule,
	MatTooltipModule,
	MatCheckboxModule,
	MatToolbarModule,
	MatMenuModule,
	MatSidenavModule,
	MatAutocompleteModule,
	MatDialogModule,
	MatTabsModule,
	MatInputModule,
	MatSelectModule,
	MatSnackBarModule,
	MatProgressSpinnerModule,
	MatListModule,
	MatIconModule
];

@NgModule({
	imports: MODULES,
	exports: MODULES,
})
export class MaterialModule {
}
