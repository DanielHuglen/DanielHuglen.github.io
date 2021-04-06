import { Component, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTable } from "@angular/material/table";
import { Restaurant, RestaurantResponse, SearchFilter } from "./app.models";
import { AppService } from "./app.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
    providers: [AppService]
})

export class AppComponent {
    // Latest search result
    private currentRestaurantResponse: RestaurantResponse;
    private _currentInternalPage: number = 1;
    public set currentInternalPage(page: number) {
        this._currentInternalPage = page;

        while (this.currentlyDisplayedRestaurants?.length < 1 && this.currentInternalPage > 1) {
            this.currentInternalPage--;
        }
    }
    
    // Used in template
    public get currentInternalPage(): number { return this._currentInternalPage }
    public get currentExternalPage(): number { return this.currentRestaurantResponse?.page }
    public get totalPages(): number { return this.currentRestaurantResponse?.pages * 5 }
    public get amountOfPageNumbersToDisplay(): any[] { return new Array(7); }
    public get currentlyDisplayedRestaurants(): Restaurant[] { return this.getRestaurantsDisplayedOnPage(this.currentInternalPage); }
    public isPageNumberDisplayed(page: number): boolean {
        const amountOfRestaurantsDisplayedOnPage = this.getRestaurantsDisplayedOnPage(page)?.length;
        return amountOfRestaurantsDisplayedOnPage > 0 && page < this.totalPages;
    };

    @ViewChild(MatTable) table: MatTable<any>;
    displayedColumns = ["navn", "total_karakter", "karakter1", "karakter2", "karakter3", "karakter4",];

    filterForm = new FormGroup({
        rating: new FormControl("", Validators.pattern("[0-5]")),
        name: new FormControl("", Validators.maxLength(50)),
        place: new FormControl("", Validators.maxLength(50)),
        zipCode: new FormControl("", Validators.pattern("[0-9]{4}")),
        organizationNumber: new FormControl("", Validators.pattern("[0-9]{9}")),
    });

    constructor(private readonly appService: AppService) {
        this.appService.getRestaurants(new SearchFilter()).subscribe((restaurantData: RestaurantResponse) => {
            if(restaurantData)
                this.currentRestaurantResponse = restaurantData;
        });
    }

    private getFilterValues(): SearchFilter {
        return new SearchFilter(this.filterForm.value.rating,
            this.filterForm.value.name,
            this.filterForm.value.place,
            this.filterForm.value.zipCode,
            this.filterForm.value.organizationNumber);
    }

    public getRestaurantsDisplayedOnPage(page: number): Restaurant[] {
        let sliceOfPageToDisplay = Math.round((page / 5 - (Math.floor(page / 5))) * 100)
        if(sliceOfPageToDisplay === 0)
            sliceOfPageToDisplay = 100;

        return this.currentRestaurantResponse?.entries.slice(sliceOfPageToDisplay - 20, sliceOfPageToDisplay);
    }

    public onSubmitFilters(): void {
        this.appService.getRestaurants(this.getFilterValues()).subscribe((restaurantData: RestaurantResponse) => {
            if(restaurantData)
                this.currentRestaurantResponse = restaurantData;

            this.currentInternalPage = 1;
        });
    }

    public onPageChange(page: number): void {
        if(page === this.currentInternalPage)
            return;

        if(Math.ceil(page / 5) === this.currentExternalPage) {
            this.currentInternalPage = page;
        }
        else {
            this.appService.getRestaurants(this.getFilterValues(), Math.ceil(page / 5)).subscribe((restaurantData: RestaurantResponse) => {
                if(restaurantData)
                    this.currentRestaurantResponse = restaurantData;

                this.currentInternalPage = page;
            });
        }
    }
}
