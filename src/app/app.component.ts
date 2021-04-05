import { Component } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
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

    // Used in template
    public get restaurantList(): Restaurant[] { return this.currentRestaurantResponse?.entries }
    public get currentPage(): number { return this.currentRestaurantResponse?.page }
    public get totalPages(): number { return this.currentRestaurantResponse?.pages }

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

    public onSubmitFilters(): void {
        this.appService.getRestaurants(this.getFilterValues()).subscribe((restaurantData: RestaurantResponse) => {
            if(restaurantData)
                this.currentRestaurantResponse = restaurantData;
        });
    }

    public onPageChange(page: number) {
        this.appService.getRestaurants(this.getFilterValues(), page).subscribe((restaurantData: RestaurantResponse) => {
            if(restaurantData)
                this.currentRestaurantResponse = restaurantData;
        });
    }
}
