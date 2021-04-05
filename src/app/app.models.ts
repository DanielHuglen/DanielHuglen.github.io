export class SearchFilter {
    constructor(readonly rating: string = "",
        readonly name: string = "",
        readonly place: string = "",
        readonly zipCode: string = "",
        readonly organizationNumber: string = "") { }

    getQueryString(): string {
        let queryString = "";

        if (this.rating)
            queryString += `total_karakter=${this.rating}&`;
        if (this.name)
            queryString += `navn=${this.name}&`;
        if (this.place)
            queryString += `poststed=${this.place}&`;
        if (this.zipCode)
            queryString += `postnr=${this.zipCode}&`;
        if (this.organizationNumber)
            queryString += `orgnummer=${this.organizationNumber}&`;

        return queryString
    }
}

export class RestaurantResponse {
    entries: Restaurant[];
    page: number;
    pages: number;
}

export class Restaurant {
    adrlinje1: string;
    adrlinje2: string;
    dato: string;
    karakter1: string;
    karakter2: string;
    karakter3: string;
    karakter4: string;
    navn: string;
    orgnummer: string;
    postnr: string;
    poststed: string;
    sakref: string;
    status: string;
    tema1_nn: string;
    tema1_no: string;
    tema2_nn: string;
    tema2_no: string;
    tema3_nn: string;
    tema3_no: string;
    tema4_nn: string;
    tema4_no: string;
    tilsynid: string;
    tilsynsbesoektype: string;
    tilsynsobjektid: string;
    total_karakter: string;
}