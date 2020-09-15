import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

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
