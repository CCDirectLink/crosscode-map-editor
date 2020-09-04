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
	MatDividerModule
} from '@angular/material';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

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
	MatDividerModule,
	MatSlideToggleModule,
];

@NgModule({
	imports: MODULES,
	exports: MODULES,
})
export class MaterialModule {
}
